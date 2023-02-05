package com.rkzt.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rkzt.entity.Storage;
import com.rkzt.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
