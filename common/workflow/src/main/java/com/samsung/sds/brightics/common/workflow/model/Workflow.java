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
