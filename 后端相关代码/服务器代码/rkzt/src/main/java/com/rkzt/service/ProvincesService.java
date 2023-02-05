package com.rkzt.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.rkzt.entity.Provinces;
import com.rkzt.entity.Storage;

import java.util.List;

public interface ProvincesService extends IService<Provinces>  {

    List<Provinces> getInfo();
    Provinces getOne(Integer id);
}
