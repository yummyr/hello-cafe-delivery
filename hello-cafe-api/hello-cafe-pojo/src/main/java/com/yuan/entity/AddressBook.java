package com.yuan.entity;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.IOException;

@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "address_book")
public class AddressBook extends BaseEntity {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(length = 50)
    private String name;

    @Column(length = 10)
    private String gender;

    @Column(length = 15)
    private String phone;

    @Column(length = 200)
    private String address;     // detail: door number, street ,etc

    @Column(length = 64)
    private String city;

    @Column(length = 64)
    private String state;

    @Column(length = 12)
    private String zipcode;

    @Column(length = 100)
    private String label;       // label: home, office, etc

    @Column(name = "is_default")
    private Integer isDefault;  // is_default address: 0-NO 1-YES

    // Custom setter to handle Boolean to Integer conversion
    @JsonSetter("isDefault")
    public void setIsDefault(Object isDefault) {
        if (isDefault instanceof Boolean) {
            this.isDefault = ((Boolean) isDefault) ? 1 : 0;
        } else if (isDefault instanceof Integer) {
            this.isDefault = (Integer) isDefault;
        } else if (isDefault instanceof String) {
            this.isDefault = "true".equalsIgnoreCase((String) isDefault) ? 1 : 0;
        }
    }

}
