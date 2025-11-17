package com.example.collegia.service;

import com.example.collegia.controller.AuthController; // Import the controller to access inner classes
import com.example.collegia.entity.CoordinatorEntity;
import com.example.collegia.entity.FacultyEntity;
import com.example.collegia.entity.StudentEntity;
import com.example.collegia.entity.UserEntity;
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
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private CoordinatorRepository coordinatorRepository;

    // inner class from AuthController
    public UserEntity registerUser(AuthController.SignUpRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // base user
        UserEntity user = new UserEntity();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUserType(request.getUserType());

        UserEntity savedUser = userRepository.save(user);

        switch (request.getUserType()) {
            case "Student":
                StudentEntity student = new StudentEntity();
                student.setFirstName(request.getFirstName());
                student.setLastName(request.getLastName());
                student.setEmail(request.getEmail());
                student.setUserType(request.getUserType());
                student.setCourse(request.getCourse());
                student.setOrganization(request.getOrganization());
                studentRepository.save(student);
                break;

            case "Faculty":
                FacultyEntity faculty = new FacultyEntity();
                faculty.setFirstName(request.getFirstName());
                faculty.setLastName(request.getLastName());
                faculty.setEmail(request.getEmail());
                faculty.setUserType(request.getUserType());
                faculty.setDepartment(request.getDepartment());
                facultyRepository.save(faculty);
                break;

            case "Coordinator":
                CoordinatorEntity coordinator = new CoordinatorEntity();
                coordinator.setFirstName(request.getFirstName());
                coordinator.setLastName(request.getLastName());
                coordinator.setEmail(request.getEmail());
                coordinator.setUserType(request.getUserType());
                coordinator.setAffiliation(request.getAffiliation());
                coordinatorRepository.save(coordinator);
                break;
        }

        return savedUser;
    }

    public UserEntity authenticateUser(String email, String password) {
        Optional<UserEntity> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            // FOR FINAL use password hashing - pls
            return user.get();
        }
        throw new RuntimeException("Invalid email or password");
    }
}