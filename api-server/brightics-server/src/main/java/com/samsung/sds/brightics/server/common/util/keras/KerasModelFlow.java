package com.samsung.sds.brightics.server.common.util.keras;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.concurrent.LinkedBlockingQueue;

import org.apache.commons.collections.CollectionUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowDataDLLoadNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowDataIDGNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowDataNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowLayerNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowOutputNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowModelNode;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowWrapperNode;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasLayers;

public class KerasModelFlow {

    private final JsonArray links;
    private final Map<String, JsonObject> functions;

    private List<KerasFlowDataNode> dataNodes;
    private List<KerasFlowNode> inputNodes;
    private List<KerasFlowOutputNode> outputNodes;

    private final Map<String, KerasFlowNode> allNodes = new HashMap<>();
    private final Set<KerasLayers> layerSet = new LinkedHashSet<>();

    public KerasModelFlow(JsonArray links, Map<String, JsonObject> functions) throws Exception {
        this.links = links;
        this.functions = functions;

        structuringModelFlow();
    }

    private void structuringModelFlow() throws Exception {
        transformLinksToNode();

        setNodeDepth();

        refineDataNodes();
        refineOutputNodes();

        extractModelInputNodes();
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    private void transformLinksToNode() throws Exception {
        Set<KerasFlowNode> notOutputNode = new HashSet<>();
        Set<KerasFlowNode> notInputNode = new HashSet<>();

        for (JsonElement l : this.links) {
            JsonObject linkInfo = l.getAsJsonObject();
            String sourceFid = getValidFid(linkInfo, "sourceFid");
            String targetFid = getValidFid(linkInfo, "targetFid");

            KerasFlowNode source = allNodes.computeIfAbsent(sourceFid, fid -> getKerasFlowNode(fid, functions.get(fid)));
            KerasFlowNode target = allNodes.computeIfAbsent(targetFid, fid -> getKerasFlowNode(fid, functions.get(fid)));

            validateTargetActivity(target);

            source.addNextNode(target);
            target.addPrevNode(source);

            notOutputNode.add(source);
            notInputNode.add(target);

            addLayerSet(source);
            addLayerSet(target);
        }

        if (allNodes.size() != functions.size()) {
            throw new Exception("Model have a broken connection");
        }

        dataNodes = new ArrayList(CollectionUtils.subtract(allNodes.values(), notInputNode));
        if (dataNodes.isEmpty()) {
            throw new Exception("Cannot find an input activity"); // circle
        }

        outputNodes = new ArrayList(CollectionUtils.subtract(allNodes.values(), notOutputNode));
    }

    private String getValidFid(JsonObject linkInfo, String fidKey) throws Exception {
        String fid = linkInfo.get(fidKey).getAsString();

        if (!functions.containsKey(fid)) {
            throw new Exception(String.format("Incorrect link data passed. There are link data containing fid '%s' but actually that activity doesn't exist", fid));
        }

        return fid;
    }

    private void validateTargetActivity(KerasFlowNode node) throws Exception {
        if (node instanceof KerasFlowDataNode) {
            throw new Exception("I/O type activity could not have any previous connection");
        }
    }

    private void addLayerSet(KerasFlowNode node) {
        if (node instanceof KerasFlowLayerNode) {
            addLayerSet(((KerasFlowLayerNode) node).getLayer());
        }
    }

    private void addLayerSet(KerasLayers layer) {
        layerSet.add(layer);
    }

    public Set<KerasLayers> getLayerSet() {
        return layerSet;
    }

    private void setNodeDepth() throws Exception {
        Queue<KerasFlowNode> q = new LinkedBlockingQueue<>();
        Set<KerasFlowNode> visited = new HashSet<>();

        KerasFlowNode mainDataNode = dataNodes.get(0);
        mainDataNode.setDepth(0);

        visited.add(mainDataNode);
        q.add(mainDataNode);

        while (!q.isEmpty()) {
            KerasFlowNode node = q.poll();
            visited.add(node);

            if (node.getDepth() < mainDataNode.getDepth()) {
                mainDataNode = node; // longest branch input node
            }

            for (KerasFlowNode n : node.getPrevNodes()) {
                if (!visited.contains(n)) {
                    n.setDepth(node.getDepth() - 1);
                    q.add(n);
                    visited.add(n);
                }
            }

            for (KerasFlowNode n : node.getNextNodes()) {
                if (!visited.contains(n)) {
                    n.setDepth(node.getDepth() + 1);
                    q.add(n);
                    visited.add(n);
                }
            }
        }

        if (visited.size() != this.functions.size()) {
            throw new Exception("Model have a broken connection");
        }

        if (!(mainDataNode instanceof KerasFlowDataNode)) {
            throw new Exception("Input activity should be an I/O type. (DL Load or ImageDataGenerator)");
        }

        dataNodes.remove(mainDataNode);
        dataNodes.add(0, (KerasFlowDataNode) mainDataNode);
    }

    private void refineDataNodes() throws Exception {
        int index = 1;

        for (KerasFlowNode node : dataNodes) {
            validateInputDataNode(node);

            setDataNodeIndex((KerasFlowDataNode) node, index++);
        }
    }

    private void validateInputDataNode(KerasFlowNode node) throws Exception {
        if (!(node instanceof KerasFlowDataNode)) {
            throw new Exception("Input activity should be an I/O type. (DL Load or ImageDataGenerator)");
        }

        ((KerasFlowDataNode) node).validate();
    }

    private void setDataNodeIndex(KerasFlowDataNode dataNode, int index) {
        dataNode.setInputNodeIndex(index);
    }

    private void refineOutputNodes() throws Exception {
        for (KerasFlowNode outputNode : outputNodes) {
            validateOutputNode(outputNode);

            setDataNodeToFirstLayer((KerasFlowOutputNode) outputNode);
            setOutputNodeToLastLayer((KerasFlowOutputNode) outputNode, outputNode);
        }
    }

    private void validateOutputNode(KerasFlowNode outputNode) throws Exception {
        if (!(outputNode instanceof KerasFlowOutputNode)) {
            throw new Exception("Model should end with Output activity.");
        }

        ((KerasFlowOutputNode) outputNode).validate(allNodes);
    }

    private void setDataNodeToFirstLayer(KerasFlowOutputNode outputNode) {
        KerasFlowDataNode trainDataNode = outputNode.getTrainDataNode();

        setDataNodeToFirstLayer(trainDataNode, trainDataNode);
    }

    private void setDataNodeToFirstLayer(KerasFlowDataNode dataNode, KerasFlowNode node) {
        if (node == null || node.isLastNode()) return;

        KerasFlowNode kerasFlowNode = node.getNextNodes().get(0); // XXX check
        if (kerasFlowNode instanceof KerasFlowLayerNode) {
            ((KerasFlowLayerNode) kerasFlowNode).setDataNode(dataNode);
        } else {
            setDataNodeToFirstLayer(dataNode, kerasFlowNode);
        }
    }

    private void setOutputNodeToLastLayer(KerasFlowOutputNode outputNode, KerasFlowNode node) {
        if (node == null || node.getPrevNodes().isEmpty()) return;

        KerasFlowNode kerasFlowNode = node.getPrevNodes().get(0); // XXX check
        if (kerasFlowNode instanceof KerasFlowLayerNode) {
            ((KerasFlowLayerNode) kerasFlowNode).setOutputNode(outputNode);
        } else {
            setOutputNodeToLastLayer(outputNode, kerasFlowNode);
        }
    }

    private void extractModelInputNodes() {
        inputNodes = new ArrayList<>();

        for (KerasFlowDataNode dataNode : dataNodes) {
            KerasFlowNode firstModelNode = getFirstModelNode(dataNode);

            if (!inputNodes.contains(firstModelNode)) {
                inputNodes.add(firstModelNode);
            }
        }
    }

    private KerasFlowNode getFirstModelNode(KerasFlowNode node) {
        for (KerasFlowNode nextNode : node.getNextNodes()) {
            if (nextNode instanceof KerasFlowModelNode) {
                return nextNode;
            }
        }

        return getFirstModelNode(node.getNextNodes().get(0));
    }

    public List<KerasFlowDataNode> getDataNodes() {
        return dataNodes;
    }

    public List<KerasFlowNode> getInputNodes() {
        return inputNodes;
    }

    public List<KerasFlowOutputNode> getOutputNodes() {
        return outputNodes;
    }

    private KerasFlowNode getKerasFlowNode(String fid, JsonObject function) {
        String operation = function.get("name").getAsString();

        if ("DLLoad".equalsIgnoreCase(operation)) {
            return new KerasFlowDataDLLoadNode(fid, function);
        } else if ("ImageDataGenerator".equalsIgnoreCase(operation)) {
            return new KerasFlowDataIDGNode(fid, function);
        } else if ("Output".equalsIgnoreCase(operation)) {
            return new KerasFlowOutputNode(fid, function);
        } else if ("DLPythonScript".equalsIgnoreCase(operation)) {
            return new KerasFlowModelNode(fid, function);
        } else if ("Bidirectional".equalsIgnoreCase(operation) || "TimeDistributed".equalsIgnoreCase(operation)) {
            KerasFlowWrapperNode layer = new KerasFlowWrapperNode(fid, function, "layer");
            layer.getInnerLayer().ifPresent(this::addLayerSet);
            return layer;
        } else if ("RNN".equalsIgnoreCase(operation)) {
            KerasFlowWrapperNode layer = new KerasFlowWrapperNode(fid, function, "cell");
            layer.getInnerLayer().ifPresent(this::addLayerSet);
            return layer;
        } else {
            return new KerasFlowLayerNode(fid, function);
        }
    }
}
