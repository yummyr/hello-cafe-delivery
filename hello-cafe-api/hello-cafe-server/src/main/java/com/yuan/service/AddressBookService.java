package com.yuan.service;

import com.yuan.entity.AddressBook;

import java.util.List;

public interface AddressBookService {
    /**
     * 新增地址
     */
    void addAddress(AddressBook addressBook);

    /**
     * 查询当前登录用户的所有地址信息
     */
    List<AddressBook> listAddress();

    /**
     * 查询默认地址
     */
    AddressBook getDefaultAddress();

    /**
     * 根据id修改地址
     */
    void updateAddress(AddressBook addressBook);

    /**
     * 根据id删除地址
     */
    void deleteAddress(Long id);

    /**
     * 根据id查询地址
     */
    AddressBook getAddressById(Long id);

    /**
     * 设置默认地址
     */
    void setDefaultAddress(AddressBook addressBook);
}