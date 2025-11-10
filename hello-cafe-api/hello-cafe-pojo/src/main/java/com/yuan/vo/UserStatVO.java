package com.yuan.vo;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatVO {
    private String dateList;       // "4-1,4-2,..."
    private String newUserList;    // "1,2,..."
    private String totalUserList;  // "200,201,..."
}
