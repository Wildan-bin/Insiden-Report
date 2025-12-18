import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const successMessage = location.state?.message

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.ok) {
                setIsAuthenticated(true)
                navigate('/dashboard')
            } else {
                setError(data.error || 'Login gagal')
            }
        } catch (error) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
                        Selamat Datang
                    </h1>
                    <p className="text-white/70">Login ke sistem pelaporan insiden</p>
                </div>

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm animate-slide-up">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm animate-slide-up">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="label-text">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            placeholder="Masukkan username"
                            required
                        />
                    </div>

                    <div>
                        <label className="label-text">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Login...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/70">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
