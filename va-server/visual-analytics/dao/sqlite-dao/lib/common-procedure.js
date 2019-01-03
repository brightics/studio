var common = require('./common');
var query = common.query;

const DDL_PROCEDURE_PROJECT_AUDIT = {
    CHECK: "SELECT * FROM pg_proc WHERE proname = 'brtc_process_project_audit'",
    CREATE: "" +
    "CREATE OR REPLACE FUNCTION brtc_process_project_audit() RETURNS TRIGGER AS $BODY$ \n" +
    "    BEGIN \n" +
    "        IF (TG_OP = 'DELETE') THEN \n" +
    "            DELETE FROM brtc_user_resource_role WHERE resource_type='project' AND resource_id = OLD.id; \n" +
    "            DELETE FROM brtc_file WHERE project_id = OLD.id; \n" +
    "            RETURN OLD; \n" +
    "        END IF; \n" +
    "        RETURN NULL; \n" +
    "    END; \n" +
    "$BODY$ LANGUAGE plpgsql"
};

//TODO brtc_user --> brtc_user_view
const DDL_PROCEDURE_USER_AUDIT = {
    CHECK: "SELECT * FROM pg_proc WHERE proname = 'brtc_process_user_audit'",
    CREATE: "" +
    "CREATE OR REPLACE FUNCTION brtc_process_user_audit() RETURNS TRIGGER AS $BODY$ \n" +
    "    BEGIN \n" +
    "        IF (TG_OP = 'INSERT') THEN \n" +
    "            INSERT INTO brtc_user_resource_role (user_id, resource_type, resource_id, role_id, create_time) VALUES (NEW.id, 'management', 'N/A', 'role_10103', now()); \n" +
    "            RETURN NEW; \n" +
    "        ELSIF (TG_OP = 'DELETE') THEN \n" +
    "            /* 삭제 사용자와 관련된 role 삭제 */ \n" +
    "            DELETE FROM brtc_user_resource_role WHERE user_id = OLD.id; \n" +
    "" +
    "            /* 삭제 사용자가 소유한 프로젝트에 관련된 멤버가 없다면 프로젝트 삭제 */ \n" +
    "            DELETE FROM brtc_project \n" +
    "             WHERE creator = OLD.id \n" +
    "               AND id NOT IN (SELECT rr.resource_id \n" +
    "                                FROM brtc_user_resource_role rr, brtc_role r \n" +
    "                               WHERE rr.resource_id = id \n" +
    "                                 AND rr.role_id = r.role_id \n" +
    "                                 AND r.role_category = 'role_proj_member'); \n" +
    "" +
    "            /* 삭제 사용자가 소유하던 프로젝트를 다른 멤버에게 이전 */ \n" +
    "            UPDATE brtc_project \n" +
    "               SET creator = (SELECT rr.user_id \n" +
    "                                FROM brtc_user_resource_role rr, brtc_role r \n" +
    "                               WHERE rr.user_id <> creator \n" +
    "                                 AND rr.resource_id = id \n" +
    "                                 AND rr.role_id = r.role_id \n" +
    "                                 AND r.role_category = 'role_proj_member' \n" +
    "                               ORDER BY rr.role_id \n" +
    "                               LIMIT 1) \n" +
    "             WHERE creator = OLD.id; \n" +
    "" +
    "            /* 새로운 프로젝트 소유자에게 할당된 이전 프로젝트 권한은 남겨둘 필요가 없음 */ \n" +
    "            DELETE FROM brtc_user_resource_role \n" +
    "             WHERE (resource_id, user_id) IN (SELECT id, creator FROM brtc_project) \n" +
    "               AND role_id IN (SELECT role_id FROM brtc_role WHERE role_category = 'role_proj_member'); \n" +
    "" +
    "            RETURN OLD; \n" +
    "        END IF; \n" +
    "        RETURN NULL; \n" +
    "    END; \n" +
    "$BODY$ LANGUAGE plpgsql"
};
const DDL_TRIGGER_PROJECT_AUDIT = {
    CHECK: "SELECT * FROM pg_trigger WHERE tgname = 'brtc_project_audit'",
    CREATE: "CREATE TRIGGER brtc_project_audit AFTER INSERT OR UPDATE OR DELETE ON brtc_project FOR EACH ROW EXECUTE PROCEDURE brtc_process_project_audit()"
};
const DDL_TRIGGER_USER_AUDIT = {
    CHECK: "SELECT * FROM pg_trigger WHERE tgname = 'brtc_user_audit'",
    CREATE: "CREATE TRIGGER brtc_user_audit AFTER INSERT OR UPDATE OR DELETE ON brtc_user FOR EACH ROW EXECUTE PROCEDURE brtc_process_user_audit()"
};

module.exports = {
    procedure: {
        checkSchema: function (errCallback, doneCallback) {
            query(DDL_PROCEDURE_PROJECT_AUDIT.CHECK, [], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_PROCEDURE_PROJECT_AUDIT.CREATE, [], errCallback, function () {
                        query(DDL_TRIGGER_PROJECT_AUDIT.CREATE, [], errCallback);
                    });
                } else {
                    query(DDL_TRIGGER_PROJECT_AUDIT.CHECK, [], errCallback, function (result) {
                        if (result.length === 0) {
                            query(DDL_TRIGGER_PROJECT_AUDIT.CREATE, [], errCallback);
                        }
                    });
                }
            });

            query(DDL_PROCEDURE_USER_AUDIT.CHECK, [], errCallback, function (result) {
                if (result.length === 0) {
                    query(DDL_PROCEDURE_USER_AUDIT.CREATE, [], errCallback, function () {
                        query(DDL_TRIGGER_USER_AUDIT.CREATE, [], errCallback);
                    });
                } else {
                    query(DDL_TRIGGER_USER_AUDIT.CHECK, [], errCallback, function (result) {
                        if (result.length === 0) {
                            query(DDL_TRIGGER_USER_AUDIT.CREATE, [], errCallback);
                        }
                    });
                }
            });
        }
    }
};
