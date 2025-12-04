package com.example.collegia.service;

import com.example.collegia.controller.AuthController;
import com.example.collegia.entity.CoordinatorEntity;
import com.example.collegia.entity.CustodianEntity;
import com.example.collegia.entity.FacultyEntity;
import com.example.collegia.entity.StudentEntity;
import com.example.collegia.entity.UserEntity;
import com.example.collegia.repository.CustodianRepository;
import com.example.collegia.repository.CoordinatorRepository;
import com.example.collegia.repository.FacultyRepository;
import com.example.collegia.repository.StudentRepository;
import com.example.collegia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private CustodianRepository custodianRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private CoordinatorRepository coordinatorRepository;

    public UserEntity registerUser(AuthController.SignUpRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserEntity user = new UserEntity();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUserType(request.getUserType());
        user.setPassword(request.getPassword()); // store raw password temporarily

        UserEntity savedUser = userRepository.save(user);

        switch (request.getUserType()) {
            // In your AuthService.java, add this to the switch statement in registerUser method
            case "Custodian":
                CustodianEntity custodian = new CustodianEntity();
                custodian.setDepartment(request.getDepartment());
                custodianRepository.save(custodian);
                break;
                
            case "Student":
                StudentEntity student = new StudentEntity();
                student.setCourse(request.getCourse());
                student.setOrganization(request.getOrganization());
                studentRepository.save(student);
                break;

            case "Faculty":
                FacultyEntity faculty = new FacultyEntity();
                faculty.setDepartment(request.getDepartment());
                facultyRepository.save(faculty);
                break;

            case "Coordinator":
                CoordinatorEntity coordinator = new CoordinatorEntity();
                coordinator.setAffiliation(request.getAffiliation());
                coordinatorRepository.save(coordinator);
                break;
            
        }

        return savedUser;
    }

    public UserEntity authenticateUser(String email, String rawPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Direct comparison of raw password
        if (!rawPassword.equals(user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}
