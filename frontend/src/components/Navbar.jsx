import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Home, FileText, BarChart, Settings } from 'lucide-react'

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem', 
      backgroundColor: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>EMS Pro</Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={linkStyle}><Home size={18} /> Dashboard</Link>
          {user.role === 'Employee' && (
            <Link to="/apply" style={linkStyle}><FileText size={18} /> Apply Leave</Link>
          )}
          {(user.role === 'Manager' || user.role === 'Admin') && (
            <>
              <Link to="/manage" style={linkStyle}><FileText size={18} /> Approvals</Link>
              <Link to="/analytics" style={linkStyle}><BarChart size={18} /> Analytics</Link>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem' }}>Welcome, <strong>{user.name}</strong></span>
        <button onClick={handleLogout} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          backgroundColor: 'transparent', 
          color: 'var(--danger)', 
          padding: '0.5rem 1rem', 
          border: '1px solid var(--danger)',
          fontSize: '0.9rem'
        }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  )
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'color 0.2s ease',
}

export default Navbar
