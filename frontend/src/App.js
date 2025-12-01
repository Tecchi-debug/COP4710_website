import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Nav from './components/Nav';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Restaurants from './components/Restaurants';
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
                        path="/restaurants" 
                        element={
                            <ProtectedRoute requiredRole="Restaurant">
                                <Restaurants />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute requiredRole="Administrator">
                                <Admin />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="/customer"
                        element={
                            <ProtectedRoute>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/donor"
                        element={
                            <ProtectedRoute>
                                <DonorDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/needy"
                        element={
                            <ProtectedRoute>
                                <NeedyDashboard />
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
