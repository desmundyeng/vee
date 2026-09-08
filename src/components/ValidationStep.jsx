import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { DualRangeSlider } from './ui/DualRangeSlider';
import { Input } from './ui/input';

const MIN = 0;
const MAX = 99999;
const MIN_DISTANCE = 1;

const ValidationStep = ({ onValidate, data, originalData, validationRange }) => {
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
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
            Method: Range threshold check
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Each reading is checked against a Min/Max range (a threshold rule): values inside the range are
          marked valid, while missing values or values outside the range are flagged invalid and re-estimated
          in Step 2. Drag the slider or type exact Min/Max values.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <label htmlFor="validation-min" className="text-xs text-gray-500">Min</label>
              <Input
                id="validation-min"
                type="text"
                aria-label="Minimum valid value"
                min={MIN}
                max={validationRange[1] - MIN_DISTANCE}
                value={Number(validationRange[0]).toFixed(4)}
                onChange={e => {
                  // Only allow numbers (including negative)
                  const val = e.target.value;
                  if (/^-?\d*(\.\d{0,4})?$/.test(val)) {
                    handleInputChange(0, val);
                  }
                }}
                className="w-28 text-right"
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <DualRangeSlider
                value={validationRange}
                min={MIN}
                max={MAX}
                step={1}
                onValueChange={handleRangeChange}
              />
            </div>
            <div className="flex flex-col items-center">
              <label htmlFor="validation-max" className="text-xs text-gray-500">Max</label>
              <Input
                id="validation-max"
                type="text"
                aria-label="Maximum valid value"
                min={validationRange[0] + MIN_DISTANCE}
                max={MAX}
                value={Number(validationRange[1]).toFixed(4)}
                onChange={e => {
                  // Only allow numbers (including negative)
                  const val = e.target.value;
                  if (/^-?\d*(\.\d{0,4})?$/.test(val)) {
                    handleInputChange(1, val);
                  }
                }}
                className="w-28 text-right"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2" title="Points that fall within the range">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">
              Valid (in range): {validCount}
            </span>
          </div>
          <div className="flex items-center gap-2" title="Points flagged as invalid">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-gray-600">
              Invalid: {invalidCount}
            </span>
          </div>
          <div className="flex items-center gap-2" title="Points removed because they are missing or out of range">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              Missing / out of range: {removedCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationStep; 