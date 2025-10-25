package com.yuan.service.impl;

import com.yuan.constant.PasswordConstant;
import com.yuan.context.UserContext;
import com.yuan.dto.EmployeeDTO;
import com.yuan.entity.Employee;
import com.yuan.repository.EmployeeRepository;
import com.yuan.result.Result;
import com.yuan.service.EmployeeService;
import com.yuan.constant.StatusConstant;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    @Override
    public Result saveEmployee(EmployeeDTO dto) {
        Employee employee = new Employee(dto.getId(), dto.getName(), dto.getUsername(),
                passwordEncoder.encode(PasswordConstant.DEFAULT_PASSWORD), dto.getPhone(),
                dto.getGender(), StatusConstant.ENABLE, LocalDateTime.now(), LocalDateTime.now(),
                UserContext.getCurrentUserId(), UserContext.getCurrentUserId());
        employeeRepository.save(employee);
        return Result.success(employee);
    }

    @Override
    public Result<Employee> updateEmployee(EmployeeDTO dto) {
        Employee existing = (Employee) employeeRepository.findByUsername(dto.getUsername()).orElse(null);
        if (existing == null) {
            return Result.error("Username not exists");
        }

        Employee employee = new Employee(dto.getId(), dto.getName(), dto.getUsername(),
                existing.getPassword(), dto.getPhone(), dto.getGender(), existing.getStatus(), existing.getCreateTime(),
                LocalDateTime.now(), existing.getCreateUser(), UserContext.getCurrentUserId());

        employeeRepository.save(employee);
        return Result.success(employee);
    }


    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return employee;
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public void updateEmployeeStatus(Long id) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
            Integer status = employee.getStatus();
            Integer newStatus = (status == 1) ? 0 : 1;
            employee.setStatus(newStatus);
            employee.setUpdateTime(LocalDateTime.now());
            employee.setUpdateUser(UserContext.getCurrentUserId());

            employeeRepository.save(employee);

        }catch (Exception e){
            log.info("Try to update employee status but failed, error :{}", e.getMessage());

        }
    }

    @Override
    public List<Employee> getEmployeesByName(String name) {
        List<Employee> byNameContaining = employeeRepository.findByNameContaining(name);
        return byNameContaining;
    }

}


