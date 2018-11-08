package com.samsung.sds.brightics.common.data.util;

import org.junit.Test;

import com.samsung.sds.brightics.common.data.util.DelimitedStringAppender;

public class DelimitedStringAppenderTest {
    @Test
    public void testString(){
        DelimitedStringAppender appender = new DelimitedStringAppender("[", "]", ",");
        appender.append("My name is jb");
        appender.append("My role is r&d");
        appender.append("I wanna go home");
        System.out.println(appender);
    }
}
