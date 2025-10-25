package com.yuan.controller;

import com.yuan.dto.EmployeeDTO;
import com.yuan.result.Result;
import com.yuan.service.EmployeeService;
import com.yuan.entity.Employee;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
        // log.info("add employee dt :{}", dto.toString());
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
    public Result getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        log.info(String.valueOf(employee));
        return Result.success(employee);
    }

    // Update
    @PutMapping("/{id}")
    public Result updateEmployee(@RequestBody EmployeeDTO dto) {
        employeeService.updateEmployee(dto);
        return Result.success();
    }

    // Update employee status
    @PutMapping("/{id}/status")
    public Result updateEmployeeStatus(@PathVariable Long id){
        employeeService.updateEmployeeStatus(id);
        return Result.success(id);
    }
    // Delete
    @DeleteMapping("/{id}")
    public Result deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return Result.success(id);
    }

    /**
     * Handles employee name fuzzy search
     * Performs partial matching on employee names using fuzzy search logic
     *
     * @param searchTerm the name or partial name to search for
     * @return list of employees whose names match the search term
     */
    @GetMapping("/search/{searchTerm}")
    public Result searchEmp(@PathVariable String searchTerm){
        // log.info("searchEmp(@PathVariable String searchTerm) is {}",searchTerm);
        List<Employee> employeeList = employeeService.getEmployeesByName(searchTerm);
        return Result.success(employeeList);
    }
}