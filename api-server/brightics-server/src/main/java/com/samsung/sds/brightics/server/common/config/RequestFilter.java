package com.samsung.sds.brightics.server.common.config;
import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;

@Component
public class RequestFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        try (MDC.MDCCloseable closable = MDC.putCloseable("user", AuthenticationUtil.getRequestUserId())) {
            chain.doFilter(req, res);
        }
    }
    @Override
    public void destroy() {
    }
}