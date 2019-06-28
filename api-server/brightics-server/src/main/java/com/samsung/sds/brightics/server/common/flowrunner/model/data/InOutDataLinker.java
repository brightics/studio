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

package com.samsung.sds.brightics.server.common.flowrunner.model.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobStatusTracker;


public class InOutDataLinker {

    private static final String IN_DATA = "inData";
    private static final String OUT_DATA = "outData";
    private static final List<String> DATA_PARAMS = Arrays.asList(IN_DATA, OUT_DATA);
    private final List<Pair<String, String>> inData = new ArrayList<>();
    private final List<Pair<String, String>> outData = new ArrayList<>();
    private boolean isLinkBetweenModel;
    private String childModelMid;

    public InOutDataLinker(JsonObject parentFunction, JsonObject childModel) {
        this(parentFunction, childModel, false);
    }

    public InOutDataLinker(JsonObject parentFunction, JsonObject childModel, boolean isLinkBetweenModel) {
        this.isLinkBetweenModel = isLinkBetweenModel;
        complementProperties(parentFunction);
        complementProperties(childModel);

        validateDataParams(parentFunction, childModel);

        JsonArray parentInData = parentFunction.getAsJsonArray(IN_DATA);
        JsonArray childInData = childModel.getAsJsonArray(IN_DATA);
        for (int i = 0; i < parentInData.size(); i++) {
            inData.add(new ImmutablePair<>(parentInData.get(i).getAsString(), childInData.get(i).getAsString()));
        }

        JsonArray parentOutData = parentFunction.getAsJsonArray(OUT_DATA);
        JsonArray childOutData = childModel.getAsJsonArray(OUT_DATA);
        for (int i = 0; i < parentOutData.size(); i++) {
            outData.add(new ImmutablePair<>(parentOutData.get(i).getAsString(), childOutData.get(i).getAsString()));
        }

        childModelMid = childModel.get("mid").getAsString().replaceAll("_.*$", "");
    }

    public void linkInData() {
        JobStatusTracker tracker = JobContextHolder.getJobStatusTracker();
        inData.forEach(
                pair -> {
                    String source = buildDataKey(tracker.getCurrentModelMid(), pair.getKey());
                    String alias = buildDataKey(isLinkBetweenModel ? childModelMid : tracker.getCurrentModelMid(), pair.getValue());
                    JobContextHolder.getBeanHolder().dataService.addDataAlias(source, alias);
                });
    }

    public void linkOutData() {
        JobStatusTracker tracker = JobContextHolder.getJobStatusTracker();
        outData.forEach(
                pair -> {
                    String source = buildDataKey(isLinkBetweenModel ? childModelMid : tracker.getCurrentModelMid(), pair.getValue());
                    String alias = buildDataKey(tracker.getCurrentModelMid(), pair.getKey());
                    JobContextHolder.getBeanHolder().dataService.addDataAlias(source, alias);
                });
    }

    private String buildDataKey(String mid, String tid) {
        String user = JobContextHolder.getJobStatusTracker().getJobStatus().getUser();
        return Stream.of(user, mid, tid).collect(Collectors.joining("/", "/", ""));
    }

    private void validateDataParams(JsonObject parent, JsonObject child) {
        DATA_PARAMS.forEach(key -> {
            if (!parent.get(key).isJsonArray() || !child.get(key).isJsonArray()) {
                throw new BrighticsCoreException("3102", key + " should be json array.");
            }

            if (parent.getAsJsonArray(key).size() != child.getAsJsonArray(key).size()) {
                throw new BrighticsCoreException("3102", key + " size is not matching(" + parent.get("fid").getAsString() + ").");
            }
        });
    }

    private void complementProperties(JsonObject obj) {
        DATA_PARAMS.forEach(key -> {
            if (!obj.has(key)) {
                obj.add(key, new JsonArray());
            }
        });
    }
}
