import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Briefcase, 
  Building2,
  Table as TableIcon,
  X,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { employeeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { TableSkeleton } from '../components/SkeletonLoader';
import toast from 'react-hot-toast';

const Employees = () => {
  const { role } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState(null);
  
  const initialFormState = {
    name: '', 
    email: '', // Maps to contact_details in DB
    designation: '', 
    username: '', 
    password: '', 
    role: 'Employee', 
    department: '', 
    joining_date: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchEmployees = async () => {
    setLoading(true);
    const response = await employeeApi.getAll({ search: searchTerm });
    if (response.success) setEmployees(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm]);

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      email: emp.contact_details,
      designation: emp.designation,
      username: '', // Password/Username usually not edited here for simplicity or handled differently
      password: '',
      role: emp.role,
      department: emp.department,
      joining_date: emp.date_of_joining
    });
    setCurrentEmpId(emp.emp_id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (emp_id) => {
    if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      const response = await employeeApi.delete(emp_id);
      if (response.success) {
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } else {
        toast.error(response.message || "Failed to delete employee");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    
    if (isEditing) {
      // Map 'email' back to 'contact_details' for the update API
      const updateData = {
        emp_id: currentEmpId,
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        contact_details: formData.email,
        role: formData.role
      };
      response = await employeeApi.update(updateData);
    } else {
      response = await employeeApi.add(formData);
    }

    if (response.success) {
      toast.success(isEditing ? "Employee updated successfully!" : "Employee added successfully!");
      setShowModal(false);
      fetchEmployees();
      setFormData(initialFormState);
      setIsEditing(false);
      setCurrentEmpId(null);
    } else {
      toast.error(response.message || `Failed to ${isEditing ? 'update' : 'add'} employee`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
      style={{ padding: '2rem 0' }}
    >
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Employee Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Manage and view all company personnel records.
          </p>
        </div>

        {role === 'Admin' && (
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData(initialFormState);
              setShowModal(true);
            }}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            <UserPlus size={20} />
            <span>Add Employee</span>
          </button>
        )}
      </header>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name, dept or designation..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '48px', background: 'rgba(255,255,255,0.03)' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '1.5rem' }}>Employee</th>
                  <th style={{ padding: '1.5rem' }}>Department</th>
                  <th style={{ padding: '1.5rem' }}>Designation</th>
                  <th style={{ padding: '1.5rem' }}>Contact</th>
                  <th style={{ padding: '1.5rem' }}>Role</th>
                  <th style={{ padding: '1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {employees.map((emp, i) => (
                    <motion.tr
                      key={emp.emp_id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'middle' }}
                    >
                      <td style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-3">
                           <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(27, 215, 96, 0.05)' }}>
                             <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{emp.name?.[0]}</span>
                           </div>
                           <div>
                              <p style={{ fontWeight: 600, color: 'white' }}>{emp.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {emp.emp_id}</p>
                           </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <Building2 size={14} />
                          {emp.department}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <Briefcase size={14} />
                          {emp.designation}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          <Mail size={14} />
                          {emp.contact_details}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem',
                          background: emp.role === 'Admin' ? 'rgba(255, 99, 132, 0.1)' : emp.role === 'Manager' ? 'rgba(54, 162, 235, 0.1)' : 'rgba(27, 215, 96, 0.1)',
                          color: emp.role === 'Admin' ? '#ff6384' : emp.role === 'Manager' ? '#36a2eb' : '#1bd760'
                        }}>
                          {emp.role}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                        <div className="flex gap-2 justify-end">
                           <button 
                             onClick={() => handleEdit(emp)}
                             className="glass" 
                             style={{ p: '8px', borderRadius: '8px', cursor: 'pointer' }}
                           >
                             <Edit2 size={16} />
                           </button>
                           {role === 'Admin' && (
                             <button 
                               onClick={() => handleDelete(emp.emp_id)}
                               className="glass" 
                               style={{ p: '8px', borderRadius: '8px', color: '#e22134', cursor: 'pointer' }}
                             >
                               <Trash2 size={16} />
                             </button>
                           )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', p: '2rem' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="glass"
               style={{ width: '100%', maxWidth: '600px', backgroundColor: '#181818', padding: '2.5rem', position: 'relative', zIndex: 1 }}
             >
                <div className="flex justify-between items-center mb-8">
                   <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
                   <button onClick={() => setShowModal(false)} className="glass" style={{ p: '8px', borderRadius: '50%' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Full Name</label>
                        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Email/Contact</label>
                        <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                      </div>
                      {!isEditing && (
                        <>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Username</label>
                            <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Initial Password</label>
                            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                          </div>
                        </>
                      )}
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Department</label>
                        <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Designation</label>
                        <input value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Role</label>
                        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required>
                           <option value="Employee">Employee</option>
                           <option value="Manager">Manager</option>
                           <option value="Admin">Admin</option>
                        </select>
                      </div>
                      {!isEditing && (
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Joining Date</label>
                          <input type="date" value={formData.joining_date} onChange={e => setFormData({...formData, joining_date: e.target.value})} required />
                        </div>
                      )}
                   </div>
                   <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '1rem' }}>
                     {isEditing ? 'Save Changes' : 'Create Employee Account'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Employees;
