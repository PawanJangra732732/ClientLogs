"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Server } from "lucide-react"

interface ServerSelectorProps {
  selectedServer: string
  onServerChange: (server: string) => void
  onFetch: () => void
  loading: boolean
  logsCount: number
}

export function ServerSelector({ selectedServer, onServerChange, onFetch, loading, logsCount }: ServerSelectorProps) {
  const servers = [
    { value: "server1", label: "Server 1", description: "Production Web Server" },
    { value: "server2", label: "Server 2", description: "Database Server" },
    { value: "server3", label: "Server 3", description: "API Gateway Server" },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Server className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">Server</span>
          {logsCount > 0 && (
            <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded">{logsCount} logs</span>
          )}
        </div>
        <Select value={selectedServer} onValueChange={onServerChange}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
            <SelectValue placeholder="Choose a server" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {servers.map((server) => (
              <SelectItem
                key={server.value}
                value={server.value}
                className="text-white hover:bg-gray-600 focus:bg-gray-600"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{server.label}</span>
                  <span className="text-xs text-gray-400">{server.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onFetch}
        disabled={loading || !selectedServer}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 whitespace-nowrap"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
            Fetching...
          </>
        ) : (
          <>
            <Search className="h-3 w-3" />
            Fetch Logs
          </>
        )}
      </Button>
    </div>
  )
}
