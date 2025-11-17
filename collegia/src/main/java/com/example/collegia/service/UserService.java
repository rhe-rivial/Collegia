package com.example.collegia.service;

import com.example.collegia.entity.UserEntity;
import com.example.collegia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<UserEntity> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }
    
    public UserEntity updateUser(Long id, UserEntity userDetails) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setUserType(userDetails.getUserType());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        UserEntity user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }
    
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}