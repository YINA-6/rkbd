package com.rkzt.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rkzt.entity.Subject;
import com.rkzt.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SubjectMapper extends BaseMapper<Subject> {
}
