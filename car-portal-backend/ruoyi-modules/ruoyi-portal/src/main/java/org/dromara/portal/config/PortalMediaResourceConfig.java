package org.dromara.portal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class PortalMediaResourceConfig implements WebMvcConfigurer {

    @Value("${portal.media.local-dir:/Users/mac/Desktop/video}")
    private String mediaLocalDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path mediaPath = Paths.get(mediaLocalDir).toAbsolutePath().normalize();
        String location = mediaPath.toUri().toString();
        registry.addResourceHandler("/media/**")
            .addResourceLocations(location);
    }
}

