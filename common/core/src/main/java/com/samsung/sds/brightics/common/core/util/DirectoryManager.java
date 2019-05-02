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