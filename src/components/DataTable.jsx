import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';

const DataTable = ({ data }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Original Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Clean Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
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
                <Badge 
                  variant={row.is_valid ? "success" : "destructive"}
                >
                  {row.is_valid ? "Valid" : "Invalid"}
                </Badge>
              </TableCell>
              <TableCell>
                {row.y_clean === null ? (
                  <span className="text-gray-400">NaN</span>
                ) : (
                  <span className="font-medium">
                    {typeof row.y_clean === 'number' 
                      ? row.y_clean.toFixed(2) 
                      : row.y_clean.toLocaleString()
                    }
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable; 