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

package com.samsung.sds.brightics.common.workflow.model;

import java.util.ArrayList;
import java.util.List;

import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;

import lombok.Getter;
import lombok.Setter;

public abstract class Workflow extends Node {

    @Setter @Getter
    protected List<Node> nodes = new ArrayList<>();
    @Setter @Getter
    protected Boolean newVariableScope = false;

    public void addNode(Node node) {
        node.parent = this;
        nodes.add(node);
    }

    public void addNodes(Node... nodeArray) {
        for (Node node : nodeArray) {
            node.parent = this;
            nodes.add(node);
        }
    }

    public Workflow(String name, Parameters parameters) {
        super(name, parameters);
    }

    abstract public void start(WorkflowContext context);
}
