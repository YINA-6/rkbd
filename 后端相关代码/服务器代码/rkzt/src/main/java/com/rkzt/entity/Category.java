package com.rkzt.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Category {
    private Integer id;
    private String categoryName;
}
