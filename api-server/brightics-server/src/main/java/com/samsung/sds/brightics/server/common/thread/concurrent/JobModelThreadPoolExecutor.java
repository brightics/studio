package com.samsung.sds.brightics.server.common.thread.concurrent;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Stream;

import javax.annotation.Nonnull;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;
import com.samsung.sds.brightics.server.common.thread.JobModelRunnable;

public class JobModelThreadPoolExecutor extends ThreadPoolExecutor {

    private static final Logger LOGGER = LoggerFactory.getLogger(JobModelThreadPoolExecutor.class);
    private final ReentrantLock lock = new ReentrantLock();
    private final Map<String, Thread> runningThreadMap = new ConcurrentHashMap<>();
    private final ExecutionTimeTracker timeTracker = new ExecutionTimeTracker();
    private final BlockingQueue<Runnable> rejectedQueue;
    private final Thread rejectedWorkHandler;
    private String name = "default";

    public JobModelThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, int maxFlowQueue) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, new SynchronousQueue<>());
        this.rejectedQueue = new LinkedBlockingQueue<>(maxFlowQueue);
        this.rejectedWorkHandler = new Thread(new RejectedWorker(this));
        this.rejectedWorkHandler.start();
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void execute(Runnable command) {
        if (!(command instanceof JobModelRunnable)) {
            throw new IllegalArgumentException("only accept JobModelRunnable");
        }

        String id = ((JobModelRunnable) command).getId();
        try {
            super.execute(command);
            timeTracker.add((JobModelRunnable) command);
            LOGGER.info("[JOB_QUEUE] job[{}] added to {}", id, name);
        } catch (RejectedExecutionException e) {
            rejectedQueue.offer(command);
        } finally {
            updatePendingStatus();
        }
    }

    @Override
    protected void beforeExecute(Thread t, Runnable r) {
        lock.lock();
        try {
            if (r instanceof JobModelRunnable) {
                String id = ((JobModelRunnable) r).getId();
                LOGGER.info("[JOB_QUEUE] job[{}] started in {}", id, name);
                runningThreadMap.put(id, t);
            }
            updatePendingStatus();
        } finally {
            lock.unlock();
        }
    }

    private synchronized void updatePendingStatus() {
        AtomicInteger position = new AtomicInteger(1);
        Stream.concat(super.getQueue().stream(), rejectedQueue.stream())
                .filter(r -> r instanceof JobModelRunnable)
                .map(r -> (JobModelRunnable) r)
                .forEachOrdered(r -> {
                    r.getStatus().setQueueName(name);
                    r.getStatus().setQueuePosition(position.getAndIncrement());
                });
    }

    @Override
    protected void afterExecute(Runnable r, Throwable t) {
        LOGGER.debug("[JOB_QUEUE] after execution in {}", name);
        lock.lock();
        try {
            if (r instanceof JobModelRunnable) {
                String id = ((JobModelRunnable) r).getId();

                if (t == null) {
                    LOGGER.info("[JOB_QUEUE] job[{}] ended in {}", id, name);
                } else {
                    LOGGER.info(String.format("[JOB_QUEUE] error occurred running job[%s] in %s", id, name), t);
                }

                runningThreadMap.remove(id);
                timeTracker.remove((JobModelRunnable) r);
                ((JobModelRunnable) r).deactivate();
            }
        } finally {
            lock.unlock();
        }
    }

    /**
     * Cancels work has matching id. Work is interrupted or removed from queue.
     * Returns true when work is interrupted.
     *
     * @param id id to lookup
     * @return work is interrupted or not
     */
    public boolean cancelWork(String id) {
        if (id == null || StringUtils.isEmpty(id)) {
            throw new IllegalArgumentException("id should not be empty.");
        }

        lock.lock();
        try {
            if (!runningThreadMap.containsKey(id)) {
                // remove from internal queue
                getQueue().removeIf(r -> {
                    boolean isTarget = id.equals(((JobModelRunnable) r).getId());
                    if (isTarget) {
                        ((JobModelRunnable) r).deactivate();
                        timeTracker.remove((JobModelRunnable) r);
                    }
                    return isTarget;
                });

                // remove from rejected queue
                synchronized (rejectedQueue) {
                    rejectedQueue.removeIf(r -> {
                        boolean isTarget = id.equals(((JobModelRunnable) r).getId());
                        if (isTarget) {
                            ((JobModelRunnable) r).deactivate();
                        }
                        return isTarget;
                    });
                }
                return false;
            } else {
                Thread t = runningThreadMap.remove(id);
                t.interrupt();
                return true;
            }
        } finally {
            lock.unlock();
        }
    }

    public boolean hasDuplication(JobModelRunnable r, long minInterval) {
        if (minInterval == 0L) {
            return false;
        }
        return new Date().getTime() - timeTracker.getLastExecuteTime(r) < minInterval;
    }

    private synchronized Runnable getRejectedWork() {
        if (super.getActiveCount() >= super.getMaximumPoolSize()) {
            return null;
        }

        synchronized (rejectedQueue) {
            if (!this.rejectedQueue.isEmpty()) {
                return this.rejectedQueue.poll();
            }
            return null;
        }
    }

    private static class ExecutionTimeTracker {

        private final Map<String, LinkedList<Timestamp>> timestampMap = new ConcurrentHashMap<>();

        public void add(JobModelRunnable r) {
            String key = generateKey(r.getJobParam());
            if (!timestampMap.containsKey(key)) {
                timestampMap.put(key, new LinkedList<>());
            }
            timestampMap.get(key).add(new Timestamp(r.getJobParam().getJid()));
        }

        public void remove(JobModelRunnable r) {
            String key = generateKey(r.getJobParam());
            if (!timestampMap.containsKey(key)) {
                return;
            }
            timestampMap.get(key).removeIf(timestamp -> timestamp.jobId.equals(r.getJobParam().getJid()));
            if (timestampMap.get(key).isEmpty()) {
                timestampMap.remove(key);
            }
        }

        public Long getLastExecuteTime(JobModelRunnable r) {
            String key = generateKey(r.getJobParam());
            LinkedList<Timestamp> timeList = timestampMap.get(key);
            if (timeList == null || timeList.isEmpty()) {
                return 0L;
            }
            return timeList.peekLast().time;
        }

        private String generateKey(JobParam jobParam) {
            return String.format("%s:%s", jobParam.getUser(), jobParam.getMain());
        }

        private static class Timestamp {

            String jobId;
            Long time;

            public Timestamp(String jobId) {
                this.jobId = jobId;
                this.time = new Date().getTime();
            }
        }
    }

    @Override
    @Nonnull
    public List<Runnable> shutdownNow() {
        lock.lock();
        try {
            rejectedWorkHandler.interrupt();
            List<Runnable> tasks = super.shutdownNow();
            synchronized (rejectedQueue) {
                rejectedQueue.drainTo(tasks);
            }
            tasks.stream().filter(task -> task instanceof JobModelRunnable).forEach(task -> ((JobModelRunnable) task).deactivate());
            return tasks;
        } finally {
            lock.unlock();
        }
    }

    private static class RejectedWorker implements Runnable {

        private JobModelThreadPoolExecutor parent;

        public RejectedWorker(JobModelThreadPoolExecutor parent) {
            this.parent = parent;
        }

        @Override
        public void run() {
            //noinspection InfiniteLoopStatement
            for (; ; ) {
                try {
                    if (Thread.currentThread().isInterrupted()) {
                        break;
                    }

                    Runnable command = parent.getRejectedWork();
                    if (command != null) {
                        parent.execute(command);
                    }
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    break;
                }
            }
        }
    }
}
