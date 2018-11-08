package com.samsung.sds.brightics.server.model.entity.repository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.sds.brightics.server.model.entity.BrtcPyFunction;

@RepositoryRestResource(path = "pyfunction")
public interface BrtcPyFunctionRepository extends BrtcRepository<BrtcPyFunction, String> {

}
