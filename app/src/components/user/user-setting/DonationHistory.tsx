"use client";

import { useEffect, useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";
import type {
    ColumnDef,
    SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import dayjs from "dayjs";

interface Donation {
    _id: string;
    amount: number;
    message: string;
    createdAt: string;
    originalIndex: number;
}

export default function DonationHistory() {
    const { coreAPI } = useContext(AppContext);
    const authAxios = useAuthAxios();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await authAxios.get(`${coreAPI}/donations/get-donations-history`);
                const dataWithIndex = res.data.map((item: any, index: number) => ({
                    ...item,
                    originalIndex: index + 1,
                }));
                setDonations(dataWithIndex);
            } catch (error) {
                console.error("Error fetching donations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const columns: ColumnDef<Donation>[] = [
        {
            header: "STT",
            cell: ({ row, table }) =>
                table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                row.index + 1,
            enableSorting: false,
        },
        {
            accessorKey: "amount",
            enableSorting: true,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Số tiền (VND) <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) =>
                row.original.amount.toLocaleString("vi-VN") + " VND",
        },
        {
            accessorKey: "message",
            enableSorting: false,
            header: "Lời nhắn",
            cell: ({ row }) =>
                row.original.message || (
                    <span className="text-muted-foreground italic">Không có</span>
                ),
        },
        {
            accessorKey: "createdAt",
            enableSorting: true,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Thời gian <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) =>
                dayjs(row.original.createdAt).format("HH:mm DD/MM/YYYY"),
        },
    ];

    const table = useReactTable({
        data: donations,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">
                Lịch sử ủng hộ
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng số tiền đã ủng hộ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold text-green-600">
                            {totalAmount.toLocaleString("vi-VN")} VND
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng số lượt ủng hộ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold text-blue-600">
                            {donations.length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Input
                placeholder="Tìm kiếm theo lời nhắn hoặc số tiền..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="mb-4"
            />

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="w-full h-24 rounded-md" />
                    ))}
                </div>
            ) : (
                <div className="rounded-md border bg-background shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex justify-between items-center mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Trang trước
                        </Button>
                        <span>
                            Trang {table.getState().pagination.pageIndex + 1} /{" "}
                            {table.getPageCount()}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Trang sau
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
