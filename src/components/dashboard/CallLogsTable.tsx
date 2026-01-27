"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CallLog {
    id: string;
    callerNumber: string | null;
    duration: number | null;
    summary: string | null;
    transcript: string | null;
    status: string | null;
    createdAt: string;
}

export function CallLogsTable({ logs }: { logs: CallLog[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Caller</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                No call logs found yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium flex items-center">
                                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                    {log.callerNumber || "Anonymous"}
                                </TableCell>
                                <TableCell>{log.duration ? `${log.duration}s` : "0s"}</TableCell>
                                <TableCell>
                                    <Badge variant={log.status === "completed" ? "default" : "secondary"}>
                                        {log.status || "Unknown"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(log.createdAt), "MMM d, h:mm a")}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Call Details - {log.callerNumber}</DialogTitle>
                                                <DialogDescription>
                                                    {format(new Date(log.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-6 mt-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-2">Summary</h4>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                                                        {log.summary || "No summary available."}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold mb-2">Transcript</h4>
                                                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap max-h-60 overflow-y-auto italic">
                                                        {log.transcript || "No transcript available."}
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
