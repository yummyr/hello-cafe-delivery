package com.yuan.controller.admin;

import com.yuan.dto.ComboDTO;
import com.yuan.dto.ComboPageQueryDTO;
import com.yuan.entity.Combo;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.ComboService;
import com.yuan.service.impl.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/combo")
public class ComboController {

    private final ComboService comboService;
    private final S3Service s3Service;

    @PostMapping
    public Result addCombo(@RequestPart("combo") String comboJson, @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Parse JSON string to ComboDTO
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            ComboDTO comboDTO = objectMapper.readValue(comboJson, ComboDTO.class);

            log.info("Adding combo: {}", comboDTO.getName());
            Combo combo = comboService.addCombo(comboDTO, imageFile);
            return Result.success(combo);
        } catch (Exception e) {
            log.error("Failed to add combo", e);
            return Result.error("Failed to add combo: " + e.getMessage());
        }
    }

    @GetMapping("/page")
    public Result page(ComboPageQueryDTO dto) {
        try {
            PageResult result = comboService.findAllWithCategory(dto);
            return Result.success(result);
        } catch (Exception e) {
            log.error("Failed to get combo page", e);
            return Result.error("Failed to get combo page: " + e.getMessage());
        }
    }

    @PostMapping("/status/{status}")
    public Result changeStatus(@PathVariable Integer status, @RequestParam Long id) {
        try {
            log.info("Changing combo status: id={}, status={}", id, status);
            comboService.changeComboStatus(id, status);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to change combo status", e);
            return Result.error("Failed to change combo status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Long id) {
        try {
            log.info("Deleting combos: {}", id);
            comboService.deleteCombo(id);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to delete combos", e);
            return Result.error("Failed to delete combos: " + e.getMessage());
        }
    }

    @PutMapping
    public Result updateCombo(@RequestPart("combo") String comboJson, @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Parse JSON string to ComboDTO
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            ComboDTO comboDTO = objectMapper.readValue(comboJson, ComboDTO.class);

            log.info("Updating combo: {}", comboDTO.getId());

            Combo combo = comboService.updateCombo(comboDTO, imageFile);
            return Result.success(combo);
        } catch (Exception e) {
            log.error("Failed to update combo", e);
            return Result.error("Failed to update combo: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result getComboById(@PathVariable Long id) {
        try {
            return Result.success(comboService.getComboById(id));
        } catch (Exception e) {
            log.error("Failed to get combo by id: {}", id, e);
            return Result.error("Failed to get combo: " + e.getMessage());
        }
    }

    
    @GetMapping("/menu-items/search")
    public Result searchMenuItems(@RequestParam String query) {
        try {
            log.info("Searching menu items with query: {}", query);
            var menuItems = comboService.searchMenuItems(query);
            return Result.success(menuItems);
        } catch (Exception e) {
            log.error("Failed to search menu items", e);
            return Result.error("Failed to search menu items: " + e.getMessage());
        }
    }
}