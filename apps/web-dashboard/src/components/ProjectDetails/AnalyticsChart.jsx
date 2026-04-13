import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: 'var(--color-bg-card)', 
        border: '1px solid var(--color-border)', 
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '0.7rem',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
      }}>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
          {payload[0].value} Requests
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsChart = ({ data = [] }) => {

  return (
    <div style={{ width: '100%', height: 180, marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
          <XAxis 
            dataKey="_id" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(62, 207, 142, 0.2)', strokeWidth: 2 }} />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="var(--color-primary)" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
            strokeWidth={1.5}
            activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--color-primary)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
