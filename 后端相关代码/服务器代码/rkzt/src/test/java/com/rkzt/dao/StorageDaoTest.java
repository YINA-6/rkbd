package com.rkzt.dao;

import com.rkzt.entity.Storage;
import com.rkzt.mapper.StorageMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class StorageDaoTest {

    @Autowired
    private StorageMapper storageMapper;

    @Test
    void testCRUD(){
        List<Storage> list = storageMapper.selectList(null);
        System.out.println(list);
    }
}
