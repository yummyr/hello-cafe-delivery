package com.yuan.service;

import com.yuan.dto.ComboDTO;
import com.yuan.dto.ComboPageQueryDTO;
import com.yuan.entity.Combo;
import com.yuan.result.PageResult;
import com.yuan.vo.ComboVO;

import java.util.List;

public interface ComboService {
    Combo addCombo(ComboDTO comboDTO);

    PageResult findAllWithCategory(ComboPageQueryDTO comboPageQueryDTO);

    void deleteCombos(List<Long> idList);

    void changeComboStatus(Long id, Integer status);

    Combo updateCombo(ComboDTO comboDTO);

    ComboVO getComboById(Long id);

    List<Combo> findAll();
}