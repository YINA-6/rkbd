package com.rkzt.service;

import com.rkzt.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;

    @Test
    public void test1(){
        User user = new User();
        user.setNickName("abc");

        System.out.println(userService.saveOrUpdate(user) ? "插入成功" : "失败");
    }

}
