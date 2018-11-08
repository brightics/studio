package com.samsung.sds.brightics.server.model.entity.repository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.sds.brightics.server.model.entity.BrtcS3Datasource;

@RepositoryRestResource(path = "s3")
public interface BrtcS3DatasourceRepository extends BrtcRepository<BrtcS3Datasource, String> {

}
