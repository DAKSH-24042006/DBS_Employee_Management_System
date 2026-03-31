import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Users,
  Search,
  ArrowRight,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { attendanceApi, analyticsApi } from '../services/api';
import GlassCard from '../components/GlassCard';
import { TableSkeleton } from '../components/SkeletonLoader';
import { toast } from 'react-hot-toast';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const Attendance = () => {
  const { user, role } = useAuth();
  const [history, setHistory] = useState([]);
  const [todayStatus, setTodayStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const fetchData = async (searchVal = debouncedSearch) => {
    setLoading(true);
    try {
      const historyParams = { role };
      if (role === 'Employee') {
        historyParams.emp_id = user.user_id;
      }
      if (searchVal) {
        historyParams.search = searchVal;
      }

      const [historyRes, statsRes] = await Promise.all([
        attendanceApi.getHistory(historyParams),
        analyticsApi.getStats({ role, emp_id: user.user_id })
      ]);

      if (historyRes.success) setHistory(historyRes.data);
      if (statsRes.success) {
        setAnalytics(statsRes.data);
        if (role === 'Employee') {
            setTodayStatus(statsRes.data.today_attendance);
        }
      }
    } catch (error) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, role, debouncedSearch]);

  const handleAttendance = async (action) => {
    setMarking(true);
    try {
      const res = await attendanceApi.mark({ emp_id: user.user_id, action });
      if (res.success) {
        toast.success(res.message);
        fetchData();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setMarking(false);
    }
  };

  const COLORS = ['#1db954', '#1e90ff', '#ffcc33', '#ff4d4d', '#a64dff'];

  if (loading) return <TableSkeleton rows={10} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
      style={{ padding: '2rem 0' }}
    >
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Attendance Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {role === 'Employee' ? "Track your working hours and mark presence." : "Monitor company-wide attendance and distribution."}
          </p>
        </div>
        <div className="glass" style={{ padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={24} className="text-primary" />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>
                {currentTime.toLocaleTimeString()}
            </span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Status Card */}
        <GlassCard 
            title={role === 'Employee' ? "Today's Status" : "Company Presence Today"} 
            icon={role === 'Employee' ? (todayStatus ? CheckCircle : AlertCircle) : Users}
        >
          {role === 'Employee' ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                {!todayStatus ? (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You haven't checked in yet today.</p>
                            <button 
                                onClick={() => handleAttendance('check_in')}
                                disabled={marking}
                                className="glass-button primary"
                                style={{ padding: '16px 48px', fontSize: '1.1rem', background: 'var(--primary-color)', color: 'black', fontWeight: 700 }}
                            >
                                <LogIn size={20} style={{ marginRight: '10px' }} />
                                Check In Now
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2.5rem' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Check In</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{todayStatus.check_in_time}</p>
                            </div>
                            <div style={{ width: '2px', background: 'var(--glass-border)' }}></div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Status</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: todayStatus.status === 'Present' ? '#1db954' : '#ffcc33' }}>
                                    {todayStatus.status}
                                </p>
                            </div>
                        </div>
                        
                        {!todayStatus.check_out_time ? (
                             <button 
                                onClick={() => handleAttendance('check_out')}
                                disabled={marking}
                                className="glass-button"
                                style={{ padding: '16px 48px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <LogOut size={20} style={{ marginRight: '10px' }} />
                                Check Out
                            </button>
                        ) : (
                            <div className="glass" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(29, 185, 84, 0.1)', border: '1px solid rgba(29, 185, 84, 0.2)' }}>
                                <p style={{ color: '#1db954', fontWeight: 600 }}>Shift Completed at {todayStatus.check_out_time}</p>
                            </div>
                        )}
                    </>
                )}
              </div>
          ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div>
                        <p style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-color)' }}>{analytics?.present_today || 0}</p>
                        <p style={{ color: 'var(--text-secondary)' }}>Employees Present Today</p>
                      </div>
                      <div className="glass" style={{ padding: '20px', borderRadius: '50%' }}>
                          <Users size={32} color="#1db954" />
                      </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(analytics?.present_today / analytics?.total_employees) * 100}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                      {Math.round((analytics?.present_today / analytics?.total_employees) * 100) || 0}% Attendance Rate
                  </p>
              </div>
          )}
        </GlassCard>

        {/* Department-wise Attendance (Visible for Admins/Managers) */}
        {role !== 'Employee' && (
            <GlassCard title="Departmental Attendance" icon={PieChartIcon} delay={0.1}>
                 <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics?.department_attendance}>
                            <XAxis dataKey="department" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ background: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            />
                            <Bar dataKey="present_count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </GlassCard>
        )}

        {/* History Table */}
        <div className="glass-card col-span-full" style={{ padding: '2rem', marginTop: '1rem' }}>
          <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Attendance History</h3>
             {role !== 'Employee' && (
                 <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px' }}>
                    <Search size={16} color="#666" />
                    <input 
                        type="text" 
                        placeholder="Search name or ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.875rem', outline: 'none' }} 
                    />
                 </div>
             )}
          </header>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)', fontSize: '0.875rem' }}>
                  {role !== 'Employee' && <th style={{ padding: '1rem' }}>Employee</th>}
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Check In</th>
                  <th style={{ padding: '1rem' }}>Check Out</th>
                  <th style={{ padding: '1rem' }}>Duration</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.925rem' }}>
                    {role !== 'Employee' && (
                        <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 600 }}>{record.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {record.emp_id}</div>
                        </td>
                    )}
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{record.date}</td>
                    <td style={{ padding: '1rem' }}>{record.check_in_time}</td>
                    <td style={{ padding: '1rem' }}>{record.check_out_time || '--:--'}</td>
                    <td style={{ padding: '1rem' }}>
                        {record.check_out_time ? (
                            <span style={{ fontWeight: 600 }}>{record.duration}h</span>
                        ) : (
                            <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 600 }}>In Progress</span>
                        )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: record.status === 'Present' ? 'rgba(27, 215, 96, 0.1)' : 'rgba(255, 204, 51, 0.1)',
                        color: record.status === 'Present' ? '#1db954' : '#ffcc33'
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                    <tr>
                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No records found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Attendance;
