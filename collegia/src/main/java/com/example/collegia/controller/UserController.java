package com.example.collegia.controller;

import com.example.collegia.entity.UserEntity;
import com.example.collegia.repository.UserRepository;
import com.example.collegia.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
        Optional<UserEntity> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserEntity> getUserByEmail(@PathVariable String email) {
        Optional<UserEntity> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserEntity createUser(@RequestBody UserEntity user) {

        // Default password WITHOUT hashing
        String defaultPassword = "12345678";
        user.setPassword(defaultPassword);
        user.setFirstLogin(true);

        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserEntity> updateUser(
            @PathVariable Long id,
            @RequestBody UserEntity userDetails) {

        try {
            UserEntity updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Pagination
    @GetMapping("/paged")
    public Page<UserEntity> getUsersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "150") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }

    // Change password (NO hashing)
    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String newPassword = body.get("password");

        if (newPassword == null || newPassword.trim().length() < 6) {
            return ResponseEntity.badRequest()
                    .body("Password must be at least 6 characters long.");
        }

        userService.changePassword(id, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/import-excel")
    public ResponseEntity<?> importExcel(@RequestBody List<Map<String, Object>> rows) {

        int importedCount = 0;
        int skippedCount = 0;

        for (Map<String, Object> row : rows) {

            String firstName = (row.get("firstName") + "").trim();
            String lastName = (row.get("lastName") + "").trim();
            String email = (row.get("email") + "").trim();
            String userType = (row.get("userType") + "").trim();

            // Skip if required fields missing
            if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || userType.isEmpty()) {
                skippedCount++;
                continue;
            }

            // Skip if email already exists
            if (userService.emailExists(email)) {
                skippedCount++;
                continue;
            }

            // Create user
            UserEntity user = new UserEntity();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setUserType(userType);

            // Default password
            user.setPassword("12345678");
            user.setFirstLogin(true);

            // Optional fields (ignored if missing)
            if (row.containsKey("course")) user.setAbout((String) row.get("course"));
            if (row.containsKey("organization")) user.setLocation((String) row.get("organization"));

            userService.createUser(user);
            importedCount++;
        }

        return ResponseEntity.ok(
                "Imported: " + importedCount + " | Skipped: " + skippedCount
        );
    }

}
