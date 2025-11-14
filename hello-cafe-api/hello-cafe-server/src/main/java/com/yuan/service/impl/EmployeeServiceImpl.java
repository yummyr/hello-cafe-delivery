package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import com.yuan.constant.PasswordConstant;
import com.yuan.dto.EmployeeDTO;
import com.yuan.dto.EmployeePageQueryDTO;
import com.yuan.entity.Employee;
import com.yuan.repository.EmployeeRepository;
import com.yuan.result.PageResult;
import com.yuan.service.EmployeeService;
import com.yuan.constant.StatusConstant;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Create new employee (AutoFill handles common fields)
     */
    @Override
    public void saveEmployee(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setUsername(dto.getUsername());
        employee.setPassword(passwordEncoder.encode(PasswordConstant.DEFAULT_PASSWORD));
        employee.setPhone(dto.getPhone());
        employee.setGender(dto.getGender());
        employee.setStatus(StatusConstant.ENABLE);

        employeeRepository.save(employee);
    }

    /**
     * Update employee info (AutoFill handles update fields)
     */
    @Override
    public Employee updateEmployee(EmployeeDTO dto) {
        Employee existing = employeeRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException(MessageConstant.ACCOUNT_NOT_FOUND));

        existing.setName(dto.getName());
        existing.setPhone(dto.getPhone());
        existing.setGender(dto.getGender());
        // password, username, status keep the same

        return employeeRepository.save(existing);
    }


    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }


    @Override
    public void updateEmployeeStatus(Long id) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(MessageConstant.ACCOUNT_NOT_FOUND));

            // Handle null status by defaulting to 0 (inactive) if null
            Integer currentStatus = employee.getStatus();
            if (currentStatus == null) {
                currentStatus = StatusConstant.DISABLE; // Default to active if status is null
            }

            Integer newStatus = currentStatus == 1 ? 0 : 1;
            employee.setStatus(newStatus);
            employeeRepository.save(employee);
        } catch (Exception e) {
            log.error("Failed to update employee status: {}", e.getMessage());
        }
    }

    /**
     * employee page query --- Pageable pagination interceptor
     *
     * @param dto
     * @return
     */
    @Override
    public PageResult page(EmployeePageQueryDTO dto) {
        if (dto == null) {
            dto = new EmployeePageQueryDTO();
        }

        Pageable pageable = PageRequest.of(dto.getPage() - 1, dto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "updateTime"));
        Page<Employee> page;

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            page = employeeRepository.findAll(pageable);
        } else {
            page = employeeRepository.findByNameContaining(dto.getName(), pageable);
        }

        return new PageResult(page.getTotalElements(), page.getContent());
    }

}


