package org.dromara.portal;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.metrics.buffering.BufferingApplicationStartup;

/**
 * 门户服务
 */
@EnableDubbo
@SpringBootApplication
public class RuoYiPortalApplication {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(RuoYiPortalApplication.class);
        application.setApplicationStartup(new BufferingApplicationStartup(2048));
        application.run(args);
        System.out.println("(♥◠‿◠)ﾉﾞ  门户服务模块启动成功   ლ(´ڡ`ლ)ﾞ");
    }
}
