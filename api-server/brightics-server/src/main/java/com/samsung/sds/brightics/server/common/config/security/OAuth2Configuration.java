package com.samsung.sds.brightics.server.common.config.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.authentication.TokenExtractor;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableWebSecurity
@EnableResourceServer
public class OAuth2Configuration extends ResourceServerConfigurerAdapter {

    @Autowired 
    private TokenExtractor tokenExtractor;
    @Autowired
    private ResourceServerTokenServices tokenService;

    String[] webConnect = { "/api/**", "/docs", "/workflow/**", "/admin/**", "/datasources/**", "/datastructure/**", "/data/**", "/chart/**" };
    String[] staticResourses = { "/api/v2/repo/file/**","/", "/auth", "/views/**", "/static/**", "/fonts/**", "/font/**"
    		, "/swagger/**", "/v2/api-docs", "/js/**", "/css/**" };
    String[] modelerApis = {"/admin/**","/datasources","/datasources/**","/datasource/**"
    		,"/data/**","/chart/**","/workflow/**","/api/data/**","/api/agentUser/**", "/datastructure", "/datastructure/**", "/udf/**"};

    @Override
    public void configure(ResourceServerSecurityConfigurer config) throws Exception {
        config
                .tokenExtractor(tokenExtractor)
                .tokenServices(tokenService).stateless(false);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.addFilterAfter(new OncePerRequestFilter() {

            @Override
            protected void doFilterInternal(HttpServletRequest request,
                    HttpServletResponse response, FilterChain filterChain)
                    throws ServletException, IOException {
                // We don't want to allow access to a resource with no token so clear
                // the security context in case it is actually an OAuth2Authentication
                String authHeader = request.getHeader("Authorization");
                if (authHeader != null) {
                    //auth request, always clear security context
//                    SecurityContextHolder.clearContext();
                    request.getSession().invalidate();
                } else {
                    // no auth header
                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    if (auth != null && auth.getDetails() != null && "no_session".equals(auth.getDetails().toString())) {
                        // authenticate per requests(oauth2)
//                        SecurityContextHolder.clearContext();
                        request.getSession().invalidate();
                    }
                }
                filterChain.doFilter(request, response);
            }
        }, AbstractPreAuthenticatedProcessingFilter.class);
        
        //TODO MUST REMOVE THIS FILTER. THIS IS CURRENTLY IMPLEMENTED AS AVOIDING AUTH FILTER.
        //        http.addFilterBefore(new OncePerRequestFilter() {
        //            @Override
        //            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //                TemporaryAuthorizedHttpServletRequest mutableRequest = new TemporaryAuthorizedHttpServletRequest(request);
        //                filterChain.doFilter(mutableRequest, response);
        //            }
        //        }, AbstractPreAuthenticatedProcessingFilter.class);

        http.authorizeRequests()
                .antMatchers(staticResourses).permitAll()
                .antMatchers(modelerApis).permitAll()
                .anyRequest().authenticated()
                .and().securityContext().securityContextRepository(new HttpSessionSecurityContextRepository())
                .and().sessionManagement()
                .and().csrf().disable();

        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }

    //    final class TemporaryAuthorizedHttpServletRequest extends HttpServletRequestWrapper {
    //
    //        private final String authHeaderName = "Authorization";
    //        private final String tempBasicAuthToken = "Bearer";
    //        
    //        public TemporaryAuthorizedHttpServletRequest(HttpServletRequest request) {
    //            super(request);
    //        }
    //        
    //        private HttpServletRequest originRequest(){
    //            return (HttpServletRequest) getRequest();
    //        }
    //        
    //        @Override
    //        public String getHeader(String name) {
    //            String v = originRequest().getHeader(name);
    //            if(v == null && authHeaderName.equals(name)){
    //                return tempBasicAuthToken;
    //            }else{
    //                return v;
    //            }
    //        }
    //        
    //        @Override
    //        public Enumeration<String> getHeaders(String name) {
    //            Enumeration<String> e = originRequest().getHeaders(name);
    //            if(!e.hasMoreElements() && authHeaderName.equals(name)){
    //                Set<String> s = new HashSet<>();
    //                s.add(tempBasicAuthToken);
    //                return Collections.enumeration(s);
    //            }else{
    //                return e;
    //            }
    //        }
    //    }
}
