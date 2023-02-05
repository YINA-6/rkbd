package com.rkzt.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.rkzt.entity.Storage;

import java.util.List;

public interface StorageService extends IService<Storage> {
    /**
     * 对外提供的操作
     */


    List<String> getYearList(Integer num);

    List<Storage> getRand(Integer number, Integer subject);


}
