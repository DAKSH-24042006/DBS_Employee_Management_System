import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', title = '', subtitle = '', icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-card ${className}`}
    >
      {(title || Icon) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            {title && <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '4px' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{subtitle}</p>}
          </div>
          {Icon && (
            <div className="glass" style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)' }}>
              <Icon size={20} color="var(--primary-color)" />
            </div>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export const StatCard = ({ label, value, icon: Icon, color = 'var(--primary-color)', delay = 0 }) => (
  <GlassCard delay={delay}>
    <div className="flex items-center gap-4">
      <div className="glass" style={{ padding: '12px', borderRadius: '12px', background: `${color}15` }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>{value}</h2>
      </div>
    </div>
  </GlassCard>
);

export default GlassCard;
