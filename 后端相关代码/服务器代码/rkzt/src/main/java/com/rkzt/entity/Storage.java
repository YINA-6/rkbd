package com.rkzt.entity;

import lombok.Data;

import java.util.List;

@Data
public class Storage {

    private Integer id;
    private String qid;
    private Integer subject;
    private String type;
    private String question;
    private String options;
    private String result;
    private String analysis;
    private String categoryId;
    private String photo;

}
