package com.example.login_demo;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @PostMapping(
            value = "/login",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @CrossOrigin(origins = "*")
    public Map<String, Object> loginJson(@RequestBody User user) {
        return doLogin(user);
    }

    @PostMapping(
            value = "/login",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @CrossOrigin(origins = "*")
    public Map<String, Object> loginForm(User user) {
        return doLogin(user);
    }

    private Map<String, Object> doLogin(User user) {
        Map<String, Object> response = new HashMap<>();
        if ("we".equals(user.getUsername()) && "we".equals(user.getPassword())) {
            response.put("success", true);
            response.put("redirect", "/home.html");
        } else {
            response.put("success", false);
            response.put("redirect", "/index.html");
        }
        return response;
    }
}