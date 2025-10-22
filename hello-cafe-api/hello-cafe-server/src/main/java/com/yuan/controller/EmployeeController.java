package com.yuan.controller;

import com.yuan.dto.EmployeeDTO;
import com.yuan.result.Result;
import com.yuan.service.EmployeeService;
import com.yuan.entity.Employee;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for managing employees.
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }


    // Create
    @PostMapping
    public Result addEmployee(@RequestBody EmployeeDTO dto) {
        log.info("add employee dt :{}", dto.toString());
        employeeService.saveEmployee(dto);
        return Result.success(dto.getUsername());
    }

    // Read all
    @GetMapping
    public Result getAllEmployees() {

        List<Employee> employeeList = employeeService.getAllEmployees();
        return Result.success(employeeList);
    }

    // Read by ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    // Update
    @PutMapping("/{id}")
    public Result updateEmployee(@RequestBody EmployeeDTO dto) {
        employeeService.updateEmployee(dto);
        return Result.success();
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }
}