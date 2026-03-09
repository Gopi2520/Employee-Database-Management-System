package com.example.login_demo;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class LoginController {
    @PostMapping("/login")
    @CrossOrigin(origins = "*")

    public Map<String, Object> login(@RequestBody User user) {
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