package com.samsung.sds.brightics.common.core.test;

import org.junit.Test;

import com.samsung.sds.brightics.common.core.legacy.exception.BrighticsLegacyException;
import static org.assertj.core.api.Assertions.assertThat;

public class LegacyFunctionExceptionTest {

	@Test
	public void functionLabelTest() {
		BrighticsLegacyException ble = new BrighticsLegacyException("0002", "alsRecommend", new String[]{"hold-cols","item-col" });
		String message = ble.getMessage();
		assertThat(message).isEqualTo("The data types of 'Hold Columns' columns must be Item Column.");
	}

	
}
