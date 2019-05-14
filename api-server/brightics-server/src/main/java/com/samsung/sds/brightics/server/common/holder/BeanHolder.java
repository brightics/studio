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

package com.samsung.sds.brightics.server.common.holder;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import com.samsung.sds.brightics.server.common.message.MessageManagerProvider;
import com.samsung.sds.brightics.server.service.DataService;
import com.samsung.sds.brightics.server.service.DataSourceService;
import com.samsung.sds.brightics.server.service.JobStatusService;
import com.samsung.sds.brightics.server.service.MetadataConverterService;
import com.samsung.sds.brightics.server.service.PyFunctionService;
import com.samsung.sds.brightics.server.service.TaskService;

@Component
public final class BeanHolder implements ApplicationContextAware {

	@Autowired
	public JobStatusService jobStatusService;

	@Autowired
	public DataSourceService dataSourceService;

	@Autowired
	public TaskService taskService;

	@Autowired
	public MessageManagerProvider messageManager;

	@Autowired
	public DataService dataService;

	@Autowired
	public PyFunctionService pyFunctionService;

	@Autowired
	public MetadataConverterService metadataConverterService;

	private BeanHolder() {

	}

	private static final ThreadLocal<BeanHolder> serviceBeanHolder = new InheritableThreadLocal<>();

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		serviceBeanHolder.set(applicationContext.getBean(this.getClass()));
	}

	public static BeanHolder getBeanHolder() {
		Assert.notNull(serviceBeanHolder.get(), "beanHolder has not been initialized");
		return serviceBeanHolder.get();
	}

}