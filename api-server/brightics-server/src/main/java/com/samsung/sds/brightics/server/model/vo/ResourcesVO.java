package com.samsung.sds.brightics.server.model.vo;

public class ResourcesVO {
	
	private int worker;
	
	private int totalCores;

	private int totalMemory;
	
	private int usedCores;
	
	private int usedMemory;

	public int getWorker() {
		return worker;
	}

	public void setWorker(int worker) {
		this.worker = worker;
	}

	public int getTotalCores() {
		return totalCores;
	}

	public void setTotalCores(int totalCores) {
		this.totalCores = totalCores;
	}

	public int getTotalMemory() {
		return totalMemory;
	}

	public void setTotalMemory(int totalMemory) {
		this.totalMemory = totalMemory;
	}

	public int getUsedCores() {
		return usedCores;
	}

	public void setUsedCores(int usedCores) {
		this.usedCores = usedCores;
	}

	public int getUsedMemory() {
		return usedMemory;
	}

	public void setUsedMemory(int usedMemory) {
		this.usedMemory = usedMemory;
	}

}
	
	
