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

package com.samsung.sds.brightics.common.workflow.util;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.workflow.model.Edge;
import com.samsung.sds.brightics.common.workflow.model.Node;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public final class WorkflowSorter {

    private WorkflowSorter() {
    }

    public static List<Node> findRootNode(List<Node> nodes) {
        computeDegree(nodes);

        // Create a queue and enqueue all nodes with degree 0
        List<Node> q = new ArrayList<>();
        for (Node node : nodes) {
            if (node.degree == 0) {
                q.add(node);
            }
        }

        // Reset all degrees of nodes
        resetDegree(nodes);

        return q;
    }

    public static List<Node> topologicalSort(List<Node> nodes) {
        computeDegree(nodes);

        // Create a queue and enqueue all nodes with degree 0
        Queue<Node> q = new LinkedList<>();
        for (Node node : nodes) {
            if (node.degree == 0) {
                q.add(node);
            }
        }

        // Initialize count of visited vertices
        int cnt = 0;

        // Create a vector to store result (A topological ordering of the vertices)
        List<Node> topOrder = new ArrayList<>();
        while (!q.isEmpty()) {
            // Extract front of queue (or perform dequeue) and add it to topological order
            Node u = q.poll();
            topOrder.add(u);

            // Iterate through all its next nodes of dequeued node u and decrease their in-degree by 1
            assert u != null;
            for (Edge edge : u.toEdges) {
                if (--edge.to.degree == 0) {
                    q.add(edge.to);
                }
            }
            cnt++;
        }

        // Check if there was a cycle
        if (cnt != nodes.size()) {
            throw new BrighticsCoreException("3102", "A cycle is not allowed.");

        }

        return topOrder;

    }

    private static void computeDegree(List<Node> nodes) {
        resetDegree(nodes);
        for (Node node : nodes) {
            for (Edge edge : node.toEdges) {
                edge.to.degree++;
            }
        }
    }

    private static void resetDegree(List<Node> nodes) {
        for (Node node : nodes) {
            node.degree = 0;
        }
    }
}
