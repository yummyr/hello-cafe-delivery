package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.context.UserContext;
import com.yuan.dto.MenuItemDTO;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.MenuItem;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.service.MenuItemService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class MenuItemServiceImpl implements MenuItemService {
    private final MenuItemRepository menuItemRepository;

    @Override
    public MenuItem addMenuItem(MenuItemDTO dto) {
        Optional<MenuItem> existing = menuItemRepository.findByName(dto.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Menu item exists, try to add another one!");
        }
        Long empId = UserContext.getCurrentUserId();
        MenuItem item = new MenuItem(null, dto.getName(), dto.getCategoryId(), dto.getPrice(), dto.getImage(),
                dto.getDescription(), StatusConstant.ENABLE, LocalDateTime.now(), LocalDateTime.now(), empId, empId);
        menuItemRepository.save(item);
        return item;
    }

    @Override
    public PageResult findAllWithCategory(MenuItemPageQueryDTO dto) {
        if (dto == null) {
            dto = new MenuItemPageQueryDTO();
        }
        Pageable pageable = PageRequest.of(dto.getPage() - 1, dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updateTime"));
        Page<MenuItem> page = menuItemRepository.findAll(pageable);
        return new PageResult(page.getTotalElements(), page.getContent());
    }

    @Override
    @Transactional
    public void deleteIds(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            throw new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        // log.info("Batch deleting menu items: {}", idList);
        menuItemRepository.deleteAllByIdInBatch(idList);
    }

}
