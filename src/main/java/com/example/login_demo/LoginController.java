package com.example.login_demo;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
        return buildResponse(user != null ? user.getUsername() : null, user != null ? user.getPassword() : null);
    }

    @PostMapping(
            value = "/login",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @CrossOrigin(origins = "*")
    public Map<String, Object> loginForm(@RequestParam String username, @RequestParam String password) {
        return buildResponse(username, password);
    }

    private Map<String, Object> buildResponse(String username, String password) {
        String u = username == null ? null : username.trim();
        String p = password == null ? null : password.trim();

        Map<String, Object> response = new HashMap<>();
        if ("we".equals(u) && "we".equals(p)) {
            response.put("success", true);
            response.put("redirect", "/home.html");
        } else {
            response.put("success", false);
            response.put("redirect", "/index.html");
        }
        return response;
    }
}