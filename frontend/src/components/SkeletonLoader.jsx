import React from 'react';

const Skeleton = ({ className = '', style = {} }) => (
  <div className={`skeleton ${className}`} style={{ borderRadius: '8px', ...style }}></div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="glass-card" style={{ padding: '2rem' }}>
    <div className="flex justify-between items-center mb-8">
      <Skeleton style={{ width: '200px', height: '32px' }} />
      <Skeleton style={{ width: '120px', height: '40px' }} />
    </div>
    <div className="flex gap-4 mb-4">
      {Array(cols).fill(0).map((_, i) => (
        <Skeleton key={i} style={{ flex: 1, height: '24px' }} />
      ))}
    </div>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} className="flex gap-4 mb-3">
        {Array(cols).fill(0).map((_, j) => (
          <Skeleton key={j} style={{ flex: 1, height: '40px' }} />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
    <div className="glass-card" style={{ minHeight: '140px' }}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
        <div style={{ flex: 1 }}>
          <Skeleton style={{ width: '60%', height: '14px', marginBottom: '8px' }} />
          <Skeleton style={{ width: '40%', height: '20px' }} />
        </div>
      </div>
    </div>
  );

export default Skeleton;
