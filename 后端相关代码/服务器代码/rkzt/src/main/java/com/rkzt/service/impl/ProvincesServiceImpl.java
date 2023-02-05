package com.rkzt.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rkzt.entity.Provinces;
import com.rkzt.entity.Storage;
import com.rkzt.mapper.ProvincesMapper;
import com.rkzt.mapper.StorageMapper;
import com.rkzt.service.ProvincesService;
import com.rkzt.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class ProvincesServiceImpl extends ServiceImpl<ProvincesMapper, Provinces> implements ProvincesService {
    @Autowired
    private ProvincesMapper provincesMapper;

    public List<Provinces> getInfo(){
        return provincesMapper.selectList(null);
    }


    public Provinces getOne(Integer id){
        LambdaQueryWrapper<Provinces> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Provinces::getId,id);
        return provincesMapper.selectOne(lqw);
    }


}
