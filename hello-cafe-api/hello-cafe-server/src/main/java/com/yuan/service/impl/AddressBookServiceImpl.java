package com.yuan.service.impl;

import com.yuan.constant.AddressConstant;
import com.yuan.entity.AddressBook;
import com.yuan.repository.AddressBookRepository;
import com.yuan.service.AddressBookService;
import com.yuan.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressBookServiceImpl implements AddressBookService {

    private final AddressBookRepository addressBookRepository;


    @Override
    @Transactional
    public void addAddress(AddressBook addressBook) {
        addressBook.setUserId(UserUtils.getCurrentUserId());

        // If setting as default, unset other default addresses first
        if (addressBook.getIsDefault() != null && addressBook.getIsDefault() == AddressConstant.DEFAULT_ADDRESS) {
            addressBookRepository.unsetDefaultAddress(UserUtils.getCurrentUserId());
        }

        addressBookRepository.save(addressBook);
        log.info("Added new address for user: {}", UserUtils.getCurrentUserId());
    }

    @Override
    public List<AddressBook> listAddress() {
        return addressBookRepository.findByUserId(UserUtils.getCurrentUserId());
    }

    @Override
    public AddressBook getDefaultAddress() {
        return addressBookRepository.findByUserIdAndIsDefault(UserUtils.getCurrentUserId(), 1);
    }

    @Override
    @Transactional
    public void updateAddress(AddressBook addressBook) {
        // Verify the address belongs to current user
        AddressBook existingAddress = addressBookRepository.findById(addressBook.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!existingAddress.getUserId().equals(UserUtils.getCurrentUserId())) {
            throw new RuntimeException("Unauthorized to update this address");
        }

        // If setting as default, unset other default addresses first
        if (addressBook.getIsDefault() != null && addressBook.getIsDefault() == 1) {
            addressBookRepository.unsetDefaultAddress(UserUtils.getCurrentUserId());
        }

        addressBookRepository.save(addressBook);
        log.info("Updated address: {} for user: {}", addressBook.getId(), UserUtils.getCurrentUserId());
    }

    @Override
    @Transactional
    public void deleteAddress(Long id) {
        AddressBook addressBook = addressBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!addressBook.getUserId().equals(UserUtils.getCurrentUserId())) {
            throw new RuntimeException("Unauthorized to delete this address");
        }

        addressBookRepository.deleteById(id);
        log.info("Deleted address: {} for user: {}", id, UserUtils.getCurrentUserId());
    }

    @Override
    public AddressBook getAddressById(Long id) {
        AddressBook addressBook = addressBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!addressBook.getUserId().equals(UserUtils.getCurrentUserId())) {
            throw new RuntimeException("Unauthorized to view this address");
        }

        return addressBook;
    }

    @Override
    @Transactional
    public void setDefaultAddress(AddressBook addressBook) {
        // Verify the address belongs to current user
        AddressBook existingAddress = addressBookRepository.findById(addressBook.getId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!existingAddress.getUserId().equals(UserUtils.getCurrentUserId())) {
            throw new RuntimeException("Unauthorized to update this address");
        }

        // Unset all default addresses for this user
        addressBookRepository.unsetDefaultAddress(UserUtils.getCurrentUserId());

        // Set this address as default
        addressBookRepository.setDefaultAddress(addressBook.getId());

        log.info("Set default address: {} for user: {}", addressBook.getId(), UserUtils.getCurrentUserId());
    }
}