package com.samsung.sds.brightics.server.controller;

import java.io.InputStream;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.samsung.sds.brightics.common.network.proto.metadata.DataStatusType;
import com.samsung.sds.brightics.server.model.param.DataLinkParam;
import com.samsung.sds.brightics.server.model.param.DataPermissionParam;
import com.samsung.sds.brightics.server.model.param.FileRepositoryParam;
import com.samsung.sds.brightics.server.model.param.GroupDataParam;
import com.samsung.sds.brightics.server.model.validator.DataLinkParamValidator;
import com.samsung.sds.brightics.server.service.DataService;

@RestController
@RequestMapping("/api/core/v2")
public class DataController {

    @Autowired
    private DataService dataService;

    /**
     * - get data status list -
     * GET 		/api/core/v2/data/list/all						: get all data list (shared and user)
     * GET 		/api/core/v2/data/list/tables					: get table data list (used in sql)
     * GET 		/api/core/v2/data/list/upload					: get uploaded data list (shared and user)
     *
     * GET 		/api/core/v2/data/schema?key=""					: get schema by dataKey.
     * GET 		/api/core/v2/data?key=""&offset=10&limit=100	: get row data by dataKey.
     * DELETE	/api/core/v2/data?key=""						: remove data by dataKey.
     * GET 		/api/core/v2/data/view/{mid}/{tab}?offset=10&limit=100			: get schema and row data in model.
     * POST   	/api/core/v2/data/view/group	  				: get staging group data
     * 
     * POST 	/api/core/v2/data/upload						: upload data.
     * POST	 	/api/core/v2/data/download						: download data.
     * POST 	/api/core/v2/data/import						: csv data file in hadoop import to brightics.
     * GET 		/api/core/v2/data/head?path=""&limit=20			: get import file limited data.
     * POST 	/api/core/v2/data/move							: move data.
     * POST 	/api/core/v2/data/copy							: copy data.
     * POST 	/api/core/v2/data/permissions					: update data permissions.
     * POST 	/api/core/v2/data/links							: add data links
     * DELETE 	/api/core/v2/data/links							: remove data links
     *
     * GET	 	/api/core/v2/data/download?key=""&delimiter=""&filename=""		: download data.
     */
    
	@RequestMapping(value = "/data/list/table", method = RequestMethod.GET)
	public Object getTableDataStatusList() throws Exception {
		return dataService.getDataStatusList(DataStatusType.TABLE);
	}
    
	@RequestMapping(value = "/data/list/upload", method = RequestMethod.GET)
	public Object getUploadedDataStatusList() throws Exception {
		return dataService.getDataStatusList(DataStatusType.UPLOAD);
	}

	@RequestMapping(value = "/data/list/all", method = RequestMethod.GET)
	public Object getAllDataStatusList() throws Exception {
		return dataService.getDataStatusList(DataStatusType.ALL);
	}

	@RequestMapping(value = "/data", method = RequestMethod.GET)
	public Object getData(@RequestParam(required = true) String key,
			@RequestParam(required = true) long offset, @RequestParam(required = true) long limit) throws Exception {
		return dataService.getData(key, offset, offset + limit);
	}
	
	@RequestMapping(value = "/data/view/{mid}/{tid}", method = RequestMethod.GET)
	public Object viewData(@PathVariable String mid, @PathVariable String tid,
			@RequestParam(required = true) long offset, @RequestParam(required = true) long limit,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		return dataService.getData(mid, tid, offset, offset + limit);
	}

	@RequestMapping(value = "/data", method = RequestMethod.DELETE)
	public void removeData(@RequestParam(required = true) String key) throws Exception {
		dataService.removeData(key);
	}

	@RequestMapping(value = "/data/schema", method = RequestMethod.GET)
	public Object getSchema(@RequestParam(required = true) String key) throws Exception {
		return dataService.getSchema(key);
	}


	@RequestMapping(value = "/data/view/group", method = RequestMethod.POST)
	public Object viewGroup(@RequestBody GroupDataParam groupDataParam) throws Exception {
		return dataService.viewGroup(groupDataParam);
	}
	
	@RequestMapping(value = "/data/head", method = RequestMethod.GET)
	public Object getTempFileData(@RequestParam String path, @RequestParam long limit) throws Exception {
		return dataService.getRemotePathData(path, limit);
	}
	
	@RequestMapping(value = "/data/import", method = RequestMethod.POST)
	public void importData(@RequestBody FileRepositoryParam repoParam) throws Exception {
		dataService.importData(repoParam);
	}

	@RequestMapping(value = "/data/move", method = RequestMethod.POST)
	public void move(@RequestBody FileRepositoryParam repoParam) throws Exception {
		dataService.moveData(repoParam);
	}

	@RequestMapping(value = "/data/copy", method = RequestMethod.POST)
	public void copy(@RequestBody FileRepositoryParam repoParam) throws Exception {
		dataService.copyData(repoParam);
	}
	
	@RequestMapping(value = "/data/upload", method = RequestMethod.POST)
	public void fileUpload(MultipartHttpServletRequest request,
			@RequestHeader(value = "path", required = true) String path,
			@RequestHeader(value = "delimiter", required = true) String delimiter,
			@RequestHeader(value = "column-type", required = true) String columnTypeJson,
			@RequestHeader(value = "column-name", required = true) String columnNameJson) throws Exception {
		
		Iterator<String> fileNames = request.getFileNames();
		if (fileNames.hasNext()) {
			MultipartFile file = request.getFile(fileNames.next());
			InputStream is = file.getInputStream();
			dataService.fileUpload(is, path, delimiter.replace("\"", ""), columnTypeJson, columnNameJson);
		}
	}
	
	@RequestMapping(value = "/data/download", method = RequestMethod.POST)
	public void downloadFile(@RequestBody FileRepositoryParam repoParam, HttpServletResponse response) {
		dataService.downloadFile(repoParam, response);
	}

	@RequestMapping(value = "/data/download", method = RequestMethod.GET)
	public void downloadFile(@RequestParam(required = true) String key, @RequestParam(required = true) String delimiter,
			@RequestParam(required = true) String filename, HttpServletResponse response) {
		FileRepositoryParam repoParam = new FileRepositoryParam();
		repoParam.setFilename(filename);
		repoParam.setRemotePath(key);
		repoParam.setDelimiter(delimiter);
		dataService.downloadFile(repoParam, response);
	}

    @RequestMapping(value = "/data/permissions", method = RequestMethod.POST)
    public Object updateDataPermissions(@RequestBody DataPermissionParam param) {
        return dataService.updatePermissions(param);
    }

    @RequestMapping(value = "/data/links", method = RequestMethod.POST)
    public Object addDataLink(@RequestBody DataLinkParam dataLinkParam) {
        DataLinkParamValidator.validateForPost(dataLinkParam);
        return dataService.addDataLinks(dataLinkParam);
    }

    @RequestMapping(value = "/data/links", method = RequestMethod.DELETE)
    public Object deleteDataLink(@RequestBody DataLinkParam dataLinkParam) {
        DataLinkParamValidator.validateForDelete(dataLinkParam);
        return dataService.removeDataLinks(dataLinkParam);
    }
}
