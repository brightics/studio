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
