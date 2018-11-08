package com.samsung.sds.brightics.agent.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class StopWatch {

	private static SimpleDateFormat formatter = new SimpleDateFormat("YYMMddHHmmss");
	private static String lastTimestamp = "";

	public static synchronized String getUniqueTimeStamp() throws InterruptedException {
		String candidate = formatter.format(new Date());
		while (candidate.equals(lastTimestamp)) {
			Thread.sleep(100);
			candidate = formatter.format(new Date());
		}
		lastTimestamp = candidate;
		return candidate;
	}

	public static String durationFromMillisToHumanReadable(long duration) {
		long milliseconds = duration % 1000L;
		long seconds = (duration / 1000L) % 60L;
		long minutes = (duration / (1000L * 60L)) % 60L;
		long hours = (duration / (1000L * 3600L)) % 24L;
		long days = (duration / (1000L * 86400L)) % 7L;

		StringBuilder sb = new StringBuilder();

		if (days > 0)
			sb.append(days).append("days ");
		if (hours > 0)
			sb.append(hours).append("hours ");
		if (minutes > 0)
			sb.append(minutes).append("minutes ");
		if (seconds > 0)
			sb.append(seconds).append("seconds ");
		if (minutes < 1 && hours < 1 && days < 1) {
			if (sb.length() > 0)
				sb.append(" ");
			sb.append(milliseconds).append("milliseconds");
		}
		return sb.toString().trim();
	}
}
