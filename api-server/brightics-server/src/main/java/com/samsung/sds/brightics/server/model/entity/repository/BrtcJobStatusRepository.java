package com.samsung.sds.brightics.server.model.entity.repository;

import java.util.List;

import com.samsung.sds.brightics.server.model.entity.BrtcJobStatus;

public interface BrtcJobStatusRepository extends BrtcRepository<BrtcJobStatus, String> {
    public List<BrtcJobStatus> findByUserOrderByStartTime(String user);
}
