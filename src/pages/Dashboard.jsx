import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard({ setIsAuthenticated }) {
    const [incidents, setIncidents] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        tanggal: '',
        kategori: '',
        narasi: ''
    })

    useEffect(() => {
        fetchIncidents()
    }, [])

    const fetchIncidents = async () => {
        try {
            const response = await fetch('/api/incidents', {
                credentials: 'include'
            })
            if (response.ok) {
                const data = await response.json()
                setIncidents(data)
            }
        } catch (error) {
            console.error('Failed to fetch incidents:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            })
            setIsAuthenticated(false)
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Laporan insiden berhasil dikirim!' })
                setFormData({ tanggal: '', kategori: '', narasi: '' })
                setShowModal(false)
                fetchIncidents()
                setTimeout(() => setMessage({ type: '', text: '' }), 3000)
            } else {
                setMessage({ type: 'error', text: data.error || 'Gagal mengirim laporan' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' })
        } finally {
            setSubmitting(false)
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('id-ID', options)
    }

    const getCategoryColor = (kategori) => {
        const colors = {
            'Keamanan': 'bg-red-500/20 text-red-300 border-red-500/50',
            'Teknis': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
            'Operasional': 'bg-green-500/20 text-green-300 border-green-500/50',
            'Lainnya': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
        }
        return colors[kategori] || colors['Lainnya']
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="glass-card p-6 mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                Dashboard Pelaporan Insiden
                            </h1>
                            <p className="text-white/70 mt-1">Kelola dan pantau laporan insiden Anda</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Success/Error Message */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl border animate-slide-up ${message.type === 'success'
                            ? 'bg-green-500/20 border-green-500/50 text-green-200'
                            : 'bg-red-500/20 border-red-500/50 text-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Action Button */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <span className="text-xl mr-2">+</span>
                        Laporkan Insiden
                    </button>
                </div>

                {/* Incidents List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Laporan Insiden</h2>

                    {loading ? (
                        <div className="glass-card p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                            <p className="mt-4 text-white/70">Memuat data...</p>
                        </div>
                    ) : incidents.length === 0 ? (
                        <div className="glass-card p-8 text-center animate-fade-in">
                            <p className="text-white/70 text-lg">Belum ada laporan insiden</p>
                            <p className="text-white/50 text-sm mt-2">Klik tombol "Laporkan Insiden" untuk membuat laporan baru</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {incidents.map((incident, index) => (
                                <div
                                    key={incident.id}
                                    className="glass-card p-6 card-hover animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getCategoryColor(incident.kategori)}`}>
                                                    {incident.kategori}
                                                </span>
                                                <span className="text-white/60 text-sm">
                                                    {formatDate(incident.tanggal)}
                                                </span>
                                            </div>
                                            <p className="text-white/90 leading-relaxed">{incident.narasi}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-white/50 text-xs">
                                            Dilaporkan pada {formatDate(incident.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="glass-card p-8 w-full max-w-2xl animate-slide-up">
                            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                Laporkan Insiden Baru
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="label-text">Tanggal Insiden</label>
                                    <input
                                        type="date"
                                        value={formData.tanggal}
                                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label-text">Kategori</label>
                                    <select
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        <option value="Keamanan">Keamanan</option>
                                        <option value="Teknis">Teknis</option>
                                        <option value="Operasional">Operasional</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="label-text">Narasi Insiden</label>
                                    <textarea
                                        value={formData.narasi}
                                        onChange={(e) => setFormData({ ...formData, narasi: e.target.value })}
                                        className="input-field min-h-[120px] resize-y"
                                        placeholder="Jelaskan detail insiden yang terjadi..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary flex-1"
                                    >
                                        {submitting ? 'Mengirim...' : 'Kirim Laporan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
