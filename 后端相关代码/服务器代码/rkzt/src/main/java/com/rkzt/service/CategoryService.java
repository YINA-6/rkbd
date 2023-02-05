package com.rkzt.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.rkzt.dto.CategoryDto;
import com.rkzt.entity.Category;
import com.rkzt.entity.Storage;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface CategoryService extends IService<Category>  {


    List<CategoryDto> getDto(Integer subject);

    List<Category> getObj();
}
