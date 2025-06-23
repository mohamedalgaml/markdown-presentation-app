import React from 'react';

const ProgressBar = ({
  current = 0,
  total = 0,
  color = '#4caf50',
  height = '10px',
  borderRadius = '10px',
  label = '',
}) => {
  const safeTotal = total <= 0 ? 1 : total;
  const percentage = Math.min(Math.max((current / safeTotal) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      style={{
        background: '#eee',
        borderRadius,
        height,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius,
          transition: 'width 0.3s ease-in-out',
        }}
      />
      {label && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '0.75rem',
            color: '#333',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
