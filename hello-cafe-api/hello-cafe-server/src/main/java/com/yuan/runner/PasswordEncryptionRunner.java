import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PasswordEncryptionRunner implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1️⃣ 加密所有 employee 密码
        employeeRepository.findAll().forEach(emp -> {
            if (!emp.getPassword().startsWith("$2a$")) { // 说明还没加密
                emp.setPassword(passwordEncoder.encode(emp.getPassword()));
                employeeRepository.save(emp);
                System.out.println("🔐 Encrypted employee: " + emp.getUsername());
            }
        });

        // 2️⃣ 加密所有 user 密码
        userRepository.findAll().forEach(user -> {
            if (!user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
                System.out.println("🔐 Encrypted user: " + user.getUsername());
            }
        });
    }
}
