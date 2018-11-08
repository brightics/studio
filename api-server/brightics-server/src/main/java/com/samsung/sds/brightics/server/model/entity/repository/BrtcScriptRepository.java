package com.samsung.sds.brightics.server.model.entity.repository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.sds.brightics.server.model.entity.BrtcScript;

@RepositoryRestResource(path = "script")
public interface BrtcScriptRepository extends BrtcRepository<BrtcScript, String> {

}
