package com.yuan.service;

import com.yuan.dto.EmployeeDTO;
import com.yuan.entity.Employee;
import com.yuan.result.Result;

import java.util.List;

public interface EmployeeService {
    void saveEmployee(EmployeeDTO employee);
    Result<Employee> updateEmployee(EmployeeDTO dto);
    void deleteEmployee(Long id);
    Employee getEmployeeById(Long id);
    List<Employee> getAllEmployees();


}