// -------------------------------------------------------------------------------------------------
// Get library list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/libraries Get library list
 @apiGroup Libraries
 @apiName Get library list
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/libraries

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "apitest@samsung.com",
     "label": "My Template",
     "description": null,
     "creator": "apitester@samsung.com",
     "create_time": "2018-08-20T01:53:54.702Z",
     "updater": "apitester@samsung.com",
     "update_time": "2018-08-20T01:53:54.702Z",
     "type": "Closed"
 }
 ]

 @apiErrorExample Error Example 1
 존재하지 않는 ID를 요청한 경우
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
// Get library template list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/libraries/:libraryId/templates Get library template list
 @apiGroup Libraries
 @apiName Get library template list
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/libraries/apitester@samsung.com/templates

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "tccnvvtm6gnnd6uj",
     "library_id": "apitest@samsung.com",
     "label": "SAMPLE",
     "contents": {
         "variables": {},
         "variableRef": [],
         "innerModels": {},
         "inData": [],
         "outData": [],
         "type": "data",
         "sheets": [],
         "param": {},
         "functions": [
             {
                 "persist-mode": "auto",
                 "func": "load",
                 "name": "Subflow",
                 "outData": [
                     "tepxuqfy36b937zt"
                 ],
                 "param": {
                     "functions": [
                         ...
                     ],
                     "links": [],
                     "entries": [
                         "f8cmf8p4fnrgtndp"
                     ]
                 },
                 "display": {
                    ...
                 },
                 "fid": "f8djbbb8g7zagfzv"
             },
             ...
         ],
         "links": [
             {
                 "kid": "kzsh2xwmc8vf2x4q",
                 "sourceFid": "f8djbbb8g7zagfzv",
                 "targetFid": "ffyvvpbeaqwxxc8j"
             },
             ...
         ],
         "preferences": {},
         "problemList": [],
         "report": {
             "title": "Report",
             "data": []
         },
         "persist-mode": "auto"
     },
     "description": "",
     "creator": "apitest@samsung.com",
     "create_time": "2018-09-06T03:17:36.034Z",
     "updater": "apitest@samsung.com",
     "update_time": "2018-09-06T03:17:36.034Z"
 }
 ]

 @apiErrorExample Error Example 1
 다른 계정의 Template 목록을 요청한 경우 (다른 계정의 Token 사용한 경우)
 403 Forbidden
 {
    "errors": [
        {
            "code": "1403",
            "message": "Your request could not be completed. Your account is not permitted to access this resource."
        }
    ]
 }
 */

// -------------------------------------------------------------------------------------------------
// Create library template
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/libraries/:libraryId/templates Create library template
 @apiGroup Libraries
 @apiName Create library template
 @apiVersion 3.0.0

 @apiParam {String} label Label
 @apiParam {String} contents Content
 @apiParam {String} description Description
 @apiParam {String} id Template ID

 @apiParamExample Param Example 1
 /api/vastudio/v3/libraries/apitester@samsung.com/templates
 {
	"label": "TEST",
	"contents": {
		"variables": {},
		"variableRef": [],
		"innerModels": {},
		"inData": [],
		"outData": [],
		"type": "data",
		"sheets": [],
		"param": {},
		"functions": [
		    ...
		],
		"links": [
		    ...
		],
		"preferences": {},
		"problemList": [],
		"report": {
			"title": "Report",
			"data": []
		},
		"persist-mode": "auto"
	},
	"description": "",
	"id": "nnnnininidididid"
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

 @apiErrorExample Error Example 2
 20개를 초과하는 경우
 400 Bad Request
 {
    "errors": [
        {
            "code": "10301",
            "message": "Your request could not be completed. You cannot create more than 20 template in a library."
        }
    ]
 }

 @apiErrorExample Error Example 3
 다른 계정의 Template 목록을 요청한 경우 (다른 계정의 Token 사용한 경우)
 403 Forbidden
 {
    "errors": [
        {
            "code": "1403",
            "message": "Your request could not be completed. Your account is not permitted to access this resource."
        }
    ]
 }

 @apiErrorExample Error Example 4
 400 Bad Request
 {
     "errors": [
         {
             "code": "10103",
             "message": "Your request could not be completed. The request contains invalid parameters."
         }
     ]
 }
 */

// -------------------------------------------------------------------------------------------------
// Update library template
// -------------------------------------------------------------------------------------------------
/**
 @api {PUT} /api/vastudio/v3/libraries/:libraryId/templates/:templateId Update library template
 @apiGroup Libraries
 @apiName Update library template
 @apiVersion 3.0.0

 @apiParam {String} label Label
 @apiParam {String} [description] Description

 @apiParamExample Param Example 1
 /api/vastudio/v3/libraries/apitest@samsung.com/templates/nnnnininidididid
 {
     "label": "TEST",
     "description": ""
 }

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 존재하지 않는 ID를 요청한 경우
 400 Bad Request
 {
     "errors": [
         {
             "code": "10102",
             "message": "Your request could not be completed. The item does not exists."
         }
     ]
 }

 @apiErrorExample Error Example 2
 다른 계정의 Template 목록을 요청한 경우 (다른 계정의 Token 사용한 경우)
 403 Forbidden
 {
    "errors": [
        {
            "code": "1403",
            "message": "Your request could not be completed. Your account is not permitted to access this resource."
        }
    ]
 }

 @apiErrorExample Error Example 3
 400 Bad Request
 {
     "errors": [
         {
             "code": "10103",
             "message": "Your request could not be completed. The request contains invalid parameters."
         }
     ]
 }
 */

// -------------------------------------------------------------------------------------------------
// Delete library template
// -------------------------------------------------------------------------------------------------
/**
 @api {DELETE} /api/vastudio/v3/libraries/:libraryId/templates/:templateId Delete library template
 @apiGroup Libraries
 @apiName Delete library template
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/libraries/apites@samsung.com/templates/nnnnininidididid

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 존재하지 않는 ID의 삭제를 요청한 경우
 400 Bad Request
 {
     "errors": [
         {
             "code": "10102",
             "message": "Your request could not be completed. The item does not exists."
         }
     ]
 }

 @apiErrorExample Error Example 2
 다른 계정의 Template 목록을 요청한 경우 (다른 계정의 Token 사용한 경우)
 403 Forbidden
 {
    "errors": [
        {
            "code": "1403",
            "message": "Your request could not be completed. Your account is not permitted to access this resource."
        }
    ]
 }

 */