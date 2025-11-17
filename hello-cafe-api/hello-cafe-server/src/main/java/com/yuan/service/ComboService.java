package com.yuan.service;

import com.yuan.dto.ComboDTO;
import com.yuan.dto.ComboPageQueryDTO;
import com.yuan.entity.Combo;
import com.yuan.result.PageResult;
import com.yuan.vo.ComboVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ComboService {
    Combo addCombo(ComboDTO comboDTO);

    Combo addCombo(ComboDTO comboDTO, MultipartFile imageFile);

    PageResult findAllWithCategory(ComboPageQueryDTO comboPageQueryDTO);

    void deleteCombo(Long id);

    void changeComboStatus(Long id, Integer status);


    Combo updateCombo(ComboDTO comboDTO, MultipartFile imageFile);

    ComboVO getComboById(Long id);

    List<Combo> findAll();

    List<Map<String, Object>> searchMenuItems(String query);


}