package com.samsung.sds.brightics.common.workflow.model;

import java.util.Objects;

public class Edge {

    public final Node from;
    public final Node to;

    public Edge(Node from, Node to) {
        this.from = from;
        this.to = to;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Edge edge = (Edge) o;
        return Objects.equals(from, edge.from) &&
            Objects.equals(to, edge.to);
    }

    @Override
    public int hashCode() {
        return Objects.hash(from, to);
    }

    @Override
    public String toString() {
        return "Edge [from=" + from + ", to=" + to + "]";
    }
}
