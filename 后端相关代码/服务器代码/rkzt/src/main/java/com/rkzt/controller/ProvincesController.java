package com.rkzt.controller;

import com.rkzt.common.R;
import com.rkzt.entity.Provinces;
import com.rkzt.service.ProvincesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/provinces")
public class ProvincesController {
    @Autowired
    private ProvincesService provincesService;

    @GetMapping()
    public R<List<Provinces>> getInfo(){
        return R.success(provincesService.getInfo());
    }

    @GetMapping("/{id}")
    public R<Provinces> getOne(@PathVariable("id") Integer id){
        return R.success(provincesService.getOne(id));
    }

    /**
     * 修改一条记录
     * @param provinces
     * @return
     */
    @PostMapping
    public R<String> updateInfo(@RequestBody Provinces provinces){
        return provincesService.updateById(provinces)? R.success("成功") : R.error("失败");
    }

    /**
     * 根据id删除
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public R<String> deleteOne(@PathVariable("id") Integer id){
        return provincesService.removeById(id) ? R.success("成功") : R.error("失败");
    }
}
