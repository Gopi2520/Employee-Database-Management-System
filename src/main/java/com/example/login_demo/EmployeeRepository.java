package com.example.login_demo;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
	import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
    List<Employee> findByFnameContainingIgnoreCase(String fname);
    }