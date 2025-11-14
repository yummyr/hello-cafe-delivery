package com.yuan.controller.admin;

import com.yuan.constant.FileConstant;
import com.yuan.dto.MenuItemDTO;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.MenuItem;
import com.yuan.entity.MenuItemFlavor;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.MenuItemService;
import com.yuan.service.impl.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;
    private final S3Service s3Service;


    @GetMapping
    public Result page(MenuItemPageQueryDTO dto) {
        PageResult result = menuItemService.findAllWithCategory(dto);
        return Result.success(result);
    }

    @DeleteMapping
    public Result delete(@RequestBody List<Long> idList) {
        try {
            // log.info("Starting to delete menu item by id");
            List<MenuItem> items = menuItemService.findByIds(idList);

            for (MenuItem item : items) {
                // log.info("Deleting menu item: {}", item.getName());
                if (item.getImage() != null && !item.getImage().isEmpty()) {
                    s3Service.deleteFile(item.getImage());
                }
            }
            menuItemService.deleteIds(idList);
            return Result.success(idList);
        } catch (Exception e) {
            log.error("Failed to delete menu item by id", e);
            return Result.error("Failed to delete menu item by id");
        }
    }

    @PostMapping
    public Result addMenuItem(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // log.info("Adding menu item: name={}, price={}, categoryId={}", name, price, categoryId);
            if (image.getSize() > FileConstant.MAX_IMAGE_SIZE) { // 5MB
                return Result.error("File too large");
            }
            if (!FileConstant.ALLOWED_IMAGE_TYPES.contains(image.getContentType())) {
                throw new IllegalArgumentException("Invalid file type");
            }
            //  convert to MenuItem DTO
            MenuItemDTO dto = new MenuItemDTO();
            dto.setName(name);
            dto.setPrice(BigDecimal.valueOf(price));
            dto.setDescription(description);
            dto.setCategoryId(categoryId);


            // upload image to S3 if image is not null
            if (image != null && !image.isEmpty()) {
                String imageUrl = s3Service.uploadFile(image);
                dto.setImage(imageUrl);
            }

            // add menu item to database and return
            MenuItem menuItem = menuItemService.addMenuItem(dto);
            return Result.success(menuItem);

        } catch (Exception e) {
            log.error("Failed to add menu item", e);
            return Result.error("Failed to add menu item: " + e.getMessage());
        }
    }

    @PutMapping("/status/{id}")
    public Result toggleStatus(@PathVariable Long id) {
        log.info("开始修改menu item 状态 with {}",id);
        menuItemService.changeItemStatus(id);
        return Result.success(id);
    }


    @PutMapping("/{id}")

    public Result updateMenuItem(@PathVariable Long id, @RequestParam("name") String name,
                                 @RequestParam("price") Double price,
                                 @RequestParam("description") String description,
                                 @RequestParam("categoryId") Long categoryId,
                                 @RequestParam(value = "image", required = false) MultipartFile image,
                                 @RequestParam(value = "oldImageUrl", required = false) String oldImageUrl) {
        try {
            // log.info("Updating menu item: id: {}, image: {}, oldImageUrl: {}", id, image, oldImageUrl);
            MenuItemDTO dto = new MenuItemDTO();
            dto.setId(id);
            dto.setName(name);
            dto.setPrice(BigDecimal.valueOf(price));
            dto.setDescription(description);
            dto.setCategoryId(categoryId);

            if (image != null && !image.isEmpty()) {
                String newImageUrl = s3Service.uploadFile(image);
                dto.setImage(newImageUrl);
                if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                    try {
                        s3Service.deleteFile(oldImageUrl);
                        // log.info("Deleted old image from S3: {}", oldImageUrl);
                    } catch (Exception e) {
                        log.warn("Failed to delete old image from S3: {}", oldImageUrl, e);
                    }
                }
            } else {
                dto.setImage(oldImageUrl);
            }

            MenuItem menuItemToUpdate = menuItemService.updateMenuItem(dto);
            return Result.success(menuItemToUpdate);
        } catch (Exception e) {
            log.error("Failed to update menu item", e);
            return Result.error("Failed to update menu item");
        }
    }

    @GetMapping("/{id}")
    public Result getMenuItemById(@PathVariable Long id) {
        try {
            MenuItem menuItem = menuItemService.getMenuItemById(id);
            return Result.success(menuItem);
        } catch (Exception e) {
            return Result.error("Failed to fetch menu item: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    public Result getMenuItem() {
        try {
            List<MenuItem> items = menuItemService.findAll();
            return Result.success(items);
        } catch (Exception e) {
            log.error("Failed to get menu items", e);
            return Result.error("Failed to retrieve menu items: " + e.getMessage());
        }
    }

    @PostMapping("/with-flavors")
    public Result addMenuItemWithFlavors(@RequestBody MenuItemDTO menuItemDTO) {
        try {
            log.info("Adding menu item with flavors: {}", menuItemDTO.getName());
            MenuItem menuItem = menuItemService.addMenuItem(menuItemDTO);
            return Result.success(menuItem);
        } catch (Exception e) {
            log.error("Failed to add menu item with flavors", e);
            return Result.error("Failed to add menu item with flavors: " + e.getMessage());
        }
    }

    @PutMapping("/with-flavors")
    public Result updateMenuItemWithFlavors(@RequestBody MenuItemDTO menuItemDTO) {
        try {
            log.info("Updating menu item with flavors: {}", menuItemDTO.getId());
            menuItemService.updateWithFlavor(menuItemDTO);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to update menu item with flavors", e);
            return Result.error("Failed to update menu item with flavors: " + e.getMessage());
        }
    }
}