package com.yuan.service;

import com.yuan.entity.ComboItem;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ComboItemService {
    List<ComboItem> addComboItems(List<ComboItem> comboItems);

    void deleteComboItems(List<Long> idList);

    void deleteComboItemsByMenuItemId(Long menuItemId);

    void deleteComboItemsByMenuItemIds(List<Long> menuItemIds);

    List<ComboItem> getComboItemsByComboId(Long comboId);

    List<ComboItem> getComboItemsByMenuItemId(Long menuItemId);

    ComboItem updateComboItem(ComboItem comboItem);

    List<ComboItem> getAllComboItems();
}