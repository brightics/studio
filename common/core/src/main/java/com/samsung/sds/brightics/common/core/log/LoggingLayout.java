package com.samsung.sds.brightics.common.core.log;

import org.apache.commons.lang3.time.FastDateFormat;

import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.LayoutBase;


public class LoggingLayout extends LayoutBase<ILoggingEvent> {
    
    private static FastDateFormat formatter = FastDateFormat.getInstance("HH:mm:ss.SSS");

    @Override
    public String doLayout(ILoggingEvent event) {
        StringBuffer sbuf = new StringBuffer(128);
        sbuf.append("[");
        sbuf.append(formatter.format(event.getTimeStamp()));
        sbuf.append("]");
        Object taskId = ThreadLocalContext.get("taskId");
        if(taskId != null){
            sbuf.append("[");
            sbuf.append(taskId.toString());
            sbuf.append("]");
        }
        sbuf.append(" ");
        sbuf.append(event.getLevel());
        sbuf.append(" ");
        sbuf.append(getSimpleName(event.getLoggerName()));
        sbuf.append(" - ");
        sbuf.append(event.getFormattedMessage());
        sbuf.append("\n");
        return sbuf.toString();
    }
    
    private String getSimpleName(String fullName){
        if(fullName != null){
            int lastIndex = fullName.lastIndexOf(".");
            return fullName.substring(lastIndex+1);
        }
        return null;
    }

}
