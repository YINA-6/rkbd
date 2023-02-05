package com.rkzt.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rkzt.dto.CategoryDto;
import com.rkzt.entity.Category;
import com.rkzt.mapper.CategoryMapper;
import com.rkzt.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {
    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategoryDto> getDto(Integer subject){
        return categoryMapper.getDto(subject);
    }

    public List<Category> getObj(){
        return categoryMapper.selectList(null);
    }

}
