package com.example.collegia.service;

import com.example.collegia.controller.AuthController;
import com.example.collegia.entity.*;

import com.example.collegia.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private CustodianRepository custodianRepository;

    @Autowired
    private CoordinatorRepository coordinatorRepository;

    // SIGN UP
    public UserEntity registerUser(AuthController.SignUpRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserEntity user = new UserEntity();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUserType(request.getUserType());
        user.setPassword(request.getPassword()); // STORE RAW PASSWORD
        user.setFirstLogin(false);

        UserEntity savedUser = userRepository.save(user);

        switch (request.getUserType()) {
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

            case "Custodian":
                CustodianEntity custodian = new CustodianEntity();
                custodian.setDepartment(request.getDepartment());
                custodianRepository.save(custodian);
                break;

            case "Coordinator":
                CoordinatorEntity coordinator = new CoordinatorEntity();
                coordinator.setAffiliation(request.getAffiliation());
                coordinatorRepository.save(coordinator);
                break;
        }

        return savedUser;
    }

    // SIGN IN (RAW PASSWORD CHECK)
    public UserEntity authenticateUser(String email, String rawPassword) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!rawPassword.equals(user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}
