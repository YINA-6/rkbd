package com.rkzt.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rkzt.entity.Subject;
import com.rkzt.mapper.SubjectMapper;
import com.rkzt.mapper.UserMapper;
import com.rkzt.service.SubjectService;
import com.rkzt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubjectServiceImpl extends ServiceImpl<SubjectMapper, Subject> implements SubjectService {

}
