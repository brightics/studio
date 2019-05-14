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

package com.samsung.sds.brightics.common.data.parquet.reader.util;

import java.sql.Date;
import java.util.Calendar;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

import org.apache.parquet.io.api.Binary;

import com.google.common.primitives.Ints;
import com.google.common.primitives.Longs;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

/**
 * Utility class for decoding INT96 encoded parquet timestamp to timestamp millis in GMT.
 * <p>
 * This class is equivalent of @see org.apache.hadoop.hive.ql.io.parquet.timestamp.NanoTime, which produces less intermediate objects during decoding.
 */
public final class ParquetTimestampUtils {
    private static final int JULIAN_EPOCH_OFFSET_DAYS = 2_440_588;
    private static final long MILLIS_IN_DAY = TimeUnit.DAYS.toMillis(1);
    private static final long NANOS_PER_MILLISECOND = TimeUnit.MILLISECONDS.toNanos(1);
    private static final long SECONDS_PER_DAY = 60 * 60 * 24L;
    private static final long MILLIS_PER_DAY = SECONDS_PER_DAY * 1000L;

    private ParquetTimestampUtils() {
    }

    /**
     * Returns GMT timestamp from binary encoded parquet timestamp (12 bytes - julian date + time of day nanos).
     *
     * @param timestampBinary
     *            INT96 parquet timestamp
     * @return timestamp in millis, GMT timezone
     */
    public static long getTimestampMillis(Binary timestampBinary) {
        if (timestampBinary.length() != 12) {
            throw new BrighticsCoreException("3102",
                    "Parquet timestamp must be 12 bytes, actual " + timestampBinary.length());
        }
        byte[] bytes = timestampBinary.getBytes();

        // little endian encoding - need to invert byte order
        long timeOfDayNanos = Longs.fromBytes(bytes[7], bytes[6], bytes[5], bytes[4], bytes[3], bytes[2], bytes[1],
                bytes[0]);
        int julianDay = Ints.fromBytes(bytes[11], bytes[10], bytes[9], bytes[8]);

        return julianDayToMillis(julianDay) + (timeOfDayNanos / NANOS_PER_MILLISECOND);
    }

    private static long julianDayToMillis(int julianDay) {
        return (julianDay - JULIAN_EPOCH_OFFSET_DAYS) * MILLIS_IN_DAY;
    }

    public static Date getDate(int daysSinceEpoch) {
        return new Date(daysToMillis(daysSinceEpoch));
    }

    private static long daysToMillis(int days) {
        TimeZone timeZone = TimeZone.getDefault();
        long millisLocal = (long) days * MILLIS_PER_DAY;
        return millisLocal - getOffsetFromLocalMillis(millisLocal, timeZone);
    }

    private static long getOffsetFromLocalMillis(long millisLocal, TimeZone tz) {
        int guess = tz.getRawOffset();
        int offset = tz.getOffset(millisLocal - guess);
        if (offset != guess) {
            guess = tz.getOffset(millisLocal - offset);
            int days = (int) Math.floor((double) millisLocal / MILLIS_PER_DAY);
            int[] yearAndDay = getYearAndDayInyear(days);
            int year = yearAndDay[0];
            int month = getMonth(yearAndDay);
            int day = getDayOfMonth(yearAndDay);
            int millisOfDay = (int) (millisLocal % MILLIS_PER_DAY);
            if (millisOfDay < 0) {
                millisOfDay += (int) MILLIS_PER_DAY;
            }
            int seconds = millisOfDay / 1000;
            int hh = seconds / 3600;
            int mm = seconds / 60 % 60;
            int ss = seconds % 60;
            int ms = millisOfDay % 1000;
            Calendar calendar = Calendar.getInstance(tz);
            calendar.set(year, month - 1, day, hh, mm, ss);
            calendar.set(Calendar.MILLISECOND, ms);
            guess = (int) (millisLocal - calendar.getTimeInMillis());
        }
        return guess;
    }

    private static int getDayOfMonth(int[] yearAndDay) {
        int year = yearAndDay[0];
        int dayInYear = yearAndDay[1];
        if (isLeapYear(year)) {
            if (dayInYear == 60) {
                return 29;
            } else if (dayInYear > 60) {
                dayInYear = dayInYear - 1;
            }
        }

        if (dayInYear <= 31) {
            return dayInYear;
        } else if (dayInYear <= 59) {
            return dayInYear - 31;
        } else if (dayInYear <= 90) {
            return dayInYear - 59;
        } else if (dayInYear <= 120) {
            return dayInYear - 90;
        } else if (dayInYear <= 151) {
            return dayInYear - 120;
        } else if (dayInYear <= 181) {
            return dayInYear - 151;
        } else if (dayInYear <= 212) {
            return dayInYear - 181;
        } else if (dayInYear <= 243) {
            return dayInYear - 212;
        } else if (dayInYear <= 273) {
            return dayInYear - 243;
        } else if (dayInYear <= 304) {
            return dayInYear - 273;
        } else if (dayInYear <= 334) {
            return dayInYear - 304;
        } else {
            return dayInYear - 334;
        }
    }

    private static int getMonth(int[] yearAndDay) {
        int year = yearAndDay[0];
        int dayInYear = yearAndDay[1];
        if (isLeapYear(year)) {
            if (dayInYear == 60) {
                return 2;
            } else if (dayInYear > 60) {
                dayInYear = dayInYear - 1;
            }
        }

        if (dayInYear <= 31) {
            return 1;
        } else if (dayInYear <= 59) {
            return 2;
        } else if (dayInYear <= 90) {
            return 3;
        } else if (dayInYear <= 120) {
            return 4;
        } else if (dayInYear <= 151) {
            return 5;
        } else if (dayInYear <= 181) {
            return 6;
        } else if (dayInYear <= 212) {
            return 7;
        } else if (dayInYear <= 243) {
            return 8;
        } else if (dayInYear <= 273) {
            return 9;
        } else if (dayInYear <= 304) {
            return 10;
        } else if (dayInYear <= 334) {
            return 11;
        } else {
            return 12;
        }
    }

    private static boolean isLeapYear(int year) {
        return (year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0);
    }

    private static int[] getYearAndDayInyear(int daysSince1970) {
        int daysSince1970Tmp = daysSince1970;
        // Since Julian calendar was replaced with the Gregorian calendar,
        // the 10 days after Oct. 4 were skipped.
        // (1582-10-04) -141428 days since 1970-01-01
        if (daysSince1970 <= -141428) {
            daysSince1970Tmp -= 10;
        }
        int daysNormalized = daysSince1970Tmp + 7293527; // toYearZero 7293527
        int numOfQuarterCenturies = daysNormalized / 146097; // 146097 daysIn400Years
        int daysInThis400 = daysNormalized % 146097 + 1;
        int[] yearsAndDayInYear = numYears(daysInThis400);
        int year = (2001 - 20000) + 400 * numOfQuarterCenturies + yearsAndDayInYear[0];
        return new int[] { year, yearsAndDayInYear[1] };
    }

    private static int[] numYears(int days) {
        int year = days / 365;
        int boundary = yearBoundary(year);
        if (days > boundary) {
            return new int[] { year, days - boundary };
        } else {
            return new int[] { year - 1, days - yearBoundary(year - 1) };
        }
    }

    private static int yearBoundary(int year) {
        return year * 365 + ((year / 4) - (year / 100) + (year / 400));
    }
}