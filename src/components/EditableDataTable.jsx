import * as React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// DataTable expects data in this format:
export function EditableDataTable({ data, setManualValue, validationRange }) {
    function formatEpochToLocal(epochSec) {
        if (!epochSec) return '';
        const date = new Date(epochSec * 1000);
        const pad = n => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "epochSecond",
                header: (
                    <span>Date</span>
                ),
                cell: (info) => {
                    return (<span className="font-medium">{formatEpochToLocal(info.row.original.epochSecond)}</span>)
                },
            },
            {
                accessorKey: "is_valid",
                header: (
                    <span>Status</span>
                ),
                cell: (info) => {
                    const row = info.row.original;
                    // Show 'Out of Range' if y is a real number outside validationRange
                    const isEmpty = row.y === null;
                    const outOfRange =
                        !isEmpty &&
                        validationRange &&
                        (row.y < validationRange[0] || row.y > validationRange[1]);

                    return (
                        <>
                            {row.is_valid && (
                                <Badge variant="success" className="w-[120px] flex justify-center items-center">Valid</Badge>
                            )}
                            {!isEmpty && !row.is_valid && outOfRange && (
                                <Badge variant="warning" className="w-[120px] flex justify-center items-center">Out of Range</Badge>
                            )}
                            {isEmpty && (
                                <Badge variant="warning" className="w-[120px] flex justify-center items-center">No data</Badge>
                            )}
                        </>
                    );
                },
            },
            {
                accessorKey: "y",
                header: <span className="text-right block">Original</span>,
                cell: (info) => {
                    const val = info.getValue();
                    const num = Number(val);
                    return val === null || val === undefined || val === "" || isNaN(num) ? (
                        <span className="text-gray-400 text-right block">NaN</span>
                    ) : (
                        <span className="text-right block">{num.toFixed(4)}</span>
                    );
                },
            },
            {
                accessorKey: "y_clean",
                header: <span className="text-right block">Estimated</span>,
                cell: ({ row }) => {
                    const estimated = row.original.y_clean;
                    const original = row.original.y;
                    const numEst = Number(estimated);
                    const numOrig = Number(original);
                    const isChanged = estimated !== "" && estimated !== null && estimated !== undefined && !isNaN(numEst) && numEst !== numOrig;
                    let direction = null;
                    if (isChanged) {
                        if (numEst > numOrig) direction = '▲';
                        else if (numEst < numOrig) direction = '▼';
                    }
                    const formatted = estimated === null || estimated === undefined || estimated === "" || isNaN(numEst) ? null : numEst.toFixed(4);
                    return isChanged ? (
                        <span className="font-medium text-right block min-w-[90px]">
                            {direction && <span className="mr-1 text-orange-500">{direction}</span>}
                            {formatted}
                        </span>
                    ) : (
                        <span className="font-medium text-right block min-w-[90px]">
                            {formatted === null ? <span className="text-gray-400">NaN</span> : formatted}
                        </span>
                    );
                },
            },
            {
                id: "setValue",
                header: <span className="text-right block">Manual Edit</span>,
                cell: ({ row }) => (
                    <SetValueDialogCell
                        value={row.original.setValue}
                        estimated={row.original.y_clean}
                        onChange={val => {
                            if (setManualValue) {
                                setManualValue(row.original.ds, val);
                            }
                        }}
                    />
                ),
            },
        ],
        [setManualValue, validationRange]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Add more table features as needed
    });

    return (
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-amber-500" />
            Step 3: Editing
          </CardTitle>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Method: Manual override
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Review each reading side by side: the original value, its validation status, and the estimated value.
            Click the <Pencil className="inline h-3.5 w-3.5 text-gray-500 align-text-bottom" /> pencil in the
            "Manual Edit" column to manually override a value. Your override takes priority over the estimated value.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        </CardContent>
        </Card>
    );
}

function SetValueDialogCell({ value, estimated, onChange }) {
    // Use estimated if value is empty/null/undefined
    const initial = value !== undefined && value !== null && value !== "" ? value : estimated;
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(initial);
    React.useEffect(() => { if (open) setInputValue(initial); }, [initial, open]);
    return (
        <div className="flex items-center justify-end gap-2 w-full">
            <span className="text-right block flex-1">
                {value !== "" && value !== null && value !== undefined && !isNaN(Number(value))
                    ? Number(value).toFixed(4)
                    : <span className="text-gray-400">—</span>}
            </span>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button type="button" className="p-1 hover:bg-gray-100 rounded" aria-label="Edit value">
                        <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Value</DialogTitle>
                        <DialogDescription>Set a custom value for this row.</DialogDescription>
                    </DialogHeader>
                    <input
                        type="text"
                        className="border rounded px-2 py-1 w-full mt-4"
                        value={inputValue}
                        onChange={e => {
                            const val = e.target.value;
                            // Allow empty or up to 5 digits before decimal and up to 4 after
                            if (val === '' || /^\d{0,5}(\.\d{0,4})?$/.test(val)) {
                                setInputValue(val);
                            }
                        }}
                        autoFocus
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                onClick={() => {
                                    onChange(inputValue);
                                }}
                            >
                                Save
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}