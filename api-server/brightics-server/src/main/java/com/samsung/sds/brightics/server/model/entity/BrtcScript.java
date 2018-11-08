package com.samsung.sds.brightics.server.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.validator.constraints.NotEmpty;

import lombok.Data;

@Data
@Entity
public class BrtcScript {
    @Id
    @NotEmpty
    private String scriptId;

    private String label;

    private String context;

    @Column(columnDefinition = "text")
    private String script;

}
