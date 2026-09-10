import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('car_rental_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('car_rental_all_users');
    return saved ? JSON.parse(saved) : [
      { email: 'admin@carrental.com', password: 'password123', name: 'Admin User', role: 'Administrator' },
      { email: 'demo@user.com', password: 'password123', name: 'Demo Manager', role: 'Fleet Manager' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('car_rental_all_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password) => {
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const sessionUser = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || 'Staff Member',
        token: `jwt_token_${Date.now()}`
      };
      setUser(sessionUser);
      localStorage.setItem('car_rental_user', JSON.stringify(sessionUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const register = (name, email, password) => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      name,
      email,
      password,
      role: 'Fleet Manager'
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('car_rental_all_users', JSON.stringify(updatedUsers));

    // Auto login
    const sessionUser = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: `jwt_token_${Date.now()}`
    };
    setUser(sessionUser);
    localStorage.setItem('car_rental_user', JSON.stringify(sessionUser));

    return { success: true };
  };

  const resetPassword = (email, newPassword) => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      return { success: false, message: 'No registered user found with this email address.' };
    }

    const updatedUsers = registeredUsers.map((u) =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
    );

    setRegisteredUsers(updatedUsers);
    localStorage.setItem('car_rental_all_users', JSON.stringify(updatedUsers));
    return { success: true, message: 'Password reset successfully! You can now log in.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('car_rental_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
