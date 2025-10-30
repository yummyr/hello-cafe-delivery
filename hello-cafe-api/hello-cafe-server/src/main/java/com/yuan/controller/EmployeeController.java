package com.yuan.controller;

import com.yuan.dto.EmployeeDTO;
import com.yuan.dto.EmployeePageQueryDTO;
import com.yuan.result.PageResult;
import com.yuan.result.Result;
import com.yuan.service.EmployeeService;
import com.yuan.entity.Employee;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing employees.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    // Create
    @PostMapping
    public Result<String> addEmployee(@RequestBody EmployeeDTO dto) {
        // log.info("add employee dt :{}", dto.toString());
        employeeService.saveEmployee(dto);
        return Result.success(dto.getUsername());
    }

    // Update employee info
    @PutMapping("/{id}")
    public Result<Employee> updateEmployee(@RequestBody EmployeeDTO dto) {
        Employee employee = employeeService.updateEmployee(dto);
        return Result.success(employee);
    }

    // Update employee status
    @PutMapping("/{id}/status")
    public Result<Long> updateEmployeeStatus(@PathVariable Long id){
        employeeService.updateEmployeeStatus(id);
        return Result.success(id);
    }
    // Delete
    @DeleteMapping("/{id}")
    public Result<Long> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return Result.success(id);
    }

    @GetMapping("/page")
    public Result pageResult(EmployeePageQueryDTO dto){
        PageResult pageResult = employeeService.page(dto);
        return Result.success(pageResult);
    }

}