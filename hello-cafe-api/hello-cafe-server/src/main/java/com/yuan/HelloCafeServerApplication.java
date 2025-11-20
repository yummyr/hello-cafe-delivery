package com.yuan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class HelloCafeServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloCafeServerApplication.class, args);
    }

}
