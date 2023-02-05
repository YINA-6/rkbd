package com.rkzt.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rkzt.mapper.StorageMapper;
import com.rkzt.service.StorageService;
import com.rkzt.entity.Storage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class StorageServiceImpl extends ServiceImpl<StorageMapper, Storage> implements StorageService {
    @Autowired
    private StorageMapper storageMapper;


    public List<String> getYearList(Integer subject){
        return storageMapper.selectYearList(subject);
    }

    public List<Storage> getRand(Integer number, Integer subject){
        return storageMapper.getRand(number, subject);
    }


}
