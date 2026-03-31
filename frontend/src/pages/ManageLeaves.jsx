import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Search, 
  Filter, 
  Calendar,
  User,
  MoreVertical,
  Clock,
  ArrowUpDown,
  ClipboardList
} from 'lucide-react';
import { leaveApi } from '../services/api';
import GlassCard from '../components/GlassCard';
import { TableSkeleton } from '../components/SkeletonLoader';
import toast from 'react-hot-toast';

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    const response = await leaveApi.getLeaves({ status: filterStatus });
    if (response.success) {
      setLeaves(response.data);
    } else {
      toast.error(response.message || "Failed to fetch leaves");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus]);

  const handleAction = async (leaveId, status) => {
    const response = await leaveApi.approve({ leave_id: leaveId, status });
    if (response.success) {
      toast.success(`Leave ${status} successfully!`);
      // Update local state to remove the processed item smoothly
      setLeaves(leaves.filter(l => l.leave_id !== leaveId));
    } else {
      toast.error(response.message || "Action failed");
    }
  };

  const filteredLeaves = (leaves || []).filter(l => 
    l.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
    l.reason?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

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
            Manage Leaves
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Review and process employee leave applications.
          </p>
        </div>

        <div className="flex gap-4">
           {['Pending', 'Approved', 'Rejected'].map(s => (
             <button
               key={s}
               onClick={() => setFilterStatus(s)}
               style={{
                  background: filterStatus === s ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  color: filterStatus === s ? 'black' : 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '0.9rem'
               }}
             >
               {s}
             </button>
           ))}
        </div>
      </header>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name or reason..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '48px', background: 'rgba(255,255,255,0.03)' }}
            />
          </div>
          <button className="glass" style={{ p: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
            <Filter size={20} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <th style={{ padding: '1.5rem' }}>Employee</th>
                  <th style={{ padding: '1.5rem' }}>Leave Dates</th>
                  <th style={{ padding: '1.5rem' }}>Reason</th>
                  <th style={{ padding: '1.5rem' }}>Applied Date</th>
                  <th style={{ padding: '1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLeaves.map((leave, i) => (
                    <motion.tr
                      key={leave.leave_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'middle' }}
                      className="hover-bright"
                    >
                      <td style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-3">
                           <div className="glass" style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <User size={16} color="var(--primary-color)" />
                           </div>
                           <span style={{ fontWeight: 600 }}>{leave.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div className="flex items-center gap-2" style={{ fontSize: '0.9rem' }}>
                               <Calendar size={14} color="var(--text-secondary)" />
                               <span>{leave.start_date} → {leave.end_date}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>3 Days Total</span>
                         </div>
                      </td>
                      <td style={{ padding: '1.5rem', maxWidth: '300px' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {leave.reason}
                        </p>
                      </td>
                      <td style={{ padding: '1.5rem' }}>
                        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          <Clock size={14} />
                          {leave.application_date}
                        </div>
                      </td>
                      <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                        <div className="flex gap-2 justify-end">
                          {filterStatus === 'Pending' ? (
                            <>
                              <button 
                                onClick={() => handleAction(leave.leave_id, 'Approved')}
                                style={{ background: 'rgba(27, 215, 96, 0.1)', color: '#1bd760', p: '8px', borderRadius: '8px' }}
                                title="Approve"
                              >
                                <Check size={20} />
                              </button>
                              <button 
                                onClick={() => handleAction(leave.leave_id, 'Rejected')}
                                style={{ background: 'rgba(226, 33, 52, 0.1)', color: '#e22134', p: '8px', borderRadius: '8px' }}
                                title="Reject"
                              >
                                <X size={20} />
                              </button>
                            </>
                          ) : (
                            <span style={{ 
                              padding: '4px 12px', 
                              borderRadius: '20px', 
                              fontSize: '0.75rem',
                              background: leave.status === 'Approved' ? 'rgba(27, 215, 96, 0.1)' : 'rgba(226, 33, 52, 0.1)',
                              color: leave.status === 'Approved' ? '#1bd760' : '#e22134'
                            }}>
                              {leave.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
          {!loading && filteredLeaves.length === 0 && (
            <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div className="glass" style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={32} opacity={0.3} />
              </div>
              <p>No leave requests found for this status.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageLeaves;
