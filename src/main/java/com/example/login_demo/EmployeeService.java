package com.example.login_demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
	@Service
	public class EmployeeService {
	    @Autowired
	    private EmployeeRepository repo;

	    public List<Employee> findByFirstName(String fname) {
	        return repo.findByFnameIgnoreCase(fname);
	}
	    public List<Employee> findByFnameContainingIgnoreCase(String fname) {
	        return repo.findByFnameContainingIgnoreCase(fname);
	    }
}
