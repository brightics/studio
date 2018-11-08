package com.samsung.sds.brightics.server.model.param;

import com.samsung.sds.brightics.server.model.entity.BrtcDatasources;
import com.samsung.sds.brightics.server.model.entity.BrtcSql;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SqlWithConditionParam {
    BrtcSql sql;
    BrtcDatasources datasource;
}
