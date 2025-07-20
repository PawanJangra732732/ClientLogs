"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Send, Clock } from "lucide-react"

interface LogFormProps {
  onLogAdded: (logData: { server: string; message: string; timestamp?: string }) => Promise<{
    success: boolean
    log: any
  }>
}

export function LogForm({ onLogAdded }: LogFormProps) {
  const [formData, setFormData] = useState({
    server: "",
    message: "",
    timestamp: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.server || !formData.message) {
      setError("Server and message are required")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await onLogAdded(formData)

      // Reset form
      setFormData({
        server: "",
        message: "",
        timestamp: "",
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create log")
    } finally {
      setLoading(false)
    }
  }

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const setCurrentTime = () => {
    setFormData({
      ...formData,
      timestamp: formatDateTimeLocal(new Date()),
    })
  }

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server" className="text-gray-300">
                Server *
              </Label>
              <Select value={formData.server} onValueChange={(value) => setFormData({ ...formData, server: value })}>
                <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Select server" />
                </SelectTrigger>
                <SelectContent className="bg-gray-600 border-gray-500">
                  <SelectItem value="server1" className="text-white hover:bg-gray-500">
                    Server 1
                  </SelectItem>
                  <SelectItem value="server2" className="text-white hover:bg-gray-500">
                    Server 2
                  </SelectItem>
                  <SelectItem value="server3" className="text-white hover:bg-gray-500">
                    Server 3
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timestamp" className="text-gray-300">
                Timestamp
              </Label>
              <div className="flex gap-2">
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={formData.timestamp}
                  onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                  placeholder="Leave empty for current time"
                  className="bg-gray-600 border-gray-500 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={setCurrentTime}
                  title="Set current time"
                  className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400">Leave empty to use current server time</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">
              Message *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter log message..."
              rows={3}
              required
              className="bg-gray-600 border-gray-500 text-white placeholder:text-gray-400"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900/20 border-green-500">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">Log entry created successfully!</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={loading || !formData.server || !formData.message}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Create Log Entry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
