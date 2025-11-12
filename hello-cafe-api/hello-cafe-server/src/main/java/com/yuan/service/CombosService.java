package com.yuan.service;

import com.yuan.entity.Combos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CombosService {
    List<Combos> addComboItems(List<Combos> combos);

    void deleteComboItems(List<Long> idList);

    void deleteComboItemsByMenuItemId(Long menuItemId);

    void deleteComboItemsByMenuItemIds(List<Long> menuItemIds);

    List<Combos> getComboItemsByComboId(Long comboId);

    List<Combos> getComboItemsByMenuItemId(Long menuItemId);

    Combos updateComboItem(Combos combos);

    List<Combos> getAllCombos();
}