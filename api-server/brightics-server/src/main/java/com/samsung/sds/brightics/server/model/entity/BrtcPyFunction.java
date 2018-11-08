package com.samsung.sds.brightics.server.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.Data;

@Data
@Entity
public class BrtcPyFunction {
    @Id
    @NotEmpty
    private String scriptId;
    
    @Column(columnDefinition="text")
    private String script;
}
