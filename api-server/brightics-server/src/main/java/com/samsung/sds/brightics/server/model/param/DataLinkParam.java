package com.samsung.sds.brightics.server.model.param;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DataLinkParam {

    List<DataLink> links;

    @Data
    public static class DataLink {
        String source;
        String alias;
    }
}
