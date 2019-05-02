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

package com.samsung.sds.brightics.common.data.client;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.FileUtil;
import org.apache.hadoop.fs.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileClient {

    private static final Logger logger = LoggerFactory.getLogger(FileClient.class);
    private static FileSystem fileSystem;

    public static synchronized FileSystem getFileSystem() {
        if (fileSystem == null) {
            try {
                fileSystem = FileSystem.get(new Configuration());
            } catch (IOException e) {
                logger.error("Can not initialize FileSystem due to IOException", e);
            }
        }
        return fileSystem;
    }

    public static boolean delete(String path) throws IllegalArgumentException, IOException {
        return getFileSystem().delete(new Path(path), true);
    }

	public static boolean copy(String source, String target) throws IllegalArgumentException, IOException {
		FileSystem fs = getFileSystem();
		if (fs.isFile(new Path(source))) {
			return FileUtil.copy(fs, new Path(source), fs, new Path(target), false, true, fs.getConf());
		} else {
			FileStatus[] listStatus = fs.listStatus(new Path(source));
			for (FileStatus fileStatus : listStatus) {
				String childfileTarget = target + File.separator + fileStatus.getPath().getName();
				if (!FileUtil.copy(fs, fileStatus.getPath(), fs, new Path(childfileTarget), false, true, fs.getConf())) {
					throw new IOException(
							String.format("fail to copy file. file source dir : {} , target : {}", source, target));
				}
			}
		}
		return true;
	}
    

    public static boolean move(String source, String target) throws IllegalArgumentException, IOException {
        return getFileSystem().rename(new Path(source), new Path(target));
    }
    
    public static InputStream open(String source) throws IllegalArgumentException, IOException {
    	return getFileSystem().open(new Path(source));
    }
}
