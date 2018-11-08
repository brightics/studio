package com.samsung.sds.brightics.server.model.param;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FileRepositoryParam {

	String inputpath; //set key
	String path;
	String source; //set key
	String destination;
	
	String localFileName;
	String remotePath;
	String delimiter;
	
	String filename;
	String[] columntype;
	String[] columnname;
}
