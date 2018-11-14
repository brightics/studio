// -------------------------------------------------------------------------------------------------
// List Role
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/authorization/roles List Role
 @apiGroup Authorization
 @apiName List Role
 @apiVersion 3.0.0

 @apiParam {String} [userId] User Id
 @apiParam {String} [roleLabel] Role Label

 @apiParamExample Param Example 1
 /api/vastudio/v3/authorization/roles

 @apiParamExample Param Example 2
 /api/vastudio/v3/authorization/roles?userId=brightics@samsung.com

 @apiParamExample Param Example 3
 /api/vastudio/v3/authorization/roles?roleLabel=Power User

 @apiParamExample Param Example 4
 /api/vastudio/v3/authorization/roles?roleLabel=Administrator&userId=brightics@samsung.com

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "role_id": "role_10101",
     "role_category": "role_management",
     "role_label": "Administrator",
     "description": "Administrator"
 },
 {
     "role_id": "role_10102",
     "role_category": "role_management",
     "role_label": "Power User",
     "description": "Power User"
 },
 {
     "role_id": "role_10103",
     "role_category": "role_management",
     "role_label": "General User",
     "description": "General User"
 }
 ]
 @apiSuccessExample Success Example 2
 200 OK
 [
 {
     "role_id": "role_10101",
     "role_category": "role_management",
     "role_label": "Administrator",
     "description": "Administrator"
 }
 ]
 @apiSuccessExample Success Example 3
 200 OK
 [
 {
     "role_id": "role_10102",
     "role_category": "role_management",
     "role_label": "Power User",
     "description": "Power User"
 }
 ]
 @apiSuccessExample Success Example 4
 200 OK
 [
 {
     "role_id": "role_10101",
     "role_category": "role_management",
     "role_label": "Administrator",
     "description": "Administrator"
 }
 ]
 */

// -------------------------------------------------------------------------------------------------
// Update Role
// -------------------------------------------------------------------------------------------------
/**
 @api {PUT} /api/vastudio/v3/authorization/roles/:roleId Update Role
 @apiGroup Authorization
 @apiName Update Role
 @apiVersion 3.0.0

 @apiParam {Array} userIdList User Id List

 @apiParamExample Param Example 1
 /api/vastudio/v3/authorization/roles/role_10101
 {
     "userIdList": ["brightics@samsung.com", "test@samsung.com"]
 }

 @apiParamExample Param Example 2
 /api/vastudio/v3/authorization/roles/role_10101
 {}

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
// List Users by Role ID
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/authorization/roles/:roleId/users List Users by Role ID
 @apiGroup Authorization
 @apiName List Users by Role ID
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/authorization/roles/role_10101/users

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "user_id": "test@samsung.com",
     "resource_type": "",
     "resource_id": "",
     "role_id": "role_10101",
     "create_time": "2018-04-25T06:07:54.919Z",
     "name": "test",
     "email": "test@samsung.com"
 },
 ...
 ]
 */

// -------------------------------------------------------------------------------------------------
// List Permissions by Role ID
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/authorization/roles/:roleId/permissions List Permissions by Role ID
 @apiGroup Authorization
 @apiName ListPermissionsbyRoleID
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/authorization/roles/role_10101/permissions

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "permission_id": "perm_account_create",
     "resource_type": "user",
     "description": "Create a account"
 },
 {
     "permission_id": "perm_account_delete",
     "resource_type": "user",
     "description": "Delete a account"
 },
 ...
 ]
 */

// -------------------------------------------------------------------------------------------------
// List Permission Resource Type By User ID
// -------------------------------------------------------------------------------------------------
/**
 @api {GET} /api/vastudio/v3/authorization/:userId/resourcetype List Permission Resource Type By User ID
 @apiGroup Authorization
 @apiName List Permission Resource Type By User ID
 @apiVersion 3.0.0

 @apiParamExample Param Example 1
 /api/vastudio/v3/authorization/brightics@samsung.com/resourcetype

 @apiSuccessExample Success Example 1
 200 OK
 [
 {
     "resource_type": "notice"
 },
 {
     "resource_type": "project"
 },
 ...
 ]
 */