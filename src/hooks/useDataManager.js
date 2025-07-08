import { useState, useCallback } from 'react';

// Helper function to generate data for a given date range
function generateDataForRange(startDateTime, endDateTime) {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const data = [];
  
  // Helper function to format number to xxxxx.xxxx format
  function formatNumber(num) {
    return parseFloat(num.toFixed(4));
  }
  
  // Generate hourly data points
  const current = new Date(start);
  while (current <= end) {
    const ds = current.toISOString().slice(0, 19).replace('T', ' ');
    const hour = current.getHours();
    
    // Generate some realistic time series data with some anomalies
    // Base value around 10000 (5 digits) with daily cycle
    let y = 10000 + Math.sin(hour / 24 * 2 * Math.PI) * 2000 + Math.random() * 500;
    
    // Add some null values and anomalies
    if (Math.random() < 0.1) {
      y = null; // 10% chance of null
    } else if (Math.random() < 0.05) {
      y = y * 2; // 5% chance of anomaly (2x value)
    }
    
    // Format the number to xxxxx.xxxx
    if (y !== null) {
      y = formatNumber(y);
    }
    
    data.push({
      ds,
      y,
      // is_valid: y !== null && y >= 5000 && y <= 20000, // Adjusted validation range for 5-digit numbers
      is_valid: y !== null, // Adjusted validation range for 5-digit numbers
      y_clean: y !== null ? y : null,
      setValue: '',
      epochSecond: current.getTime() / 1000
    });
    
    // Move to next hour
    current.setHours(current.getHours() + 1);
  }
  
  return data;
}

// Sample data matching the original Python code (fallback)
const fallbackData = [
  { ds: '2024-01-01 00:00:00', y: 100, is_valid: true, y_clean: 100, setValue: '' },
  { ds: '2024-01-01 01:00:00', y: 102, is_valid: true, y_clean: 102, setValue: '' },
  { ds: '2024-01-01 02:00:00', y: null, is_valid: false, y_clean: null, setValue: '' },
  { ds: '2024-01-01 03:00:00', y: 3000, is_valid: true, y_clean: null, setValue: '' },
  { ds: '2024-01-01 04:00:00', y: 106, is_valid: true, y_clean: 106, setValue: '' },
  { ds: '2024-01-01 05:00:00', y: 108, is_valid: true, y_clean: 108, setValue: '' },
  { ds: '2024-01-01 06:00:00', y: null, is_valid: false, y_clean: null, setValue: '' },
  { ds: '2024-01-01 07:00:00', y: 110, is_valid: true, y_clean: 110, setValue: '' },
  { ds: '2024-01-01 08:00:00', y: 112, is_valid: true, y_clean: 112, setValue: '' },
  { ds: '2024-01-01 09:00:00', y: 20000, is_valid: true, y_clean: null, setValue: '' },
];

export const useDataManager = (startDateTime, endDateTime) => {
  // Generate initial data based on the provided date range
  const getInitialData = useCallback(() => {
    if (!startDateTime || !endDateTime) {
      return fallbackData;
    }
    return generateDataForRange(startDateTime, endDateTime);
  }, [startDateTime, endDateTime]);

  const [data, setData] = useState(getInitialData);
  const [originalData, setOriginalData] = useState(getInitialData);

  // Update data when date range changes
  const updateDataForNewRange = useCallback(() => {
    const newData = getInitialData();
    setData(newData);
    setOriginalData(newData);
  }, [getInitialData]);

  // Step 1: Validation
  const validateData = useCallback((minVal, maxVal) => {
    setData(prevData => 
      prevData.map(row => ({
        ...row,
        is_valid: row.y !== null && row.y >= minVal && row.y <= maxVal
        // Preserve existing y_clean values - don't reset them
      }))
    );
  }, []);

  // Step 2: Estimation (Interpolation)
  const estimateData = useCallback(() => {
    setData(prevData => {
      const newData = [...prevData];
      // Set invalid values to null for interpolation, but skip locked rows
      newData.forEach(row => {
        if (row.lock) {
          // Do not change locked rows
          return;
        }
        if (!row.is_valid) {
          row.y_clean = null;
        } else {
          row.y_clean = row.y;
        }
      });
      // Simple linear interpolation, skipping locked rows
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].lock) continue; // skip locked
        if (newData[i].y_clean === null) {
          // Find previous valid value (not locked)
          let prevValid = null;
          let prevIndex = i - 1;
          while (prevIndex >= 0 && prevValid === null) {
            if (!newData[prevIndex].lock && newData[prevIndex].y_clean !== null) {
              prevValid = newData[prevIndex].y_clean;
            }
            prevIndex--;
          }
          // Find next valid value (not locked)
          let nextValid = null;
          let nextIndex = i + 1;
          while (nextIndex < newData.length && nextValid === null) {
            if (!newData[nextIndex].lock && newData[nextIndex].y_clean !== null) {
              nextValid = newData[nextIndex].y_clean;
            }
            nextIndex++;
          }
          // Interpolate
          if (prevValid !== null && nextValid !== null) {
            const totalSteps = nextIndex - prevIndex - 2;
            const currentStep = i - prevIndex - 1;
            newData[i].y_clean = prevValid + (nextValid - prevValid) * (currentStep / totalSteps);
          } else if (prevValid !== null) {
            newData[i].y_clean = prevValid;
          } else if (nextValid !== null) {
            newData[i].y_clean = nextValid;
          }
        }
      }
      return newData;
    });
  }, []);

  // Step 3: Single Edit
  const editSingleValue = useCallback((date, value) => {
    setData(prevData => 
      prevData.map(row => 
        row.ds === date 
          ? { ...row, y_clean: parseFloat(value), is_valid: true }
          : row
      )
    );
  }, []);

  // Step 3: Bulk Edit
  const editBulkValues = useCallback((edits) => {
    setData(prevData => {
      const newData = [...prevData];
      edits.forEach(edit => {
        const rowIndex = newData.findIndex(row => row.ds === edit.date);
        if (rowIndex !== -1) {
          newData[rowIndex] = {
            ...newData[rowIndex],
            y_clean: parseFloat(edit.value),
            is_valid: true
          };
        }
      });
      return newData;
    });
  }, []);

  // Reset data to original
  const resetData = useCallback(() => {
    setData(originalData);
  }, [originalData]);

  // Set lock state for rows
  const setLocks = useCallback((locks) => {
    setData(prevData => prevData.map((row, i) => ({ ...row, lock: locks[i] })));
  }, []);

  // Set manual value for a row (for Set Value dialog)
  const setManualValue = useCallback((date, value) => {
    setData(prevData =>
      prevData.map(row =>
        row.ds === date
          ? { ...row, setValue: value }
          : row
      )
    );
  }, []);

  return {
    data,
    validateData,
    estimateData,
    editSingleValue,
    editBulkValues,
    resetData,
    setLocks,
    setManualValue,
    originalData,
    updateDataForNewRange,
  };
}; 