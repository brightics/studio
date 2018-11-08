package com.samsung.sds.brightics.common.data.util;

import java.util.regex.Pattern;

public class DelimiterUtil {
	
	public static String getDelimiter(String delim) {
		return "(?<!\\\\)" + Pattern.quote(delim);
	}
}
