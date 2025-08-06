"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  BookOpen,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  addKajian,
  deleteKajian,
  updateKajian,
  getKajian,
} from "@/utils/kajianServerAction";

/* eslint-disable react/no-unescaped-entities */
export interface KajianItem {
  id?: string; // Optional for new items
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu";
  ustaz: string;
  timeStart: string;
  timeEnd: string;
  topic: string;
  image: string | null;
}

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function KajianSchedule() {
  const [kajianData, setKajianData] = useState<KajianItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KajianItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    day: "",
    ustaz: "",
    timeStart: "",
    timeEnd: "",
    topic: "",
    image: null as File | null,
    imageUrl: "", // For displaying current image URL when editing
  });

  // Fetch kajian data on component mount
  useEffect(() => {
    const fetchKajianData = async () => {
      try {
        setLoading(true);
        const data = await getKajian();
        setKajianData(data);
      } catch (error) {
        console.error("Failed to fetch kajian data:", error);
        toast.error("Gagal memuat data kajian");
      } finally {
        setLoading(false);
      }
    };

    fetchKajianData();
  }, []);

  const resetForm = () => {
    setFormData({
      day: "",
      ustaz: "",
      timeStart: "",
      timeEnd: "",
      topic: "",
      image: null,
      imageUrl: "",
    });
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  const handleEdit = (item: KajianItem) => {
    setFormData({
      day: item.day,
      ustaz: item.ustaz,
      timeStart: item.timeStart,
      timeEnd: item.timeEnd,
      topic: item.topic,
      image: null, // File will be uploaded separately if changed
      imageUrl: item.image || "",
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.day ||
      !formData.ustaz ||
      !formData.timeStart ||
      !formData.timeEnd ||
      !formData.topic
    ) {
      toast.error("Semua field harus diisi");
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData object
      const submitData = new FormData();
      submitData.append("day", formData.day);
      submitData.append("ustaz", formData.ustaz);
      submitData.append("timeStart", formData.timeStart);
      submitData.append("timeEnd", formData.timeEnd);
      submitData.append("topic", formData.topic);

      // Handle image upload
      if (formData.image) {
        submitData.append("image", formData.image);
      } else {
        // Create a placeholder file for the server action
        const placeholderBlob = new Blob([""], { type: "image/jpeg" });
        const placeholderFile = new File([placeholderBlob], "placeholder.jpg", {
          type: "image/jpeg",
        });
        submitData.append("image", placeholderFile);
      }

      if (editingItem) {
        // For update, you'll need to implement updateKajian to work with FormData
        // For now, let's assume you have an updateKajian function that accepts FormData and ID
        submitData.append("id", editingItem.id!);
        const updatedKajian = await updateKajian(submitData);

        // Update local state
        setKajianData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? updatedKajian : item
          )
        );
        toast.success("Jadwal kajian berhasil diperbarui");
      } else {
        // Add new kajian
        const newKajian = await addKajian(submitData);

        // Update local state
        setKajianData((prev) => [...prev, newKajian]);
        toast.success("Jadwal kajian berhasil ditambahkan");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting kajian:", error);
      toast.error(
        editingItem ? "Gagal memperbarui kajian" : "Gagal menambahkan kajian"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKajian(id);

      // Update local state
      setKajianData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Jadwal kajian berhasil dihapus");
    } catch (error) {
      console.error("Error deleting kajian:", error);
      toast.error("Gagal menghapus kajian");
    }
  };

  const sortedKajianData = [...kajianData].sort((a, b) => {
    return days.indexOf(a.day) - days.indexOf(b.day);
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Daftar Kajian</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kelola jadwal kajian rutin masjid
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Memuat data kajian...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Daftar Kajian</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kelola jadwal kajian rutin masjid
          </p>
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
              <DialogTitle>
                {editingItem ? "Edit Kajian" : "Tambah Kajian Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Hari</Label>
                  <Select
                    value={formData.day}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, day: value }))
                    }
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
                  <Label htmlFor="ustaz">Ustadz</Label>
                  <Input
                    id="ustaz"
                    value={formData.ustaz}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ustaz: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        timeStart: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeEnd">Jam Selesai</Label>
                  <Input
                    id="timeEnd"
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        timeEnd: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">Materi</Label>
                <Textarea
                  id="topic"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  placeholder="Materi kajian"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Gambar</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">
                      Gambar saat ini:
                    </p>
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={formData.imageUrl}
                        alt="Current image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {editingItem ? "Memperbarui..." : "Menambahkan..."}
                    </>
                  ) : editingItem ? (
                    "Perbarui"
                  ) : (
                    "Tambah"
                  )}
                </Button>
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
                <p className="text-sm text-gray-400">
                  Klik tombol {"Tambah Kajian"} untuk menambah jadwal
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedKajianData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.topic}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.day}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            {item.timeStart} - {item.timeEnd} WIB
                          </div>
                        </div>
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {item.topic}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <User className="h-3 w-3" />
                          {item.ustaz}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 p-0"
                        >
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
                                Apakah Anda yakin ingin menghapus kajian{" "}
                                {item.topic} pada hari {item.day}? Tindakan ini
                                tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id!)}
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
  );
}
