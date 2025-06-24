/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit,
  Trash2,
  User,
  Mail,
  Search,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { addUser, deleteAdminData, updateUser } from "@/utils/userGetServerAction";

// Type untuk Admin berdasarkan model Prisma
type Admin = Prisma.AdminGetPayload<{}>;

// Type untuk form data (tanpa password saat display)
export interface AdminForm {
  email: string;
  username: string;
  password: string;
}

export default function AdminTable({ adminData }: { adminData: Admin[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [editForm, setEditForm] = useState<AdminForm>({
    email: "",
    username: "",
    password: "",
  });

  const [addForm, setAddForm] = useState<AdminForm>({
    email: "",
    username: "",
    password: "",
  });

  const addAdmin = async (data: AdminForm) => {
    setIsAdding(true);
    const toastId = toast.loading("Menambahkan admin...");

    try {
      // Simulate API call - replace with actual API call

      await addUser(data); // Uncomment when API is ready

      toast.success("Admin berhasil ditambahkan", { id: toastId });
      setAddDialogOpen(false);
      setAddForm({
        email: "",
        username: "",
        password: "",
      });
    } catch {
      toast.error("Gagal menambahkan admin", { id: toastId });
    } finally {
      setIsAdding(false);
    }
  };

  const deleteAdmin = async (id: string) => {
    setIsDeleting(id);
    const toastId = toast.loading("Menghapus admin...");

    try {
      // Simulate API call - replace with actual API call
      await deleteAdminData(id); // Uncomment when API is ready
      toast.success("Admin berhasil dihapus", { id: toastId });
    } catch {
      toast.error("Gagal menghapus admin", { id: toastId });
    } finally {
      setIsDeleting(null);
    }
  };

  const updateAdmin = async (id: string, data: AdminForm) => {
    setIsUpdating(id);
    const toastId = toast.loading("Mengupdate admin...");

    try {
      // Simulate API call - replace with actual API call

      await updateUser(data, id); // Uncomment when API is ready

      toast.success("Admin berhasil diupdate", { id: toastId });
      setEditDialogOpen(false);
      setEditingAdmin(null);
    } catch {
      toast.error("Gagal mengupdate admin", { id: toastId });
    } finally {
      setIsUpdating(null);
    }
  };

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditForm({
      email: admin.email,
      username: admin.username,
      password: "", // Don't pre-fill password for security
    });
    setEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setAddForm({
      email: "",
      username: "",
      password: "",
    });
    setAddDialogOpen(true);
  };

  const togglePasswordVisibility = (adminId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
    }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Filter admins
  const filteredAdmins = adminData.filter((admin) => {
    const matchesSearch =
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalAdmins = adminData.length;

  return (
    <div className="w-full space-y-6">
      {/* Main Table */}
      <Card>
        <CardHeader>
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Manajemen Admin</h2>
              <p className="text-sm text-gray-600">
                Kelola akun administrator sistem
              </p>
            </div>

            {/* Add Admin Button */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={openAddDialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Admin
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tambah Admin Baru</DialogTitle>
                  <DialogDescription>
                    Buat akun administrator baru dengan informasi yang
                    diperlukan.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="add-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="add-email"
                      type="email"
                      value={addForm.email}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          email: e.target.value,
                        })
                      }
                      className="col-span-3"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="add-username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="add-username"
                      type="text"
                      value={addForm.username}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          username: e.target.value,
                        })
                      }
                      className="col-span-3"
                      placeholder="admin123"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="add-password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="add-password"
                      type="password"
                      value={addForm.password}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          password: e.target.value,
                        })
                      }
                      className="col-span-3"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                    disabled={isAdding}>
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addAdmin(addForm)}
                    disabled={
                      isAdding ||
                      !addForm.email ||
                      !addForm.username ||
                      !addForm.password ||
                      !validateEmail(addForm.email)
                    }>
                    {isAdding ? "Menambahkan..." : "Tambah Admin"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari email atau username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="font-semibold text-left p-3">Email</th>
                  <th className="font-semibold text-left p-3">Username</th>
                  <th className="font-semibold text-left p-3">Password</th>
                  <th className="font-semibold text-right p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? "Tidak ada admin yang sesuai dengan pencarian"
                        : "Belum ada admin terdaftar"}
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 border-b">
                      <td className="p-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium">{admin.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">{admin.username}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {showPasswords[admin.id]
                              ? admin.password
                              : "••••••••"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(admin.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                            {showPasswords[admin.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>

                      <td className="text-right p-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <Dialog
                            open={editDialogOpen}
                            onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(admin)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                disabled={isUpdating === admin.id}>
                                {isUpdating === admin.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                                <span className="sr-only">Edit admin</span>
                              </Button>
                            </DialogTrigger>

                            {editingAdmin?.id === admin.id && (
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Admin</DialogTitle>
                                  <DialogDescription>
                                    Ubah informasi administrator. Kosongkan
                                    password jika tidak ingin mengubah.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-email"
                                      className="text-right">
                                      Email
                                    </Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={editForm.email}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          email: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-username"
                                      className="text-right">
                                      Username
                                    </Label>
                                    <Input
                                      id="edit-username"
                                      type="text"
                                      value={editForm.username}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          username: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                      htmlFor="edit-password"
                                      className="text-right">
                                      Password
                                    </Label>
                                    <Input
                                      id="edit-password"
                                      type="password"
                                      value={editForm.password}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          password: e.target.value,
                                        })
                                      }
                                      className="col-span-3"
                                      placeholder="Kosongkan jika tidak ingin mengubah"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditDialogOpen(false)}>
                                    Batal
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      updateAdmin(admin.id, editForm)
                                    }
                                    disabled={
                                      isUpdating === admin.id ||
                                      !editForm.email ||
                                      !editForm.username ||
                                      !validateEmail(editForm.email)
                                    }>
                                    {isUpdating === admin.id
                                      ? "Menyimpan..."
                                      : "Simpan"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            )}
                          </Dialog>

                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={isDeleting === admin.id}>
                                {isDeleting === admin.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">Hapus admin</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Admin</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus admin{" "}
                                  <strong>{admin.username}</strong> (
                                  {admin.email})? Tindakan ini tidak dapat
                                  dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAdmin(admin.id)}
                                  className="bg-red-600 hover:bg-red-700">
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Menampilkan {filteredAdmins.length} dari {totalAdmins} admin
            {searchTerm && " (difilter)"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
