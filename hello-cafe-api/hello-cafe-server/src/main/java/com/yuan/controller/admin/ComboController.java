package com.yuan.controller.admin;

import com.yuan.constant.FileConstant;
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

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/admin/combo_item")
public class ComboController {

    private final ComboService comboService;
    private final S3Service s3Service;

    @PostMapping
    public Result addCombo(@RequestBody ComboDTO comboDTO) {
        try {
            log.info("Adding combo: {}", comboDTO.getName());
            Combo combo = comboService.addCombo(comboDTO);
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

    @DeleteMapping
    public Result delete(@RequestParam List<Long> ids) {
        try {
            log.info("Deleting combos: {}", ids);
            comboService.deleteCombos(ids);
            return Result.success();
        } catch (Exception e) {
            log.error("Failed to delete combos", e);
            return Result.error("Failed to delete combos: " + e.getMessage());
        }
    }

    @PutMapping
    public Result updateCombo(@RequestBody ComboDTO comboDTO) {
        try {
            log.info("Updating combo: {}", comboDTO.getId());
            Combo combo = comboService.updateCombo(comboDTO);
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
}