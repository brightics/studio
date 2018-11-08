package com.samsung.sds.brightics.server.common.util.keras;

import java.util.HashMap;
import java.util.List;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.server.common.util.keras.flow.KerasFlowNode;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class KerasModelFlowTest {

    private static JsonObject dlLoadParam;

    @Before
    public void setup() {
        dlLoadParam = new JsonObject();
        dlLoadParam.addProperty("loadType", "HDFS");
        dlLoadParam.addProperty("input_path", "data.parquet");
        dlLoadParam.addProperty("train_data_column", "train_data");
        dlLoadParam.addProperty("train_label_column", "train_label");

        JsonArray inputShape = new JsonArray();
        inputShape.add("28");
        inputShape.add("28");
        inputShape.add("1");

        dlLoadParam.add("input_shape", inputShape);
    }

    @Ignore
    @Test
    public void tenConnectionPermutationTest() throws Exception {
        int size = 10;
        JsonObject[] linkList = new JsonObject[size];

        for (int i = 0; i < size; i++) {
            JsonObject link = new JsonObject();
            link.addProperty("sourceFid", String.valueOf(size - i));
            link.addProperty("targetFid", String.valueOf(size - i + 1));

            linkList[i] = link;
        }

        perm(linkList, 0, size, size);
    }

    @Test
    public void whenModelHaveATwoInputActivityReturnLongBranchInput() throws Exception {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        JsonObject link0 = new JsonObject();
        link0.addProperty("sourceFid", "0");
        link0.addProperty("targetFid", "3");

        JsonObject link3 = new JsonObject();
        link3.addProperty("sourceFid", "3");
        link3.addProperty("targetFid", "4");

        JsonObject link4 = new JsonObject();
        link4.addProperty("sourceFid", "4");
        link4.addProperty("targetFid", "5");

        links.add(link0);
        links.add(link1);
        links.add(link2);
        links.add(link3);
        links.add(link4);

        JsonObject outputParam = new JsonObject();
        outputParam.addProperty("train_data", "1");

        JsonObject dlLoadParam2 = new JsonObject();
        dlLoadParam2.addProperty("loadType", "hdfs");
        dlLoadParam2.addProperty("input_path", "data.parquet");
        dlLoadParam2.addProperty("train_data_column", "train_data");
        dlLoadParam2.addProperty("train_label_column", "train_label");

        JsonArray inputShape = new JsonArray();
        inputShape.add("28");
        inputShape.add("28");
        inputShape.add("1");

        dlLoadParam2.add("input_shape", inputShape);

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1", "DLLoad", dlLoadParam);
        addFunction(functions, "2");
        addFunction(functions, "3");
        addFunction(functions, "4");
        addFunction(functions, "5", "Output", outputParam);
        addFunction(functions, "0", "DLLoad", dlLoadParam2);

        KerasModelFlow kerasModelFlow = new KerasModelFlow(links, functions);
        KerasFlowNode start = kerasModelFlow.getDataNodes().get(0);
        int depth = start.getDepth();

        assertThat(start.getFid()).isEqualTo("1");
        assertThat(start.getPrevNodes().size()).isEqualTo(0);
        assertThat(start.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node2 = start.getNextNodes().get(0);
        assertThat(node2.getFid()).isEqualTo("2");
        assertThat(node2.getDepth()).isEqualTo(depth + 1);
        assertThat(node2.getPrevNodes().size()).isEqualTo(1);
        assertThat(node2.getPrevNodes().get(0)).isEqualTo(start);
        assertThat(node2.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node3 = node2.getNextNodes().get(0);
        assertThat(node3.getFid()).isEqualTo("3");
        assertThat(node3.getDepth()).isEqualTo(depth + 2);

        List<KerasFlowNode> prev = node3.getPrevNodes();
        assertThat(prev.size()).isEqualTo(2);
        if (prev.get(0).getFid().equals("0")) {
            KerasFlowNode node0 = prev.get(0);
            assertThat(node0.getFid()).isEqualTo("0");
            assertThat(node0.getDepth()).isEqualTo(depth + 1);
            assertThat(node0.getPrevNodes().size()).isEqualTo(0);
            assertThat(node0.getNextNodes().size()).isEqualTo(1);
        } else {
            KerasFlowNode node0 = prev.get(1);
            assertThat(node0.getFid()).isEqualTo("0");
            assertThat(node0.getDepth()).isEqualTo(depth + 1);
            assertThat(node0.getPrevNodes().size()).isEqualTo(0);
            assertThat(node0.getNextNodes().size()).isEqualTo(1);
        }

        assertThat(node3.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node4 = node3.getNextNodes().get(0);
        assertThat(node4.getFid()).isEqualTo("4");
        assertThat(node4.getDepth()).isEqualTo(depth + 3);
        assertThat(node4.getPrevNodes().size()).isEqualTo(1);
        assertThat(node4.getPrevNodes().get(0)).isEqualTo(node3);
        assertThat(node4.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node5 = node4.getNextNodes().get(0);
        assertThat(node5.getFid()).isEqualTo("5");
        assertThat(node5.getDepth()).isEqualTo(depth + 4);
        assertThat(node5.getPrevNodes().size()).isEqualTo(1);
        assertThat(node5.getPrevNodes().get(0)).isEqualTo(node4);
        assertThat(node5.getNextNodes().size()).isEqualTo(0);
    }

    @Test
    public void modelCouldHaveACircleHalfway() throws Exception {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        JsonObject link3 = new JsonObject();
        link3.addProperty("sourceFid", "3");
        link3.addProperty("targetFid", "4");

        JsonObject link4 = new JsonObject();
        link4.addProperty("sourceFid", "4");
        link4.addProperty("targetFid", "5");

        JsonObject link5 = new JsonObject();
        link5.addProperty("sourceFid", "5");
        link5.addProperty("targetFid", "6");

        JsonObject link2_7 = new JsonObject();
        link2_7.addProperty("sourceFid", "2");
        link2_7.addProperty("targetFid", "7");

        JsonObject link7 = new JsonObject();
        link7.addProperty("sourceFid", "7");
        link7.addProperty("targetFid", "8");

        JsonObject link8 = new JsonObject();
        link8.addProperty("sourceFid", "8");
        link8.addProperty("targetFid", "5");

        links.add(link1);
        links.add(link2);
        links.add(link3);
        links.add(link4);
        links.add(link5);
        links.add(link2_7);
        links.add(link7);
        links.add(link8);

        JsonObject outputParam = new JsonObject();
        outputParam.addProperty("train_data", "1");

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1", "DLLoad", dlLoadParam);
        addFunction(functions, "2");
        addFunction(functions, "3");
        addFunction(functions, "4");
        addFunction(functions, "5");
        addFunction(functions, "7");
        addFunction(functions, "8");
        addFunction(functions, "6", "Output", outputParam);

        KerasModelFlow kerasModelFlow = new KerasModelFlow(links, functions);
        KerasFlowNode start = kerasModelFlow.getDataNodes().get(0);
        int depth = start.getDepth();

        assertThat(start.getFid()).isEqualTo("1");
        assertThat(start.getPrevNodes().size()).isEqualTo(0);
        assertThat(start.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node2 = start.getNextNodes().get(0);
        assertThat(node2.getFid()).isEqualTo("2");
        assertThat(node2.getDepth()).isEqualTo(depth + 1);
        assertThat(node2.getPrevNodes().size()).isEqualTo(1);
        assertThat(node2.getPrevNodes().get(0)).isEqualTo(start);
        assertThat(node2.getNextNodes().size()).isEqualTo(2);

        KerasFlowNode node3 = node2.getNextNodes().get(0);
        KerasFlowNode node7 = node2.getNextNodes().get(1);

        if (node2.getNextNodes().get(0).getFid().equals("7")) {
            node7 = node2.getNextNodes().get(0);
            node3 = node2.getNextNodes().get(1);
        }

        assertThat(node3.getFid()).isEqualTo("3");
        assertThat(node3.getDepth()).isEqualTo(depth + 2);
        assertThat(node3.getPrevNodes().size()).isEqualTo(1);
        assertThat(node3.getPrevNodes().get(0)).isEqualTo(node2);
        assertThat(node3.getNextNodes().size()).isEqualTo(1);

        assertThat(node7.getFid()).isEqualTo("7");
        assertThat(node7.getDepth()).isEqualTo(depth + 2);
        assertThat(node7.getPrevNodes().size()).isEqualTo(1);
        assertThat(node7.getPrevNodes().get(0)).isEqualTo(node2);
        assertThat(node7.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node4 = node3.getNextNodes().get(0);
        assertThat(node4.getFid()).isEqualTo("4");
        assertThat(node4.getDepth()).isEqualTo(depth + 3);
        assertThat(node4.getPrevNodes().size()).isEqualTo(1);
        assertThat(node4.getPrevNodes().get(0)).isEqualTo(node3);
        assertThat(node4.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node8 = node7.getNextNodes().get(0);
        assertThat(node8.getFid()).isEqualTo("8");
        assertThat(node8.getDepth()).isEqualTo(depth + 3);
        assertThat(node8.getPrevNodes().size()).isEqualTo(1);
        assertThat(node8.getPrevNodes().get(0)).isEqualTo(node7);
        assertThat(node8.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node5 = node4.getNextNodes().get(0);
        assertThat(node5.getFid()).isEqualTo("5");
        assertThat(node5.getDepth()).isEqualTo(depth + 4);
        assertThat(node5.getPrevNodes().size()).isEqualTo(2);

        if (node5.getPrevNodes().get(0).equals(node4)) {
            assertThat(node5.getPrevNodes().get(1).equals(node8)).isTrue();
        } else {
            assertThat(node5.getPrevNodes().get(0).equals(node8)).isTrue();
            assertThat(node5.getPrevNodes().get(1).equals(node4)).isTrue();
        }

        assertThat(node5.getNextNodes().size()).isEqualTo(1);

        KerasFlowNode node6 = node5.getNextNodes().get(0);
        assertThat(node6.getFid()).isEqualTo("6");
        assertThat(node6.getDepth()).isEqualTo(depth + 5);
        assertThat(node6.getPrevNodes().size()).isEqualTo(1);
        assertThat(node6.getPrevNodes().get(0)).isEqualTo(node5);
        assertThat(node6.getNextNodes().size()).isEqualTo(0);
    }

    @Test
    public void whenModelHaveBrokenLinkExceptionOccurs() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        JsonObject link4 = new JsonObject();
        link4.addProperty("sourceFid", "4");
        link4.addProperty("targetFid", "5");

        links.add(link1);
        links.add(link2);
        links.add(link4);

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1", "DLLoad", dlLoadParam);
        addFunction(functions, "2");
        addFunction(functions, "3");
        addFunction(functions, "4", "Dense", new JsonObject());
        addFunction(functions, "5");

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("Model have a broken connection");
    }

    @Test
    public void whenCannotFindInputActivityErrorOccurs() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        JsonObject link3 = new JsonObject();
        link3.addProperty("sourceFid", "3");
        link3.addProperty("targetFid", "1");

        links.add(link1);
        links.add(link2);
        links.add(link3);

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1");
        addFunction(functions, "2");
        addFunction(functions, "3");

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("Cannot find an input activity");
    }

    @Test
    public void inputTypeActivityCannotHaveASourceActivity() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        JsonObject link3 = new JsonObject();
        link3.addProperty("sourceFid", "3");
        link3.addProperty("targetFid", "4");

        links.add(link1);
        links.add(link2);
        links.add(link3);

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1");
        addFunction(functions, "2", "DLLoad", dlLoadParam);
        addFunction(functions, "3");
        addFunction(functions, "4");

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("I/O type activity could not have any previous connection");
    }

    @Test
    public void inputActivityShouldBeAnIOType() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        JsonObject link3 = new JsonObject();
        link3.addProperty("sourceFid", "3");
        link3.addProperty("targetFid", "4");

        links.add(link1);
        links.add(link2);
        links.add(link3);

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1");
        addFunction(functions, "2");
        addFunction(functions, "3");
        addFunction(functions, "4");

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("Input activity should be an I/O type. (DL Load or ImageDataGenerator)");
    }

    @Test
    public void modelShouldEndWithOutputActivity() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        links.add(link1);
        links.add(link2);

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1", "DLLoad", dlLoadParam);
        addFunction(functions, "2");
        addFunction(functions, "3");

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("Model should end with Output activity.");
    }

    @Test
    public void outputActivityTrainDataParameterRequired() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        links.add(link1);
        links.add(link2);

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1", "DLLoad", dlLoadParam);
        addFunction(functions, "2");
        addFunction(functions, "3", "Output", new JsonObject());

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("Output activity 'Train Data' is a required parameter.");
    }

    @Test
    public void ifOutputActivityCannotFindPairInputActivityErrorOccurs() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        links.add(link1);
        links.add(link2);

        JsonObject outputParam = new JsonObject();
        outputParam.addProperty("train_data", "0");

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1", "DLLoad", dlLoadParam);
        addFunction(functions, "2");
        addFunction(functions, "3", "Output", outputParam);

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("Cannot find input activity with fid '0' set in 'Train Data' parameter of output activity.");
    }

    @Test
    public void outputActivityTrainDataParameterShouldBeAnDLLoadOrImageDataGenerator() {
        JsonArray links = new JsonArray();

        JsonObject link1 = new JsonObject();
        link1.addProperty("sourceFid", "1");
        link1.addProperty("targetFid", "2");

        JsonObject link2 = new JsonObject();
        link2.addProperty("sourceFid", "2");
        link2.addProperty("targetFid", "3");

        links.add(link1);
        links.add(link2);

        JsonObject outputParam = new JsonObject();
        outputParam.addProperty("train_data", "2");

        HashMap<String, JsonObject> functions = new HashMap<>();
        addFunction(functions, "1", "DLLoad", dlLoadParam);
        addFunction(functions, "2");
        addFunction(functions, "3", "Output", outputParam);

        assertThatThrownBy(() -> new KerasModelFlow(links, functions))
                .hasMessage("Output activity 'Train Data' parameter should be a DL Load or ImageDataGenerator type.");
    }

    private void addFunction(HashMap<String, JsonObject> functions, String fid) {
        addFunction(functions, fid, "Dense", new JsonObject());
    }

    private void addFunction(HashMap<String, JsonObject> functions, String fid, String name, JsonObject param) {
        JsonObject func = new JsonObject();
        func.addProperty("fid", fid);
        func.addProperty("name", name);
        func.add("param", param);
        functions.put(fid, func);
    }

    static long count = 1;
    public static void perm(JsonObject[] arr, int depth, int n, int k) throws Exception {
        if (depth == k) {
            JsonArray a = getArr(arr, k);
            System.out.println(count++);

            KerasFlowNode s = new KerasModelFlow(a, new HashMap<>()).getDataNodes().get(0);

            int d = 0;

            while(!s.getNextNodes().isEmpty()) {
                assertThat(s.getDepth()).isEqualTo(d);
                assertThat(s.getFid()).isEqualTo(String.valueOf(d + 1));
                assertThat(s.getNextNodes().size()).isEqualTo(1);

                s = s.getNextNodes().get(0);
                d++;
            }

            assertThat(s.getDepth()).isEqualTo(d);
            assertThat(s.getFid()).isEqualTo(String.valueOf(d + 1));

            return;
        }

        for (int i = depth; i < n; i++) {
            swap(arr, i, depth);
            perm(arr, depth + 1, n, k);
            swap(arr, i, depth);
        }
    }

    public static void swap(JsonObject[] arr, int i, int j) {
        JsonObject temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static JsonArray getArr(JsonObject[] arr, int k) {
        JsonArray jsonArr = new JsonArray();
        for (int i = 0; i < k; i++) {
            jsonArr.add(arr[i]);
        }
        return jsonArr;
    }

    public void dfs(JsonObject[] linkArr, List<JsonArray> results, JsonArray result) {
        if (linkArr.length == result.size()) {
            JsonArray temp = new JsonArray();
            results.add(temp);
        }

        for (int i = 0; i < linkArr.length; i++) {
            if (!result.contains(linkArr[i])) {
                result.add(linkArr[i]);
                dfs(linkArr, results, result);
                result.remove(result.size() - 1);
            }
        }
    }
}
