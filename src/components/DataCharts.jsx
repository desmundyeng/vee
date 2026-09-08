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

const LINE_KEYS = [
  { key: 'original', name: 'Original', color: '#6b7280' },
  { key: 'clean', name: 'Estimated', color: '#2563eb' },
  { key: 'setValue', name: 'Manual Edit', color: '#f59e42' },
];

const LINE_STYLES = {
  original: { strokeDasharray: '' }, // solid
  clean: { strokeDasharray: '6 3' }, // dashed
  setValue: { strokeDasharray: '2 2' }, // dotted
};

const DataCharts = ({ data }) => {
  // Prepare data for charts
  const chartData = data.map(row => ({
    date: row.ds,
    epoch: row.epochSecond,
    original: row.y,
    clean: row.y_clean,
    setValue: (row.setValue !== '' && row.setValue !== null && row.setValue !== undefined && !isNaN(Number(row.setValue)))
      ? Number(row.setValue)
      : (row.y_clean !== null && row.y_clean !== undefined && !isNaN(Number(row.y_clean)) ? Number(row.y_clean) : null),
    status: row.is_valid ? 'Valid' : 'Invalid'
  }));

  // State for toggling line visibility
  const [visible, setVisible] = React.useState({
    original: true,
    clean: true,
    setValue: true,
  });

  const handleLegendClick = (o) => {
    const key = o.dataKey;
    setVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  function formatEpochToLocal(epochSec) {
    if (!epochSec) return '';
    const date = new Date(epochSec * 1000);
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formattedLabel = formatEpochToLocal(label);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Date: ${formattedLabel}`}</p>
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

  const minEpoch = Math.min(...chartData.map(d => d.epoch));
  const maxEpoch = Math.max(...chartData.map(d => d.epoch));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="epoch"
          textAnchor="end"
          height={80}
          interval={0}
          ticks={data.map(d => d.epochSecond)} // force every data point as a tick
          tickFormatter={value => formatEpochToLocal(value)}
          tick={{ fontSize: '12px', angle: -15, textAnchor: 'end' }}
          domain={[minEpoch, maxEpoch]}
          type="number"
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" onClick={handleLegendClick} />
        {LINE_KEYS.map(line =>
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={line.key === 'original' ? 2 : 3}
            dot={{ fill: line.color, strokeWidth: 2, r: 5 }}
            name={line.name}
            hide={!visible[line.key]}
            strokeDasharray={LINE_STYLES[line.key]?.strokeDasharray}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DataCharts; 