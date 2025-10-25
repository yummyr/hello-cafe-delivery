package com.yuan.dto;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class MenuItemDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private String name;
    private Double price;
    private Integer type;
    private  String image;
    private  String description;

}
