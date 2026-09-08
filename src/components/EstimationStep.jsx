import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, Calculator, CheckCircle } from 'lucide-react';

const EstimationStep = ({ onEstimate, data }) => {
  const missingCount = data.filter(row => row.y_clean === null).length;
  const estimatedCount = data.filter(row => 
    row.y_clean !== null && 
    (row.y === null || row.y_clean !== row.y)
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Step 2: Estimation
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Missing and invalid readings are filled in automatically using linear interpolation between the
          nearest valid points. This runs every time you change the validation range in Step 1.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 mt-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2" title="Points still without a value after estimation">
            <Calculator className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">
              Remaining gaps: {missingCount}
            </span>
          </div>
          {estimatedCount > 0 && (
            <div className="flex items-center gap-2" title="Points filled in by interpolation">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                Estimated: {estimatedCount}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2">
          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-xs text-green-800">
            Estimation runs automatically whenever the validation range changes. No action needed.
          </span>
        </div>
        
        {missingCount === 0 && estimatedCount === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No missing values to estimate. All data points are valid.
          </div>
        )}

        {/* Estimation Summary */}
        {estimatedCount > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Estimation summary</h5>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• {estimatedCount} data point(s) filled in using linear interpolation</p>
              <p>• Estimated values appear in the "Estimated" column of the table below</p>
              <p>• Override any of them by hand in Step 3</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimationStep; 