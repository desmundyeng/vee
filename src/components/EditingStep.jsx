import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Edit, Edit3, Save } from 'lucide-react';

const EditingStep = ({ onSingleEdit, onBulkEdit, data }) => {
  const [singleDate, setSingleDate] = useState('2024-01-06');
  const [singleValue, setSingleValue] = useState('107');
  const [bulkEdits, setBulkEdits] = useState('2024-01-03,105\n2024-01-07,109');

  const handleSingleEdit = () => {
    onSingleEdit(singleDate, singleValue);
  };

  const handleBulkEdit = () => {
    const edits = bulkEdits
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [date, value] = line.split(',').map(s => s.trim());
        return { date, value };
      })
      .filter(edit => edit.date && edit.value);
    
    onBulkEdit(edits);
  };

  const availableDates = data.map(row => row.ds);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5 text-purple-600" />
          Step 3: Manual Editing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Edit</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Edit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <select
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  type="number"
                  value={singleValue}
                  onChange={(e) => setSingleValue(e.target.value)}
                  placeholder="Enter new value"
                />
              </div>
            </div>
            <Button onClick={handleSingleEdit} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Apply Single Edit
            </Button>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulk Edits (Date,Value format)</label>
              <Textarea
                value={bulkEdits}
                onChange={(e) => setBulkEdits(e.target.value)}
                placeholder="2024-01-03,105&#10;2024-01-07,109&#10;2024-01-10,115"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Enter one edit per line in format: YYYY-MM-DD,value
              </p>
            </div>
            <Button onClick={handleBulkEdit} className="w-full">
              <Edit3 className="h-4 w-4 mr-2" />
              Apply Bulk Edits
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EditingStep; 