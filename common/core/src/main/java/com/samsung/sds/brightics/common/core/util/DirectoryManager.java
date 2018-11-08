package com.samsung.sds.brightics.common.core.util;

import java.io.File;

public class DirectoryManager {
    private static String tmpDir;
    
    public static boolean deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        return directoryToBeDeleted.delete();
    }

    public static void createRootTmpDir(String parent) {
        File f = new File(System.getProperty("java.io.tmpdir") + File.separator + parent);

        if (f.exists()) {
            deleteDirectory(f);
        }
        f.mkdirs();
        tmpDir = f.getAbsolutePath();
    }

    public static String getTmpDir() {
        return tmpDir;
    }

    public static String getTmpDir(String subdir) {
        if(tmpDir==null){
            // Set default tmp dir name to brightics
            createRootTmpDir("brightics");
        }
        String targetDir = tmpDir + File.separator + subdir;
        File f = new File(targetDir);
        if (!f.exists())
            f.mkdirs();
        return f.getAbsolutePath();
    }
    
    public static String getClassOutputDir() {
        return getTmpDir("classes");
    }
}