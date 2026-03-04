package com.example.login_demo;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmployeeSchemaInitializer {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/init-employee-table")
    @Transactional
    public String initEmployeeTable() {
        entityManager.createNativeQuery("""
            CREATE TABLE IF NOT EXISTS employee (
                id          SERIAL PRIMARY KEY,
                fname       VARCHAR(255),
                lname       VARCHAR(255),
                contact     VARCHAR(255),
                mail        VARCHAR(255),
                age         INT,
                sex         VARCHAR(50),
                degree      VARCHAR(255),
                role        VARCHAR(255),
                salary      DOUBLE PRECISION,
                img         BYTEA,
                created_at  TIMESTAMP
            )
        """).executeUpdate();
        return "employee table ensured";
    }
}

