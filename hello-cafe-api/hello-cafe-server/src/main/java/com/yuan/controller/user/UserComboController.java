package com.yuan.controller.user;

import com.yuan.dto.ComboPageQueryDTO;
import com.yuan.entity.Combo;
import com.yuan.entity.Combos;
import com.yuan.entity.MenuItem;
import com.yuan.repository.CombosRepository;
import com.yuan.repository.ComboRepository;
import com.yuan.repository.MenuItemRepository;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.ComboService;
import com.yuan.vo.MenuItemVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/user/combo")
public class UserComboController {

    private final ComboService comboService;

    // /**
    //  * query combos by category
    //  */
    // @GetMapping("/list")
    // public Result<List<Combo>> list(@RequestParam Long categoryId) {
    //     try {
    //         log.info("Querying combos by category id: {}", categoryId);
    //
    //         // only query active combos
    //         List<Combo> combos = comboRepository.findByCategoryIdAndStatus(categoryId, 1);
    //
    //         return Result.success(combos);
    //     } catch (Exception e) {
    //         log.error("Failed to query combos", e);
    //         return Result.error("Failed to query combos: " + e.getMessage());
    //     }
    // }


    @GetMapping("/page")
    public Result<PageResult> page(ComboPageQueryDTO dto){
        try{
            log.info("try to get page for combo in user end for CombosPage");
            PageResult result = comboService.findAllWithCategory(dto);
            log.info("user end combo page result:{}",result);
            return Result.success(result);
        }catch (Exception e){
            log.error("Fail to fetch pageResult");
            return Result.error("Fail to fetch pageResult");
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