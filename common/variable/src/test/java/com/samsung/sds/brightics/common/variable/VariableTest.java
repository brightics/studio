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

package com.samsung.sds.brightics.common.variable;

import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.storage.impl.LocalFsStorage;
import static java.lang.System.currentTimeMillis;
import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Test;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;

public class VariableTest {

    private static final String CMD = "<cmd>";
    private Context cx;

    @Before
    public void init() {
        cx = Context.enter();
    }

    @Test
    public void testCommonVariables() {

        Scriptable scope1 = cx.initStandardObjects();
        Scriptable scope2 = cx.initStandardObjects();
        Scriptable scope3 = cx.initStandardObjects();
        scope3.setParentScope(scope2);
        scope2.setParentScope(scope1);
        Object result1 = cx.evaluateString(scope1, "var s='a'\ns", CMD, 1, null);
        Object result2 = cx.evaluateString(scope2, "var t=2.5\nt", CMD, 2, null);
        Object result3 = cx.evaluateString(scope3, "var cars = ['Saab', 'Volvo', 'BMW'];cars.push('KIA');cars", CMD, 3, null);
        Object result4 = cx.evaluateString(scope3, "var car = {type:'Fiat', model:'500', color:'white'};car", CMD, 3, null);
        Object result5 = cx.evaluateString(scope3, "null", CMD, 3, null);
        Object result6 = cx.evaluateString(scope3, "", CMD, 3, null);
        Object result7 = cx.evaluateString(scope3, "var n=-12.0\nn", CMD, 3, null);
        System.out.println(result1.getClass());
        System.out.println(result2.getClass());
        System.out.println(result3.getClass());
        System.out.println(result4.getClass());
        System.out.println(result5);
        System.out.println(result6.getClass());
        System.out.println(result7);
        System.out.println(Context.toString(result1));
        System.out.println(Context.toString(result2));
        System.out.println(Context.toString(result3));
        System.out.println(Context.toString(result4));
        System.out.println(Context.toString(result5));
        System.out.println(Context.toString(result6));
        System.out.println(Context.toString(result7));
        System.out.println(((NativeObject) result4).get("type"));
        System.out.println(result7.getClass().getName());
    }

    @Test(expected = RuntimeException.class)
    public void testNoVariableScopeToUse() {
        VariableContext context = new VariableContext();
        context.getValue("v", "default");
    }

    @Test
    public void testVariableScopeParentness() {
        VariableContext context = new VariableContext();
        context.createScopeWithStorage("PersistenceScope", new LocalFsStorage("var1.v"));
        context.createScope("MemoryScope");
        context.execute("var scope = 'memory'");
        context.execute("PersistenceScope", "var scope = 'persistence'");
        assertEquals("memory", context.getValue("scope"));
        assertEquals("memory", context.getValue("MemoryScope", "scope"));
        assertEquals("persistence", context.getValue("PersistenceScope", "scope"));
    }

    @Test
    public void testVariableScopePersistence() {
        VariableContext context = new VariableContext();
        context.createScopeWithStorage("PersistenceScope", new LocalFsStorage("persist1.v"));
        context.execute("PersistenceScope", "var scope = 'persistence'");
        assertEquals("persistence", context.getValue("scope"));

        VariableContext context2 = new VariableContext();
        context2.createScopeWithStorage("PersistenceScope2", new LocalFsStorage("persist1.v"));
        assertEquals("persistence", context.getValue("scope"));
    }

    @Test
    public void testVariableScopePerformance() {
        long start = currentTimeMillis();
        VariableContext context = new VariableContext();
        context.createScopeWithStorage("PersistenceScope", new LocalFsStorage("persist1.v"));
        context.execute("PersistenceScope", "var arr = []");
        for (int i = 0; i < 1000; i++) {
            context.execute("PersistenceScope", "arr.push(" + i + ")");
        }
        System.out.println("do execute and backup 1000 times in " + (currentTimeMillis() - start) + "ms");
    }

    @Test
    public void testNumberVariable() {
        VariableContext context = new VariableContext();
        context.execute("var num = 1");
        assertEquals(1, context.getValue("num"));
        context.execute("num = 1.0");
        assertEquals(1, context.getValue("num"));
        context.execute("num = 2.0");
        assertEquals(2, context.getValue("num"));
        context.execute("num = 0.1");
        assertEquals(0.1, context.getValue("num"));
        context.execute("num = 3");
        assertEquals(3, context.getValue("num"));
        context.execute("num = -1.0");
        assertEquals(-1, context.getValue("num"));
    }
}
