package com.samsung.sds.brightics.server.model.entity.repository;

import java.util.List;

import com.samsung.sds.brightics.server.model.entity.BrtcJobModel;

public interface BrtcJobModelRepository extends BrtcRepository<BrtcJobModel, String> {
    public List<BrtcJobModel> findByMain(String main);
}
