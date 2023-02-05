package com.rkzt.controller;

import com.alibaba.fastjson2.JSONObject;
import com.rkzt.common.R;
import com.rkzt.dto.Code2SessionDto;
import com.rkzt.entity.WeChatConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/wx")
public class WeChatController {

    @Autowired
    private WeChatConfig weChatConfig;

    // 手动创建对象
    RestTemplate restTemplate = new RestTemplate();
    Code2SessionDto  code2SessionDto = new Code2SessionDto();


    /**
     * 通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程
     * @param code
     * @return session_key  会话密钥，openid  用户唯一标识
     */
    @GetMapping("/login/{code}")
    public R<Code2SessionDto> code2session(@PathVariable("code") String code){
        System.out.println("wx-login 接受到请求：code = "+ code);
        // wx获取账号信息的HTTPS
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid={appid}&secret={secret}&js_code={code}&grant_type=authorization_code";

        // 封装Map,用作url参数填充
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("appid", weChatConfig.getAppid());
        requestMap.put("secret", weChatConfig.getSecret());
        requestMap.put("code", code);

        // 发起网络请求
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class, requestMap);
        // 转JSON对象
        JSONObject jsonObject = JSONObject.parseObject(responseEntity.getBody());
        // 封装返回对象
        code2SessionDto.setSession_key(jsonObject.getString("session_key"));
        code2SessionDto.setOpenid(jsonObject.getString("openid"));

        return  R.success(code2SessionDto);

    }
}
