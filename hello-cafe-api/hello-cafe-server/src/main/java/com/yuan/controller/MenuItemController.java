package com.yuan.controller;

import com.yuan.dto.MenuItemDTO;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.MenuItem;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/menu")
public class MenuItemController {
    private final MenuItemService menuItemService;
    @GetMapping
    public Result page(MenuItemPageQueryDTO dto){
        PageResult result = menuItemService.findAllWithCategory(dto);
        return Result.success(result);
    }

    @DeleteMapping
    public Result delete(@RequestBody List<Long> idList){
        log.info("Start to delete menu item by id");
        menuItemService.deleteIds(idList);
        return Result.success(idList);
    }

    @PostMapping
    public Result addMenuItem(@RequestBody MenuItemDTO dto){
       MenuItem menuItem = menuItemService.addMenuItem(dto);
        return Result.success(menuItem);
    }

    @PutMapping("/status")
    public Result toggleStatus(@RequestBody Long id){
        menuItemService.changeItemStatus(id);
        return Result.success(id);
    }
}
