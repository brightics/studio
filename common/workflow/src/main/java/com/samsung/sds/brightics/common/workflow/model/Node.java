package com.samsung.sds.brightics.common.workflow.model;

import java.util.ArrayList;
import java.util.List;

import com.samsung.sds.brightics.common.workflow.context.parameter.ParameterValueHandler;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;

public class Node {

    public Node parent = null;
    public String name;
    protected Parameters originalParameters;
    protected Parameters resolvedParameters;

    public final List<Edge> toEdges = new ArrayList<>();
    public int degree = 0;

    public Node(String name) {
        this.name = name;
    }

    public Node(String name, Parameters parameters) {
        this.name = name;
        this.originalParameters = parameters;
    }

    /**
     * It connects this to targetnode
     *
     * @return targetNode
     */
    public Node connect(Node targetNode) {
        Edge e = new Edge(this, targetNode);
        toEdges.add(e);
        return targetNode;
    }

    @Override
    public String toString() {
        return "Node [name=" + name + "]";
    }

    public void resolveParameters(ParameterValueHandler handler) {
        resolvedParameters = handler.handle(originalParameters);
    }
}
