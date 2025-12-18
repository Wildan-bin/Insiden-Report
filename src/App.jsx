import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/check-auth', {
                credentials: 'include'
            })
            const data = await response.json()
            setIsAuthenticated(data.authenticated)
        } catch (error) {
            console.error('Auth check failed:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route
                path="/dashboard"
                element={
                    isAuthenticated ? (
                        <Dashboard setIsAuthenticated={setIsAuthenticated} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
    )
}

export default App
