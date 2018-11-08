package com.samsung.sds.brightics.server.common.util;

import org.apache.commons.lang3.StringUtils;

public abstract class AgentCommandUtil {
	public static class START extends AgentCommandUtil {
		@Override
		public String getShellCommand() {
			return "start";
		}
		@Override
		public String toPlainCommandString() {
			return  stringJoin(
				this.getShellCommand(),
				this.getName(),
				this.getPort(),
				this.getCores(),
				this.getMemPerNode()
				);
		}
	}
	public static class STOP extends AgentCommandUtil {
		@Override
		public String getShellCommand() {
			return "stop";
		}
		
		@Override
		public String toPlainCommandString() {
			return stringJoin(
				this.getShellCommand(),
				this.getName()
				);
		}
		
	}
	
	private String name;
	private String port;
	private String cores;
	private String memPerNode;
	
	public AgentCommandUtil() {}
	public AgentCommandUtil(String name, String port, int cores, String memPerNode) {
		this.name = name;
		this.port = port;
		this.cores = String.valueOf(cores);
		this.memPerNode = memPerNode;
	}
	
	public String getName() {
		return name;
	}
	public AgentCommandUtil setName(String name) {
		this.name = name;
		return this;
	}
	public String getPort() {
		return port;
	}
	public AgentCommandUtil setPort(String port) {
		this.port = port;
		return this;
	}
	public String getCores() {
		return cores;
	}
	public AgentCommandUtil setCores(int cores) {
		this.cores = String.valueOf(cores);
		return this;
	}
	public String getMemPerNode() {
		return memPerNode;
	}
	public AgentCommandUtil setMemPerNode(String memPerNode) {
		this.memPerNode = memPerNode;
		return this;
	}
	public AgentCommandUtil setMemInGB(int memPerNode) {
		this.memPerNode = memPerNode + "G";
		return this;
	}
	public AgentCommandUtil setMemInMB(int memPerNode) {
		this.memPerNode = memPerNode + "M";
		return this;
	}
	
	@Override
	public String toString() {
		return  stringJoin(
				this.name,
				this.port,
				this.cores,
				this.memPerNode
				);
	}
	
	private static String stringJoin(String...strs) {
		return StringUtils.join(strs, " ");
	}
	
	public abstract String getShellCommand();
	public abstract String toPlainCommandString();
}
