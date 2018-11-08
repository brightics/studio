package com.samsung.sds.brightics.agent.network.receiver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.network.listener.ReceiveMessageListener;
import com.samsung.sds.brightics.agent.service.TaskService;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.TaskServiceGrpc;

import io.grpc.stub.StreamObserver;

public class TaskReceiver extends TaskServiceGrpc.TaskServiceImplBase {

    private static final Logger logger = LoggerFactory.getLogger(TaskReceiver.class);

    private final ReceiveMessageListener listener;

    public TaskReceiver(ReceiveMessageListener listener) {
        this.listener = listener;
    }

    @Override
    public void receiveAsyncTask(ExecuteTaskMessage request, StreamObserver<ExecuteTaskMessage> responseObserver) {
        String taskId = request.getTaskId();
        listener.receiveWithKey(taskId, request);

        logger.info("receiveAsyncTask" + Thread.currentThread().getName());

        ThreadLocalContext.put("user", request.getUser());
        //set task information in Thread local context.
        setTaskInfoInThreadLocal(request);

        logger.info("[Task receiver] receive async task : " + request.toString() + ", user : " + request.getUser());
        responseObserver.onNext(ExecuteTaskMessage.newBuilder().build());
        responseObserver.onCompleted();
        TaskService.receiveAsyncTask(request);

    }

    @Override
    public void receiveSyncTask(ExecuteTaskMessage request, StreamObserver<ResultTaskMessage> responseObserver) {
        String key = listener.receive(request);

        ThreadLocalContext.put("user", request.getUser());
        //set task information in Thread local context.
        setTaskInfoInThreadLocal(request);
        logger.info("[Task receiver] receive sync task : " + request.toString() + ", user : " + request.getUser());
        ResultTaskMessage resultMessage = TaskService.getTaskResult(request);
        responseObserver.onNext(resultMessage);
        responseObserver.onCompleted();

        listener.onCompleted(key);
    }

    @Override
    public void stopTask(StopTaskMessage request, StreamObserver<ResultTaskMessage> responseObserver) {
        String key = listener.receive(request);

        ThreadLocalContext.put("user", request.getUser());
        logger.info("[Task receiver] receive stop task : " + request.toString() + ", user : " + request.getUser());
        TaskService.stopTask(request);
        responseObserver.onNext(ResultTaskMessage.newBuilder().build());
        responseObserver.onCompleted();

        listener.onCompleted(key);
    }

    private void setTaskInfoInThreadLocal(ExecuteTaskMessage request) {
        ThreadLocalContext.put("taskId", request.getTaskId());
        ThreadLocalContext.put("taskName", request.getName());
    }
}
