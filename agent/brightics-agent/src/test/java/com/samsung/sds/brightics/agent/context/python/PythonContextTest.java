package com.samsung.sds.brightics.agent.context.python;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.agent.context.UserContextSession;
import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.agent.util.DataKeyUtil;
import com.samsung.sds.brightics.common.core.acl.Permission;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.view.Column;
import com.samsung.sds.brightics.common.data.view.ObjectTable;
import com.samsung.sds.brightics.common.data.view.Table;
import com.samsung.sds.brightics.common.network.proto.ContextType;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.EnvironmentVariables;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.exceptions.JedisConnectionException;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.fail;
import static org.junit.Assume.assumeTrue;

public class PythonContextTest {

    @Rule
    public final EnvironmentVariables environmentVariables = new EnvironmentVariables();

    private static String REPOSITORY_PATH;
    private static String FILE_PATH;

    private PythonContext runner;

    private int pythonVersion = 2;

    @Before
    public void setUp() {
        String projectRootPath = Paths.get(".").toAbsolutePath().getParent().getParent().getParent().toString();
        REPOSITORY_PATH = Paths.get(projectRootPath, "function").toString();
        FILE_PATH = Paths.get(REPOSITORY_PATH, "python/brightics/brightics_python_runner.py").toString();

        environmentVariables.set("BRIGHTICS_FUNCTION_HOME", REPOSITORY_PATH);

        ThreadLocalContext.put("user", "test_user");

        runner = new PythonContext("test_user");
        runner.init();

        pythonVersion = Integer.parseInt(runner.runScript(makePythonScript("import sys\nprint(sys.version_info.major)")));
    }

    @After
    public void tearDown() {
        runner.close();
    }

    @Test
    public void testSimpleStatementExecution() {
        TaskMessageWrapper scriptMessage = makePythonScript("for i in range(5):", "  print(i)");

        String result = runner.runScript(scriptMessage);

        assertThat(result).isNotBlank().isEqualToIgnoringNewLines("01234");
    }

    @Test
    public void testMultiplePythonRunner() {
        PythonContext runner2 = new PythonContext("test_session");
        runner2.init();

        TaskMessageWrapper scriptMessage1 = makePythonScript("print('Hello, runner1')");
        TaskMessageWrapper scriptMessage2 = makePythonScript("print('Hello, runner2')");

        String result1 = runner.runScript(scriptMessage1);
        String result2 = runner2.runScript(scriptMessage2);

        assertThat(result1).isNotBlank().isEqualToIgnoringNewLines("Hello, runner1");
        assertThat(result2).isNotBlank().isEqualToIgnoringNewLines("Hello, runner2");

        runner2.close();
    }

    @Test
    public void cannotRunBlankScript() {
        String result = runner.runScript(makePythonScript(" "));

        assertThat(result).isBlank();
    }

    @Test
    public void testMultipleLinesOfScript() {
        TaskMessageWrapper message = makePythonScript("# this is a comment"
                , "sum = 0"
                , "for i in range(10):"
                , "  sum += i"
                , ""
                , "print(sum)");

        String result = runner.runScript(message);
        assertThat(result).isNotBlank().isEqualToIgnoringNewLines("45");
    }

    @Test
    public void errorMessageIgnored() {
        TaskMessageWrapper message = makePythonScript("import warnings"
                , "warnings.warn('0' * 80000)"
                , "print('Hello! This is Standard out!')");

        String result = runner.runScript(message);

        assertThat(result).isNotBlank().isEqualToIgnoringNewLines("Hello! This is Standard out!");
    }

    @Test
    public void testNoOutputScript() {
        TaskMessageWrapper message = makePythonScript("def test():", "  pass");

        String result = runner.runScript(message);

        assertThat(result).isBlank();
    }

    @Test
    public void scriptContainsOnlyCommentReturnBlank() {
        TaskMessageWrapper message = makePythonScript("# def test():", "  # pass");

        String result = runner.runScript(message);

        assertThat(result).isBlank();
    }

    @Test
    public void multipleRunShareVariables() {
        String result1 = runner.runScript(makePythonScript("a = 2"));
        String result2 = runner.runScript(makePythonScript("b = 3"));

        assertThat(result1).isBlank();
        assertThat(result2).isBlank();

        String result = runner.runScript(makePythonScript("a + b"));
        assertThat(result).isNotBlank().isEqualToIgnoringNewLines("5");
    }

    @Test
    public void testExceptionReturn() {
        String errorMsg = pythonVersion == 2 ?
                "ZeroDivisionError: integer division or modulo by zero" : "ZeroDivisionError: division by zero";

        try {
            runner.runScript(makePythonScript("1/0"));
            fail("expect BrighticsCoreException");
        } catch (BrighticsCoreException e) {
            assertThat(e.getMessage()).
                    isNotBlank().
                    isEqualToIgnoringNewLines("Python script error : " + errorMsg);

            assertThat(e.detailedCause).isNotBlank();

            String[] traceback = e.getCause().toString().split("[\r\n]+");
            assertThat(traceback[0]).isEqualToIgnoringNewLines("java.lang.Throwable: Traceback (most recent call last):");
            assertThat(traceback[1]).containsSubsequence("File \"", FILE_PATH, "\"", ", line", ", in _executer");
            assertThat(traceback[2]).isEqualToIgnoringNewLines("    exec(interactive_code_object, self._globals)");
            assertThat(traceback[3]).isEqualToIgnoringNewLines("  File \"<string>\", line 1, in <module>");
            assertThat(traceback[4]).isEqualToIgnoringNewLines(errorMsg);
        } catch (Exception e) {
            fail("expect BrighticsCoreException");
        }
    }

    @Test
    public void testKoreanInput() {
        String result = runner.runScript(makePythonScript("a = '안녕하세요'", "print(a)"));
        assertThat(result)
                .isNotBlank()
                .isEqualToIgnoringNewLines("안녕하세요");
    }

    @Ignore("not work on Windows")
    @Test
    public void testExecInterrupt() {
        new Thread(() -> {
            try {
                Thread.sleep(2500);
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                runner.stopTask("");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

        runner.runScript(makePythonScript("import time"));
        runner.runScript(makePythonScript("a = 1"));

        String result = runner.runScript(makePythonScript("for i in range(10):\n  time.sleep(0.5)\n  print(i)"));
        assertThat(result).isNotBlank().contains("0");

        int indexOfTraceback = result.indexOf("Traceback");
        assertThat(indexOfTraceback).isGreaterThan(0);

        String interruptedTraceback = result.substring(indexOfTraceback);
        assertThat(interruptedTraceback)
                .isNotBlank()
                .hasLineCount(7)
                .isEqualToIgnoringNewLines("Traceback (most recent call last):" +
                        "  File \"" + FILE_PATH + "\", line 57, in _executer" +
                        "    exec(interactive_code_object)" +
                        "  File \"<string>\", line 2, in <module>" +
                        "  File \"" + FILE_PATH + "\", line 77, in _interrupt_handler" +
                        "    sys.exit(0)" +
                        "SystemExit: 0");

        // after interrupted by thread have defined variable

        result = runner.runScript(makePythonScript("a"));
        assertThat(result).isEqualToIgnoringNewLines("1");
    }

    @Ignore("It is hard to handle added dependencies by creating new function, just test in fully prepared environment")
    @Test
    public void testRunFunction() {
        String putDataResult = runner.runScript(makePythonScript(
                "import numpy as np",
                "import pandas as pd",
                "from sklearn import datasets",
                "data = datasets.load_iris()",
                "iris_data = pd.DataFrame(np.c_[data['data'], data['target']], columns=data['feature_names'] + ['target'])",
                "put_data('/test_user/mid/iris_data', iris_data, 'label')"));
        assertThat(putDataResult).isBlank();

        runner.runFunction(makeFunctionMessage("LinearRegressionTrain",
                "{featureCols=[\"sepal length (cm)\",\"sepal width (cm)\",\"petal length (cm)\",\"petal width (cm)\"], labelCol=\"target\"}",
                "{inputs={\"inputTable\": \"iris_data\"}, " +
                        "outputs={\"train_model\": \"linear_regression_result\"}, " +
                        "mid=\"mid\", " +
                        "persist=false}"));

        UserContextSession userSession = ContextManager.getCurrentUserContextSession();

        DataStatus kMeansResult1 = userSession.getDataStatus("/test_user/mid/linear_regression_result");

        assertThat(kMeansResult1).isNotNull();
        assertThat(kMeansResult1.typeName).isEqualTo("dict");
        assertThat(kMeansResult1.acl).isEqualTo(Permission.PUBLIC);
        assertThat(kMeansResult1.contextType).isEqualTo(ContextType.PYTHON);
    }

    @Test
    public void testWriteParquetWhenDataTypeIsPandasDataFrame() {
        String putDataResult = runner.runScript(makePythonScript(
                "import pandas as pd",
                "df = pd.DataFrame({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]})",
                "put_data('df_data', df, 'label')"));
        assertThat(putDataResult).isBlank();

        DataStatus status = runner.writeData("df_data", "test.parquet");
        assertThat(status.typeName).isExactlyInstanceOf(String.class).isEqualTo("table");
        assertThat(status.acl).isExactlyInstanceOf(Permission.class).isEqualTo(Permission.PUBLIC);
        assertThat(status.contextType).isExactlyInstanceOf(ContextType.class).isEqualTo(ContextType.FILESYSTEM);
    }

    @Test
    public void testWriteDataToRedisWhenDataTypeIsNotDataFrame() {
        assumeTrue(redisServerStarted()); // If redis server is not started, the test would be ignored

        String putDataResult = runner.runScript(makePythonScript("a = 'test data'", "put_data('redis_test_key', a, 'label')"));
        assertThat(putDataResult).isBlank();

        DataStatus status = runner.writeData("redis_test_key", "redis_test");
        assertThat(status.typeName).isExactlyInstanceOf(String.class).isEqualTo("text");
        assertThat(status.acl).isExactlyInstanceOf(Permission.class).isEqualTo(Permission.PUBLIC);
        assertThat(status.contextType).isExactlyInstanceOf(ContextType.class).isEqualTo(ContextType.KV_STORE);

        clearRedisTestData("redis_test_key");
    }

    @Test
    public void testReadRedisDatas() {
        assumeTrue(redisServerStarted()); // If redis server is not started, the test would be ignored

        testReadDataFromRedis("redis_test_str", "'test_str'", "str", "label_str");
        testReadDataFromRedis("redis_test_num", "123", "int", "label_int");
        testReadDataFromRedis("redis_test_list", "[1, 2, 3]", "list", "label_list");
        testReadDataFromRedis("redis_test_tuple", "(1, 2, 3)", "tuple", "label_tuple");
        testReadDataFromRedis("redis_test_set", "{1, 2, 3}", "set", "label_set");
        testReadDataFromRedis("redis_test_dict", "{'1': 1, '2': 2, '3': 3}", "dict", "label_dict");

        clearRedisTestData("redis_test_str",
                "redis_test_num",
                "redis_test_list",
                "redis_test_tuple",
                "redis_test_set",
                "redis_test_dict");
    }

    private boolean redisServerStarted() {
        JedisPool pool = new JedisPool("localhost", 6379);

        try {
            pool.getResource();
            return true;
        } catch (JedisConnectionException e) {
            return false;
        }
    }

    private void testReadDataFromRedis(String key, String data, String type, String label) {
        String putDataResult = runner.runScript(makePythonScript("put_data('" + key + "', " + data + ", '" + label + "')"));
        assertThat(putDataResult).isBlank();

        runner.writeData(key, key);

        String result = runner.runScript(makePythonScript("read_result = read_redis('" + key + "')", "read_result"));
        assertThat(result).isEqualTo(data);

        result = runner.runScript(makePythonScript("type(read_result)"));
        assertThat(result).isEqualTo(String.format("<class '%s'>", type));
    }

    private void clearRedisTestData(String... testKeys) {
        String deleteResult = runner.runScript(makePythonScript(
                "import redis as _redis_test",
                "_test_redis = _redis_test.StrictRedis(host='localhost', port=6379)",
                "_test_redis.delete(" + Arrays.stream(testKeys).collect(Collectors.joining("','", "'", "'")) + ")"));

        assertThat(Integer.valueOf(deleteResult)).isEqualTo(testKeys.length);
    }

    @Test
    public void testViewDataWhenDataTypeIsPandasDataFrame() throws Exception {
        String putDataResult = runner.runScript(makePythonScript(
                "from collections import OrderedDict",
                "import pandas as pd",
                "df = pd.DataFrame(OrderedDict({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]}))",
                "put_data('df_data', df, 'label')"));
        assertThat(putDataResult).isBlank();

        Map<String, Object> dataView = toMap(runner.viewData("df_data", 0, 10));

        Column[] schema = new Column[3];
        schema[0] = new Column("one", "float64");
        schema[1] = new Column("two", "object");
        schema[2] = new Column("three", "bool");

        Object[][] data = new Object[3][3];
        data[0][0] = -1.0;
        data[0][1] = "foo";
        data[0][2] = true;
        data[1][0] = 0.0;
        data[1][1] = "bar";
        data[1][2] = false;
        data[2][0] = 2.5;
        data[2][1] = "baz";
        data[2][2] = true;

        Map<String, Object> expectedTable = toMap(new ObjectTable(3, -1, schema, data));

        assertThat(dataView).isEqualToComparingFieldByFieldRecursively(expectedTable);
    }

    @Test
    public void testViewTextWhenDataTypeIsText() throws Exception {
        String putDataResult = runner.runScript(makePythonScript(
                "put_data('text_data', 'This is saved text data', 'label')"));
        assertThat(putDataResult).isBlank();

        Map<String, Object> dataView = toMap(runner.viewData("text_data", 0, 10));

        assertThat(dataView).containsKeys("type", "data");
        assertThat(dataView.get("type")).isEqualTo("text");
        assertThat(dataView.get("data")).isEqualTo("This is saved text data");
    }

    @Test
    public void testNotifyDataUpdated() {
        String dataKey = ContextManager.getCurrentUserContextSession().getLink(DataKeyUtil.createDataKey("mid", "test"));

        String putDataResult = runner.runScript(makePythonScript(String.format("put_data('%s', [1, 2, 3, 4, 5], 'label')", dataKey)));
        assertThat(putDataResult).isBlank();

        DataStatus updatedDataStatus = ContextManager.getDataStatusAsKey(dataKey);
        assertThat(updatedDataStatus).isNotNull();
        assertThat(updatedDataStatus.typeName).isEqualTo("list");
        assertThat(updatedDataStatus.acl).isEqualTo(Permission.PUBLIC);
        assertThat(updatedDataStatus.contextType).isEqualTo(ContextType.PYTHON);
    }

    @Test
    public void testNotifyDataDeleted() {
        String dataKey = ContextManager.getCurrentUserContextSession().getLink(DataKeyUtil.createDataKey("mid", "test"));

        String putDataResult = runner.runScript(makePythonScript(
                String.format("put_data('%s', [1, 2, 3, 4, 5], 'label')", dataKey),
                String.format("delete_data('%s')", dataKey)));
        assertThat(putDataResult).isEqualToIgnoringNewLines("True");

        assertThatThrownBy(() -> ContextManager.getDataStatusAsKey(dataKey)).
                isInstanceOf(BrighticsCoreException.class).
                hasMessage(String.format("Cannot get data. %s", dataKey));
    }

    @Test
    public void testPythonImportModuleInUserDefFunction() {
        String result = runner.runScript(makePythonScript(
                "import random",
                "def test():",
                "  return random.randint(0, 10)",
                "",
                "print(test())"));

        assertThat(Integer.parseInt(result)).isBetween(0, 10);
    }

    @Test
    public void testViewSchema() throws Exception {
        String putDataResult = runner.runScript(makePythonScript(
                "from collections import OrderedDict",
                "import pandas as pd",
                "df = pd.DataFrame(OrderedDict({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]}))",
                "put_data('df_data', df, 'label')"));
        assertThat(putDataResult).isBlank();

        Map<String, Object> table = toMap(runner.viewSchema("df_data"));

        Column[] schema = new Column[3];
        schema[0] = new Column("one", "float64");
        schema[1] = new Column("two", "object");
        schema[2] = new Column("three", "bool");

        Map<String, Object> expectedTable = toMap(new Table(-1, -1, schema));

        assertThat(table).isEqualToComparingFieldByFieldRecursively(expectedTable);
    }

    @Test
    public void testRemoveData() {
        String putDataResult = runner.runScript(makePythonScript(
                "from collections import OrderedDict",
                "import pandas as pd",
                "df = pd.DataFrame(OrderedDict({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]}))",
                "put_data('df_data', df, 'label')"));
        assertThat(putDataResult).isBlank();

        assertThat(runner.removeData("df_data")).isTrue();
        assertThat(runner.removeData("df_data")).isFalse();
    }

    @Test
    public void testResetPythonContext() {
        String assignResult = runner.runScript(makePythonScript("a = 1"));
        assertThat(assignResult).isBlank();

        String printResult = runner.runScript(makePythonScript("print(a)"));
        assertThat(printResult).isEqualToIgnoringNewLines("1");

        runner.reset();

        assertThatThrownBy(() -> runner.runScript(makePythonScript("print(a)"))).
                isInstanceOf(BrighticsCoreException.class).
                hasMessage("Python script error : NameError: name 'a' is not defined\n");
    }

    @Test
    public void testLongResult() {
        StringBuilder longStr = new StringBuilder();
        for (int i = 0; i < 80000; i++) {
            longStr.append("0");
        }
        TaskMessageWrapper scriptMessage = makePythonScript("print('0' * 80000)");
        String result = runner.runScript(scriptMessage);
        assertThat(result).isNotBlank().isEqualToIgnoringNewLines(longStr.toString());
    }

    @Test
    public void testPythonScript() {
        String result = runner.runScript(makePythonScriptScript("", "out", "df", "",
                "from collections import OrderedDict",
                "import pandas as pd",
                "df = pd.DataFrame(OrderedDict({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]}))"));

        assertThat(result).isBlank();

        DataStatus status = ContextManager.getCurrentUserContextSession().getDataStatus("/test_user/mid/out");

        assertThat(status).isNotNull();
        assertThat(status.typeName).isEqualTo("table");
        assertThat(status.acl).isEqualTo(Permission.PUBLIC);
        assertThat(status.contextType).isEqualTo(ContextType.PYTHON);
    }

    @Test
    public void testOldVersionPythonUDF_Before3_5() {
        runner.runScript(makePythonScript(
                "from collections import OrderedDict",
                "import pandas as pd",
                "df = pd.DataFrame(OrderedDict({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]}))",
                "put_data('/test_user/mid/in', df, 'label')"));

        String result = runner.runScript(makePythonScriptScript("in",
                "out",
                "out_df",
                "[\"aaa\", \"string\", \"greet\"], [\"bbb\", \"string\", \"\"]",
                "print(aaa)",
                "print(bbb)",
                "out_df = inputs[0]"));

        assertThat(result).isEqualTo("greet\nNone");

        DataStatus status = ContextManager.getCurrentUserContextSession().getDataStatus("/test_user/mid/out");

        assertThat(status).isNotNull();
        assertThat(status.typeName).isEqualTo("table");
        assertThat(status.acl).isEqualTo(Permission.PUBLIC);
        assertThat(status.contextType).isEqualTo(ContextType.PYTHON);
    }

    @Test
    public void testPythonUDF_3_6() {
        runner.runScript(makePythonScript(
                "from collections import OrderedDict",
                "import pandas as pd",
                "df = pd.DataFrame(OrderedDict({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]}))",
                "put_data('/test_user/mid/in_data', df, 'label')"));

        String result = runner.runScript(makePythonUDFScript("in_data",
                "out_data",
                "\"input_string\": \"str\", \"input_integer\": 1, \"input_double\": 1.0, " +
                        "\"array_input_string\": [\"str one\", \"str two\", \"str three\"], " +
                        "\"array_input_integer\": [1, 2, 3], " +
                        "\"array_input_double\": [1.0, 2.0, 3.0], " +
                        "\"expression\": \"1 + 2\", " +
                        "\"column_single\": [\"Sepal Length\"], " +
                        "\"column_multiple\": [\"Sepal Length\", \"Sepal Width\", \"Petal Length\", \"Petal Width\"], " +
                        "\"checkbox\": [\"check one\", \"check two\", \"check three\"], " +
                        "\"radio\": \"radio\", " +
                        "\"dropdown\": \"dropdown\"",
                "print(input_string, type(input_string))",
                "print(input_integer, type(input_integer))",
                "print(input_double, type(input_double))",
                "print(array_input_string, type(array_input_string), all(isinstance(l, str) for l in array_input_string))",
                "print(array_input_integer, type(array_input_integer), all(isinstance(l, int) for l in array_input_integer))",
                "print(array_input_double, type(array_input_double), all(isinstance(l, float) for l in array_input_double))",
                "print(expression, type(expression))",
                "print(column_single, type(column_single), all(isinstance(l, str) for l in column_single))",
                "print(column_multiple, type(column_multiple), all(isinstance(l, str) for l in column_multiple))",
                "print(checkbox, type(checkbox), all(isinstance(l, str) for l in checkbox))",
                "print(radio, type(radio))",
                "print(dropdown, type(dropdown))",
                "out_key = in_key[0]"));

        assertThat(result).isEqualTo("str <class 'str'>\n" +
                "1 <class 'int'>\n" +
                "1.0 <class 'float'>\n" +
                "['str one', 'str two', 'str three'] <class 'list'> True\n" +
                "[1, 2, 3] <class 'list'> True\n" +
                "[1.0, 2.0, 3.0] <class 'list'> True\n" +
                "1 + 2 <class 'str'>\n" +
                "['Sepal Length'] <class 'list'> True\n" +
                "['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'] <class 'list'> True\n" +
                "['check one', 'check two', 'check three'] <class 'list'> True\n" +
                "radio <class 'str'>\n" +
                "dropdown <class 'str'>");

        DataStatus status = ContextManager.getCurrentUserContextSession().getDataStatus("/test_user/mid/out_data");

        assertThat(status).isNotNull();
        assertThat(status.typeName).isEqualTo("table");
        assertThat(status.acl).isEqualTo(Permission.PUBLIC);
        assertThat(status.contextType).isEqualTo(ContextType.PYTHON);
    }

    @Test
    public void testCatchBrighticsCoreExceptionFromPython() {
        assertThatThrownBy(() -> runner.runScript(makePythonScript(
                    "from brightics.common.exception import BrighticsCoreException",
                    "raise BrighticsCoreException('3109', 'Input shape')")))
                .isInstanceOf(BrighticsCoreException.class)
                .hasMessage(String.format("'Input shape' is a required parameter."));
    }

    private TaskMessageWrapper makeFunctionMessage(String name, String parameters, String attributes) {
        return new TaskMessageWrapper(ExecuteTaskMessage.newBuilder().
                setName(name).
                setParameters(parameters).
                setAttributes(attributes).build());
    }

    private TaskMessageWrapper makePythonScript(String... script) {
        String s = Arrays.stream(script).collect(Collectors.joining("\n"));
        return new TaskMessageWrapper(ExecuteTaskMessage.newBuilder().
                setTaskId(UUID.randomUUID().toString()).
                setName("Python").
                setParameters("{\"script\": \"" + s + "\"}").
                setAttributes("{\"mid\": \"mid\"}").
                build());
    }

    private TaskMessageWrapper makePythonScriptScript(String in, String out, String outAlias, String inputVariables, String... script) {
        String s = Arrays.stream(script).collect(Collectors.joining("\n"));
        return new TaskMessageWrapper(ExecuteTaskMessage.newBuilder().
                setTaskId(UUID.randomUUID().toString()).
                setName("PythonScript").
                setParameters("{\"out-table-alias\": [" + outAlias + "], " +
                        "\"input-variables\": [" + inputVariables + "], " +
                        "\"script\": \"" + s + "\"}").
                setAttributes("{\"inData\": [" + in + "], " +
                        "\"outData\": [" + out + "], " +
                        "\"mid\": \"mid\", " +
                        "\"persist\": false}").build());
    }

    private TaskMessageWrapper makePythonUDFScript(String in, String out, String params, String... script) {
        String s = Arrays.stream(script).collect(Collectors.joining("\n"));
        return new TaskMessageWrapper(ExecuteTaskMessage.newBuilder()
                .setTaskId(UUID.randomUUID().toString())
                .setName("UDF")
                .setParameters("{" + params + ", " +
                        "\"script\": {" +
                            "\"script\": \"" + s + "\"" +
                        "}}")
                .setAttributes("{\"inputs\": {'in_key': " + in + "}," +
                        "\"outputs\": {'out_key': " + out + "}," +
                        "\"mid\": \"mid\"," +
                        "\"persist\": false}")
                .build());
    }

    private static ObjectMapper MAPPER = new ObjectMapper();

    private Map<String, Object> toMap(String json) throws IOException {
        return MAPPER.readValue(json, Map.class);
    }

    private Map<String, Object> toMap(Object obj) throws IOException {
        return toMap(MAPPER.writeValueAsString(obj));
    }
}
