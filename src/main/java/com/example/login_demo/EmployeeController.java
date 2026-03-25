package com.example.login_demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api") // optional, prefix all endpoints
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeService employeeService;

    // ---------- CREATE ----------
    @PostMapping("/uploadEmployee")
    public ResponseEntity<String> uploadEmployee(
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("contact") String contact,
            @RequestParam("mail") String mail,
            @RequestParam("age") int age,
            @RequestParam("sex") String sex,
            @RequestParam("degree") String degree,
            @RequestParam("role") String role,
            @RequestParam("salary") double salary,
            @RequestParam("img") MultipartFile img) throws Exception {

        Employee emp = new Employee();
        emp.setFname(fname);
        emp.setLname(lname);
        emp.setContact(contact);
        emp.setMail(mail);
        emp.setAge(age);
        emp.setSex(sex);
        emp.setDegree(degree);
        emp.setRole(role);
        emp.setSalary(salary);

        if (img != null && !img.isEmpty()) {
            emp.setImg(img.getBytes());
        }

        employeeRepository.save(emp);
        return ResponseEntity.ok("Employee uploaded successfully");
    }

    // ---------- DELETE ----------
    @DeleteMapping("/deleteEmployee/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int id) {
        return employeeRepository.findById(id)
                .map(emp -> {
                    employeeRepository.delete(emp);
                    return ResponseEntity.ok("Employee deleted successfully");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Employee not found"));
    }

    // ---------- SEARCH BY NAME ----------
    @GetMapping("/viewEmployeesByName")
    public ResponseEntity<List<EmployeeDTO>> getEmployeesByName(@RequestParam("empname") String empname) {
        List<Employee> employees = employeeService.findByFnameContainingIgnoreCase(empname);
        List<EmployeeDTO> dtos = employees.stream().map(this::toDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    // ---------- VIEW ALL ----------
    @GetMapping("/viewAllEmployees")
    public ResponseEntity<List<EmployeeDTO>> viewAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        List<EmployeeDTO> dtos = employees.stream().map(this::toDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    // ---------- GET BY ID ----------
    @GetMapping("/getEmployeeById/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable int id) {
        return employeeRepository.findById(id)
                .map(emp -> ResponseEntity.ok(toDTO(emp)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // ---------- UPDATE ----------
    @PutMapping("/updateEmployee/{id}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable int id,
            @RequestParam("fname") String fname,
            @RequestParam("lname") String lname,
            @RequestParam("contact") String contact,
            @RequestParam("mail") String mail,
            @RequestParam("age") int age,
            @RequestParam("sex") String sex,
            @RequestParam("degree") String degree,
            @RequestParam("role") String role,
            @RequestParam("salary") double salary,
            @RequestParam(value = "img", required = false) MultipartFile img) {

        return employeeRepository.findById(id)
                .map(emp -> {
                    emp.setFname(fname);
                    emp.setLname(lname);
                    emp.setContact(contact);
                    emp.setMail(mail);
                    emp.setAge(age);
                    emp.setSex(sex);
                    emp.setDegree(degree);
                    emp.setRole(role);
                    emp.setSalary(salary);

                    try {
                        if (img != null && !img.isEmpty()) {
                            emp.setImg(img.getBytes());
                        }
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Image processing error");
                    }

                    employeeRepository.save(emp);
                    return ResponseEntity.ok("Employee updated successfully");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found"));
    }

    // ---------- HELPER: Convert Employee -> EmployeeDTO ----------
    private EmployeeDTO toDTO(Employee emp) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(emp.getId());
        dto.setFname(emp.getFname());
        dto.setLname(emp.getLname());
        dto.setContact(emp.getContact());
        dto.setMail(emp.getMail());
        dto.setAge(emp.getAge());
        dto.setSex(emp.getSex());
        dto.setDegree(emp.getDegree());
        dto.setRole(emp.getRole());
        dto.setSalary(emp.getSalary());
        dto.setCreatedAt(emp.getCreatedAt() != null ? emp.getCreatedAt().toString() : null);
        return dto;
    }
}