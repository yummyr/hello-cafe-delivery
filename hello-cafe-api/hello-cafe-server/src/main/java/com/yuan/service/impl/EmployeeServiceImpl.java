package com.yuan.hellocafeserver.service.impl;

import com.yuan.entity.Employee;
import com.yuan.hellocafeserver.repository.EmployeeRepository;
import com.yuan.hellocafeserver.service.EmployeeService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Long id, Employee employee) {
        Optional<Employee> existing = employeeRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        Employee old = existing.get();
        old.setName(employee.getName());
        old.setUsername(employee.getUsername());
        old.setPassword(employee.getPassword());
        old.setPhone(employee.getPhone());
        old.setGender(employee.getGender());
        old.setStatus(employee.getStatus());
        old.setUpdateTime(employee.getUpdateTime());
        return employeeRepository.save(old);
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