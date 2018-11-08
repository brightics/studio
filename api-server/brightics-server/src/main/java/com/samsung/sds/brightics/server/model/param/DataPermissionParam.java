package com.samsung.sds.brightics.server.model.param;

import com.samsung.sds.brightics.common.core.acl.Permission;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DataPermissionParam {

    private Permission permission;
    private List<TargetDataKey> dataKeys;

    @Data
    public static class TargetDataKey {
        private String mid;
        private String tid;
    }
}
