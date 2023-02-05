package com.rkzt.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.rkzt.common.R;
import com.rkzt.entity.Subject;
import com.rkzt.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/subject")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    /**
     * 获取表单信息
     * @return
     */
    @GetMapping()
    public R<List<Subject>> getAllInfo(){
        return R.success(subjectService.list());
    }

    @GetMapping("/level/{level}")
    public R<List<Subject>> getBylevel(@PathVariable("level") Integer level){
        LambdaQueryWrapper<Subject> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Subject::getLevel,level);
        return R.success(subjectService.list(queryWrapper));
    }


}


