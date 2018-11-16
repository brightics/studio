package com.samsung.sds.brightics.agent.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.ByteBuffer;

import org.junit.Test;

import com.google.protobuf.ByteString;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage;
import com.samsung.sds.brightics.common.network.proto.stream.WriteMessage;
import com.samsung.sds.brightics.common.network.server.NetworkServer;

public class StreamServiceTest {

	
	private final ByteBuffer itemBuffer = ByteBuffer.allocate(NetworkServer.MAXIMUM_MESSAGE_SIZE);
	private int pendingItems = 0;


	@Test
	public void uploadFileTest() {
		try {
			String parameter = "{\"delimiter\":\",\",\"columntype\":\"String,String,String,String,String,String,String,String,String,Double,Double,Double,Double,Double,Double,String\",\"columnname\":\"SALES_LEVEL,SALES_ID,ITEM_ID,START_DATE,END_DATE,START_YEAR,START_WEEK,END_YEAR,END_WEEK,S_PROMO_BNC_VALUE,S_PROMO_BUNDLE_VALUE,S_PROMO_CASHBACK_VALUE,S_PROMO_FLYER_VALUE,S_PROMO_TV_VALUE,S_PROMO_DMD_INQ_VALUE,DATASET\"}";
//			String parameter = "{\"delimiter\":\",\",\"columntype\":\"Double,Double,Double,Double,String\",\"columnname\":\"a,b,c,d,e\"}";
			WriteMessage initMessage = WriteMessage.newBuilder().setPath("test001").setUser("admin")
					.setParameters(parameter).build();
			StreamService.initWriteData("test00001", initMessage);
			FileInputStream fileInputStream = new FileInputStream(new File("ODS_S_PROMO"));
//			FileInputStream fileInputStream = new FileInputStream(new File("iris.csv"));
			BufferedReader lineBuffer = new BufferedReader(new InputStreamReader(fileInputStream));
			String line = null;
			lineBuffer.readLine();
			while ((line = lineBuffer.readLine()) != null) {
				addAndSendJunked(line + "\n");
			}
			if (pendingItems > 0) {
				sendData();
			}
			
			System.out.println("test");
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	

	public void addAndSendJunked(String data) {
		byte[] dataBytes = data.getBytes();
		final int dataLength = dataBytes.length;

		final int newSize = itemBuffer.position() + dataLength;
		if (newSize >= NetworkServer.MAXIMUM_MESSAGE_SIZE) {
			System.out.println(itemBuffer.position());
			sendData();
		}

		if (dataLength > NetworkServer.MAXIMUM_MESSAGE_SIZE) {
			// Size of single row exceeds maximum size
			throw new BrighticsCoreException("4410");
		}
		itemBuffer.put(dataBytes);
		
		pendingItems++;
	}

	public void sendData() {
		if (itemBuffer.position() == 0) {
			return;
		}
		itemBuffer.flip();
		int length = itemBuffer.limit();
		byte[] data = new byte[length];
		itemBuffer.get(data);
		try {
			System.out.println("send!!!");
			ByteStreamMessage build = ByteStreamMessage.newBuilder().setTempKey("")
			.setData(ByteString.copyFrom(data)).build();
			
			System.out.println("testtest1 :" + itemBuffer.position());
			System.out.println("testtest2 :" + build.toByteArray().length);
			
			StreamService.writeData("test00001", ByteString.copyFrom(data));
			itemBuffer.clear();
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}
	
}


