package com.yuan.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yuan.dto.LoginRequestDTO;
import com.yuan.dto.LoginResponseDTO;
import com.yuan.dto.RegisterRequestDTO;
import com.yuan.entity.User;
import com.yuan.result.Result;

public interface AuthService {

    /**
     * Validate credentials and generate a JWT token.
     *
     * @param loginRequest DTO containing username, password and role
     * @return token and related info
     */
    LoginResponseDTO login(LoginRequestDTO loginRequest);

   Result<User> registerUser(RegisterRequestDTO registerRequest);


    LoginResponseDTO refreshToken(String oldToken) throws JsonProcessingException;
}
