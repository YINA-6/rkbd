package com.rkzt.controller;

import com.rkzt.common.R;
import com.rkzt.dto.CategoryDto;
import com.rkzt.entity.Category;
import com.rkzt.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    /**
     * 获取所有
     * @return
     */
    @GetMapping()
    public R<List<Category>> getObj(){
        return R.success(categoryService.getObj());
    }

    /**
     * 获取Dto集合
     * @return
     */
    @GetMapping("/dto/{subject}")
    public R<List<CategoryDto>> getDto(@PathVariable("subject") Integer subject){
        return R.success(categoryService.getDto(subject));
    }


    /**
     * 新增 & 修改
     * @param category
     * @return
     */
    @PostMapping
    public R<Object> saveOrUp(@RequestBody  Category category){
        return categoryService.saveOrUpdate(category)? R.success(category) : R.error("失败");
    }

    /**
     * 根据id删除一条记录
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public R<String> deleteOne(@PathVariable("id") Integer id){
       return  categoryService.removeById(id)? R.success("成功") : R.error("失败");
    }


}
