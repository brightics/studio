/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.samsung.sds.brightics.server.common.flowrunner.status;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.util.Assert;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.model.vo.JobFunctionStatusVO;
import com.samsung.sds.brightics.server.model.vo.JobModelStatusVO;
import com.samsung.sds.brightics.server.model.vo.JobStatusVO;

import lombok.Getter;

public class JobStatusTracker {

    @Getter
    private final JobStatusVO jobStatus;

    private final LinkedList<JobModelStatusVO> modelStack = new LinkedList<>();
    private final LinkedList<JobFunctionStatusVO> functionStack = new LinkedList<>();
    private final Map<String, JobModelStatusVO> modelMap = Collections.synchronizedMap(new HashMap<>());
    private final FunctionMap functionMap = new FunctionMap(modelStack);
    private final LinkedList<String> runningControlFunctionStack = new LinkedList<>();
    private final Set<String> controlFunctionNames = new HashSet<>(Arrays.asList("WhileLoop", "ForLoop", "If", "Flow", "Opt"));

    public JobStatusTracker(JobStatusVO jobStatus) {
        this.jobStatus = jobStatus;
    }

    public JobModelStatusVO addModel(String mid, String pid) {
        JobModelStatusVO modelStatus = new JobModelStatusVO();
        modelStatus.setMid(mid);
        modelStatus.setPid(pid);
        modelStatus.setStatus(Status.WAITING.toString());
        modelStatus.setBegin(-1);
        modelStatus.setEnd(-1);
        this.jobStatus.getProcesses().add(modelStatus);
        modelMap.put(getModelMapKey(mid, pid), modelStatus);

        return modelStatus;
    }

    private static String getModelMapKey(String mid, String pid) {
        return "MID:" + mid + "|PID:" + pid;
    }

    public synchronized void startModel(String mid, String pid) {
        String key = getModelMapKey(mid, pid);
        if (!modelMap.containsKey(key)) {
            throw new BrighticsCoreException("3102", "Model status for \"" + mid + "\" has not been initialized.");
        }
        JobModelStatusVO modelStatus = modelMap.get(key);
        modelStack.push(modelStatus);

        functionMap.removeAll(modelStatus.getFunctions());
        modelStatus.getFunctions().clear();
        modelStatus.setStatus(Status.PROCESSING.toString());
        modelStatus.setBegin(System.currentTimeMillis());
    }

    public synchronized void endModelWith(Status status) {
        Assert.state(status == Status.SUCCESS || status == Status.FAIL, "Model cannot end with status in " + status.toString());
        JobModelStatusVO modelStatus = modelStack.pop();
        modelStatus.setStatus(status.toString());
        modelStatus.setEnd(System.currentTimeMillis());
        functionMap.lastEndedModel = modelStatus;
    }

    public synchronized void startFunction(String fid, String label, String functionName) {
        Assert.notEmpty(modelStack, "No model is running.");

        JobFunctionStatusVO functionStatus = functionMap.getOrCreate(fid, label, functionName);

        functionStatus.setStatus(Status.PROCESSING.toString());
        functionStatus.setBegin(System.currentTimeMillis());
        functionStatus.setEnd(-1);

        functionStack.push(functionStatus);
    }

    public synchronized void endFunctionWith(Status status) {
        Assert.state(status == Status.SUCCESS || status == Status.FAIL, "Function cannot end with status in " + status.toString());
        Assert.notEmpty(functionStack, "No function is running.");

        JobFunctionStatusVO functionStatus = functionStack.pop();
        functionStatus.setStatus(status.toString());
        functionStatus.setEnd(System.currentTimeMillis());
        if (status == Status.FAIL) {
            this.jobStatus.setErrorFunctionName(functionStatus.getFunctionName());
        }
    }

    public synchronized void startControlFunction(String fid, String label, String name) {
        if (!controlFunctionNames.contains(name)) {
            throw new BrighticsCoreException("3102", name + " is invalid control function name");
        }
        startFunction(fid, label, name);
        runningControlFunctionStack.push(fid);
    }

    public synchronized void endControlFunctionWith(String fid, Status status) {
        Assert.state(status == Status.SUCCESS || status == Status.FAIL, "Function cannot end with status in " + status.toString());

        if (!fid.equals(runningControlFunctionStack.peek())) {
            return;
        }

        String controlFunctionFid = runningControlFunctionStack.pop();
        functionMap.get(controlFunctionFid).setStatus(status.toString());
        functionMap.get(controlFunctionFid).setEnd(System.currentTimeMillis());
        while (!controlFunctionFid.equals(Objects.requireNonNull(functionStack.peek()).getFid())) {
            functionStack.pop();
        }
        functionStack.pop();
    }

    public synchronized void updateFunctionMessage(String fid, String message) {
        functionMap.get(fid).setMessage(message);
    }

    public synchronized void updateOptimizationMessage(String fid, Object optResult) {
    	functionMap.get(fid).setOptimization(optResult);
    }

    public synchronized JobFunctionStatusVO getCurrentFunctionStatus() {
        return functionStack.peek();
    }

    public synchronized void startSubFlow(String fid, String label, String name) {
        startControlFunction(fid, label, name);
    }

    public synchronized void endSubFlow(String fid, Status status) {
        endControlFunctionWith(fid, status);
    }

    public synchronized String getCurrentModelMid() {
        return getCurrentModelMid(true);
    }

    public synchronized String getCurrentModelMid(boolean removeVersionId) {
        if (this.modelStack.isEmpty()) {
            throw new BrighticsCoreException("3102", "No model is running.");
        }
        String mid = Objects.requireNonNull(this.modelStack.peek()).getMid();
        // remove version id from mid
        if (removeVersionId) {
            return mid.replaceAll("[_].*$", "");
        } else {
            return mid;
        }
    }
    
    public synchronized String getMainModelMid() {
        if (modelStack.isEmpty()) {
            throw new BrighticsCoreException("3102", "No model is running");
        }
        return modelStack.peekLast().getMid();
    }

    private static class FunctionMap {
        private final Map<String, JobFunctionStatusVO> functionMap = Collections.synchronizedMap(new HashMap<>());
        private final LinkedList<JobModelStatusVO> modelStack;
        private JobModelStatusVO lastEndedModel;

        public FunctionMap(LinkedList<JobModelStatusVO> modelStack) {
            this.modelStack = modelStack;
        }

        private String genKey(String fid) {
            return Optional.ofNullable(modelStack.peek()).orElse(lastEndedModel).getMid() + fid;
        }

        public void removeAll(List<JobFunctionStatusVO> functions) {
            for (JobFunctionStatusVO function : functions) {
                functionMap.remove(genKey(function.getFid()));
            }
        }

        public JobFunctionStatusVO getOrCreate(String fid, String label, String functionName) {
            return Optional
                    .ofNullable(functionMap.get(genKey(fid)))
                    .orElseGet(() -> {
                        JobFunctionStatusVO newStatus = new JobFunctionStatusVO();
                        newStatus.setFid(fid);
                        newStatus.setFunctionName(functionName);
                        newStatus.setLabel(label);
                        functionMap.put(genKey(fid), newStatus);
                        Objects.requireNonNull(modelStack.peek()).getFunctions().add(newStatus);
                        return newStatus;
                    });
        }

        public JobFunctionStatusVO get(String fid) {
            return functionMap.get(genKey(fid));
        }
    }
}
