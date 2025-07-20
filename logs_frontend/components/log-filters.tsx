"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RotateCcw } from "lucide-react"

interface LogFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
  loading: boolean
}

export function LogFilters({ filters, onFiltersChange, loading }: LogFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      server: "server1",
      limit: 100,
    }
    setLocalFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const parseLocalDateTime = (localDateTime: string) => {
    if (!localDateTime) return ""
    const date = new Date(localDateTime)
    return date.toISOString()
  }

  const parseISOToLocal = (isoString: string) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return formatDateTimeLocal(date)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="server" className="text-gray-300">
          Server
        </Label>
        <Select
          value={localFilters.server}
          onValueChange={(value) => setLocalFilters({ ...localFilters, server: value })}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Select server" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="server1" className="text-white hover:bg-gray-600">
              Server 1
            </SelectItem>
            <SelectItem value="server2" className="text-white hover:bg-gray-600">
              Server 2
            </SelectItem>
            <SelectItem value="server3" className="text-white hover:bg-gray-600">
              Server 3
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="since" className="text-gray-300">
          Since
        </Label>
        <Input
          id="since"
          type="datetime-local"
          value={parseISOToLocal(localFilters.since || "")}
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              since: e.target.value ? parseLocalDateTime(e.target.value) : undefined,
            })
          }
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="until" className="text-gray-300">
          Until
        </Label>
        <Input
          id="until"
          type="datetime-local"
          value={parseISOToLocal(localFilters.until || "")}
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              until: e.target.value ? parseLocalDateTime(e.target.value) : undefined,
            })
          }
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="limit" className="text-gray-300">
          Max Logs
        </Label>
        <Input
          id="limit"
          type="number"
          min="1"
          max="1000"
          value={localFilters.limit || ""}
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              limit: e.target.value ? Number.parseInt(e.target.value) : 100,
            })
          }
          placeholder="Max results"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>

      <div className="md:col-span-2 lg:col-span-4 flex gap-2">
        <Button
          onClick={handleApplyFilters}
          disabled={loading || !localFilters.server}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Search className="h-4 w-4" />
          Apply Filters
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}
