import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Nav from './components/Nav';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import RestaurantDashboard from './components/RestaurantDashboard';
import Admin from './components/Admin';
import CustomerDashboard from "./components/CustomerDashboard";
import DonorDashboard from "./components/DonorDashboard";
import NeedyDashboard from "./components/NeedyDashboard";
import './App.css';

function App() {
return (
    <AuthProvider>
        <Router>
            <div className="App">
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />

                    <Route 
                        path="/RestaurantDashboard" 
                        element={
                            <ProtectedRoute requiredRole="Restaurant">
                                <RestaurantDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    <Route 
                        path="/DonorDashboard" 
                        element={
                            <ProtectedRoute requiredRole="Donor">
                                <DonorDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/CustomerDashboard" 
                        element={
                            <ProtectedRoute requiredRole="Customer">
                                <CustomerDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    <Route 
                        path="/NeedyDashboard" 
                        element={
                            <ProtectedRoute requiredRole="Needy">
                                <NeedyDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    <Route 
                        path="Admin" 
                        element={
                            <ProtectedRoute requiredRole="Administrator">
                                <Admin />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </div>
        </Router>
    </AuthProvider>
);
}

export default App;
