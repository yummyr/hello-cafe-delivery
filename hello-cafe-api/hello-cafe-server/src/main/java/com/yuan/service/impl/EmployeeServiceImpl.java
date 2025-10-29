package com.yuan.service.impl;

import com.yuan.constant.MessageConstant;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import com.yuan.constant.PasswordConstant;
import com.yuan.context.UserContext;
import com.yuan.dto.EmployeeDTO;
import com.yuan.dto.EmployeePageQueryDTO;
import com.yuan.entity.Employee;
import com.yuan.repository.EmployeeRepository;
import com.yuan.result.PageResult;
import com.yuan.service.EmployeeService;
import com.yuan.constant.StatusConstant;

import java.time.LocalDateTime;
import java.util.List;

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


    @Override
    public void saveEmployee(EmployeeDTO dto) {
        Employee employee = new Employee(dto.getId(), dto.getName(), dto.getUsername(),
                passwordEncoder.encode(PasswordConstant.DEFAULT_PASSWORD), dto.getPhone(),
                dto.getGender(), StatusConstant.ENABLE, LocalDateTime.now(), LocalDateTime.now(),
                UserContext.getCurrentUserId(), UserContext.getCurrentUserId());
        employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(EmployeeDTO dto) {
        Employee existing = (Employee) employeeRepository.findByUsername(dto.getUsername()).orElse(null);
        if (existing == null) {
            throw new IllegalArgumentException("Username not exists");
        }

        Employee employee = new Employee(dto.getId(), dto.getName(), dto.getUsername(),
                existing.getPassword(), dto.getPhone(), dto.getGender(), existing.getStatus(), existing.getCreateTime(),
                LocalDateTime.now(), existing.getCreateUser(), UserContext.getCurrentUserId());

        employeeRepository.save(employee);
        return employee;
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
            Integer status = employee.getStatus();
            Integer newStatus = (status == 1) ? 0 : 1;
            employee.setStatus(newStatus);
            employee.setUpdateTime(LocalDateTime.now());
            employee.setUpdateUser(UserContext.getCurrentUserId());

            employeeRepository.save(employee);

        } catch (Exception e) {
            log.info("Try to update employee status but failed, error :{}", e.getMessage());

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


