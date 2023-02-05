package com.rkzt.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.rkzt.common.R;
import com.rkzt.entity.Storage;
import com.rkzt.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    /**
     * 查询全部数据
     * @return
     */
    @GetMapping()
    public R<List<Storage>> getAll(){
        return R.success(storageService.list());
    }

    /**
     * 根据科目获取题目
     * @param num
     * @return
     */
    @GetMapping("/subject/{num}")
    public R<List<Storage>> getBySubject(@PathVariable("num") Integer num){
        LambdaQueryWrapper<Storage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Storage::getSubject, num);
        return R.success(storageService.list(queryWrapper));
    }


    /**
     * 分页查询
     * @param page
     * @param pageSize
     * @return
     */
    @GetMapping("/page")
    public R<Page> page(int page, int pageSize){
        //分页构造器
        Page<Storage> pageInfo = new Page<>(page,pageSize);
        //条件构造器
        LambdaQueryWrapper<Storage> queryWrapper = new LambdaQueryWrapper<>();
        //添加排序条件，根据sort进行排序
        queryWrapper.orderByAsc(Storage::getId);

        //分页查询
        storageService.page(pageInfo,queryWrapper);
        return R.success(pageInfo);
    }

    /**
     * 根据IDs查询
     * @param ids
     * @return
     */
    @GetMapping("/{ids}")
    public R<List<Storage>> getQuestionById(@PathVariable("ids") String ids){
        List<Integer> list  = new ArrayList<>();
        String[] strings = ids.split(",");
        for (int i = 0; i < strings.length; i++) {
            list.add(Integer.parseInt(strings[i]));
        }
        return R.success(storageService.listByIds(list));

    }

    /**
     * 根据CategoryId查询
     * @param cid
     * @return
     */
    @GetMapping("/cid/{cid}/{subject}")
    public R<List<Storage>> getQuestionByCategoryId(@PathVariable("cid") Integer cid,@PathVariable("subject") Integer subject){
        LambdaQueryWrapper<Storage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Storage::getSubject, subject).eq(Storage::getCategoryId, cid);
        return R.success(storageService.list(queryWrapper));

    }

    /**
     * 查询指定year-order的数据
     * @param year
     * @param order
     * @return
     */
    @GetMapping("/{year}/{order}/{subject}")
    public R<List<Storage>> getYearAllQuestion(@PathVariable("year") Integer year, @PathVariable("order") Integer order, @PathVariable("subject") Integer subject ){
        LambdaQueryWrapper<Storage> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.likeRight(order != null, Storage::getQid,String.valueOf(year)+order)
                .eq(Storage::getSubject, subject);
        return R.success(storageService.list(queryWrapper));
    }

    /**
     * 查询年份集合
     * @return
     */
    @GetMapping("/yearlist/{subject}")
    public R<List<String>> getYearList(@PathVariable("subject") Integer subject){
        return R.success(storageService.getYearList(subject));
    }

    /**
     * 随机查询number个数据
     * @param number
     * @param subject
     * @return
     */
    @GetMapping("/random/{number}/{subject}")
    public R<List<Storage>> getRandQuestion(@PathVariable("number") Integer number,@PathVariable("subject") Integer subject){
        return R.success(storageService.getRand(number,subject));
    }





    /**
     * 更新&新增
     * @param storage
     * @return
     */
    @PostMapping()
    public R<Object> saveOrUp(@RequestBody Storage storage){
        return storageService.saveOrUpdate(storage)? R.success(storage): R.error("失败");
    }

    /**
     * 根据id删除
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public R<String> deleteOne(@PathVariable("id") Integer id){
        return storageService.removeById(id) ? R.success("成功") : R.error("失败");
    }
}
