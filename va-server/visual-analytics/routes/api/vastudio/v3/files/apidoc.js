// -------------------------------------------------------------------------------------------------
// Get file list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/projects/:projectId/files Get file list
 @apiGroup Files
 @apiName Get file list
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/pr73udvq34ugp9wh/files

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
         }
     ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Create file
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/projects/:projectId/files Create file
 @apiGroup Files
 @apiName Create file
 @apiVersion 3.0.0

 @apiParam {String} id ID
 @apiParam {String} label Label
 @apiParam {String} contents Contents
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/pr73udvq34ugp9wh/files
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
            "code": "10401",
            "message": "Your request could not be completed. You cannot create more than 100 models in a project."
        }
    ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Get file
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/projects/:projectId/files/:fileId Get file
 @apiGroup Files
 @apiName Get file
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/nnnnininidididid/files/pr73udvq34ugp9df

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
 존재하지 않는 ID를 요청한 경우
 400 Bad Request
 {
     "errors": [
         {
             "code": "10102",
             "message": "Your request could not be completed. The file does not exists."
         }
     ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Update file
// -------------------------------------------------------------------------------------------------
/**
 @api {PUT} /api/vastudio/v3/projects/:projectId/files/:fileId Update file
 @apiGroup Files
 @apiName Update file
 @apiVersion 3.0.0

 @apiParam {String} event_key Current event_key
 @apiParam {String} label Label
 @apiParam {String} contents Contents
 @apiParam {String} [description] Description
 @apiParam {String} [type] Type
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df
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
 존재하지 않는 ID를 요청한 경우
 400 Bad Request
 {
     "errors": [
         {
             "code": "10102",
             "message": "Your request could not be completed. The file does not exists."
         }
     ]
 }

 @apiErrorExample Error Example 2
 event_key가 맞지 않는 경우
 400 Bad Request
 {
     "errors": [
         {
             "code": 32031,
             "message": "This model has been changed by another user. It will be loaded with the latest version."
         }
     ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Delete file
// -------------------------------------------------------------------------------------------------
/**
 @api {DELETE} /api/vastudio/v3/projects/:projectId/files/:fileId Delete file
 @apiGroup Files
 @apiName Delete file
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df

 @apiSuccessExample Success Example 1
 200 OK

 @apiErrorExample Error Example 1
 존재하지 않는 File의 삭제를 요청한 경우
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
// Get version list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/projects/:projectId/files/:fileId/versions Get version list
 @apiGroup Files
 @apiName Get version list
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions

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
 존재하지 않는 ID의 Version 목록을 요청한 경우
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
// Get version
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/projects/:projectId/files/:fileId/versions/:versionId Get version
 @apiGroup Files
 @apiName Get version
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions/vhjb5m79z4s3pjjb

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

// -------------------------------------------------------------------------------------------------
// Create version
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/projects/:projectId/files/:fileId/versions Create version
 @apiGroup Files
 @apiName Create version
 @apiVersion 3.0.0

 @apiParam {String} event_key Current event_key
 @apiParam {String} label Label
 @apiParam {String} contents Contents
 @apiParam {String} [description] Description
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions
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
             "code": "10102",
             "message": "Your request could not be completed. The item does not exists."
         }
     ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Update version
// -------------------------------------------------------------------------------------------------
/**
 @api {PUT} /api/vastudio/v3/projects/:projectId/files/:fileId/versions/:versionId Update version
 @apiGroup Files
 @apiName Update version
 @apiVersion 3.0.0

 @apiParam {String} [description] Description
 @apiParam {String} [tag] Tag

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions/vhjb5m79z4s3pjjb
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
             "code": "10102",
             "message": "Your request could not be completed. The item does not exists."
         }
     ]
 }

 */

// -------------------------------------------------------------------------------------------------
// Load version
// -------------------------------------------------------------------------------------------------
/**
 @api {post} /api/vastudio/v3/projects/:projectId/files/:fileId/versions/:versionId/load Load version
 @apiGroup Files
 @apiName Load version
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/projects/p34ephjmngga3vp1/files/pr73udvq34ugp9df/versions/vhjb5m79z4s3pjjb/load

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
