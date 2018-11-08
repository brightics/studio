package com.samsung.sds.brightics.server.model.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AgentStartVO {
    private boolean isStart;
    private String agentId;
    private String message;
}