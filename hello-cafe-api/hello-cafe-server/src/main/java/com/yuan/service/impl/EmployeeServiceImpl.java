package com.yuan.service.impl;

import com.yuan.constant.PasswordConstant;
import com.yuan.dto.EmployeeDTO;
import com.yuan.entity.Employee;
import com.yuan.repository.EmployeeRepository;
import com.yuan.result.Result;
import com.yuan.service.EmployeeService;
import com.yuan.constant.StatusConstant;

import java.time.LocalDateTime;
import java.util.List;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void saveEmployee(EmployeeDTO dto) {
        Employee employee = new Employee(dto.getId(), dto.getName(), dto.getUsername(),
                passwordEncoder.encode(PasswordConstant.DEFAULT_PASSWORD), dto.getPhone(),
                dto.getGender(), StatusConstant.ENABLE, LocalDateTime.now(), LocalDateTime.now());
        employeeRepository.save(employee);
    }

    @Override
    public Result<Employee> updateEmployee(EmployeeDTO dto) {
        Employee existing = (Employee) employeeRepository.findByUsername(dto.getUsername()).orElse(null);
        if (existing == null) {
            return Result.error("Username not exists");
        }

        Employee employee = new Employee(dto.getId(), dto.getName(), dto.getUsername(),
                existing.getPassword(), dto.getPhone(), dto.getGender(), existing.getStatus(), existing.getCreateTime(), LocalDateTime.now());

        employeeRepository.save(employee);
        return Result.success(employee);
    }


    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }


}