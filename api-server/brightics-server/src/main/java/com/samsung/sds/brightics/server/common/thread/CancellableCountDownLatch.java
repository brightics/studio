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

package com.samsung.sds.brightics.server.common.thread;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class CancellableCountDownLatch {

	private final CountDownLatch latch;
	final List<Thread> waiters;
	boolean cancelled = false;

	public CancellableCountDownLatch(int count) {
		latch = new CountDownLatch(count);
		waiters = new ArrayList<Thread>();
	}

	public void await() throws InterruptedException {
		try {
			addWaiter();
			latch.await();
		} finally {
			removeWaiter();
		}
	}

	public boolean await(long timeout, TimeUnit unit) throws InterruptedException {
		try {
			addWaiter();
			return latch.await(timeout, unit);
		} finally {
			removeWaiter();
		}
	}

	private synchronized void addWaiter() throws InterruptedException {
		if (cancelled) {
			Thread.currentThread().interrupt();
			throw new InterruptedException("Latch has already been cancelled");
		}
		waiters.add(Thread.currentThread());
	}

	private synchronized void removeWaiter() {
		waiters.remove(Thread.currentThread());
	}

	public void countDown() {
		latch.countDown();
	}

	public synchronized void cancel() {
		if (!cancelled) {
			cancelled = true;
			for (Thread waiter : waiters) {
				waiter.interrupt();
			}
			waiters.clear();
		}
	}

	public long getCount() {
		return latch.getCount();
	}

	@Override
	public String toString() {
		return latch.toString();
	}

}
