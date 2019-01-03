// -------------------------------------------------------------------------------------------------
// Get project list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/projects Get project list
 @apiGroup Projects
 @apiName Get project list
 @apiVersion 3.6.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects

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
 @api {POST} /api/vastudio/v3/projects Create project
 @apiGroup Projects
 @apiName Create project
 @apiVersion 3.6.0

 @apiParam {String} id Project ID
 @apiParam {String} label Label
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects
 {
    "id": "p34ephjmngga3vp1",
    "label": "TEST"
 }

 @apiSuccessExample Success Example 1
 200 OK
 OK

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
 100개를 초과하는 경우
 400 Bad Request
 {
    "errors": [
        {
            "code": "10201",
            "message": "Your request could not be completed. You cannot create more than 100 projects."
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
// Get project
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/projects/:projectId Get project
 @apiGroup Projects
 @apiName Get project
 @apiVersion 3.6.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1

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
// Update project
// -------------------------------------------------------------------------------------------------
/**
 @api {PUT} /api/vastudio/v3/projects/:projectId Update project
 @apiGroup Projects
 @apiName Update project
 @apiVersion 3.6.0

 @apiParam {String} label Label
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1
 {
    "label": "TEST"
 }

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 존재하지 않는 ID의 업데이트를 요청한 경우
 400 Bad Request
 {
     "errors": [
         {
             "code": "10102",
             "message": "Your request could not be completed. The item does not exists."
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
// Delete project
// -------------------------------------------------------------------------------------------------
/**
 @api {DELETE} /api/vastudio/v3/projects/:projectId Delete project
 @apiGroup Projects
 @apiName Delete projects
 @apiVersion 3.6.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1

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
 */

// -------------------------------------------------------------------------------------------------
// Get project member list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/projects/:projectId/members Get project member list
 @apiGroup Projects
 @apiName Get project member list
 @apiVersion 3.6.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/members

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
 존재하지 않는 ID의 Member 목록을 요청한 경우
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
// Invite members
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/projects/:projectId/members/invite Invite members
 @apiGroup Projects
 @apiName Invite members
 @apiVersion 3.6.0

 @apiParam {Array} members Members array ({"user_id": "", "role_id": "role_10001 | role_10002 | role_10003 | role_10004"})

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/members/invite
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
 200 2

 @apiErrorExample Error Example 1
 존재하지 않는 ID의 invite 요청한 경우
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
// Withdraw members
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/projects/:projectId/members/withdraw Withdraw members
 @apiGroup Projects
 @apiName Withdraw members
 @apiVersion 3.6.0

 @apiParam {Array} members Members array ({"user_id": ""})

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/members/withdraw
 {
     "members": [{
         "user_id": "apitester@samsung.com"
     },
     {
         "user_id": "apitest2@samsung.com"
     }]
 }

 @apiSuccessExample Success Example 1
 200 2

 @apiErrorExample Error Example 1
 400 Bad Request
 존재하지 않는 ID의 withdraw 요청한 경우
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
// Change members authority
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/projects/:projectId/members/authority Change members authority
 @apiGroup Projects
 @apiName Change members authority
 @apiVersion 3.6.0

 @apiParam {Array} members Members array ({"user_id": "", "role_id": "role_10001 | role_10002 | role_10003 | role_10004"})

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/members/authority
 {
      "members": [{
          "user_id": "apitester@samsung.com",
          "role_id": "role_10004"
      }]
 }

 @apiSuccessExample Success Example 1
 200 1

 @apiErrorExample Error Example 1
 400 Bad Request
 존재하지 않는 ID의 withdraw 요청한 경우
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