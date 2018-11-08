package com.samsung.sds.brightics.common.data.util;

import java.util.LinkedList;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.fs.Path;
import org.junit.Assert;
import org.junit.Test;

public class DataStatusMapBuilderTest {
    
    @Test
    public void getDataKeyFromTest() {
    	String dataRoot = "/test01/test02";
    	String sourcePath = "/test01/test02/test03/test01/test02";
    	LinkedList<String> paths = new LinkedList<>();
		Path path = new Path(sourcePath);
		while (path != null && !path.isRoot()) {
			paths.push(path.getName());
			path = path.getParent();
		}
		String absPath = paths.stream().collect(Collectors.joining("/", "/", ""));
		if(!dataRoot.equals("/") && absPath.startsWith(dataRoot)){
			absPath = absPath.replaceFirst(dataRoot, "");
    	}
		
		System.out.println(absPath);
        Assert.assertEquals("/test03/test01/test02", absPath);
    }
	
}
