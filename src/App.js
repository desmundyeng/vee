import React, { useEffect, useMemo, useState } from 'react';
import { useDataManager } from "./hooks/useDataManager";
import ValidationStep from "./components/ValidationStep";
import EstimationStep from "./components/EstimationStep";
import EditingStep from "./components/EditingStep";
import DataTable from "./components/DataTable";
import DataCharts from "./components/DataCharts";
import DataSummary from "./components/DataSummary";
import { Button } from "./components/ui/button";
import { RotateCcw, Download } from "lucide-react";
import { EditableDataTable } from "./components/EditableDataTable";

function App() {
  const {
    data,
    validateData,
    estimateData,
    editSingleValue,
    editBulkValues,
    resetData,
    setLocks,
    originalData,
    setManualValue,
  } = useDataManager();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
            Validation, Estimation, and Editing (VEE)
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Interactive data validation, estimation, and editing for time series data.
              Clean your data step by step with real-time feedback and visualizations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={resetData}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Data
            </Button>
            <Button
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Data Overview and Time Series Chart Side by Side */}
          {/* <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6 h-[500px] overflow-auto w-full">
              <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
              <DataTable data={data} />
            </div>
          </div> */}

          {/* Time Series Chart - Right */}
          <div className="bg-white rounded-lg shadow h-[500px] flex flex-col justify-center w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Time Series Data</h2>
            <div className="flex-1 min-h-0">
              <DataCharts data={data} />
            </div>
          </div>
          {/* Step 1 and Step 2 side by side */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 ">
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

          {/* Debug: Print Manual Edit values above the chart */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 text-xs text-gray-700">
            <div className="font-semibold mb-2">Manual Edit Values (Debug):</div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
              {data.map(row => (
                <li key={row.ds} className="flex justify-between">
                  <span>{row.ds}</span>
                  <span className="font-mono">{row.setValue || <span className="text-gray-400">(empty)</span>}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content - Horizontal Layout */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Steps */}
            {/* <div className="space-y-6">
              <EditingStep
                onSingleEdit={editSingleValue}
                onBulkEdit={editBulkValues}
                data={data}
              />
            </div> */}

            {/* Right Column - Data Summary */}
            {/* <div className="space-y-6"> */}
              {/* Data Summary */}
              {/* <DataSummary data={data} /> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
