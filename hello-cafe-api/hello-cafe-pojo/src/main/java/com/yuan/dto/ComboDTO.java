package com.yuan.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
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

    // Use different field name to avoid conflict with custom getter/setter
    private String imageField;          // Combo image
    private String imageUrl;            // Existing image URL reference
    private String description;         // Combo description
    private Integer status;             // Combo status: 1 for available, 0 for unavailable
    private List<ComboItemDTO> items; // Menu items included in combo with quantity

    // Image handling flags
    private Boolean imageChanged;       // Flag to indicate if image was modified
    private Boolean hasExistingImage;   // Flag to indicate if there was an existing image

    // Custom setter for image field to handle both String and Object types
    @JsonSetter("image")
    public void setImage(Object imageValue) {
        if (imageValue == null) {
            this.imageField = null;
        } else if (imageValue instanceof String) {
            this.imageField = (String) imageValue;
        } else {
            // Handle empty object {} or any other object type by converting to empty string
            this.imageField = "";
        }
    }

    // Standard getter
    @JsonGetter("image")
    public String getImage() {
        return this.imageField;
    }

}