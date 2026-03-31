import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users,
  Download,
  Filter
} from 'lucide-react';
import { analyticsApi } from '../services/api';
import GlassCard from '../components/GlassCard';
import { TableSkeleton } from '../components/SkeletonLoader';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // For Admin-level analytics, we don't need to specify role here 
      // if the session handles it, but it's safer for debugging.
      const response = await analyticsApi.getStats({ role: 'Admin' });
      if (response.success) {
        setData(response.data);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) return <TableSkeleton rows={8} cols={4} />;

  // Vibrant, accessible color palette
  const COLORS = ['#1db954', '#1e90ff', '#ffcc33', '#ff4d4d', '#a64dff', '#4bc0c0'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
      style={{ padding: '2rem 0' }}
    >
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            System Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            In-depth analysis of leave patterns and employee engagement.
          </p>
        </div>
        <button className="glass" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <Download size={18} />
          <span style={{ fontWeight: 600 }}>Export Report</span>
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Department Distribution (Pie Chart) */}
        <GlassCard title="Days by Department" icon={PieChartIcon} delay={0.1}>
          <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {data?.department_analytics?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.department_analytics}
                    dataKey="leave_count"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={115}
                    paddingAngle={8}
                    stroke="none"
                  >
                    {data?.department_analytics?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(18, 18, 18, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.2)', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: 'white' }}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No departmental data available</div>
            )}
          </div>
        </GlassCard>

        {/* Top Leave Takers */}
        <GlassCard title="Most Days Taken" icon={BarChartIcon} delay={0.2}>
          <div style={{ height: '350px' }}>
            {data?.top_leave_takers?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.top_leave_takers} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <XAxis type="number" stroke="#999" fontSize={11} axisLine={false} tickLine={false} hide />
                  <YAxis dataKey="name" type="category" stroke="#ccc" fontSize={13} axisLine={false} tickLine={false} width={130} style={{ fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: 'rgba(18, 18, 18, 0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="leave_count" fill="#1db954" radius={[0, 6, 6, 0]} barSize={32}>
                    {data?.top_leave_takers?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[0]} fillOpacity={1 - index * 0.15} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No data available</div>
            )}
          </div>
        </GlassCard>

        {/* Annual Leave Frequency */}
        <GlassCard title="Monthly Leave Duration" icon={TrendingUp} delay={0.3} className="col-span-full">
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.leave_analytics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#1e90ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#999" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#999" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip contentStyle={{ background: 'rgba(18, 18, 18, 0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="total_leaves" stroke="#1e90ff" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="glass-card" style={{ marginTop: '3rem', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Detailed Data View</h3>
            <div className="glass" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Total Records: {data?.leave_analytics?.length || 0}
            </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead>
               <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                 <th style={{ padding: '1.25rem' }}>Employee Name</th>
                 <th style={{ padding: '1.25rem' }}>Total Days Taken (Approved)</th>
                 <th style={{ padding: '1.25rem' }}>Status</th>
               </tr>
             </thead>
             <tbody>
               {data?.leave_analytics?.map((item, i) => (
                 <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                   <td style={{ padding: '1.25rem', fontWeight: 600, color: 'white' }}>{item.name}</td>
                   <td style={{ padding: '1.25rem' }}>
                       <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '1.1rem' }}>
                           {item.total_leaves} <small style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.7 }}>Days</small>
                       </span>
                   </td>
                   <td style={{ padding: '1.25rem' }}>
                     <span style={{ 
                       padding: '6px 16px', 
                       borderRadius: '100px', 
                       fontSize: '0.75rem',
                       fontWeight: 600,
                       background: 'rgba(27, 215, 96, 0.15)',
                       color: '#1db954'
                     }}>Active Account</span>
                   </td>
                 </tr>
               ))}
               {(!data?.leave_analytics || data?.leave_analytics.length === 0) && (
                   <tr>
                       <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No records found</td>
                   </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
