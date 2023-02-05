package com.rkzt.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rkzt.entity.Storage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.omg.PortableInterceptor.Interceptor;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Mapper
public interface StorageMapper extends BaseMapper<Storage> {
    /**
     * 使用BaseMapper加速开发基础CRUD
     */

    /**
     * 自定义sql
     */
    @Select("SELECT DISTINCT LEFT(qid,5) as 'yearList' FROM `storage` where subject = #{subject}")
    List<String> selectYearList(Integer subject);

    @Select("SELECT * from `storage` where subject = #{subject} ORDER BY rand() LIMIT #{number} ;")
    List<Storage> getRand(@Param("number") Integer number, @Param("subject") Integer subject);

}
