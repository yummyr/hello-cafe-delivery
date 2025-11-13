package com.yuan.dto;

import com.yuan.entity.Combos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class ComboDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;                    // Combo id
    private String name;                // Combo name
    private Long categoryId;            // Category id
    private Double price;               // Combo price
    private String image;               // Combo image
    private String description;         // Combo description
    private Integer status;             // Combo status: 1 for available, 0 for unavailable
    private List<Combos> combos; // Menu items included in combo
}