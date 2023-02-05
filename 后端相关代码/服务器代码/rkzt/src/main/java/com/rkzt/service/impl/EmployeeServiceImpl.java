package com.rkzt.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rkzt.entity.Employee;
import com.rkzt.mapper.EmployeeMapper;
import com.rkzt.service.EmployeeService;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl extends ServiceImpl<EmployeeMapper, Employee> implements EmployeeService {


}
