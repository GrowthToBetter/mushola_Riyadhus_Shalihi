"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Clock, User, BookOpen } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface KajianItem {
  id: string
  day: string
  ustaz: string
  time: string
  topic: string
  image: string
}

const initialKajianData: KajianItem[] = [
  {
    id: "1",
    day: "Senin",
    ustaz: "Ust. Ahmad Fauzi",
    time: "19:30 - 21:00",
    topic: "Tafsir Al-Quran",
    image: "/placeholder.svg?height=80&width=100",
  },
  {
    id: "2",
    day: "Rabu",
    ustaz: "Ust. Muhammad Ridwan",
    time: "20:00 - 21:30",
    topic: "Fiqh Sehari-hari",
    image: "/placeholder.svg?height=80&width=100",
  },
  {
    id: "3",
    day: "Jumat",
    ustaz: "Ust. Abdullah Hakim",
    time: "19:00 - 20:30",
    topic: "Akhlak dan Tasawuf",
    image: "/placeholder.svg?height=80&width=100",
  },
]

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

export function KajianSchedule() {
  const [kajianData, setKajianData] = useState<KajianItem[]>(initialKajianData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<KajianItem | null>(null)
  const [formData, setFormData] = useState({
    day: "",
    ustaz: "",
    timeStart: "",
    timeEnd: "",
    topic: "",
    image: "",
  })

  const resetForm = () => {
    setFormData({
      day: "",
      ustaz: "",
      timeStart: "",
      timeEnd: "",
      topic: "",
      image: "",
    })
    setEditingItem(null)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (item: KajianItem) => {
    const [timeStart, timeEnd] = item.time.split(" - ")
    setFormData({
      day: item.day,
      ustaz: item.ustaz,
      timeStart: timeStart,
      timeEnd: timeEnd,
      topic: item.topic,
      image: item.image,
    })
    setEditingItem(item)
    setIsDialogOpen(true)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.day || !formData.ustaz || !formData.timeStart || !formData.timeEnd || !formData.topic) {
      toast.error("Semua field harus diisi")
      return
    }    const newItem: KajianItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      day: formData.day,
      ustaz: formData.ustaz,
      time: `${formData.timeStart} - ${formData.timeEnd}`,
      topic: formData.topic,
      image: formData.image || "/placeholder.svg?height=80&width=100",
    }

    if (editingItem) {
      setKajianData((prev) => prev.map((item) => (item.id === editingItem.id ? newItem : item)))
      toast.success("Jadwal kajian berhasil diperbarui")
    } else {
      setKajianData((prev) => [...prev, newItem])
      toast.success("Jadwal kajian berhasil ditambahkan")
    }

    setIsDialogOpen(false)
    resetForm()
  }
  const handleDelete = (id: string) => {
    setKajianData((prev) => prev.filter((item) => item.id !== id))
    toast.success("Jadwal kajian berhasil dihapus")
  }

  const sortedKajianData = [...kajianData].sort((a, b) => {
    return days.indexOf(a.day) - days.indexOf(b.day)
  })

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Daftar Kajian</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Kelola jadwal kajian rutin masjid</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kajian
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Kajian" : "Tambah Kajian Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Hari</Label>
                  <Select
                    value={formData.day}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, day: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hari" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ustaz">Ustaz</Label>
                  <Input
                    id="ustaz"
                    value={formData.ustaz}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ustaz: e.target.value }))}
                    placeholder="Nama ustaz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeStart">Jam Mulai</Label>
                  <Input
                    id="timeStart"
                    type="time"
                    value={formData.timeStart}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timeStart: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeEnd">Jam Selesai</Label>
                  <Input
                    id="timeEnd"
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timeEnd: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Materi</Label>
                <Textarea
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                  placeholder="Materi kajian"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL Gambar (Opsional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">{editingItem ? "Perbarui" : "Tambah"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kajian List */}
      <div className="grid gap-4">
        {sortedKajianData.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada jadwal kajian</p>
                <p className="text-sm text-gray-400">Klik tombol "Tambah Kajian" untuk menambah jadwal</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedKajianData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.topic} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.day}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            {item.time} WIB
                          </div>
                        </div>

                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{item.topic}</h4>

                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <User className="h-3 w-3" />
                          {item.ustaz}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Kajian</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus kajian "{item.topic}" pada hari {item.day}? Tindakan
                                ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
