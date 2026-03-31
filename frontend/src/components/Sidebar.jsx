import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  ClipboardList, 
  Users, 
  PieChart, 
  LogOut,
  User,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout, role } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['Admin', 'Manager', 'Employee'] },
    { name: 'Attendance', icon: Clock, path: '/attendance', roles: ['Admin', 'Manager', 'Employee'] },
    { name: 'Apply Leave', icon: CalendarPlus, path: '/apply', roles: ['Employee'] },
    { name: 'Manage Leaves', icon: ClipboardList, path: '/manage', roles: ['Admin', 'Manager'] },
    { name: 'Employees', icon: Users, path: '/employees', roles: ['Admin', 'Manager'] },
    { name: 'Analytics', icon: PieChart, path: '/analytics', roles: ['Admin', 'Manager'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <motion.div 
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      className="glass"
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        borderRadius: '0 24px 24px 0',
        zIndex: 50
      }}
    >
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="glass" style={{ p: '0.5rem', borderRadius: '12px', background: 'var(--primary-color)' }}>
          <LayoutDashboard size={24} color="black" />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>DNS SYSTEMS</h1>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {filteredItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-smooth ${isActive ? 'glass-active' : 'hover-dim'}`}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(27, 215, 96, 0.1)' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400
                })}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="glass-card" style={{ padding: '1rem', marginTop: 'auto' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-100"
          style={{ 
            background: 'rgba(226, 33, 52, 0.1)', 
            color: '#e22134',
            padding: '10px',
            width: '100%',
            justifyContent: 'center',
            fontSize: '0.875rem'
          }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
