package com.rkzt.dto;

import lombok.Data;

@Data
public class Code2SessionDto {

    private String session_key;		// 会话密钥
    private String openid;		// 用户唯一标识

}
