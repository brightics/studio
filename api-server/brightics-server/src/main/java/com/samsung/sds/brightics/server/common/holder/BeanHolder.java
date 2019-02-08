package com.samsung.sds.brightics.server.common.holder;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import com.samsung.sds.brightics.server.common.message.MessageManagerProvider;
import com.samsung.sds.brightics.server.service.DataService;
import com.samsung.sds.brightics.server.service.DatabaseService;
import com.samsung.sds.brightics.server.service.JobStatusService;
import com.samsung.sds.brightics.server.service.MetadataConverterService;
import com.samsung.sds.brightics.server.service.PyFunctionService;
import com.samsung.sds.brightics.server.service.TaskService;

@Component
public final class BeanHolder implements ApplicationContextAware {

	@Autowired
	public JobStatusService jobStatusService;

	@Autowired
	public DatabaseService databaseService;

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
