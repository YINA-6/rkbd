package com.rkzt.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rkzt.dto.CategoryDto;
import com.rkzt.entity.Category;
import com.rkzt.entity.Storage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category>  {

    /**
     * 自定义sql
     */

    @Select("SELECT s.category_id, category_name,count(*) as `number` from `storage` s, category c\n" +
            "where s.category_id = c.id and s.subject = #{subject}\n" +
            "GROUP BY c.id;")
    List<CategoryDto> getDto(Integer subject);
}
