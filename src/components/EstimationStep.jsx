import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, Calculator, Eye, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';

const EstimationStep = ({ onEstimate, data }) => {
  const missingCount = data.filter(row => row.y_clean === null).length;
  const estimatedCount = data.filter(row => 
    row.y_clean !== null && 
    (row.y === null || row.y_clean !== row.y)
  ).length;

  // Get estimated data points - show any row where y_clean differs from y (including NaN cases)
  const estimatedData = data.filter(row => 
    row.y_clean !== null && 
    (row.y === null || row.y_clean !== row.y)
  );

  // Get missing data points that need estimation
  const missingData = data.filter(row => row.y_clean === null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Step 2: Estimation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                Missing values: {missingCount}
              </span>
            </div>
            {estimatedCount > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  Estimated: {estimatedCount}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Button 
            onClick={() => {}}
            variant="default"
            disabled
          >
            Estimate Missing or Bad Data
          </Button>
          <span className="text-xs text-gray-500">Estimation is automated when the validation range changes.</span>
        </div>
        
        {missingCount === 0 && estimatedCount === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No missing values to estimate. All data points are valid.
          </div>
        )}

        {/* Missing Data Points */}
        {/* {missingCount > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Missing or Possibly Invalid Data Points (Need Estimation)
            </h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Original Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missingData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.ds}</TableCell>
                      <TableCell>
                        {row.y === null ? (
                          <span className="text-gray-400">NaN</span>
                        ) : (
                          row.y.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Missing</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )} */}

        {/* Estimated Data Points */}
        {/* Removed as per requirements */}

        {/* Estimation Summary */}
        {estimatedCount > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Estimation Summary</h5>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• {estimatedCount} data points have been estimated using linear interpolation</p>
              <p>• Estimated values are shown in green in the data table</p>
              <p>• You can further adjust these values in Step 3 if needed</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimationStep; 