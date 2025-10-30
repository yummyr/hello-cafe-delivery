package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.dto.MenuItemDTO;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.Category;
import com.yuan.entity.MenuItem;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.service.MenuItemService;
import com.yuan.vo.MenuItemVO;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class MenuItemServiceImpl implements MenuItemService {
    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Add a new menu item (autofilled by AOP)
     */
    @Override
    public MenuItem addMenuItem(MenuItemDTO dto) {
        Optional<MenuItem> existing = menuItemRepository.findByName(dto.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException(MessageConstant.ALREADY_EXISTS);
        }

        MenuItem item = new MenuItem();
        item.setName(dto.getName());
        item.setCategoryId(dto.getCategoryId());
        item.setPrice(dto.getPrice());
        item.setImage(dto.getImage());
        item.setDescription(dto.getDescription());
        item.setStatus(StatusConstant.ENABLE);

        menuItemRepository.save(item);
        return item;
    }


    /**
     * Query all menu items with category info
     */
    @Override
    public PageResult findAllWithCategory(MenuItemPageQueryDTO dto) {
        if (dto == null) {
            dto = new MenuItemPageQueryDTO();
        }

        Pageable pageable = PageRequest.of(
                dto.getPage() - 1,
                dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updateTime")
        );

        Page<MenuItem> page = menuItemRepository.findAllWithCategory(
                dto.getName(),
                dto.getCategoryName(),
                dto.getStatus(),
                pageable
        );

        // map category name and id
        Map<Long, String> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        // convert formation to menu item VO
        List<MenuItemVO> voList = page.getContent().stream()
                .map(item -> new MenuItemVO(
                        item.getId(),
                        item.getName(),
                        categoryMap.getOrDefault(item.getCategoryId(), "Unknown"),
                        item.getPrice(),
                        item.getImage(),
                        item.getDescription(),
                        item.getStatus(),
                        item.getUpdateTime()
                ))
                .toList();

        return new PageResult(page.getTotalElements(), voList);
    }


    /**
     * Batch delete menu items by ID list
     */
    @Override
    @Transactional
    public void deleteIds(List<Long> idList) {
        if (idList == null || idList.isEmpty()) {
            throw new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        // log.info("Batch deleting menu items: {}", idList);
        menuItemRepository.deleteAllByIdInBatch(idList);
    }


    /**
     * Change menu item active/inactive status (auto update fields)
     */
    @Override
    public void changeItemStatus(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MenuItem not found: " + id));

        Integer newStatus = (item.getStatus() == 1) ? 0 : 1;
        item.setStatus(newStatus);

        menuItemRepository.save(item);
    }


}
