package com.yuan.runner;

import com.yuan.repository.EmployeeRepository;
import com.yuan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordEncryptionRunner implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. encode all employee password
        employeeRepository.findAll().forEach(emp -> {
            if (!emp.getPassword().startsWith("$2a$")) { // if not encoded
                emp.setPassword(passwordEncoder.encode(emp.getPassword()));
                employeeRepository.save(emp);
                System.out.println("Encrypted employee: " + emp.getUsername());
            }
        });

        // 2. encode all user password
        userRepository.findAll().forEach(user -> {
            if (!user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
                System.out.println("Encrypted user: " + user.getUsername());
            }
        });
    }
}
