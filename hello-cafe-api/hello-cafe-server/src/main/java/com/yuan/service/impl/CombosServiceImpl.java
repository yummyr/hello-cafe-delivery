package com.yuan.service.impl;

import com.yuan.entity.Combos;
import com.yuan.repository.CombosRepository;
import com.yuan.service.CombosService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CombosServiceImpl implements CombosService {

    private final CombosRepository combosRepository;

    @Override
    @Transactional
    public List<Combos> addComboItems(List<Combos> combos) {
        if (combos == null || combos.isEmpty()) {
            throw new IllegalArgumentException("Combo items list cannot be null or empty");
        }
        return combosRepository.saveAll(combos);
    }

    @Override
    @Transactional
    public void deleteComboItems(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            throw new IllegalArgumentException("ID list cannot be null or empty");
        }
        combosRepository.deleteAllByIdInBatch(idList);
    }

    @Override
    @Transactional
    public void deleteComboItemsByMenuItemId(Long menuItemId) {
        if (menuItemId == null) {
            throw new IllegalArgumentException("Menu item ID cannot be null");
        }
        combosRepository.deleteByMenuItemId(menuItemId);
    }

    @Override
    @Transactional
    public void deleteComboItemsByMenuItemIds(List<Long> menuItemIds) {
        if (menuItemIds == null || menuItemIds.isEmpty()) {
            throw new IllegalArgumentException("Menu item IDs list cannot be null or empty");
        }
        combosRepository.deleteByMenuItemIdIn(menuItemIds);
    }

    @Override
    public List<Combos> getComboItemsByComboId(Long comboId) {
        if (comboId == null) {
            throw new IllegalArgumentException("Combo ID cannot be null");
        }
        return combosRepository.findByComboId(comboId);
    }

    @Override
    public List<Combos> getComboItemsByMenuItemId(Long menuItemId) {
        if (menuItemId == null) {
            throw new IllegalArgumentException("Menu item ID cannot be null");
        }
        return combosRepository.findByMenuItemId(menuItemId);
    }

    @Override
    @Transactional
    public Combos updateComboItem(Combos combos) {
        if (combos == null || combos.getId() == null) {
            throw new IllegalArgumentException("Combo item or ID cannot be null");
        }
        return combosRepository.save(combos);
    }

    @Override
    public List<Combos> getAllCombos() {
        return combosRepository.findAll();
    }
}