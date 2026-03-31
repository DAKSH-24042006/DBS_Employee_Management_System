import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, leaveApi } from '../services/api';
import GlassCard, { StatCard } from '../components/GlassCard';
import { CardSkeleton } from '../components/SkeletonLoader';
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

const Dashboard = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = role === 'Employee' ? { emp_id: user.user_id, role: 'Employee' } : { emp_id: user.user_id, role };
        
        const [statsRes, leavesRes] = await Promise.all([
          analyticsApi.getStats(params),
          leaveApi.getLeaves(params)
        ]);
        
        if (statsRes.success) setStats(statsRes.data);
        if (leavesRes.success) setRecentLeaves(leavesRes.data.slice(0, 5));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, role]);

  if (loading) {
    return (
      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
        {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  const COLORS = ['#1db954', '#1e90ff', '#ffcc33', '#ff4d4d', '#a64dff'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
      style={{ padding: '2rem 0' }}
    >
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Welcome, {user?.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {role === 'Employee' ? "Manage your records and leave requests." : "Here's what's happening in the system today."}
        </p>
      </header>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {role === 'Admin' || role === 'Manager' ? (
          <>
            <StatCard label="Total Employees" value={stats?.total_employees || 0} icon={Users} color="#1db954" delay={0.1} />
            <StatCard label="Pending Leaves" value={stats?.pending_leaves_count || 0} icon={Clock} color="#ffcc33" delay={0.2} />
            <StatCard label="Approved Today" value={stats?.department_analytics?.reduce((a, b) => a + Number(b.leave_count), 0) || 0} icon={CalendarCheck} color="#1e90ff" delay={0.3} />
            <StatCard label="Present Today" value={stats?.present_today || 0} icon={TrendingUp} color="#a64dff" delay={0.4} />
          </>
        ) : (
          <>
            <StatCard label="My Casual Leaves" value={stats?.leave_balance?.casual_leaves || 0} icon={CalendarCheck} color="#1db954" delay={0.1} />
            <StatCard label="My Sick Leaves" value={stats?.leave_balance?.sick_leaves || 0} icon={Clock} color="#ffcc33" delay={0.2} />
            <StatCard label="Applied Leaves" value={stats?.personal_stats?.total_applied || 0} icon={Users} color="#1e90ff" delay={0.3} />
            <StatCard 
                label="Total Hours Work" 
                value={stats?.personal_stats?.total_hours ? `${stats.personal_stats.total_hours.split(':')[0]}h ${stats.personal_stats.total_hours.split(':')[1]}m` : '0h 0m'} 
                icon={TrendingUp} 
                color="#a64dff" 
                delay={0.4} 
            />
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        {role !== 'Employee' && (
          <>
            {/* Department Attendance Chart (NEW) */}
            <GlassCard title="Attendance by Department" subtitle="Real-time presence across company units" delay={0.4}>
              <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stats?.department_attendance?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.department_attendance} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                      <XAxis dataKey="department" stroke="#ccc" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#999" fontSize={10} tickLine={false} axisLine={false} tickCount={5} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(18, 18, 18, 0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }}
                        formatter={(value) => [`${value} Present`, 'Status']}
                      />
                      <Bar dataKey="present_count" fill="#1db954" radius={[4, 4, 0, 0]} barSize={40}>
                         {stats?.department_attendance?.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <p>No attendance data recorded yet today.</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Department Leave Distribution Chart */}
            <GlassCard title="Leaves by Department" subtitle="Total days taken across company units" delay={0.5}>
              <div style={{ height: '350px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {stats?.department_analytics?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.department_analytics.map(d => ({ ...d, leave_count: Number(d.leave_count) }))}
                        dataKey="leave_count"
                        nameKey="department"
                        cx="50%"
                        cy="45%"
                        outerRadius={90}
                        innerRadius={60}
                        paddingAngle={5}
                        stroke="none"
                        labelLine={false}
                      >
                        {stats.department_analytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'rgba(24, 24, 24, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: 'white' }}
                        formatter={(value) => [`${value} Days`, 'Total']}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                      <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                      <p>No department leave data available</p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Top Leave Takers Chart */}
            <GlassCard title="Most Days Taken" subtitle="Employees with highest leave duration" delay={0.6}>
              <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stats?.top_leave_takers?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.top_leave_takers} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#ccc" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={15}
                        style={{ fontWeight: 500 }}
                      />
                      <YAxis 
                        stroke="#999" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickCount={5}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.08)' }}
                        contentStyle={{ 
                          background: 'rgba(18, 18, 18, 0.95)', 
                          border: '1px solid rgba(255,255,255,0.2)', 
                          borderRadius: '12px', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                          padding: '12px'
                        }}
                        itemStyle={{ color: '#1db954', fontWeight: 600 }}
                        labelStyle={{ color: '#fff', marginBottom: '4px', fontWeight: 700 }}
                        formatter={(value) => [`${value} Days`, 'Duration']}
                      />
                      <Bar dataKey="leave_count" radius={[6, 6, 0, 0]} barSize={40}>
                        {stats?.top_leave_takers?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No trending data available</p>
                )}
              </div>
            </GlassCard>
          </>
        )}

        {/* Recent Leave Requests */}
        <GlassCard 
          title={role === 'Employee' ? "My Recent Leave Requests" : "Recent Activity"} 
          subtitle={role === 'Employee' ? "Track your recent applications" : "Latest leave applications"} 
          delay={0.7} 
          className="col-span-full"
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', borderBottom: '1px solid var(--glass-border)' }}>
                  {role !== 'Employee' && <th style={{ padding: '1rem' }}>Employee</th>}
                  <th style={{ padding: '1rem' }}>Dates</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map((leave, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.925rem' }}>
                    {role !== 'Employee' && <td style={{ padding: '1rem' }}>{leave.name || 'Anonymous'}</td>}
                    <td style={{ padding: '1rem' }}>{leave.start_date} - {leave.end_date}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem',
                        background: leave.status === 'Approved' ? 'rgba(27, 215, 96, 0.1)' : leave.status === 'Pending' ? 'rgba(255, 206, 86, 0.1)' : 'rgba(226, 33, 52, 0.1)',
                        color: leave.status === 'Approved' ? '#1bd760' : leave.status === 'Pending' ? '#ffce56' : '#e22134'
                      }}>
                        {leave.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{leave.reason}</td>
                  </tr>
                ))}
                {recentLeaves.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No recent leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default Dashboard;
