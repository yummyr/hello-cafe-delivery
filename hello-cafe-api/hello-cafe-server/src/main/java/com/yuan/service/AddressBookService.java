package com.yuan.service;

import com.yuan.entity.AddressBook;

import java.util.List;

public interface AddressBookService {
    /**
     * add new address
     */
    void addAddress(AddressBook addressBook);

    /**
     * query all address for current user
     */
    List<AddressBook> listAddress();

    /**
     * query default address
     */
    AddressBook getDefaultAddress();

    /**
     * update address by id
     */
    void updateAddress(AddressBook addressBook);

    /**
     * delete address by id
     */
    void deleteAddress(Long id);

    /**
     * get address by id
     */
    AddressBook getAddressById(Long id);

    /**
     * set default address
     */
    void setDefaultAddress(Long id);
}