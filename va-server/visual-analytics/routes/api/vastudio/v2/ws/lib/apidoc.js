// -------------------------------------------------------------------------------------------------
// Get project list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/projects Get project list
 @apiGroup Projects
 @apiName Get project list
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "p34ephjmngga3vp1",
     "label": "TEST",
     "description": "",
     "creator": "apitest@samsung.com",
     "create_time": "2018-08-20T01:53:45.892Z",
     "updater": "apitest@samsung.com",
     "update_time": "2018-08-23T05:44:16.090Z",
     "type": null,
     "tag": null,
     "model_count": "3",
     "report_count": "1"
 }
 ...
 ]

 */

// -------------------------------------------------------------------------------------------------
// Create project
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects Create project
 @apiGroup Projects
 @apiName Create project
 @apiVersion 3.5.0

 @apiParam {String} id Project ID
 @apiParam {String} label Label
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects
 {
    "id": "p34ephjmngga3vp1",
    "label": "TEST"
 }

 @apiSuccessExample Success Example 1
 200 OK
 OK

 @apiErrorExample Error Example 1
 400 Bad Request
 {
    "errors": [
        {
            "code": "34011",
            "message": "Already exists."
        }
    ]
 }

 @apiErrorExample Error Example 2
 400 Bad Request
 {
    "errors": [
        {
            "code": "31011",
            "message": "You can not create more than 100 projects."
        }
    ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Get project
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/projects/:projectId Get project
 @apiGroup Projects
 @apiName Get project
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "p34ephjmngga3vp1",
     "label": "TEST",
     "description": "",
     "creator": "apitest@samsung.com",
     "create_time": "2018-09-05T10:56:56.535Z",
     "updater": "apitest@samsung.com",
     "update_time": "2018-09-05T10:56:56.535Z",
     "type": null,
     "tag": null
 }
 ]

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Update project
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/update Update project
 @apiGroup Projects
 @apiName Update project
 @apiVersion 3.5.0

 @apiParam {String} label Label
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/update
 {
    "label": "TEST"
 }

 @apiSuccessExample Success Example 1
 200 OK
 1

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Delete project
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/delete Delete project
 @apiGroup Projects
 @apiName Delete projects
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/delete

 @apiSuccessExample Success Example 1
 200 OK
 1

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Get project member list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/projects/:projectId/members Get project member list
 @apiGroup Projects
 @apiName Get project member list
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/members

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "user_name": "TEST",
     "user_id": "apitester@samsung.com",
     "role_id": "role_10001",
     "role_category": "role_proj_member",
     "role_label": "Owner",
     "joined_time": "2018-09-05T10:56:56.535Z"
 }
 ...
 ]

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Invite members
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/members/invite Invite members
 @apiGroup Projects
 @apiName Invite members
 @apiVersion 3.5.0

 @apiParam {Array} members Members array ({"user_id": "", "role_id": "role_10001 | role_10002 | role_10003 | role_10004"})

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/members/invite
 {
     "members": [{
         "user_id": "apitester@samsung.com",
         "role_id": "role_10003"
     },
     {
         "user_id": "apitest2@samsung.com",
         "role_id": "role_10003"
     }]
 }

 @apiSuccessExample Success Example 1
 200 OK
 2

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Withdraw members
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/members/withdraw Withdraw members
 @apiGroup Projects
 @apiName Withdraw members
 @apiVersion 3.5.0

 @apiParam {Array} members Members array ({"user_id": ""})

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/members/withdraw
 {
     "members": [{
         "user_id": "apitester@samsung.com"
     },
     {
         "user_id": "apitest2@samsung.com"
     }]
 }

 @apiSuccessExample Success Example 1
 200 OK
 2

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Change members authority
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/members/authority Change members authority
 @apiGroup Projects
 @apiName Change members authority
 @apiVersion 3.5.0

 @apiParam {Array} members Members array ({"user_id": "", "role_id": "role_10001 | role_10002 | role_10003 | role_10004"})

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/members/authority
 {
      "members": [{
          "user_id": "apitester@samsung.com",
          "role_id": "role_10004"
      }]
 }

 @apiSuccessExample Success Example 1
 200 OK
 2

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Get file list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/projects/:projectId/files Get file list
 @apiGroup Files
 @apiName Get file list
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/pr73udvq34ugp9wh/files

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "mnbgnapjusna6kum",
     "project_id": "pr73udvq34ugp9wh",
     "label": "DF",
     "contents": {
      ...
 ]

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Create file
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/files Create file
 @apiGroup Files
 @apiName Create file
 @apiVersion 3.5.0

 @apiParam {String} id ID
 @apiParam {String} label Label
 @apiParam {String} contents Contents
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/pr73udvq34ugp9wh/files
 {
  "id": "pr73udvq34ugp9df",
  "label": "TEST",
  "contents": {
    ...
  },
  "description": ""
}

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
 {
    "errors": [
        {
            "code": "34012",
            "message": "Failed to create."
        }
    ]
 }

 @apiErrorExample Error Example 2
 400 Bad Request
 {
    "errors": [
        {
            "code": "34011",
            "message": "Already exists."
        }
    ]
 }

 @apiErrorExample Error Example 3
 400 Bad Request
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
            "code": "32011",
            "message": "You can not create more than 100 models in a project."
        }
    ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Get file
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/projects/:projectId/files/:fileId Get file
 @apiGroup Files
 @apiName Get file
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/nnnnininidididid/files/pr73udvq34ugp9df

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
  "id": "pr73udvq34ugp9df",
  "project_id": "",
  "label": "TEST",
  "contents": {
    ...
  },
  "description": "",
  "creator": "apitest@samsung.com"
 }
 ]

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Update file
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/files/:fileId/update Update file
 @apiGroup Files
 @apiName Update file
 @apiVersion 3.5.0

 @apiParam {String} event_key Current event_key
 @apiParam {String} label Label
 @apiParam {String} contents Contents
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/update
 {
    "label": "DF",
    "contents": {
        ...
    },
    "event_key": "180906_110833_784607",
 }

 @apiSuccessExample Success Example 1
 200 OK
 {
    "id": "pr73udvq34ugp9df",
    "project_id": "p34ephjmngga3vp1",
    "label": "DF",
    "contents": {
        ...
    }
    ...
 }

 @apiErrorExample Error Example 1
 400 Bad Request
 {
     "errors": [
         {
             "code": "1403",
             "message": "Your request could not be completed. Your account is not permitted to access this resource."
         }
     ]
 }

 @apiErrorExample Error Example 2
 400 Bad Request
 {
     "errors": [
         {
             "code": 32031,
             "message": "This model has been changed by another user. It will be loaded with the latest version."
         }
     ]
 }

 @apiErrorExample Error Example 3
 400 Bad Request
 {
     "errors": [
         {
             "code": 32032,
             "message": "Failed to update."
         }
     ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Delete file
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/files/:fileId/delete Delete file
 @apiGroup Files
 @apiName Delete file
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/delete

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Get version list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/projects/:projectId/files/:fileId/versions Get version list
 @apiGroup Files
 @apiName Get version list
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
    "version_id": "vhjb5m79z4s3pjjb",
    "file_id": "pr73udvq34ugp9df",
    "major_version": 0,
    "minor_version": 1,
    "contents": {
    ...
    }
    ...
 }
 ]

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Get version
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/projects/:projectId/files/:fileId/versions/:versionId Get version
 @apiGroup Files
 @apiName Get version
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions/vhjb5m79z4s3pjjb

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Create version
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/files/:fileId/versions Create version
 @apiGroup Files
 @apiName Create version
 @apiVersion 3.5.0

 @apiParam {String} event_key Current event_key
 @apiParam {String} label Label
 @apiParam {String} contents Contents
 @apiParam {String} [description] Description
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions
 {
    "version_id": "DF",
    "isMajor": true,
    "label": "DF",
 }

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Update version
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/files/:fileId/versions/:versionId/update Update version
 @apiGroup Files
 @apiName Update version
 @apiVersion 3.5.0

 @apiParam {String} [description] Description
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions/vhjb5m79z4s3pjjb/update
 {
    "description": "",
    "tag": ""
 }

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Load version
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/projects/:projectId/files/:fileId/versions/:versionId/load Load version
 @apiGroup Files
 @apiName Load version
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions/vhjb5m79z4s3pjjb/load

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Get library list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/libraries Get library list
 @apiGroup Libraries
 @apiName Get library list
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/libraries

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
 400 Bad Request
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
// Get library template list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/va/v2/ws/libraries/:libraryId/templates Get library template list
 @apiGroup Libraries
 @apiName Get library template list
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/libraries/apitester@samsung.com/templates

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
 @api {POST} /api/va/v2/ws/libraries/:libraryId/templates Create library template
 @apiGroup Libraries
 @apiName Create library template
 @apiVersion 3.5.0

 @apiParam {String} label Label
 @apiParam {String} contents Content
 @apiParam {String} description Description
 @apiParam {String} id Template ID

 @apiParamExample Param Example 1
 /api/va/v2/ws/libraries/apitester@samsung.com/templates
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
 400 Bad Request
 {
     "errors": [
         {
             "code": "1403",
             "message": "Your request could not be completed. Your account is not permitted to access this resource."
         }
     ]
 }

 @apiErrorExample Error Example 2
 400 Bad Request
 {
    "errors": [
        {
            "code": "33011",
            "message": "You can not create more than 20 template in a library."
        }
    ]
 }

 @apiErrorExample Error Example 2
 400 Bad Request
 {
    "errors": [
        {
            "code": "34012",
            "message": "Failed to create."
        }
    ]
 }

 @apiErrorExample Error Example 3
 400 Bad Request
 {
    "errors": [
        {
            "code": "34011",
            "message": "Already exists."
        }
    ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Update library template
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/libraries/:libraryId/templates/:templateId/update Update library template
 @apiGroup Libraries
 @apiName Update library template
 @apiVersion 3.5.0

 @apiParam {String} label Label
 @apiParam {String} [description] Description

 @apiParamExample Param Example 1
 /api/va/v2/ws/libraries/apitest@samsung.com/templates/nnnnininidididid/update
 {
     "label": "TEST",
     "description": ""
 }

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
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
// Delete library template
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/va/v2/ws/libraries/:libraryId/templates/:templateId/delete Delete library template
 @apiGroup Libraries
 @apiName Delete library template
 @apiVersion 3.5.0

 @apiParamExample Param Example 1
 /api/va/v2/ws/libraries/apites@samsung.com/templates/nnnnininidididid/delete

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 400 Bad Request
 {
     "errors": [
         {
             "code": "1403",
             "message": "Your request could not be completed. Your account is not permitted to access this resource."
         }
     ]
 }

 */