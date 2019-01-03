// -------------------------------------------------------------------------------------------------
// Get User Define Function list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/udfs Get User Define Function list
 @apiGroup User Define Function
 @apiName Get User Define Function list
 @apiVersion 3.6.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/udfs

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "g3f7xrngsh5z8gta",
     "label": "Operator A",
     "version": "1.0",
     "type": "python",
     "contents": "{\"category\":\"udf\",\"func\":\"\",\"name\":\"UDF\",\"context\":\"python\",\"label\":\"Operator A\",\"description\":\"\",\"tags\":[\"a\",\"b\"],\"version\":\"3.5\",\"inrange\":{\"min\":1,\"max\":1},\"outrange\":{\"min\":1,\"max\":1},\"params\":[{\"id\":\"testa\",\"label\":\"TEST A\",\"description\":\"\",\"mandatory\":false,\"items\":[],\"visibleOption\":[],\"control\":\"InputBox\",\"columnType\":[],\"validation\":[{\"validationCode\":\"/* value : 컨트롤에 입력된 값을 지정하는 변수\\n * fnUnit : Function generator를 통해 생성된 function의 현제 모든 정보를 가지고 있는 Javascript object\\n * Validation code는 javascript 문법으로 작성해야 하며 return 값음 true나 false 만 가능하다.\\n * return 값이 false 일 경우 Message의 정보가 표시된다.*\/\n// return value > 4;\",\"messageParam\":[\"asdfsdafsdf\"],\"messageCode\":\"CR-3120\"}],\"type\":\"Integer\"}],\"scriptId\":\"udf_scripttymjsc89yxypbwes\"}",
     "script_id": "udf_scripttymjsc89yxypbwes",
     "description": "",
     "resource_id": null,
     "creator": "koha.son@samsung.com",
     "create_time": "2018-10-04T08:55:35.435Z",
     "updater": null,
     "update_time": null
 },
 ...
 ]
 */

// -------------------------------------------------------------------------------------------------
// Create User Define Function
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/udfs Create User Define Function
 @apiGroup User Define Function
 @apiName Create user define function
 @apiVersion 3.6.0

 @apiParam {Object} script Script
 @apiParam {Object} specJson Spec json
 @apiParam {String} id ID

 @apiParamExample Param Example 1
 /api/vastudio/v3/udfs
 {
	"script": {
		"type": "scala",
		"content": "val row = read(\"/brightics@samsung.com/m2cp4gzr6sdtagwc/t4nxwnh57xtjez6b\", \"/brightics@samsung.com/m2cp4gzr6sdtagwc/t4nxwnh57xtjez6b\", ContextType.valueOf(\"FILESYSTEM\")).asInstanceOf[org.apache.spark.sql.DataFrame].take(1)\nrow.size"
	},
	"specJson": {
		"category": "udf",
		"func": "",
		"name": "UDF",
		"context": "scala",
		"label": "TEST",
		"description": "",
		"tags": [],
		"version": "3.6",
		"inputs": {},
		"outputs": {},
		"meta": {},
		"params": [],
		"scriptId": "udf_scripty86nf84p5xerbpgv"
	},
	"md": "",
	"id": "hyc9qwaq5akuaeg2"
}

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 동일한 ID로 생성한 경우
 400 Bad Request
 {
     "errors": [
         {
             "code": "10101",
             "message": "Your request could not be completed. The item already exists."
         }
     ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Get User Define Function by function id
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/udfs/:functionId Get User Define Function by Function Id
 @apiGroup User Define Function
 @apiName Get user define function by function id
 @apiVersion 3.6.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/udfs/g3f7xrngsh5z8gta

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "g3f7xrngsh5z8gta",
     "label": "Operator A",
     "version": "1.0",
     "type": "python",
     "contents": "{\"category\":\"udf\",\"func\":\"\",\"name\":\"UDF\",\"context\":\"python\",\"label\":\"Operator A\",\"description\":\"\",\"tags\":[\"a\",\"b\"],\"version\":\"3.5\",\"inrange\":{\"min\":1,\"max\":1},\"outrange\":{\"min\":1,\"max\":1},\"params\":[{\"id\":\"testa\",\"label\":\"TEST A\",\"description\":\"\",\"mandatory\":false,\"items\":[],\"visibleOption\":[],\"control\":\"InputBox\",\"columnType\":[],\"validation\":[{\"validationCode\":\"/* value : 컨트롤에 입력된 값을 지정하는 변수\\n * fnUnit : Function generator를 통해 생성된 function의 현제 모든 정보를 가지고 있는 Javascript object\\n * Validation code는 javascript 문법으로 작성해야 하며 return 값음 true나 false 만 가능하다.\\n * return 값이 false 일 경우 Message의 정보가 표시된다.*\/\n// return value > 4;\",\"messageParam\":[\"asdfsdafsdf\"],\"messageCode\":\"CR-3120\"}],\"type\":\"Integer\"}],\"scriptId\":\"udf_scripttymjsc89yxypbwes\"}",
     "script_id": "udf_scripttymjsc89yxypbwes",
     "description": "",
     "resource_id": null,
     "creator": "birghtics@samsung.com",
     "create_time": "2018-10-04T08:55:35.435Z",
     "updater": null,
     "update_time": null
 }
 ]

 @apiErrorExample Error Example 1
 400 Bad Request
 {
     "errors": [
         {
             "code": "10102",
             "message": "Your request could not be completed. The item does not exists."
         }
     ]
 }

 */


// -------------------------------------------------------------------------------------------------
// Delete User Define Function
// -------------------------------------------------------------------------------------------------
/**
 @api {DELETE} /api/vastudio/v3/udfs/:functionId Delete User Define Function
 @apiGroup User Define Function
 @apiName Delete User Define Function
 @apiVersion 3.6.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/udfs/g3f7xrngsh5z8gta

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
 {
     "errors": [
         {
             "code": "10102",
             "message": "Your request could not be completed. The item does not exists."
         }
     ]
 }

 */
