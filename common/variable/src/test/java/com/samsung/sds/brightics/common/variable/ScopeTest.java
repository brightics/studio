package com.samsung.sds.brightics.common.variable;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class ScopeTest {

    private static final String CMD = "<cmd>";

    @Test
    public void testScopeLookupOrder() {
        Context cx = Context.enter();
        Scriptable scope1 = cx.initStandardObjects();
        Scriptable scope2 = cx.initStandardObjects();
        Scriptable scope3 = cx.initStandardObjects();
        scope3.setParentScope(scope2);
        scope2.setParentScope(scope1);
        Object result1 = cx.evaluateString(scope1, "var s=1\ns", CMD, 1, null);
        assertEquals("1", Context.toString(result1));
        Object result2 = cx.evaluateString(scope2, "var s=2\ns", CMD, 1, null);
        assertEquals("2", Context.toString(result2));
        Object result3 = cx.evaluateString(scope3, "s", CMD, 1, null);
        assertEquals("2", Context.toString(result3));
    }

    @Test
    public void testScopedVariableWriter() throws IOException, ClassNotFoundException {
        Context cx = Context.enter();
        Scriptable rootScope = cx.initStandardObjects();
        cx.evaluateString(rootScope, "var root=1", CMD, 1, null);

        cx = Context.enter();
        ScriptableObject scope = cx.initStandardObjects();
        scope.setParentScope(rootScope);
        String result1 = Context.toString(cx.evaluateString(scope, "var a=1\na", CMD, 1, null));
        String result2 = Context.toString(cx.evaluateString(scope, "var b=2\nb", CMD, 1, null));
        String result3 = Context.toString(cx.evaluateString(scope, "var c=b+a\nc", CMD, 1, null));
        Context.exit();

        FileOutputStream fos = new FileOutputStream("scope1.v");
        try (ObjectOutputStream out = new ObjectOutputStream(fos)) {
            scope.setParentScope(null);
            out.writeObject(scope);
        }
        Context.exit();

        cx = Context.enter();
        FileInputStream fis = new FileInputStream("scope1.v");
        Scriptable loadedScope;
        try (ObjectInputStream in = new ObjectInputStream(fis)) {
            loadedScope = (Scriptable) in.readObject();
        }
        loadedScope.setParentScope(rootScope);

        assertEquals(result1, Context.toString(cx.evaluateString(loadedScope, "a", CMD, 1, null)));
        assertEquals(result2, Context.toString(cx.evaluateString(loadedScope, "b", CMD, 1, null)));
        assertEquals(result3, Context.toString(cx.evaluateString(loadedScope, "c", CMD, 1, null)));
        Context.exit();
    }

}
