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

package com.samsung.sds.brightics.server.common.util.keras.flow;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonObject;

public abstract class KerasFlowNode {

    protected static final String LINE_SEPARATOR = System.lineSeparator();

    protected String fid;

    protected String operation;
    protected JsonObject param;

    int depth = Integer.MAX_VALUE; // not defined yet

    List<KerasFlowNode> prevNodes = new ArrayList<>();
    List<KerasFlowNode> nextNodes = new ArrayList<>();

    public KerasFlowNode(String fid, JsonObject function) {
        this.fid = fid;

        this.operation = function.get("name").getAsString();
        this.param = function.get("param").getAsJsonObject();
    }

    public String getFid() {
        return fid;
    }

    public String getOperation() {
        return operation;
    }

    public JsonObject getParam() {
        return param;
    }

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }

    public List<KerasFlowNode> getPrevNodes() {
        return prevNodes;
    }

    public void addPrevNode(KerasFlowNode prevNode) {
        if (!prevNodes.contains(prevNode)) {
            prevNodes.add(prevNode);
        }
    }

    public List<KerasFlowNode> getNextNodes() {
        return nextNodes;
    }

    public void addNextNode(KerasFlowNode nextNode) {
        if (!nextNodes.contains(nextNode)) {
            nextNodes.add(nextNode);
        }
    }

    public boolean isLastNode() {
        return nextNodes.isEmpty();
    }

    protected boolean containsStringParam(String paramName) {
        return param.get(paramName) != null && StringUtils.isNotBlank(param.get(paramName).getAsString());
    }

    @Override
    public int hashCode() {
        return fid.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;

        KerasFlowNode other = (KerasFlowNode) obj;

        if (fid == null) {
            if (other.fid != null)
                return false;
        } else if (!fid.equals(other.fid))
            return false;

        return true;
    }
}
