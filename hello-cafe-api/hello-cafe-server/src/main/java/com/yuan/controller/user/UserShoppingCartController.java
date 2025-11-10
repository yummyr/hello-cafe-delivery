package com.yuan.controller.user;

import com.yuan.dto.ShoppingCartDTO;
import com.yuan.vo.ShoppingCartVO;
import com.yuan.result.Result;
import com.yuan.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user/shoppingCart")
public class UserShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    /**
     * 添加购物车
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody ShoppingCartDTO shoppingCartDTO) {
        try {
            log.info("Adding item to shopping cart");
            shoppingCartService.addToCart(shoppingCartDTO);
            return Result.success("Item added to cart successfully");
        } catch (Exception e) {
            log.error("Failed to add item to cart", e);
            return Result.error("Failed to add item to cart: " + e.getMessage());
        }
    }

    /**
     * 查看购物车
     */
    @GetMapping("/list")
    public Result<List<ShoppingCartVO>> list() {
        try {
            log.info("Getting shopping cart items");
            List<ShoppingCartVO> cartItems = shoppingCartService.listCart();
            return Result.success(cartItems);
        } catch (Exception e) {
            log.error("Failed to get shopping cart", e);
            return Result.error("Failed to get shopping cart: " + e.getMessage());
        }
    }

    /**
     * 删除购物车中一个商品
     */
    @PostMapping("/sub")
    public Result<String> sub(@RequestBody ShoppingCartDTO shoppingCartDTO) {
        try {
            log.info("Subtracting item from shopping cart");
            shoppingCartService.subtractFromCart(shoppingCartDTO);
            return Result.success("Item removed from cart successfully");
        } catch (Exception e) {
            log.error("Failed to subtract item from cart", e);
            return Result.error("Failed to subtract item from cart: " + e.getMessage());
        }
    }

    /**
     * 清空购物车
     */
    @DeleteMapping("/clean")
    public Result<String> clean() {
        try {
            log.info("Cleaning shopping cart");
            shoppingCartService.cleanCart();
            return Result.success("Shopping cart cleaned successfully");
        } catch (Exception e) {
            log.error("Failed to clean shopping cart", e);
            return Result.error("Failed to clean shopping cart: " + e.getMessage());
        }
    }
}