// -------------------------------------------------------------------------------------------------
// Get notice list
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/notices Get notice list
 @apiGroup Notice
 @apiName Get notice list
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/notices

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "id": "n34ephjmngga3vp1",
     "title": "testTitle",
     "content": "<div>test</div>",
     "creator": "tester",
     "create_time": "2018-05-11T01:43:47.219Z",
     "updater": null,
     "update_time": "2018-05-11T01:43:47.219Z",
     "hits": 0
 },
 {
     "id": "ntze9hsdk8sqnss7",
     "title": "sdf",
     "content": "<p>sdf</p>",
     "creator": "ng1123.kim@samsung.com",
     "create_time": "2018-04-25T06:11:20.801Z",
     "updater": null,
     "update_time": "2018-04-25T06:11:20.801Z",
     "hits": 0
 },
 ...
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
// Create notice
// -------------------------------------------------------------------------------------------------
/**
 @api {POST} /api/vastudio/v3/notices Create notice
 @apiGroup Notice
 @apiName Create notice
 @apiVersion 3.0.0

 @apiParam {String} id ID
 @apiParam {String} title Title
 @apiParam {String} content Content

 @apiParamExample Param Example 1
 /api/vastudio/v3/notices
 {
     "id": "n34ephjmngga3vpt",
     "title": "testTitle",
     "content": "<div>test</div>"
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
// Update notice
// -------------------------------------------------------------------------------------------------
/**
 @api {PUT} /api/vastudio/v3/notices/:noticeId Update notice
 @apiGroup Notice
 @apiName Update notice
 @apiVersion 3.0.0

 @apiParam {String} title Title
 @apiParam {String} content Content

 @apiParamExample Param Example 1
 /api/vastudio/v3/notices/n34ephjmngga3vpt
 {
     "title": "testTitle22",
     "content": "<div>test22</div>"
 }

 @apiSuccessExample Success Example 1
 200 OK
 OK

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
// Delete notice
// -------------------------------------------------------------------------------------------------
/**
 @api {DELETE} /api/vastudio/v3/notices/:noticeId Delete notice
 @apiGroup Notice
 @apiName Delete notice
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/notices/n34ephjmngga3vpt

 @apiSuccessExample Success Example 1
 200 OK
 OK

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