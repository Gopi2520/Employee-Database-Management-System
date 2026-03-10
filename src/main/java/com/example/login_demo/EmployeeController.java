package com.example.login_demo;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
@Controller
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;
    private EmployeeService employeeService;

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

    @GetMapping("/employee/{id}")
    public String getEmployee(@PathVariable int id, Model model) {
        Employee emp = employeeRepository.findById(id).orElseThrow();
        model.addAttribute("employee", emp);
        return "employeeView";
    }
    @DeleteMapping("/deleteEmployee/{id}")
    @ResponseBody
    public ResponseEntity<String> deleteEmployee(@PathVariable int id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return new ResponseEntity<>("Employee with ID " + id + " deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Employee with ID " + id + " not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/viewEmployeesByName")
    @ResponseBody
    public List<Employee> getEmployeesByName(@RequestParam String empname) {
        return employeeService.findByFnameContainingIgnoreCase(empname);
    }
    
    @GetMapping("/viewAllEmployees")
    @ResponseBody
    public List<Employee> viewAllEmployees() {
        return employeeRepository.findAll();
    }

   @GetMapping("/getEmployeeByName")
@ResponseBody
public ResponseEntity<List<Employee>> getEmployeeByName(@RequestParam String empname) {
    List<Employee> employees = employeeRepository.findByFnameContainingIgnoreCase(empname);
    return employees.isEmpty()
            ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
            : ResponseEntity.ok(employees);
}

    @GetMapping("/getEmployeeById/{id}")
    @ResponseBody
    public ResponseEntity<Employee> getEmployeeById(@PathVariable int id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PutMapping("/updateEmployee/{id}")
    @ResponseBody
    public ResponseEntity<String> updateEmployee(@PathVariable int id, @RequestBody Employee updatedEmployee) {
        return employeeRepository.findById(id)
                .map(emp -> {
                    emp.setFname(updatedEmployee.getFname());
                    emp.setLname(updatedEmployee.getLname());
                    emp.setContact(updatedEmployee.getContact());
                    emp.setMail(updatedEmployee.getMail());
                    emp.setAge(updatedEmployee.getAge());
                    emp.setSex(updatedEmployee.getSex());
                    emp.setDegree(updatedEmployee.getDegree());
                    emp.setRole(updatedEmployee.getRole());
                    emp.setSalary(updatedEmployee.getSalary());
                    if (updatedEmployee.getImg() != null) {
                        emp.setImg(updatedEmployee.getImg());
                    }
                    employeeRepository.save(emp);
                    return ResponseEntity.ok("Employee updated successfully");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found"));
    }
}