import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Calendar, 
  FileText, 
  Info,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { leaveApi } from '../services/api';
import GlassCard from '../components/GlassCard';
import toast from 'react-hot-toast';

const ApplyLeave = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    leave_type: 'Casual'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [balance, setBalance] = useState({ casual_leaves: 0, sick_leaves: 0 });

  const fetchBalance = async () => {
    if (user?.user_id) {
      const response = await leaveApi.getBalance(user.user_id);
      if (response.success) setBalance(response.data);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      toast.error("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        emp_id: user.user_id
      };
      
      const response = await leaveApi.apply(data);
      if (response.success) {
        toast.success("Leave application submitted successfully!");
        setFormData({ start_date: '', end_date: '', reason: '', leave_type: 'Casual' });
        fetchBalance();
      } else {
        toast.error(response.message || "Failed to submit application.");
      }
    } catch (error) {
           toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container"
      style={{ padding: '2rem 0', maxWidth: '800px' }}
    >
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Apply for Leave
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Submit your leave request for approval by your manager.
        </p>
      </header>

      <GlassCard delay={0.2} style={{ padding: '3rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>
                <Calendar size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Start Date
              </label>
              <input 
                type="date" 
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>
                <Calendar size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                End Date
              </label>
              <input 
                type="date" 
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <Info size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Leave Type
            </label>
            <select 
              value={formData.leave_type}
              onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
              style={{ width: '100%', padding: '12px' }}
            >
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Earned">Earned Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <FileText size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Reason for Leave
            </label>
            <textarea 
              rows="4"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Please provide a brief reason..."
              style={{ padding: '12px', width: '100%' }}
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="var(--primary-color)" />
              <span>Response usually within 24 hours</span>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '14px 32px',
                fontSize: '1rem'
              }}
            >
              {isSubmitting ? (
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Send size={18} /></motion.div>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <GlassCard style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div className="glass" style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)' }}>
             <Calendar size={18} color="var(--primary-color)" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Casual Leaves Left</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{balance.casual_leaves} Days</p>
          </div>
        </GlassCard>
        <GlassCard style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div className="glass" style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)' }}>
             <Calendar size={18} color="rgba(54, 162, 235, 1)" />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sick Leaves Left</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{balance.sick_leaves} Days</p>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default ApplyLeave;
