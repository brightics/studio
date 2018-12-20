'use strict';
const common = require('./common');
const IDGenerator = require('../../../lib/tools/idgenerator');

const getQuery = require('./query-utils').getQuery;

const DDL_CHECK_TABLE_DEFAULT = common.DDL_CHECK_TABLE;
var query = common.query;

const FILE_TABLE = 'brtc_file';

const FILE_ID_IN_FILE_TABLE = 'id';
const FILE_CONTENTS_IN_FILE_TABLE = 'contents';
const FILE_TYPE_IN_FILE_TABLE = 'type';
const FILE_UPDATE_TIME_IN_FILE_TABLE = 'update_time';
const FILE_EVENT_KEY_IN_FILE_TABLE = 'event_key';
const FILE_UPDATER_IN_FILE_TABLE = 'updater';
const FROM_VERSION_IN_FILE_TABLE = 'from_version';
// const FROM_VERSION_TYPE_IN_FILE_TABLE = 'character varying(80)';

const FILE_VERSION_TABLE = 'brtc_file_version';
const VERSION_ID_COL = 'version_id';
const VERSION_ID_TYPE = 'character varying(80) NOT NULL';
const FILE_ID_COL = 'file_id';
const FILE_ID_TYPE = 'character varying(80) NOT NULL';
const MAJOR_VERSION_COL = 'major_version';
const MAJOR_VERSION_TYPE = 'integer NOT NULL';
const MINOR_VERSION_COL = 'minor_version';
const MINOR_VERSION_TYPE = 'integer NOT NULL';
const VERSION_CONTENTS_COL = 'contents';
const VERSION_CONTENTS_TYPE = 'text';
const FILE_TYPE_COL = 'type';
const FILE_TYPE_TYPE = 'character varying(80)';
const CREATOR_COL = 'creator';
const CREATOR_TYPE = 'character varying(80)';
const CREATE_TIME_COL = 'create_time';
const CREATE_TIME_TYPE = 'timestamp with time zone';
const UPDATER_COL = 'updater';
const UPDATER_TYPE = 'character varying(80)';
const UPDATE_TIME_COL = 'update_time';
const UPDATE_TIME_TYPE = 'timestamp with time zone';
const TAGS_COL = 'tags';
const TAGS_TYPE = 'character varying(80)';
const LABEL_COL = 'label';
const LABEL_TYPE = 'character varying(80)';
const DESCRIPTION_COL = 'description';
const DESCRIPTION_TYPE = 'text';
const MODEL_IMAGE_COL = 'model_image';
const MODEL_IMAGE_TYPE = 'bytea DEFAULT NULL';
const IS_DELETED_COL = 'is_deleted';
const IS_DELETED_TYPE = 'boolean';

const DDL_CREATE_VERSION_TABLE_DEFAULT = `
    CREATE TABLE ${FILE_VERSION_TABLE} (
        ${VERSION_ID_COL} ${VERSION_ID_TYPE},
        ${FILE_ID_COL} ${FILE_ID_TYPE},
        ${MAJOR_VERSION_COL} ${MAJOR_VERSION_TYPE},
        ${MINOR_VERSION_COL} ${MINOR_VERSION_TYPE},
        ${VERSION_CONTENTS_COL} ${VERSION_CONTENTS_TYPE},
        ${FILE_TYPE_COL} ${FILE_TYPE_TYPE},
        ${CREATOR_COL} ${CREATOR_TYPE},
        ${CREATE_TIME_COL} ${CREATE_TIME_TYPE},
        ${UPDATER_COL} ${UPDATER_TYPE},
        ${UPDATE_TIME_COL} ${UPDATE_TIME_TYPE},
        ${TAGS_COL} ${TAGS_TYPE},
        ${LABEL_COL} ${LABEL_TYPE},
        ${DESCRIPTION_COL} ${DESCRIPTION_TYPE},
        ${MODEL_IMAGE_COL} ${MODEL_IMAGE_TYPE},
        ${IS_DELETED_COL} ${IS_DELETED_TYPE},
        CONSTRAINT ${FILE_VERSION_TABLE}_pkey
            PRIMARY KEY (${VERSION_ID_COL}, ${FILE_ID_COL})
    )
    WITH (
        OIDS=FALSE
    )
`;

const DDL_CREATE_VERSION_TABLE_SQLITE = `
    CREATE TABLE ${FILE_VERSION_TABLE} (
        ${VERSION_ID_COL} ${VERSION_ID_TYPE},
        ${FILE_ID_COL} ${FILE_ID_TYPE},
        ${MAJOR_VERSION_COL} ${MAJOR_VERSION_TYPE},
        ${MINOR_VERSION_COL} ${MINOR_VERSION_TYPE},
        ${VERSION_CONTENTS_COL} ${VERSION_CONTENTS_TYPE},
        ${FILE_TYPE_COL} ${FILE_TYPE_TYPE},
        ${CREATOR_COL} ${CREATOR_TYPE},
        ${CREATE_TIME_COL} ${CREATE_TIME_TYPE},
        ${UPDATER_COL} ${UPDATER_TYPE},
        ${UPDATE_TIME_COL} ${UPDATE_TIME_TYPE},
        ${TAGS_COL} ${TAGS_TYPE},
        ${LABEL_COL} ${LABEL_TYPE},
        ${DESCRIPTION_COL} ${DESCRIPTION_TYPE},
        ${MODEL_IMAGE_COL} ${MODEL_IMAGE_TYPE},
        ${IS_DELETED_COL} ${IS_DELETED_TYPE},
        CONSTRAINT ${FILE_VERSION_TABLE}_pkey
            PRIMARY KEY (${VERSION_ID_COL}, ${FILE_ID_COL})
    )
`;

const FILE_SELECT_BY_FILE_ID_DEFAULT = `
    SELECT * FROM ${FILE_TABLE} WHERE ${FILE_ID_IN_FILE_TABLE} = $1
`;
const VERSION_SELECT_ALL_DEFAULT = `SELECT * FROM ${FILE_VERSION_TABLE}`;
const VERSION_SELECT_BY_FILE_ID_DEFAULT = `
    SELECT * FROM ${FILE_VERSION_TABLE} WHERE ${FILE_ID_COL} = $1
`;

const VERSION_SELECT_BY_FILE_AND_VERSION_ID_DEFAULT = `
    SELECT *
    FROM ${FILE_VERSION_TABLE}
    WHERE ${FILE_ID_COL} = $1 AND ${VERSION_ID_COL} = $2
`;

const SELECT_CONTENTS_TYPE_FROM_IN_FILE_TABLE_DEFAULT = `
    SELECT
        ${FILE_CONTENTS_IN_FILE_TABLE},
        ${FILE_TYPE_IN_FILE_TABLE},
        ${FROM_VERSION_IN_FILE_TABLE}
    FROM ${FILE_TABLE}
    WHERE ${FILE_ID_IN_FILE_TABLE} = $1
`;

const VERSION_CREATE_HEADER = `
    INSERT INTO ${FILE_VERSION_TABLE} (
        ${VERSION_ID_COL},
        ${FILE_ID_COL},
        ${MAJOR_VERSION_COL},
        ${MINOR_VERSION_COL},
        ${VERSION_CONTENTS_COL},
        ${FILE_TYPE_COL},
        ${CREATOR_COL},
        ${CREATE_TIME_COL},
        ${UPDATER_COL},
        ${UPDATE_TIME_COL},
        ${TAGS_COL},
        ${LABEL_COL},
        ${DESCRIPTION_COL},
        ${IS_DELETED_COL}
    )
`;

const VERSION_CREATE_MANUALLY_DEFAULT = `
    INSERT INTO ${FILE_VERSION_TABLE} (
        ${VERSION_ID_COL},
        ${FILE_ID_COL},
        ${MAJOR_VERSION_COL},
        ${MINOR_VERSION_COL},
        ${VERSION_CONTENTS_COL},
        ${FILE_TYPE_COL},
        ${CREATOR_COL},
        ${CREATE_TIME_COL},
        ${UPDATER_COL},
        ${UPDATE_TIME_COL},
        ${TAGS_COL},
        ${LABEL_COL},
        ${DESCRIPTION_COL},
        ${IS_DELETED_COL}
    )
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        now(),
        $7,
        now(),
        $8,
        $9,
        $10,
        false
    )
    RETURNING *
`;

const VERSION_CREATE_MANUALLY_SQLITE = `
    INSERT INTO ${FILE_VERSION_TABLE} (
        ${VERSION_ID_COL},
        ${FILE_ID_COL},
        ${MAJOR_VERSION_COL},
        ${MINOR_VERSION_COL},
        ${VERSION_CONTENTS_COL},
        ${FILE_TYPE_COL},
        ${CREATOR_COL},
        ${CREATE_TIME_COL},
        ${UPDATER_COL},
        ${UPDATE_TIME_COL},
        ${TAGS_COL},
        ${LABEL_COL},
        ${DESCRIPTION_COL},
        ${IS_DELETED_COL}
    )
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        datetime('now'),
        $7,
        datetime('now'),
        $8,
        $9,
        $10,
        0
    )
`;

const VERSION_CREATE_WITH_MAJOR_DEFAULT = `
    ${VERSION_CREATE_HEADER}
    SELECT
        CAST($1 AS VARCHAR),
        CAST($2 AS VARCHAR),
        COALESCE(MAX(A.${MAJOR_VERSION_COL}), 0) + 1,
        0,
        $7,
        $8,
        CAST($3 AS VARCHAR),
        now(),
        CAST($3 AS VARCHAR),
        now(),
        CAST($4 AS VARCHAR),
        CAST($5 AS VARCHAR),
        CAST($6 AS TEXT),
        false
    FROM ${FILE_VERSION_TABLE} as A, ${FILE_TABLE} as B
    WHERE A.${FILE_ID_COL} = $2
    RETURNING *
`;

const VERSION_CREATE_WITH_MAJOR_SQLITE = `
    ${VERSION_CREATE_HEADER}
    SELECT
        CAST($1 AS VARCHAR) ${VERSION_ID_COL},
        CAST($2 AS VARCHAR) ${FILE_ID_COL},
        (COALESCE(MAX(A.${MAJOR_VERSION_COL}), 0) + 1) ${MAJOR_VERSION_COL},
        0 ${MINOR_VERSION_COL},
        $7 ${VERSION_CONTENTS_COL},
        $8 ${FILE_TYPE_COL},
        CAST($3 AS VARCHAR) ${CREATOR_COL},
        datetime('now') ${CREATE_TIME_COL},
        CAST($3 AS VARCHAR) ${UPDATER_COL},
        datetime('now') ${UPDATE_TIME_COL},
        CAST($4 AS VARCHAR) ${TAGS_COL},
        CAST($5 AS VARCHAR) ${LABEL_COL},
        CAST($6 AS TEXT) ${DESCRIPTION_COL},
        0 ${IS_DELETED_COL}

    FROM ${FILE_VERSION_TABLE} as A, ${FILE_TABLE} as B
    WHERE A.${FILE_ID_COL} = $2
`;
const VERSION_CREATE_WITH_MINOR_DEFAULT = `
    ${VERSION_CREATE_HEADER}
    SELECT
        CAST($1 AS VARCHAR),
        CAST($2 AS VARCHAR),
        $9,
        COALESCE(MAX(${MINOR_VERSION_COL}), 0) + 1,
        $7,
        $8,
        CAST($3 AS VARCHAR),
        now(),
        CAST($3 AS VARCHAR),
        now(),
        CAST($4 AS VARCHAR),
        CAST($5 AS VARCHAR),
        CAST($6 AS TEXT),
        false
    FROM ${FILE_VERSION_TABLE} as A, ${FILE_TABLE} as B
    WHERE ${FILE_ID_COL} = $2 AND ${MAJOR_VERSION_COL} = (
            SELECT COALESCE(MAX(${MAJOR_VERSION_COL}), 0)
            FROM ${FILE_VERSION_TABLE}
            WHERE ${FILE_ID_COL} = $2 AND ${MAJOR_VERSION_COL} = $9
        )
    RETURNING *
`;

const VERSION_CREATE_WITH_MINOR_SQLITE = `
    ${VERSION_CREATE_HEADER}
    SELECT
        CAST($1 AS VARCHAR) ${VERSION_ID_COL},
        CAST($2 AS VARCHAR) ${FILE_ID_COL},
        $9 ${MAJOR_VERSION_COL},
        (COALESCE(MAX(${MINOR_VERSION_COL}), 0) + 1) ${MINOR_VERSION_COL},
        $7 ${VERSION_CONTENTS_COL},
        $8 ${FILE_TYPE_COL},
        CAST($3 AS VARCHAR) ${CREATOR_COL},
        datetime('now') ${CREATE_TIME_COL},
        CAST($3 AS VARCHAR) ${UPDATER_COL},
        datetime('now') ${UPDATE_TIME_COL},
        CAST($4 AS VARCHAR) ${TAGS_COL},
        CAST($5 AS VARCHAR) ${LABEL_COL},
        CAST($6 AS TEXT) ${DESCRIPTION_COL},
        0 ${IS_DELETED_COL}
    FROM ${FILE_VERSION_TABLE} as A, ${FILE_TABLE} as B
    WHERE ${FILE_ID_COL} = $2 AND ${MAJOR_VERSION_COL} = (
            SELECT COALESCE(MAX(${MAJOR_VERSION_COL}), 0)
            FROM ${FILE_VERSION_TABLE}
            WHERE ${FILE_ID_COL} = $2 AND ${MAJOR_VERSION_COL} = $9
        )
`;

const VERSION_UPDATE_DEFAULT = `
    UPDATE ${FILE_VERSION_TABLE}
    SET (
        ${UPDATER_COL},
        ${UPDATE_TIME_COL},
        ${TAGS_COL},
        ${DESCRIPTION_COL}
    ) = ($1, now(), $2, $3)
    WHERE ${FILE_ID_COL} = $4 AND ${VERSION_ID_COL} = $5
`;

const VERSION_UPDATE_SQLITE = `
    UPDATE ${FILE_VERSION_TABLE}
    SET (
        ${UPDATER_COL},
        ${UPDATE_TIME_COL},
        ${TAGS_COL},
        ${DESCRIPTION_COL}
    ) = ($1, datetime('now'), $2, $3)
    WHERE ${FILE_ID_COL} = $4 AND ${VERSION_ID_COL} = $5
`;

// const VERSION_SOFT_DELETE = `
//     UPDATE ${FILE_VERSION_TABLE}
//     SET (${UPDATER_COL}, ${UPDATE_TIME_COL}, ${IS_DELETED_COL})
//         = ($1, now(), true)
//     WHERE ${FILE_ID_COL} = $2 AND ${VERSION_ID_COL} = $3
// `;

const VERSION_HARD_DELETE_DEFAULT = `
    DELETE FROM ${FILE_VERSION_TABLE}
    WHERE ${FILE_ID_COL} = $1 AND ${VERSION_ID_COL} = $2
`;

const SELECT_CONTENTS_IN_FILE_VERSION_TABLE_DEFAULT = `
    SELECT
        ${VERSION_CONTENTS_COL},
        ${MAJOR_VERSION_COL},
        ${MINOR_VERSION_COL}
    FROM ${FILE_VERSION_TABLE}
    WHERE ${FILE_ID_COL} = $1 AND ${VERSION_ID_COL} = $2
`;

const VERSION_LOAD_DEFAULT = `
    UPDATE ${FILE_TABLE}
    SET (
        ${FILE_CONTENTS_IN_FILE_TABLE},
        ${FILE_UPDATE_TIME_IN_FILE_TABLE},
        ${FILE_EVENT_KEY_IN_FILE_TABLE},
        ${FROM_VERSION_IN_FILE_TABLE},
        ${FILE_UPDATER_IN_FILE_TABLE}
    ) = (
        $3,
        now(),
        to_char(current_timestamp, 'YYMMDD_HH24MISS_US'),
        $4,
        $2
    )
    WHERE ${FILE_ID_IN_FILE_TABLE} = $1
    RETURNING *
`;

const VERSION_LOAD_SQLITE = `
    UPDATE ${FILE_TABLE}
    SET (
        ${FILE_CONTENTS_IN_FILE_TABLE},
        ${FILE_UPDATE_TIME_IN_FILE_TABLE},
        ${FILE_EVENT_KEY_IN_FILE_TABLE},
        ${FROM_VERSION_IN_FILE_TABLE},
        ${FILE_UPDATER_IN_FILE_TABLE}
    ) = (
        $3,
        datetime('now'),
        strftime('%Y_%H%M%f', current_timestamp),
        $4,
        $2
    )
    WHERE ${FILE_ID_IN_FILE_TABLE} = $1
`;


const stmt = {
    DDL_CHECK_TABLE: {
        default: DDL_CHECK_TABLE_DEFAULT
    },
    DDL_CREATE_VERSION_TABLE: {
        default: DDL_CREATE_VERSION_TABLE_DEFAULT,
        sqlite: DDL_CREATE_VERSION_TABLE_SQLITE
    },
    VERSION_SELECT_ALL: {
        default: VERSION_SELECT_ALL_DEFAULT
    },
    VERSION_SELECT_BY_FILE_ID: {
        default: VERSION_SELECT_BY_FILE_ID_DEFAULT
    },
    VERSION_SELECT_BY_FILE_AND_VERSION_ID: {
        default: VERSION_SELECT_BY_FILE_AND_VERSION_ID_DEFAULT
    },
    FILE_SELECT_BY_FILE_ID: {
        default: FILE_SELECT_BY_FILE_ID_DEFAULT
    },
    SELECT_CONTENTS_TYPE_FROM_IN_FILE_TABLE: {
        default: SELECT_CONTENTS_TYPE_FROM_IN_FILE_TABLE_DEFAULT
    },
    VERSION_CREATE_MANUALLY: {
        default: VERSION_CREATE_MANUALLY_DEFAULT,
        sqlite: VERSION_CREATE_MANUALLY_SQLITE
    },
    VERSION_CREATE_WITH_MAJOR: {
        default: VERSION_CREATE_WITH_MAJOR_DEFAULT,
        sqlite: VERSION_CREATE_WITH_MAJOR_SQLITE
    },
    VERSION_CREATE_WITH_MINOR: {
        default: VERSION_CREATE_WITH_MINOR_DEFAULT,
        sqlite: VERSION_CREATE_WITH_MINOR_SQLITE
    },
    VERSION_UPDATE: {
        default: VERSION_UPDATE_DEFAULT,
        sqlite: VERSION_UPDATE_SQLITE
    },
    VERSION_HARD_DELETE: {
        default: VERSION_HARD_DELETE_DEFAULT
    },
    SELECT_CONTENTS_IN_FILE_VERSION_TABLE: {
        default: SELECT_CONTENTS_IN_FILE_VERSION_TABLE_DEFAULT
    },
    VERSION_LOAD: {
        default: VERSION_LOAD_DEFAULT,
        sqlite: VERSION_LOAD_SQLITE
    }
};

const DDL_CHECK_TABLE = getQuery(stmt, 'DDL_CHECK_TABLE');
const DDL_CREATE_VERSION_TABLE = getQuery(stmt, 'DDL_CREATE_VERSION_TABLE');
const VERSION_SELECT_ALL = getQuery(stmt, 'VERSION_SELECT_ALL');
const VERSION_SELECT_BY_FILE_ID = getQuery(stmt, 'VERSION_SELECT_BY_FILE_ID');
const VERSION_SELECT_BY_FILE_AND_VERSION_ID = getQuery(stmt, 'VERSION_SELECT_BY_FILE_AND_VERSION_ID');
const SELECT_CONTENTS_TYPE_FROM_IN_FILE_TABLE =
    getQuery(stmt, 'SELECT_CONTENTS_TYPE_FROM_IN_FILE_TABLE');
const VERSION_CREATE_MANUALLY = getQuery(stmt, 'VERSION_CREATE_MANUALLY');
const VERSION_CREATE_WITH_MAJOR = getQuery(stmt, 'VERSION_CREATE_WITH_MAJOR');
const VERSION_CREATE_WITH_MINOR = getQuery(stmt, 'VERSION_CREATE_WITH_MINOR');
const VERSION_UPDATE = getQuery(stmt, 'VERSION_UPDATE');
const VERSION_HARD_DELETE = getQuery(stmt, 'VERSION_HARD_DELETE');
const SELECT_CONTENTS_IN_FILE_VERSION_TABLE = getQuery(stmt, 'SELECT_CONTENTS_IN_FILE_VERSION_TABLE');
const VERSION_LOAD = getQuery(stmt, 'VERSION_LOAD');
const FILE_SELECT_BY_FILE_ID = getQuery(stmt, 'FILE_SELECT_BY_FILE_ID');

const repairTable = (schemaRows) => {
    var columns = {};
    schemaRows.forEach((column) => {
        columns[column.column_name] = true;
    });

    const columnNameAndType = [
        [VERSION_ID_COL, VERSION_ID_TYPE],
        [FILE_ID_COL, FILE_ID_TYPE],
        [MAJOR_VERSION_COL, MAJOR_VERSION_TYPE],
        [MINOR_VERSION_COL, MINOR_VERSION_TYPE],
        [VERSION_CONTENTS_COL, VERSION_CONTENTS_TYPE],
        [FILE_TYPE_COL, FILE_TYPE_TYPE],
        [CREATOR_COL, CREATOR_TYPE],
        [CREATE_TIME_COL, CREATE_TIME_TYPE],
        [UPDATER_COL, UPDATER_TYPE],
        [UPDATE_TIME_COL, UPDATE_TIME_TYPE],
        [TAGS_COL, TAGS_TYPE],
        [LABEL_COL, LABEL_TYPE],
        [DESCRIPTION_COL, DESCRIPTION_TYPE],
        [MODEL_IMAGE_COL, MODEL_IMAGE_TYPE],
        [IS_DELETED_COL, IS_DELETED_TYPE]
    ];

    const checkAllColumns = columnNameAndType.map((column) => {
        const name = column[0];
        const type = column[1];
        const alterQuery = `ALTER TABLE ${FILE_VERSION_TABLE}
                    ADD COLUMN ${name} ${type}`;
        return new Promise((resolve, reject) => {
            if (!columns[name]) {
                query(alterQuery, [], reject, resolve);
            } else {
                resolve();
            }
        });
    });

    return Promise.all(checkAllColumns);
};

var version = {
    checkSchema: function (errCallback, doneCallback) {
        query(DDL_CHECK_TABLE, [FILE_VERSION_TABLE], errCallback, function (result) {
            if (result.length === 0) {
                query(DDL_CREATE_VERSION_TABLE, [], errCallback, doneCallback);
            } else {
                repairTable(result).then(() => {
                    doneCallback(result.rows, result, DDL_CHECK_TABLE, [FILE_VERSION_TABLE]);
                }).catch(errCallback);
            }
        });
    },

    // TODO: contents 없이 반환하도록 수정해야함
    selectAll: function (opt, errCallback, doneCallback) {
        query(VERSION_SELECT_ALL, [], errCallback, doneCallback);
    },

    // TODO: contents 없이 반환하도록 수정해야함
    selectById: function (opt, errCallback, doneCallback) {
        const param = [opt.fileId];
        query(VERSION_SELECT_BY_FILE_ID, param, errCallback, doneCallback);
    },

    // TODO: 단순 조회시 contents 없이 반환하도록 수정해야함
    selectByIdAndVersion: function (opt, errCallback, doneCallback) {
        const param = [
            opt.fileId,
            opt.versionId
        ];
        query(VERSION_SELECT_BY_FILE_AND_VERSION_ID, param, errCallback, doneCallback);
    },

    // TODO : atomic 하도록 해야함
    create: function (opt, errCallback, doneCallback) {
        query(SELECT_CONTENTS_TYPE_FROM_IN_FILE_TABLE, [opt.fileId], errCallback, function (rows) {
            if (rows.length) {
                const majorVersion =
                    rows[0].from_version ? parseInt(rows[0].from_version.split('.')[0]) : 0;
                const queryStatement =
                    opt.isMajor ? VERSION_CREATE_WITH_MAJOR : VERSION_CREATE_WITH_MINOR;

                const id = opt.versionId || IDGenerator.version.id();
                var contents = JSON.parse(rows[0].contents);
                contents.version_id = id;
                contents.mid = opt.fileId;
                const param = [
                    id,
                    opt.fileId,
                    opt.user,
                    opt.tags,
                    opt.label,
                    opt.description,
                    contents,
                    rows[0].type
                ];
                if (!opt.isMajor) {
                    param.push(majorVersion);
                }
                query(queryStatement, param, errCallback, () => {
                    query(VERSION_SELECT_BY_FILE_AND_VERSION_ID,
                        [opt.fileId, id], errCallback, doneCallback);
                });
            } else {
                doneCallback(null);
            }
        });
    },
    createManually: function (opt, errCallback, doneCallback) {
        var id = opt.versionId || IDGenerator.version.id();
        opt.contents.version_id = id;
        opt.contents.mid = opt.fileId;
        const param = [
            id,
            opt.fileId,
            opt.majorVersion,
            opt.minorVersion,
            opt.contents,
            opt.type,
            opt.user,
            opt.tags,
            opt.label,
            opt.description
        ];
        query(VERSION_CREATE_MANUALLY, param, errCallback, () => {
            query(VERSION_SELECT_BY_FILE_AND_VERSION_ID,
                [opt.fileId, id], errCallback, doneCallback);
        });
    },
    update: function (opt, errCallback, doneCallback) {
        const param = [
            opt.updater,
            opt.tags,
            opt.description,
            opt.fileId,
            opt.versionId
        ];
        query(VERSION_UPDATE, param, errCallback, doneCallback);
    },
    delete: function (opt, errCallback, doneCallback) {
        const param = [
            opt.fileId,
            opt.versionId
        ];
        query(VERSION_HARD_DELETE, param, errCallback, doneCallback);
    },
    load: function (opt, errCallback, doneCallback) {
        query(SELECT_CONTENTS_IN_FILE_VERSION_TABLE, [opt.fileId, opt.versionId], errCallback,
            function (rows) {
                if (rows.length) {
                    var row = rows[0];
                    var contents = JSON.parse(row.contents);
                    if (contents.version_id) delete contents.version_id;
                    const param = [
                        opt.fileId,
                        opt.updater,
                        contents,
                        row.major_version + '.' + row.minor_version
                    ];
                    query(VERSION_LOAD, param, errCallback, () => {
                        query(FILE_SELECT_BY_FILE_ID,
                            [opt.fileId, opt.versionId], errCallback, doneCallback);
                    });
                } else {
                    errCallback('Version does not exsits');
                }
            });
    },
    getMock: function () {
        return {
            id: 'abcd',
            version: '0.1',
            contents: '{}',
            type: 'data',
            creator: 'test@samsung.com',
            create_time: 'datetime(\'now\')',
            updater: 'test@samsung.com',
            update_time: 'datetime(\'now\'',
            tags: 'temptag',
            label: 'temp',
            description: 'description test',
            model_image: 'null',
            is_deleted: 'false'
        };
    }
};

module.exports = {
    file: {
        version: version
    }
};

// TODO: share 안된 사람이 날린 쿼리는 무시해야하지 않을까요?
