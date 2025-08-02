"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface PrayerTime {
  name: string
  time: string
}

interface PrayerData {
  date: string
  prayers: PrayerTime[]
}

export function PrayerSchedule() {
  const [useApi, setUseApi] = useState(true)
  const [loading, setLoading] = useState(false)
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null)
  const [manualTimes, setManualTimes] = useState<PrayerTime[]>([
    { name: "Subuh", time: "04:30" },
    { name: "Dzuhur", time: "12:00" },
    { name: "Ashar", time: "15:30" },
    { name: "Maghrib", time: "18:00" },
    { name: "Isya", time: "19:30" },  ])

  const fetchPrayerTimes = async () => {
    setLoading(true)
    try {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")

      const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1634/${year}/${month}/${day}`)

      if (!response.ok) throw new Error("Failed to fetch prayer times")

      const data = await response.json()

      if (data.status && data.data && data.data.jadwal) {
        const jadwal = data.data.jadwal
        setPrayerData({
          date: `${day}/${month}/${year}`,
          prayers: [
            { name: "Subuh", time: jadwal.subuh },
            { name: "Dzuhur", time: jadwal.dzuhur },
            { name: "Ashar", time: jadwal.ashar },
            { name: "Maghrib", time: jadwal.maghrib },
            { name: "Isya", time: jadwal.isya },
          ],
        });
        toast.success("Jadwal sholat berhasil diperbarui dari API")
      }    } catch (error) {
      console.error("Error fetching prayer times:", error)
      toast.error("Gagal mengambil jadwal sholat dari API")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (useApi) {
      fetchPrayerTimes()
    }
  }, [useApi])

  const handleManualTimeChange = (index: number, time: string) => {
    const updated = [...manualTimes]
    updated[index].time = time
    setManualTimes(updated)
  }
  const saveManualTimes = () => {
    // Simulate saving to backend
    toast.success("Jadwal sholat manual berhasil disimpan")
  }

  const currentTimes = useApi ? prayerData?.prayers : manualTimes

  return (
    <div className="space-y-6">
      {/* API Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="space-y-1">
          <Label htmlFor="api-toggle" className="text-sm font-medium">
            Gunakan API Jadwal Sholat
          </Label>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Otomatis mengambil jadwal dari MyQuran API untuk kota Depok
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="api-toggle" checked={useApi} onCheckedChange={setUseApi} />
          {useApi && (
            <Button variant="outline" size="sm" onClick={fetchPrayerTimes} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant={useApi ? "default" : "secondary"}>{useApi ? "Mode API" : "Mode Manual"}</Badge>
        {prayerData && useApi && <Badge variant="outline">Tanggal: {prayerData.date}</Badge>}
      </div>

      {/* Prayer Times Display/Edit */}
      {useApi ? (
        // API Mode - Display Only
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTimes?.map((prayer, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{prayer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{prayer.time}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Manual Mode - Editable
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {manualTimes.map((prayer, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{prayer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="time"
                    value={prayer.time}
                    onChange={(e) => handleManualTimeChange(index, e.target.value)}
                    className="text-lg font-semibold"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={saveManualTimes} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Simpan Jadwal Manual
            </Button>
          </div>
        </div>
      )}

      {loading && useApi && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Mengambil jadwal sholat...</span>
        </div>
      )}
    </div>
  )
}
