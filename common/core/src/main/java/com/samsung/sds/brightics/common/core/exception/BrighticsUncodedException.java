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

package com.samsung.sds.brightics.common.core.exception;

/**
 * This exception class is used to pass only messages without code.
 * use case
 * #1. when run function fail. combine multiple exception message to on message and send. 
 * #2. when server receive fail result from agent. result don't have code or parameters.
 */
public class BrighticsUncodedException extends AbsBrighticsException {
	
	private static final long serialVersionUID = -1509602533254552744L;

	public BrighticsUncodedException(String message) {
		super.message = message;
	}

	public BrighticsUncodedException(String message, String detailedCause) {
		super.message = message;
		super.detailedCause = detailedCause;
	}

}
