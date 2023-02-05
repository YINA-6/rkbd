package com.rkzt.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties(prefix = "wechat" )
public class WeChatConfig {

    private String appid;
    private String secret;

}
