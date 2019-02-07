package com.samsung.sds.brightics.server.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.samsung.sds.brightics.server.service.FunctionMetaService;

@RunWith(SpringRunner.class)
@SpringBootTest
@WebMvcTest(FunctionMetaController.class)
public class FunctionMetaControllerTest {

	@Autowired
	private MockMvc mvc;

	@MockBean
	private FunctionMetaService functionMetaService;

	@Test
	public void getFunctionMetaList() throws Exception {
		MvcResult mvcResult  = mvc.perform(MockMvcRequestBuilders.get("").accept(MediaType.APPLICATION_JSON_VALUE))
				.andReturn();
		MockHttpServletResponse response = mvcResult.getResponse();
		System.out.println(response.getStatus());
		System.out.println(response.getContentAsString());		
		
	}

}
