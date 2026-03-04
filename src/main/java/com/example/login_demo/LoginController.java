package com.example.login_demo;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @PostMapping(value = "/login", consumes = {"application/json", "application/x-www-form-urlencoded"})
@CrossOrigin(origins = "*")
public Map<String, Object> login(@RequestParam(required = false) String username,
                                 @RequestParam(required = false) String password,
                                 @RequestBody(required = false) Map<String, String> payload) {
    if (payload != null) {
        username = payload.get("username");
        password = payload.get("password");
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