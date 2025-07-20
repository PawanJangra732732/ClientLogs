"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, AlertCircle, Server, Clock, MessageSquare } from "lucide-react"
import type { Log } from "@/app/page"

interface LogsTableProps {
  logs: Log[]
  loading: boolean
  error: string | null
  onRefresh: () => void
}

export function LogsTable({ logs, loading, error, onRefresh }: LogsTableProps) {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString()
    } catch {
      return timestamp
    }
  }

  const getServerColor = (server: string) => {
    const colors = {
      server1: "bg-blue-100 text-blue-800",
      server2: "bg-green-100 text-green-800",
      server3: "bg-purple-100 text-purple-800",
    }
    return colors[server as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getMessageType = (message: string) => {
    const lower = message.toLowerCase()
    if (lower.includes("error") || lower.includes("failed")) {
      return { type: "error", color: "bg-red-100 text-red-800" }
    }
    if (lower.includes("warning") || lower.includes("warn")) {
      return { type: "warning", color: "bg-yellow-100 text-yellow-800" }
    }
    if (lower.includes("success") || lower.includes("completed") || lower.includes("ok")) {
      return { type: "success", color: "bg-green-100 text-green-800" }
    }
    return { type: "info", color: "bg-blue-100 text-blue-800" }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-32" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters or check back later.</p>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="w-32">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Server
                </div>
              </TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-48">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timestamp
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => {
              const messageType = getMessageType(log.message)
              return (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.id}</TableCell>
                  <TableCell>
                    <Badge className={getServerColor(log.server)}>{log.server}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className={`${messageType.color} text-xs`}>
                        {messageType.type}
                      </Badge>
                      <span className="text-sm">{log.message}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-600">{formatTimestamp(log.timestamp)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
