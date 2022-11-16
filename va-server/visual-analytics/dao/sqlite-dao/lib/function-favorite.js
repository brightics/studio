var common = require('./common');

const DDL_CHECK_TABLE = common.DDL_CHECK_TABLE;
var query = common.query;
 
const CREATE_FUNCTION_FAVORITE_TABLE = `
CREATE TABLE brtc_function_favorite (
  id text NOT NULL
)`;
const FUNCTION_FAVORITE_CHECK = 'SELECT COUNT(*) FROM brtc_function_favorite WHERE id=$1';
const FUNCTION_FAVORITE_CREATE_MANY = 'INSERT INTO brtc_function_favorite (id) VALUES ';
const FUNCTION_FAVORITE_DELETE_ALL = 'DELETE FROM brtc_function_favorite';
const FUNCTION_FAVORITE_SELECT  = 'SELECT * FROM brtc_function_favorite';

module.exports = {
  function: {
    favorite: {
      checkSchema: function (errCallback, doneCallback) {
        query(DDL_CHECK_TABLE, ['brtc_function_favorite'], errCallback, function (result) {
          if (result.length === 0) {
            query(CREATE_FUNCTION_FAVORITE_TABLE, [], errCallback, doneCallback);
            return;
          }
          var columns = {};
          for (var i in result) {
            columns[result[i].column_name] = true;
          }
          if (!columns['id']) query('ALTER TABLE brtc_function_favorite ADD COLUMN id text', errCallback);
          if (doneCallback) doneCallback(result.rows, result, DDL_CHECK_TABLE, ['brtc_function_favorite']);
        });
      },
      has: function (opt, errCallback, doneCallback) {
        return query(FUNCTION_FAVORITE_CHECK, [opt.id], errCallback, doneCallback);
      },
      create: function (opt, errCallback, doneCallback) {
        const ids = opt.ids;
        let valuesSql = [];
        for (let i = 0; i < ids.length; i++) {
          valuesSql.push('($' + (i + 1) + ')');
        }
        return query(FUNCTION_FAVORITE_CREATE_MANY + valuesSql.join(', '), ids, errCallback, doneCallback);
      },
      deleteAll: function (opt, errCallback, doneCallback) {
        return query(FUNCTION_FAVORITE_DELETE_ALL, [], errCallback, doneCallback);
      },
      select: function (opt, errCallback, doneCallback) {
        return query(FUNCTION_FAVORITE_SELECT, [], errCallback, doneCallback);
      },
    }
  }
};
