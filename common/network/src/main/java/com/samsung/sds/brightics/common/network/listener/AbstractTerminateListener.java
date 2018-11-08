package com.samsung.sds.brightics.common.network.listener;

import com.samsung.sds.brightics.common.network.sender.SenderManager;

/**
 * This abstract class is superclass of terminate listener classes 
 * which listen client terminated signal.
 * 
 * @author hk.im
 *
 */
abstract public class AbstractTerminateListener {

	public void terminate(String clientId) {
		SenderManager.removeSender(clientId);
		clientTerminated(clientId);
	};

	abstract public void clientTerminated(String clientId);
}
