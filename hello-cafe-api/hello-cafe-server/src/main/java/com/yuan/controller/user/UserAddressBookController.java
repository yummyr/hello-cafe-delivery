package com.yuan.controller.user;

import com.yuan.entity.AddressBook;
import com.yuan.result.Result;
import com.yuan.service.AddressBookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user/addressBook")
public class UserAddressBookController {

    private final AddressBookService addressBookService;

    /**
     * 新增地址
     */
    @PostMapping
    public Result addAddress(@RequestBody AddressBook addressBook) {
        try {
            log.info("Adding new address for consignee: {}", addressBook.getConsignee());
            addressBookService.addAddress(addressBook);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to add address", e);
            return Result.error("Failed to add address: " + e.getMessage());
        }
    }

    /**
     * 查询当前登录用户的所有地址信息
     */
    @GetMapping("/list")
    public Result<List<AddressBook>> listAddress() {
        try {
            log.info("Getting address list for current user");
            List<AddressBook> addressList = addressBookService.listAddress();
            return Result.success(addressList);
        } catch (Exception e) {
            log.error("Failed to get address list", e);
            return Result.error("Failed to get address list: " + e.getMessage());
        }
    }

    /**
     * 查询默认地址
     */
    @GetMapping("/default")
    public Result<AddressBook> getDefaultAddress() {
        try {
            log.info("Getting default address for current user");
            AddressBook defaultAddress = addressBookService.getDefaultAddress();
            return Result.success(defaultAddress);
        } catch (Exception e) {
            log.error("Failed to get default address", e);
            return Result.error("Failed to get default address: " + e.getMessage());
        }
    }

    /**
     * 根据id修改地址
     */
    @PutMapping
    public Result updateAddress(@RequestBody AddressBook addressBook) {
        try {
            log.info("Updating address: {}", addressBook.getId());
            addressBookService.updateAddress(addressBook);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to update address", e);
            return Result.error("Failed to update address: " + e.getMessage());
        }
    }

    /**
     * 根据id删除地址
     */
    @DeleteMapping
    public Result deleteAddress(@RequestParam Long id) {
        try {
            log.info("Deleting address: {}", id);
            addressBookService.deleteAddress(id);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to delete address", e);
            return Result.error("Failed to delete address: " + e.getMessage());
        }
    }

    /**
     * 根据id查询地址
     */
    @GetMapping("/{id}")
    public Result<AddressBook> getAddressById(@PathVariable Long id) {
        try {
            log.info("Getting address by id: {}", id);
            AddressBook address = addressBookService.getAddressById(id);
            return Result.success(address);
        } catch (Exception e) {
            log.error("Failed to get address", e);
            return Result.error("Failed to get address: " + e.getMessage());
        }
    }

    /**
     * 设置默认地址
     */
    @PutMapping("/default")
    public Result setDefaultAddress(@RequestBody AddressBook addressBook) {
        try {
            log.info("Setting default address: {}", addressBook.getId());
            addressBookService.setDefaultAddress(addressBook);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to set default address", e);
            return Result.error("Failed to set default address: " + e.getMessage());
        }
    }
}