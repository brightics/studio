package com.samsung.sds.brightics.server.common.thread;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class CancellableCountDownLatch {

	private final CountDownLatch latch;
	final List<Thread> waiters;
	boolean cancelled = false;

	public CancellableCountDownLatch(int count) {
		latch = new CountDownLatch(count);
		waiters = new ArrayList<Thread>();
	}

	public void await() throws InterruptedException {
		try {
			addWaiter();
			latch.await();
		} finally {
			removeWaiter();
		}
	}

	public boolean await(long timeout, TimeUnit unit) throws InterruptedException {
		try {
			addWaiter();
			return latch.await(timeout, unit);
		} finally {
			removeWaiter();
		}
	}

	private synchronized void addWaiter() throws InterruptedException {
		if (cancelled) {
			Thread.currentThread().interrupt();
			throw new InterruptedException("Latch has already been cancelled");
		}
		waiters.add(Thread.currentThread());
	}

	private synchronized void removeWaiter() {
		waiters.remove(Thread.currentThread());
	}

	public void countDown() {
		latch.countDown();
	}

	public synchronized void cancel() {
		if (!cancelled) {
			cancelled = true;
			for (Thread waiter : waiters) {
				waiter.interrupt();
			}
			waiters.clear();
		}
	}

	public long getCount() {
		return latch.getCount();
	}

	@Override
	public String toString() {
		return latch.toString();
	}

}
