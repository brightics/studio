package com.samsung.sds.brightics.common.data.util;

public class SafeParser {
    
    public static double parseDouble(String s){
//        try{
//            return Double.parseDouble(s);
//        } catch (Exception e){
//            return Double.NaN;
//        }
        return NumberParser.getDouble(s);
    }
    
    public static int parseInt(String s){
        try{
            return Integer.parseInt(s);
        } catch (Exception e){
            return Integer.MIN_VALUE;
        }
    }
    public static long parseLong(String s){
        try{
            return Long.parseLong(s);
        } catch (Exception e){
            return Long.MIN_VALUE;
        }
    }

    public static boolean parseBoolean(String s) {
        try{
            return Boolean.parseBoolean(s);
        } catch (Exception e){
            return false;
        }
    }
    
    public static String nullToString(Object obj) {
        if(obj == null) return "";
        else return obj.toString();
    }
}
