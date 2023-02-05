package com.rkzt.controller;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rkzt.common.R;
import com.rkzt.entity.User;
import com.rkzt.service.UserService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 查询所有
     * @return
     */
    @GetMapping()
    public R<List<User>> getAll(){
        return R.success(userService.list());
    }

    /**
     * 分页查询
     * @param page
     * @param pageSize
     * @return
     */
    @GetMapping("/page")
    public R<Page> page(int page, int pageSize){
        //分页构造器
        Page<User> pageInfo = new Page<>(page,pageSize);
        //条件构造器
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        //添加排序条件，根据sort进行排序
        queryWrapper.orderByAsc(User::getCreateTime);

        //分页查询
        userService.page(pageInfo,queryWrapper);
        return R.success(pageInfo);
    }

    /**
     * 根据openId查询
     * @param openid
     * @return
     */
    @GetMapping("/{openid}")
    public R<User> getUserInfo(@PathVariable("openid") @NotNull String openid){
        return R.success(userService.getById(openid));

    }

    /**
     * 保存一个用户
     * @param user
     * @return
     */
    @PostMapping()
    public R<Map> saveUserInfo(@RequestBody User user){
        if(user.getOpenId() == null){
            return R.error("openid必须填写");
        }
        if (userService.saveOrUpdate(user)) {
            LocalDateTime time = user.getUpdateTime();
            HashMap<String, Object> map = new HashMap<>();
            map.put("updateTime",time);
            return R.success(map);
        }else
        {
            return R.error("失败");
        }

    }



    /**
     * 删除一个用户记录
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public R<String> deleteOne(@PathVariable("id") Integer id){
        return userService.removeById(id)? R.success("成功") : R.error("失败");
    }



}
