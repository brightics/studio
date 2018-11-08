package com.samsung.sds.brightics.server.model.param;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper=false)
public class StreamKafkaParam {
	
	String topic;
	String originTopic;
	int partitions;
	int replication;

}
