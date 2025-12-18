import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Password tidak cocok')
            return
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.ok) {
                navigate('/login', { state: { message: 'Registrasi berhasil! Silakan login.' } })
            } else {
                setError(data.error || 'Registrasi gagal')
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
                        Buat Akun
                    </h1>
                    <p className="text-white/70">Daftar untuk melaporkan insiden</p>
                </div>

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
                            placeholder="Minimal 6 karakter"
                            required
                        />
                    </div>

                    <div>
                        <label className="label-text">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                            placeholder="Masukkan password lagi"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                    >
                        {loading ? 'Mendaftar...' : 'Daftar'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/70">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
