package com.example.login_demo;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public Map<String, Object> login(
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String password) {

        if (username == null && body != null) {
            Object u = body.get("username");
            if (u != null) {
                username = u.toString();
            }
        }
        if (password == null && body != null) {
            Object p = body.get("password");
            if (p != null) {
                password = p.toString();
            }
        }

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