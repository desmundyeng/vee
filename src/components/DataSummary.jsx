import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  Calculator,
  BarChart3
} from 'lucide-react';

const DataSummary = ({ data }) => {
  const validCount = data.filter(row => row.is_valid).length;
  const invalidCount = data.filter(row => !row.is_valid).length;
  const totalCount = data.length;
  const estimatedCount = data.filter(row => 
    row.y_clean !== null && row.y_clean !== row.y && row.y !== null
  ).length;

  // Calculate statistics
  const originalValues = data.filter(row => row.y !== null).map(row => row.y);
  const cleanValues = data.filter(row => row.y_clean !== null).map(row => row.y_clean);
  
  const originalStats = {
    min: Math.min(...originalValues),
    max: Math.max(...originalValues),
    avg: originalValues.reduce((a, b) => a + b, 0) / originalValues.length
  };

  const cleanStats = {
    min: Math.min(...cleanValues),
    max: Math.max(...cleanValues),
    avg: cleanValues.reduce((a, b) => a + b, 0) / cleanValues.length
  };

  const stats = [
    {
      title: "Total Records",
      value: totalCount,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Valid Data",
      value: validCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Invalid Data",
      value: invalidCount,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Estimated Values",
      value: estimatedCount,
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Original Data</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minimum:</span>
                  <span className="font-medium">{originalStats.min.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Maximum:</span>
                  <span className="font-medium">{originalStats.max.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average:</span>
                  <span className="font-medium">{originalStats.avg.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Clean Data</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minimum:</span>
                  <span className="font-medium">{cleanStats.min.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Maximum:</span>
                  <span className="font-medium">{cleanStats.max.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average:</span>
                  <span className="font-medium">{cleanStats.avg.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Status */}
      <Card>
        <CardHeader>
          <CardTitle>Data Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Valid Records</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="success">{validCount}</Badge>
                <span className="text-sm text-gray-500">
                  ({((validCount / totalCount) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Invalid Records</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">{invalidCount}</Badge>
                <span className="text-sm text-gray-500">
                  ({((invalidCount / totalCount) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            {estimatedCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Estimated Values</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{estimatedCount}</Badge>
                  <span className="text-sm text-gray-500">
                    ({((estimatedCount / totalCount) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSummary; 