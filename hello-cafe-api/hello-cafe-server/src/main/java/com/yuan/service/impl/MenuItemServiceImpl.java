package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import com.yuan.constant.StatusConstant;
import com.yuan.dto.MenuItemDTO;
import com.yuan.dto.MenuItemPageQueryDTO;
import com.yuan.entity.Category;
import com.yuan.entity.Combos;
import com.yuan.entity.MenuItem;
import com.yuan.entity.MenuItemFlavor;
import com.yuan.repository.CategoryRepository;
import com.yuan.repository.CombosRepository;
import com.yuan.repository.MenuItemFlavorRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.service.MenuItemService;
import com.yuan.vo.MenuItemVO;
import org.springframework.beans.BeanUtils;
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
    private final MenuItemFlavorRepository menuItemFlavorRepository;
    private final CombosRepository combosRepository;

    /**
     * Add a new menu item (autofilled by AOP)
     */
    @Override
    @Transactional
    public MenuItem addMenuItem(MenuItemDTO dto) {
        Optional<MenuItem> existing = menuItemRepository.findByName(dto.getName());
        if (existing.isPresent()) {
            throw new IllegalArgumentException(MessageConstant.ALREADY_EXISTS);
        }
        MenuItem item = new MenuItem();
        BeanUtils.copyProperties(dto, item);
        item.setStatus(StatusConstant.DISABLE);

        menuItemRepository.save(item);

        // Add flavors if provided (Optional)
        List<MenuItemFlavor> flavors = dto.getFlavors();
        if (flavors != null && !flavors.isEmpty()) {
            flavors.forEach(flavor -> {
                flavor.setMenuItemId(item.getId());
                menuItemFlavorRepository.save(flavor);
            });
        }

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
                .map(item -> {
                    MenuItemVO vo = new MenuItemVO();
                    vo.setId(item.getId());
                    vo.setName(item.getName());
                    vo.setCategoryName(categoryMap.getOrDefault(item.getCategoryId(), "Unknown"));
                    vo.setPrice(item.getPrice());
                    vo.setImage(item.getImage());
                    vo.setDescription(item.getDescription());
                    vo.setStatus(item.getStatus());
                    vo.setUpdateTime(item.getUpdateTime());
                    vo.setCopies(0); // Default value for menu items
                    return vo;
                })
                .collect(Collectors.toList());

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

        // Check if any menu items are currently active (status = 1)
        List<MenuItem> activeItems = menuItemRepository.findAllById(idList).stream()
                .filter(item -> item.getStatus() == 1)
                .toList();

        if (!activeItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot delete active menu items: " +
                    activeItems.stream().map(MenuItem::getName).collect(Collectors.joining(", ")));
        }

        // Check if any menu items are referenced in combo items
        List<Combos> referencedItems = combosRepository.findByMenuItemIdIn(idList);
        if (!referencedItems.isEmpty()) {
            List<String> referencedItemNames = menuItemRepository.findAllById(
                    referencedItems.stream().map(Combos::getMenuItemId).toList()
            ).stream().map(MenuItem::getName).toList();
            throw new IllegalArgumentException("Cannot delete menu items referenced in combos: " +
                    String.join(", ", referencedItemNames));
        }

        // Delete associated flavors first
        menuItemFlavorRepository.deleteByMenuItemIdIn(idList);

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

    @Override
    public List<MenuItem> findByIds(List<Long> idList) {
        if (idList != null && !idList.isEmpty()) {
            return menuItemRepository.findAllById(idList);
        }
        return null;
    }

    @Override
    public MenuItem updateMenuItem(MenuItemDTO dto) {
        if (dto == null || dto.getId() == null) {
            throw new IllegalArgumentException("DTO or ID cannot be null");
        }
        MenuItem item = menuItemRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Menu item not found: " + dto.getId()));
        log.info("Updating menu item dto: {}", dto);
        BeanUtils.copyProperties(dto, item);

        log.info("Updating menu item: id={}, name={}", item.getId(), item.getName());

        return menuItemRepository.save(item);
    }

    /**
     * Update menu item with associated flavors
     */
    @Override
    @Transactional
    public void updateWithFlavor(MenuItemDTO menuItemDTO) {
        MenuItem item = new MenuItem();
        BeanUtils.copyProperties(menuItemDTO, item);

        // Update menu item
        menuItemRepository.save(item);

        // Delete existing flavors for this menu item
        menuItemFlavorRepository.deleteByMenuItemId(menuItemDTO.getId());

        // Insert new flavors
        List<MenuItemFlavor> flavors = menuItemDTO.getFlavors();
        if (flavors != null && !flavors.isEmpty()) {
            flavors.forEach(flavor -> {
                flavor.setMenuItemId(menuItemDTO.getId());
                menuItemFlavorRepository.save(flavor);
            });
        }
    }

    @Override
    public List<MenuItem> findAll() {
        try {
            List<MenuItem> items = menuItemRepository.findAll();
            return items;
        } catch (Exception e) {
            log.error("Failed to find menu items", e);
            throw new RuntimeException("Failed to retrieve menu items: " + e.getMessage());
        }
    }

    @Override
    public MenuItem getMenuItemById(Long id) {
        try {
            MenuItem item = menuItemRepository.findById(id).orElse(null);
            return item;
        } catch (Exception e) {
            log.error("Failed to find menu item by id: {}", id, e);
            throw new RuntimeException("Failed to retrieve menu item: " + e.getMessage());
        }
    }

    @Override
    public List<MenuItemVO> findByStatus(Integer status) {
        try {
            log.info("Finding menu items by status: {}", status);
            List<MenuItem> menuItems = menuItemRepository.findByStatus(status);

            return menuItems.stream()
                    .map(this::convertToVO)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to find menu items by status: {}", status, e);
            throw new RuntimeException("Failed to retrieve menu items: " + e.getMessage());
        }
    }

    @Override
    public List<MenuItemVO> findByCategoryIdAndStatus(Long categoryId, Integer status) {
        try {
            log.info("Finding menu items by category {} and status: {}", categoryId, status);
            List<MenuItem> menuItems = menuItemRepository.findByCategoryIdAndStatus(categoryId, status);

            return menuItems.stream()
                    .map(this::convertToVO)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to find menu items by category {} and status: {}", categoryId, status, e);
            throw new RuntimeException("Failed to retrieve menu items: " + e.getMessage());
        }
    }

    @Override
    public MenuItemVO getMenuItemVOById(Long id) {
        try {
            log.info("Finding menu item VO by id: {}", id);
            MenuItem menuItem = menuItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + id));

            return convertToVO(menuItem);
        } catch (Exception e) {
            log.error("Failed to find menu item VO by id: {}", id, e);
            throw new RuntimeException("Failed to retrieve menu item: " + e.getMessage());
        }
    }

    @Override
    public List<MenuItemVO> findAllActive() {
        try {
            log.info("Finding all active menu items");
            List<MenuItem> menuItems = menuItemRepository.findByStatus(StatusConstant.ENABLE);

            return menuItems.stream()
                    .map(this::convertToVO)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to find all active menu items", e);
            throw new RuntimeException("Failed to retrieve menu items: " + e.getMessage());
        }
    }

    private MenuItemVO convertToVO(MenuItem menuItem) {
        MenuItemVO vo = new MenuItemVO();
        vo.setId(menuItem.getId());
        vo.setName(menuItem.getName());
        vo.setPrice(menuItem.getPrice());
        vo.setImage(menuItem.getImage());
        vo.setDescription(menuItem.getDescription());
        vo.setStatus(menuItem.getStatus());
        vo.setUpdateTime(menuItem.getUpdateTime());

        // Get category name if categoryId is not null
        if (menuItem.getCategoryId() != null) {
            try {
                Category category = categoryRepository.findById(menuItem.getCategoryId()).orElse(null);
                vo.setCategoryName(category != null ? category.getName() : "Unknown");
            } catch (Exception e) {
                log.warn("Failed to fetch category for menu item {}: {}", menuItem.getId(), e.getMessage());
                vo.setCategoryName("Unknown");
            }
        } else {
            vo.setCategoryName("Uncategorized");
        }

        return vo;
    }


}
