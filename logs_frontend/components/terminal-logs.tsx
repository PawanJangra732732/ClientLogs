"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal } from "lucide-react"
import type { Log } from "@/app/page"

interface TerminalLogsProps {
  logs: Log[]
  loading: boolean
  connected: boolean
  selectedServer: string
  fullHeight?: boolean
}

export function TerminalLogs({ logs, loading, connected, selectedServer, fullHeight = false }: TerminalLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    } catch {
      return timestamp
    }
  }

  const getServerColor = (server: string) => {
    const colors = {
      server1: "text-blue-400",
      server2: "text-green-400",
      server3: "text-purple-400",
    }
    return colors[server as keyof typeof colors] || "text-gray-400"
  }

  const getMessageColor = (message: string) => {
    const lower = message.toLowerCase()
    if (lower.includes("error") || lower.includes("failed")) {
      return "text-red-400"
    }
    if (lower.includes("warning") || lower.includes("warn")) {
      return "text-yellow-400"
    }
    if (lower.includes("success") || lower.includes("completed") || lower.includes("ok")) {
      return "text-green-400"
    }
    return "text-gray-300"
  }

  const getLogPrefix = (message: string) => {
    const lower = message.toLowerCase()
    if (lower.includes("error") || lower.includes("failed")) {
      return "[ERROR]"
    }
    if (lower.includes("warning") || lower.includes("warn")) {
      return "[WARN]"
    }
    if (lower.includes("success") || lower.includes("completed") || lower.includes("ok")) {
      return "[INFO]"
    }
    return "[LOG]"
  }

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  if (loading && logs.length === 0) {
    return (
      <div className="bg-black p-4 font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-green-400 mb-4">
          <Terminal className="h-4 w-4" />
          <span>Fetching logs from {selectedServer}...</span>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-600">
              <span className="animate-pulse">{">"}</span>
              <div className="h-3 bg-gray-800 rounded flex-1 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const terminalHeight = fullHeight ? "calc(100vh - 200px)" : "h-96"

  return (
    <div className="bg-black min-w-max auto-fit">
      {/* Compact Terminal Header */}
      <div className="bg-gray-900 px-3 py-2 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
          <Terminal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 ml-1" />
          <span className="text-gray-400 text-xs font-mono">logs@{selectedServer}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-500">Live ({logs.length})</span>
          {!connected && (
            <span className="px-1.5 py-0.5 bg-yellow-900/30 text-yellow-400 rounded text-xs border border-yellow-400/30">
              Sample
            </span>
          )}
        </div>
      </div>

      {/* Terminal Content - Full Height with Horizontal Scroll */}
      <ScrollArea className={`${terminalHeight}`}>
        <div ref={scrollRef} className="p-2 sm:p-3 font-mono text-xs min-w-max">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <Terminal className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No logs found for {selectedServer}</p>
              <p className="text-xs mt-1">Select a server and click "Fetch Logs" to view logs</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {logs.map((log) => (
                <div key={`${log.id}-${log.timestamp}`} className="hover:bg-gray-900/50 px-1 sm:px-2 py-0.5 rounded">
                  {/* Single line log with horizontal scroll */}
                  <div className="flex items-center gap-1 sm:gap-2 text-xs leading-tight overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent min-w-max">
                    <span className="text-gray-500 text-xs shrink-0 w-16 sm:w-20">
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span className={`${getServerColor(log.server)} shrink-0 font-semibold w-16 sm:w-20`}>
                      [{log.server}]
                    </span>
                    <span className="text-gray-400 shrink-0 text-xs w-12 sm:w-16">{getLogPrefix(log.message)}</span>
                    <span className={`${getMessageColor(log.message)} whitespace-nowrap`}>{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Terminal Cursor */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-400">$</span>
            <span className="bg-green-400 w-1.5 h-3 animate-pulse"></span>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
