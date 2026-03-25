package com.example.login_demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeService employeeService;

    // ---------- CREATE ----------
    @PostMapping("/uploadEmployee")
    public String uploadEmployee(
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
        emp.setImg(img.getBytes());

        employeeRepository.save(emp);

        return "redirect:/success.html";
    }

    // ---------- VIEW BY ID (THYMELEAF) ----------
    @GetMapping("/employee/{id}")
    public String getEmployee(@PathVariable("id") int id, Model model) {

        Employee emp = employeeRepository.findById(id).orElseThrow();

        model.addAttribute("employee", emp);

        return "employeeView";
    }

    // ---------- DELETE ----------
    @DeleteMapping("/deleteEmployee/{id}")
    @ResponseBody
    public ResponseEntity<String> deleteEmployee(@PathVariable("id") int id) {

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
    @ResponseBody
    public ResponseEntity<List<Employee>> getEmployeesByName(
            @RequestParam("empname") String empname) {

        List<Employee> employees =
                employeeService.findByFnameContainingIgnoreCase(empname);

        return ResponseEntity.ok(employees);
    }

    // ---------- VIEW ALL ----------
    @GetMapping("/viewAllEmployees")
    @ResponseBody
    public List<Employee> viewAllEmployees() {

        return employeeRepository.findAll();
    }

    // ---------- GET BY ID (JSON) ----------
    @GetMapping("/getEmployeeById/{id}")
    @ResponseBody
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("id") int id) {

        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // ---------- UPDATE ----------
    @PutMapping("/updateEmployee/{id}")
    @ResponseBody
    public ResponseEntity<String> updateEmployee(

            @PathVariable("id") int id,
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
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Employee not found"));
    }
}
