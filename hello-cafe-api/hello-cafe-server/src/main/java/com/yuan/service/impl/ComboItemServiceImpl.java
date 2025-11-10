package com.yuan.service.impl;

import com.yuan.entity.ComboItem;
import com.yuan.repository.ComboItemRepository;
import com.yuan.service.ComboItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ComboItemServiceImpl implements ComboItemService {

    private final ComboItemRepository comboItemRepository;

    @Override
    @Transactional
    public List<ComboItem> addComboItems(List<ComboItem> comboItems) {
        if (comboItems == null || comboItems.isEmpty()) {
            throw new IllegalArgumentException("Combo items list cannot be null or empty");
        }
        return comboItemRepository.saveAll(comboItems);
    }

    @Override
    @Transactional
    public void deleteComboItems(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            throw new IllegalArgumentException("ID list cannot be null or empty");
        }
        comboItemRepository.deleteAllByIdInBatch(idList);
    }

    @Override
    @Transactional
    public void deleteComboItemsByMenuItemId(Long menuItemId) {
        if (menuItemId == null) {
            throw new IllegalArgumentException("Menu item ID cannot be null");
        }
        comboItemRepository.deleteByMenuItemId(menuItemId);
    }

    @Override
    @Transactional
    public void deleteComboItemsByMenuItemIds(List<Long> menuItemIds) {
        if (menuItemIds == null || menuItemIds.isEmpty()) {
            throw new IllegalArgumentException("Menu item IDs list cannot be null or empty");
        }
        comboItemRepository.deleteByMenuItemIdIn(menuItemIds);
    }

    @Override
    public List<ComboItem> getComboItemsByComboId(Long comboId) {
        if (comboId == null) {
            throw new IllegalArgumentException("Combo ID cannot be null");
        }
        return comboItemRepository.findByComboId(comboId);
    }

    @Override
    public List<ComboItem> getComboItemsByMenuItemId(Long menuItemId) {
        if (menuItemId == null) {
            throw new IllegalArgumentException("Menu item ID cannot be null");
        }
        return comboItemRepository.findByMenuItemId(menuItemId);
    }

    @Override
    @Transactional
    public ComboItem updateComboItem(ComboItem comboItem) {
        if (comboItem == null || comboItem.getId() == null) {
            throw new IllegalArgumentException("Combo item or ID cannot be null");
        }
        return comboItemRepository.save(comboItem);
    }

    @Override
    public List<ComboItem> getAllComboItems() {
        return comboItemRepository.findAll();
    }
}