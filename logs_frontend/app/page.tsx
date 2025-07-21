"use client"

import { useState, useEffect, useRef } from "react"
import { TerminalLogs } from "@/components/terminal-logs"
import { LogForm } from "@/components/log-form"
import { ServerSelector } from "@/components/server-selector"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Monitor, Plus, Wifi, WifiOff } from "lucide-react"
import sampleLogs from "@/data/sample-logs.json"

export interface Log {
  id: number
  server: string
  message: string
  timestamp: string
}

export default function LogsDashboard() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState<"logs" | "add">("logs")
  const [selectedServer, setSelectedServer] = useState<string>("server1")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const FLASK_API_URL = "http://127.0.0.1:5000"
  const POLL_INTERVAL = 1000 // 1 second

  const fetchLogs = async (server: string, showLoading = true) => {
    if (!server) return

    if (showLoading) setLoading(true)

    try {
      const response = await fetch(`${FLASK_API_URL}/api/logs?server=${server}&limit=1000`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Sort by timestamp (newest first)
      data.sort((a: Log, b: Log) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setLogs(data)
      setConnected(true)
    } catch (err) {
      console.warn("Backend unavailable, using sample data:", err)
      setConnected(false)

      // Use sample data filtered by server
      const serverLogs = sampleLogs.filter((log) => log.server === server)
      const sortedSampleLogs = [...serverLogs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      setLogs(sortedSampleLogs)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const handleServerChange = (server: string) => {
    setSelectedServer(server)
  }

  const handleFetchLogs = () => {
    fetchLogs(selectedServer)
    startPolling(selectedServer)
  }

  const handleLogAdded = async (logData: { server: string; message: string; timestamp?: string }) => {
    try {
      const payload: any = {
        server: logData.server,
        message: logData.message,
      }

      if (logData.timestamp) {
        payload.timestamp = new Date(logData.timestamp).toISOString()
      }

      if (connected) {
        const response = await fetch(`${FLASK_API_URL}/api/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const newLog = await response.json()

        // Add to current logs only if it matches the selected server
        if (newLog.server === selectedServer) {
          const updatedLogs = [newLog, ...logs].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
          setLogs(updatedLogs)
        }

        return { success: true, log: newLog }
      } else {
        // Simulate adding to sample data
        const newLog = {
          id: Math.max(...logs.map((l) => l.id), 0) + 1,
          server: logData.server,
          message: logData.message,
          timestamp: logData.timestamp ? new Date(logData.timestamp).toISOString() : new Date().toISOString(),
        }

        // Add to current logs only if it matches the selected server
        if (newLog.server === selectedServer) {
          const updatedLogs = [newLog, ...logs].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
          setLogs(updatedLogs)
        }

        return { success: true, log: newLog }
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to create log")
    }
  }

  // Start real-time polling for specific server
  const startPolling = (server: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      fetchLogs(server, false) // Don't show loading for background updates
    }, POLL_INTERVAL)
  }

  // Stop polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    // Initial fetch with default server
    fetchLogs(selectedServer)
    startPolling(selectedServer)

    return () => {
      stopPolling()
    }
  }, [])

  return (
    <div className="max-w-full  bg-gray-900 text-white p-2 sm:p-4">
      {/* <div className="fixed inset-0 h-screen max-w-full bg-gray-900 text-white p-2 sm:p-3 font-mono text-lg sm:text-base md:text-sm min-w-max"> */}
      {/* // <div className="fixed inset-0 h-screen max-w-full bg-gray-900 text-white p-2 sm:p-3 font-mono font-vw min-w-max"> */}
      <div className="max-w-full mx-auto space-y-3">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-400" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Terminal Logs</h1>
              <p className="text-xs sm:text-sm text-gray-400">Real-time monitoring</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            {connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400">Sample Mode</span>
              </>
            )}
          </div>
        </div>

        {/* Compact Toggle Buttons */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "logs" ? "default" : "outline"}
            onClick={() => setActiveTab("logs")}
            size="sm"
            className={`flex items-center gap-1 text-xs sm:text-sm ${
              activeTab === "logs"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
            View Logs
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "outline"}
            onClick={() => setActiveTab("add")}
            size="sm"
            className={`flex items-center gap-1 text-xs sm:text-sm ${
              activeTab === "add"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            Add Log
          </Button>
        </div>

        {activeTab === "logs" && (
          <div className="space-y-3">
            {/* Compact Server Selector */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-3">
                <ServerSelector
                  selectedServer={selectedServer}
                  onServerChange={handleServerChange}
                  onFetch={handleFetchLogs}
                  loading={loading}
                  logsCount={logs.length}
                />
              </CardContent>
            </Card>

            {/* Full Height Terminal - No Header */}
            {/* h screen 80% */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg h-[70vh] overflow-auto">
              <TerminalLogs
                logs={logs}
                loading={loading}
                connected={connected}
                selectedServer={selectedServer}
                fullHeight={true}
              />
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Log Entry
                </h3>
                <p className="text-sm text-gray-400">Create a new log entry for a server</p>
              </div>
              <LogForm onLogAdded={handleLogAdded} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
