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

package com.samsung.sds.brightics.server.common.util;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;

public class AuthenticationUtil {
    
	//return session userId, session is null return admin
	public static String getRequestUserId(){
	    String user = (String) ThreadLocalContext.get("user");
	    if(user != null){
	        return user;
	    }else{
    		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    		if (!(authentication instanceof AnonymousAuthenticationToken)
    				&& authentication!= null && 
    				StringUtils.isNoneBlank(authentication.getName())) {
    		    String currentUserName = authentication.getName();
    		    return currentUserName;
    		} else {
    			return "guest";
    		}
	    }
	}

}
