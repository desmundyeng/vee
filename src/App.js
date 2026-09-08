import React, { useEffect, useMemo, useState } from 'react';
import { useDataManager } from "./hooks/useDataManager";
import ValidationStep from "./components/ValidationStep";
import EstimationStep from "./components/EstimationStep";
import DataCharts from "./components/DataCharts";
import { Button } from "./components/ui/button";
import { Download, Github } from "lucide-react";
import { EditableDataTable } from "./components/EditableDataTable";
import { Input } from "./components/ui/input";

function App() {
  // Calculate default start (3 days ago, 00:00) and end (yesterday, 00:00)
  let now = new Date();
  let defaultStart = new Date(now);
  defaultStart.setDate(now.getDate() - 3);
  defaultStart.setHours(0, 0, 0, 0);
  const defaultEnd = new Date(now);
  defaultEnd.setDate(now.getDate() - 1);
  defaultEnd.setHours(0, 0, 0, 0);

  const [startDateTime, setStartDateTime] = useState(formatDateTimeLocal(defaultStart));
  const [endDateTime, setEndDateTime] = useState(formatDateTimeLocal(defaultEnd));
  
  const {
    data,
    validateData,
    estimateData,
    originalData,
    setManualValue,
    updateDataForNewRange,
  } = useDataManager(startDateTime, endDateTime);

  const dataMin = useMemo(() => {
    const vals = data.map(row => row.y).filter(v => typeof v === 'number');
    return vals.length ? Math.min(...vals) : 0;
  }, [data]);
  const dataMax = useMemo(() => {
    const vals = data.map(row => row.y).filter(v => typeof v === 'number');
    return vals.length ? Math.max(...vals) : 99999;
  }, [data]);

  // Add state for validation range
  const [validationRange, setValidationRange] = React.useState([dataMin, dataMax]);

  // Wrap validateData to also update validationRange
  const handleValidate = React.useCallback((min, max) => {
    setValidationRange([min, max]);
    validateData(min, max);
  }, [validateData]);

  const handleExportData = () => {
    const csvContent = [
      "Date,Original Value,Status,Clean Value",
      ...data.map(row =>
        `${row.ds},${row.y || 'NaN'},${row.is_valid ? 'Valid' : 'Invalid'},${row.y_clean || 'NaN'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Automate Step 2 estimation when validationRange changes
  useEffect(() => {
    estimateData();
  }, [validationRange, estimateData]);

  // Update validation range when data changes
  useEffect(() => {
    setValidationRange([dataMin, dataMax]);
  }, [dataMin, dataMax]);

  // Helper to format date to yyyy-MM-ddTHH:mm for datetime-local
  function formatDateTimeLocal(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-900">
                Validation, Estimation, and Editing (VEE)
              </h1>
              <a
                href="https://github.com/desmundyeng/vee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="hover:opacity-80 ml-4"
              >
                <Github className="w-8 h-8 text-gray-700" />
              </a>
            </div>
            <p className="text-lg text-gray-600 ">
              Interactive data validation, estimation, and editing for time series data.
              Clean your data in three guided steps with real-time charts and instant feedback.
            </p>
            {/* Workflow overview */}
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                1. Validate <span className="text-blue-500">flag out-of-range points</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                2. Estimate <span className="text-green-600">fill gaps automatically</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                3. Edit <span className="text-amber-600">fine-tune values by hand</span>
              </span>
            </div>
          </div>

          {/* Date/Time Pickers */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Generate sample data</h2>
              <p className="text-sm text-gray-500">
                Pick a start and end date/time, then generate hourly time series data to clean. Samples follow a
                sinusoidal daily cycle with random noise, plus injected gaps (~10% nulls) and anomalies (~5% spikes).
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="flex flex-col items-start w-full md:w-auto">
                <label htmlFor="start-datetime" className="mb-1 font-medium text-gray-700">Start date &amp; time</label>
                <Input
                  id="start-datetime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={e => setStartDateTime(e.target.value)}
                  className="w-56"
                />
              </div>
              <div className="h-full center pt-6">
                -
              </div>
              <div className="flex flex-col items-start w-full md:w-auto">
                <label htmlFor="end-datetime" className="mb-1 font-medium text-gray-700">End date &amp; time</label>
                <Input
                  id="end-datetime"
                  type="datetime-local"
                  value={endDateTime}
                  onChange={e => setEndDateTime(e.target.value)}
                  className="w-56"
                />
              </div>
              <div className="flex items-end pt-7">
                <Button
                  onClick={updateDataForNewRange}
                >
                  Generate Data
                </Button>
              </div>
            </div>
          </div>

          {/* Time Series Chart - Right */}
          <div className="bg-white rounded-lg shadow h-[520px] flex flex-col w-full p-4">
            <div className="mb-3">
              <h2 className="text-xl font-semibold">Time series overview</h2>
              <p className="text-sm text-gray-500">
                Compare the <span className="text-gray-600 font-medium">Original</span> readings,
                the <span className="text-blue-600 font-medium">Estimated</span> (interpolated) values, and your
                <span className="text-amber-600 font-medium"> Manual Edits</span>. Click a legend item to show or hide a line.
              </p>
            </div>
            <div className="flex-1 min-h-0">
              <DataCharts data={data} />
            </div>
          </div>
          {/* Step 1 and Step 2 side by side */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ValidationStep 
              onValidate={handleValidate}
              data={data}
              originalData={originalData}
              validationRange={validationRange}
            />
            <EstimationStep 
              onEstimate={estimateData}
              data={data}
            />
          </div>

          <EditableDataTable
            data={data}
            setManualValue={setManualValue}
            validationRange={validationRange}
          />

          {/* Export */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export cleaned data (CSV)
            </Button>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 pt-6 pb-2 text-center text-sm text-gray-500">
            <p>
              VEE — Validation, Estimation, and Editing for time series data. Built with React, Tailwind CSS, and Recharts.
            </p>
            <a
              href="https://github.com/desmundyeng/vee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-gray-600 hover:text-gray-900"
            >
              <Github className="w-4 h-4" />
              View source on GitHub
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
