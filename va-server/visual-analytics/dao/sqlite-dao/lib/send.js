// var common = require('./common');
// const DDL_CHECK_TABLE = common.DDL_CHECK_TABLE;
// var query = common.query;
//
// const DDL_CREATE_SEND_MODEL_INFO_TABLE = 'CREATE TABLE brtc_send_model_info ( send_id character varying(80) NOT NULL, user_id character varying(80) NOT NULL, from_user_id character varying(80) NOT NULL, staus_code character varying(2) NOT NULL, send_type_code character varying(2) NOT NULL, project_id character varying(80), file_id character varying(80), label character varying(80) NOT NULL, description character varying(80), contents text, send_message text, send_date timestamp without time zone) WITH ( OIDS=FALSE )';
// const SEND_PROJECT_COPY_BY_PROJECTID = '';
// const SEND_FILE_COPY_BY_FILEID = 'INSERT INTO brtc_send_model_info (send_id, user_id, from_user_id, staus_code, send_type_code, project_id, file_id, label, description, contents, send_message, send_date)     (SELECT $1 as send_id, $2 as user_id, $3 as from_user_id, $4 as staus_code, $5 as send_type_code, A.id as project_id, B.id as file_id, B.label as label, B.description as description, B.contents as contents, $6 as send_message, datetime(\'now\') as send_date FROM brtc_project A, brtc_file B WHERE A.id = $7 and B.id = $8)';
// const SEND_UPDATE_STATUS_BY_UID = 'UPDATE brtc_send_model_info SET (staus_code) = (\'02\') WHERE send_id = $1 and project_id = $2 and file_id = $3';
// const SEND_DELETE_BY_UID = 'DELETE FROM brtc_send_model_info WHERE send_id = $1 and project_id = $2 and file_id = $3';
// const SEND_SELECT_NEW_BY_USERID = 'select (select name from brtc_user where id = A.from_user_id ) from_user_name, label, send_message, send_date from brtc_send_model_info A where user_id = $1 and staus_code = \'01\'';
// const SEND_SELECT_ALL_BY_USERID = 'select (select name from brtc_user where id = A.from_user_id ) from_user_name, send_id, project_id, file_id, label, send_message, send_date, staus_code from brtc_send_model_info A where user_id = $1';
// const SEND_FILE_COPY_TO_WORKSPACE_BY_UID = 'INSERT INTO brtc_file (id, project_id, label, contents, description, creator, create_time, updater, update_time) (SELECT $1 as id, $2 as project_id, $3 as label, contents, description, from_user_id as creator, datetime(\'now\') as create_time, $4 as updater, datetime(\'now\') as update_time FROM brtc_send_model_info WHERE send_id = $5 and project_id = $6 and file_id = $7)';
//
// module.exports = {
//     send: {
//         checkSchema: function (errCallback, doneCallback) {
//             query(DDL_CHECK_TABLE, ['brtc_send_model_info'], errCallback, function (result) {
//                 if (result.length == 0) {
//                     query(DDL_CREATE_SEND_MODEL_INFO_TABLE, [], errCallback, doneCallback);
//                 } else {
//                     var columns = {};
//                     for (var i in result) {
//                         columns[result[i].column_name] = true;
//                     }
//                     if (!columns['send_id']) query('ALTER TABLE brtc_send_model_info ADD COLUMN id character varying(80)', errCallback);
//                     if (!columns['user_id']) query('ALTER TABLE brtc_send_model_info ADD COLUMN user_id character varying(80)', errCallback);
//                     if (!columns['from_user_id']) query('ALTER TABLE brtc_send_model_info ADD COLUMN from_user_id character varying(80)', errCallback);
//                     if (!columns['staus_code']) query('ALTER TABLE brtc_send_model_info ADD COLUMN staus_code character varying(80)', errCallback);
//                     if (!columns['send_type_code']) query('ALTER TABLE brtc_send_model_info ADD COLUMN send_type_code timestamp', errCallback);
//                     if (!columns['project_id']) query('ALTER TABLE brtc_send_model_info ADD COLUMN project_id character varying(80)', errCallback);
//                     if (!columns['file_id']) query('ALTER TABLE brtc_send_model_info ADD COLUMN file_id character varying(80)', errCallback);
//                     if (!columns['label']) query('ALTER TABLE brtc_send_model_info ADD COLUMN label character varying(80)', errCallback);
//                     if (!columns['description']) query('ALTER TABLE brtc_send_model_info ADD COLUMN description character varying(80)', errCallback);
//                     if (!columns['contents']) query('ALTER TABLE brtc_send_model_info ADD COLUMN contents text', errCallback);
//                     if (!columns['send_message']) query('ALTER TABLE brtc_send_model_info ADD COLUMN send_message text', errCallback);
//                     if (!columns['send_date']) query('ALTER TABLE brtc_send_model_info ADD COLUMN send_date timestamp without time zone', errCallback);
//
//                     if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_send_model_info']);
//                 }
//             });
//         },
//         project: {
//             createSendToByFileID: function (opt, errCallback, doneCallback) {
//                 query(SEND_PROJECT_COPY_BY_PROJECTID, [opt.projectId], errCallback, doneCallback);
//             }
//         },
//         file: {
//             createSendToByFileID: function (opt, errCallback, doneCallback) {
//                 query(SEND_FILE_COPY_BY_FILEID, [opt.sendId, opt.userId, opt.fromUserId, '01', '02', opt.sendMessage, opt.projectId, opt.fileId], errCallback, doneCallback);
//             },
//             copyModelToWorkspaceByUniqueID: function (opt, errCallback, doneCallback) {
//                 query(SEND_FILE_COPY_TO_WORKSPACE_BY_UID, [opt.newFileId, opt.toProjectId, opt.newLabel, opt.updater, opt.sendId, opt.projectId, opt.fileId], errCallback, doneCallback);
//             }
//         },
//         updateStausCodeByUniqueID: function (opt, errCallback, doneCallback) {
//             query(SEND_UPDATE_STATUS_BY_UID, [opt.sendId, opt.projectId, opt.fileId], errCallback, doneCallback);
//         },
//         deleteByUniqueId: function (opt, errCallback, doneCallback) {
//             query(SEND_DELETE_BY_UID, [opt.sendId, opt.projectId, opt.fileId], errCallback, doneCallback);
//         },
//         selectNewSendToByUserID: function (opt, errCallback, doneCallback) {
//             query(SEND_SELECT_NEW_BY_USERID, [opt.userId], errCallback, doneCallback);
//         },
//         selectAllSendToByUserID: function (opt, errCallback, doneCallback) {
//             query(SEND_SELECT_ALL_BY_USERID, [opt.userId], errCallback, doneCallback);
//         }
//
//     },
// };
