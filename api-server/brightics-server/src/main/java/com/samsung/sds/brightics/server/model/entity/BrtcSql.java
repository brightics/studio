package com.samsung.sds.brightics.server.model.entity;

import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Data;

@Data
@Entity
public class BrtcSql {
    @Id
    @NotEmpty
    private String sqlId;
    
    @Column(columnDefinition="text")
    private String sql;
    
    @Transient
    @JsonProperty(access = Access.WRITE_ONLY)
    String datasource;

    @Transient
    @JsonProperty(access = Access.WRITE_ONLY)
    Map<String,Object> condition;
}
