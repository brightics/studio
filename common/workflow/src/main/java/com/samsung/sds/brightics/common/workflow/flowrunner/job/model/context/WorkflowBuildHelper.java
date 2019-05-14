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

package com.samsung.sds.brightics.common.workflow.flowrunner.job.model.context;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.JsonObjectUtil;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.impl.EmptyWork;

final class WorkflowBuildHelper {

    private WorkflowBuildHelper() {
    }

    public static Node[] getNodes(JsonObject model) {
        JsonArray functions = model.getAsJsonArray("functions");
        Map<String, Node> nodeMap = new HashMap<>();
        Node[] nodes = new Node[functions.size()];

        // node 생성&추가
        AtomicInteger idx = new AtomicInteger();
        model.getAsJsonArray("functions").forEach(function -> {
            Node node = buildNode(model, function.getAsJsonObject());
            nodeMap.put(node.name, node);
            nodes[idx.getAndIncrement()] = node;
        });

        // edge 연결
        connectNodes(getLinks(model), nodes, nodeMap);

        return nodes;
    }

    private static JsonArray getLinks(JsonObject model) {
        JsonElement links = model.get("links");
        if (links != null && links.isJsonArray()) {
            return links.getAsJsonArray();
        }
        return new JsonArray();
    }

    private static void connectNodes(JsonArray links, Node[] nodes, Map<String, Node> nodeMap) {
        if (links.size() > 0) {
            links.forEach(link -> {
                JsonObject linkObject = link.getAsJsonObject();
                Node source = nodeMap.get(JsonObjectUtil.getAsString(linkObject, "sourceFid"));
                Node target = nodeMap.get(JsonObjectUtil.getAsString(linkObject, "targetFid"));
                if (source == null || target == null) {
                    String invalidFid = source == null ? JsonObjectUtil.getAsString(linkObject, "sourceFid") : JsonObjectUtil
                            .getAsString(linkObject, "targetFid");
                    throw new BrighticsCoreException("3114", String.format("Invalid fid(%s)", invalidFid));
                }
                source.connect(target);
            });
        } else {
            // link 정보 없으면 순서대로 link 연결
            for (int idx = 1; idx < nodes.length; idx++) {
                nodes[idx - 1].connect(nodes[idx]);
            }
        }
    }

    private static Node buildNode(JsonObject model, JsonObject function) {
        JsonObject innerModels = model.getAsJsonObject("innerModels");
        JsonObject optModels = model.getAsJsonObject("optModels");

        // skip function
        if (function.has("skip") && function.get("skip").getAsBoolean()) {
            return new EmptyWork(JsonObjectUtil.getAsString(function, "fid"));
        }

        switch (JsonObjectUtil.getAsString(function, "name")) {
            case "WhileLoop":
            case "ForLoop":
                return new LoopWorkflowBuilder(function, innerModels).build();
            case "If":
                return new ConditionalWorkflowBuilder(function, innerModels).build();
            case "Flow":
                return new SubModelWorkBuilder(function).build();
            case "Opt":
            	return new OptWorkflowBuilder(function, optModels).build();
            default:
                return new FunctionWorkBuilder(function).build();
        }
    }
}
