package com.example.login_demo;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public Map<String, Object> login(
            @RequestParam String username,
            @RequestParam String password) {

        Map<String, Object> response = new HashMap<>();
        if ("we".equals(username) && "we".equals(password)) {
            response.put("success", true);
            response.put("redirect", "/home.html");
        } else {
            response.put("success", false);
            response.put("redirect", "/index.html");
        }
        return response;
    }
}