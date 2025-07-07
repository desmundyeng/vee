import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Range, getTrackBackground } from 'react-range';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { DualRangeSlider } from './ui/DualRangeSlider';
import { Input } from './ui/input';

const MIN = 0;
const MAX = 99999;
const MIN_DISTANCE = 1;

const ValidationStep = ({ onValidate, data, originalData, validationRange }) => {
  // Compute min/max from data
  const dataMin = useMemo(() => {
    const vals = data.map(row => row.y).filter(v => typeof v === 'number');
    return vals.length ? Math.min(...vals) : MIN;
  }, [data]);
  const dataMax = useMemo(() => {
    const vals = data.map(row => row.y).filter(v => typeof v === 'number');
    return vals.length ? Math.max(...vals) : MAX;
  }, [data]);

  // Manual input handlers
  const handleInputChange = (idx, value) => {
    let val = Number(value);
    if (isNaN(val)) val = idx === 0 ? MIN : MAX;
    if (idx === 0) {
      val = Math.max(MIN, Math.min(val, validationRange[1] - MIN_DISTANCE));
      onValidate(val, validationRange[1]);
    } else {
      val = Math.min(MAX, Math.max(val, validationRange[0] + MIN_DISTANCE));
      onValidate(validationRange[0], val);
    }
  };

  // Range slider handler
  const handleRangeChange = (values) => {
    // Clamp so that min thumb cannot go above max thumb - MIN_DISTANCE
    if (values[1] - values[0] < MIN_DISTANCE) {
      if (validationRange[0] !== values[0]) {
        // Moving min thumb
        onValidate(values[1] - MIN_DISTANCE, values[1]);
      } else {
        // Moving max thumb
        onValidate(values[0], values[0] + MIN_DISTANCE);
      }
    } else {
      onValidate(values[0], values[1]);
    }
  };

  const handleValidate = () => {
    onValidate(validationRange[0], validationRange[1]);
  };

  const validCount = data.filter(row => row.is_valid).length;
  const invalidCount = data.filter(row => !row.is_valid).length;
  // Compute removed count: original values that do not fall within the current validation range
  const removedCount = data
    ? data.filter(row => row.y === null || row.y < validationRange[0] || row.y > validationRange[1]).length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          Step 1: Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500">Min</label>
              <Input
                type="text"
                min={MIN}
                max={validationRange[1] - MIN_DISTANCE}
                value={validationRange[0]}
                onChange={e => {
                  // Only allow numbers (including negative)
                  const val = e.target.value;
                  if (/^-?\d*$/.test(val)) {
                    handleInputChange(0, val);
                  }
                }}
                className="w-24 text-center"
              />
            </div>
            <div className="flex-1">
              <DualRangeSlider
                value={validationRange}
                min={MIN}
                max={MAX}
                step={1}
                onValueChange={handleRangeChange}
                label={val => val}
                labelPosition="top"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-500">Max</label>
              <Input
                type="text"
                min={validationRange[0] + MIN_DISTANCE}
                max={MAX}
                value={validationRange[1]}
                onChange={e => {
                  // Only allow numbers (including negative)
                  const val = e.target.value;
                  if (/^-?\d*$/.test(val)) {
                    handleInputChange(1, val);
                  }
                }}
                className="w-24 text-center"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                Valid: {validCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">
                Invalid: {invalidCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">
                Removed: {removedCount}
              </span>
            </div>
          </div>
        </div>
        {/* Debug info - remove after verification */}
        <div className="text-xs text-gray-400 mt-2">Range: [{validationRange[0]}, {validationRange[1]}], Removed: {removedCount}</div>
      </CardContent>
    </Card>
  );
};

export default ValidationStep; 