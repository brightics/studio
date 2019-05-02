/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

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
