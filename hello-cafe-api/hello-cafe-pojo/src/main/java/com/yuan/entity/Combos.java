package com.yuan.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@Table(name = "combos")
public class Combos implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "combo_id")
    private Long comboId;

    @Column(name = "menu_item_id")
    private Long menuItemId;

    @Column(name = "quantity")
    private Integer quantity;

    // Constructor for creating new combos without id
    public Combos(Long comboId, Long menuItemId, Integer quantity) {
        this.comboId = comboId;
        this.menuItemId = menuItemId;
        this.quantity = quantity != null ? quantity : 1; // Default to 1 if not specified
    }

    // Constructor for existing combos with id
    public Combos(Long id, Long comboId, Long menuItemId, Integer quantity) {
        this.id = id;
        this.comboId = comboId;
        this.menuItemId = menuItemId;
        this.quantity = quantity != null ? quantity : 1; // Default to 1 if not specified
    }

}
