import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DataCharts = ({ data }) => {
  // Prepare data for charts
  const chartData = data.map(row => ({
    date: row.ds,
    original: row.y,
    clean: row.y_clean,
    setValue: (row.setValue !== '' && row.setValue !== null && row.setValue !== undefined && !isNaN(Number(row.setValue)))
      ? Number(row.setValue)
      : (row.y_clean !== null && row.y_clean !== undefined && !isNaN(Number(row.y_clean)) ? Number(row.y_clean) : null),
    status: row.status ? 'Valid' : 'Invalid'
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value || 'NaN'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          angle={-45}
          textAnchor="end"
          height={80}
          interval={0}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="original" 
          stroke="#6b7280" 
          strokeWidth={2}
          dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
          name="Original"
        />
        <Line 
          type="monotone" 
          dataKey="clean" 
          stroke="#2563eb" 
          strokeWidth={3}
          dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
          name="Estimated"
        />
        <Line 
          type="monotone" 
          dataKey="setValue" 
          stroke="#f59e42" 
          strokeWidth={3}
          dot={{ fill: '#f59e42', strokeWidth: 2, r: 5 }}
          name="Manual Edit"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DataCharts; 