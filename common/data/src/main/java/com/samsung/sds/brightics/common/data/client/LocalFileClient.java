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
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

public class LocalFileClient {

//    private static final Logger logger = LoggerFactory.getLogger(LocalFileClient.class);
	
	private static File getValidFile(String path) {
		File file = new File(path);
		if (!file.exists()) {
			throw new BrighticsCoreException("3002", String.format("file [%s]", path));
		}
		return file;
	}
	
    public static Object browse(String path) {
    	List<Map<String, Object>> result = new ArrayList<>();
    	File file = getValidFile(path);
    	if(file.exists() && file.isDirectory()) {
    		File[] listFiles = file.listFiles();
    		for (File child : listFiles) {
				Map<String, Object> map = new HashMap<>();
				map.put("path", child.getPath());
				map.put("name", child.getName());
				map.put("isFile", child.isFile());
				result.add(map);
			}
    		return result;
    	} else {
    		throw new BrighticsCoreException("3002" , String.format("directory [%s]", path));
    	}
    }
    
    public static boolean delete(String path) {
		return getValidFile(path).delete();
    }

    public static boolean copy(String source, String target) throws IOException {
		FileUtils.copyFile(getValidFile(source), new File(target));
		return true;
    }

	public static boolean move(String source, String target) {
		return getValidFile(source).renameTo(new File(target));
	}
    
    public static InputStream open(String source) throws FileNotFoundException {
		return new FileInputStream(getValidFile(source));
    }
}
