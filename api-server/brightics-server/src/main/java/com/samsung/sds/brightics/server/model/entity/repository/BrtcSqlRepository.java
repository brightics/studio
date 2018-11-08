package com.samsung.sds.brightics.server.model.entity.repository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.sds.brightics.server.model.entity.BrtcSql;

@RepositoryRestResource(path = "sql")
public interface BrtcSqlRepository extends BrtcRepository<BrtcSql, String> {

}
