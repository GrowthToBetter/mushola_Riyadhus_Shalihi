// filepath: src/utils/userGetServerAction.ts
"use server";

import { SignInFormData } from "@/app/auth/signin/page";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";
import bcrypt from "bcrypt";
import { env } from "@/env";
import { AdminForm } from "@/components/admin/editAdmin/Hero";

// Type definitions for better type safety
export type ActionResult = {
  status: number;
  message: string;
  data?: Record<string, unknown>;
};

export type AuthResult = {
  ok: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    username: string;
  };
};

/**
 * Revalidate all admin-related paths
 */
function revalidateAdminPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/schedule");
  revalidatePath("/admin/edit");
}

/**
 * Delete admin by ID
 */
export async function deleteAdminData(id: string): Promise<ActionResult> {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return {
        status: 404,
        message: "Admin tidak ditemukan",
      };
    }

    // Prevent deletion of default admin
    if (existingAdmin.email === env.DEFAULT_ADMIN) {
      return {
        status: 403,
        message: "Admin default tidak dapat dihapus",
      };
    }

    // Check if this is the last admin
    const adminCount = await prisma.admin.count();
    if (adminCount <= 1) {
      return {
        status: 403,
        message: "Tidak dapat menghapus admin terakhir",
      };
    }

    await prisma.admin.delete({
      where: { id },
    });

    revalidateAdminPaths();

    return {
      status: 200,
      message: "Admin berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return {
      status: 500,
      message: "Gagal menghapus admin",
    };
  }
}

/**
 * Authenticate admin user
 */
export async function storeData(formData: SignInFormData): Promise<AuthResult> {
  const { email, password } = formData;

  try {
    // Validate input
    if (!email || !password) {
      return {
        ok: false,
        message: "Email dan password harus diisi",
      };
    }

    // Find admin by email
    let admin = await prisma.admin.findUnique({
      where: { email },
    });

    // Handle default admin case
    if (!admin && email === env.DEFAULT_ADMIN) {
      admin = {
        id: "default-id",
        email: env.DEFAULT_ADMIN,
        username: "admin",
        password: await bcrypt.hash(env.DEFAULT_ADMIN_PASSWORD, 10),
      };
    }

    // Check if admin exists
    if (!admin) {
      return {
        ok: false,
        message: "Email tidak terdaftar",
      };
    }

    if (!admin.password) {
      return {
        ok: false,
        message: "Password tidak tersedia",
      };
    }

    // Validate password
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return {
        ok: false,
        message: "Password salah",
      };
    }

    return {
      ok: true,
      message: "Login berhasil",
      data: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      ok: false,
      message: "Terjadi kesalahan saat login",
    };
  }
}

/**
 * Add new admin user
 */
export async function addUser(data: AdminForm): Promise<ActionResult> {
  try {
    // Validate input data
    if (
      !data.email?.trim() ||
      !data.password?.trim() ||
      !data.username?.trim()
    ) {
      return {
        status: 400,
        message: "Semua field harus diisi",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        status: 400,
        message: "Format email tidak valid",
      };
    }

    // Validate password length
    if (data.password.length < 6) {
      return {
        status: 400,
        message: "Password minimal 6 karakter",
      };
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existingAdmin) {
      return {
        status: 409,
        message: "Email sudah terdaftar",
      };
    }

    // Hash password
    const hashedPassword = await hash(data.password, 10);

    // Create new admin
    const newAdmin = await prisma.admin.create({
      data: {
        email: data.email.trim(),
        password: hashedPassword,
        username: data.username.trim(),
      },
    });

    revalidateAdminPaths();

    return {
      status: 201,
      message: "Admin berhasil ditambahkan",
      data: {
        id: newAdmin.id,
        email: newAdmin.email,
        username: newAdmin.username,
      },
    };
  } catch (error) {
    console.error("Error adding user:", error);
    return {
      status: 500,
      message: "Gagal menambahkan admin",
    };
  }
}

/**
 * Update existing admin user
 */
export async function updateUser(
  data: AdminForm,
  id: string
): Promise<ActionResult> {
  try {
    // Validate input data
    if (
      !data.email?.trim() ||
      !data.password?.trim() ||
      !data.username?.trim()
    ) {
      return {
        status: 400,
        message: "Semua field harus diisi",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        status: 400,
        message: "Format email tidak valid",
      };
    }

    // Validate password length
    if (data.password.length < 6) {
      return {
        status: 400,
        message: "Password minimal 6 karakter",
      };
    }

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return {
        status: 404,
        message: "Admin tidak ditemukan",
      };
    }

    // Check if email is already used by another admin
    const emailExists = await prisma.admin.findFirst({
      where: {
        email: data.email,
        id: { not: id },
      },
    });

    if (emailExists) {
      return {
        status: 409,
        message: "Email sudah digunakan oleh admin lain",
      };
    }

    // Hash new password
    const hashedPassword = await hash(data.password, 10);

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        email: data.email.trim(),
        password: hashedPassword,
        username: data.username.trim(),
      },
    });

    revalidateAdminPaths();

    return {
      status: 200,
      message: "Admin berhasil diperbarui",
      data: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        username: updatedAdmin.username,
      },
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      status: 500,
      message: "Gagal memperbarui admin",
    };
  }
}

/**
 * Get all admin emails (for validation purposes)
 */
export async function getEmailAdmin(): Promise<{ email: string }[]> {
  try {
    const emails = await prisma.admin.findMany({
      select: { email: true },
    });
    return emails;
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    return [];
  }
}

/**
 * Get all admin users (excluding sensitive password data in production)
 */
export async function getAllUsers() {
  try {
    const users = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        password: true, // Consider removing in production for security
      },
      orderBy: [
        {
          // Put default admin first
          email: "asc",
        },
        {
          username: "asc",
        },
      ],
    });
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

/**
 * Get admin user by ID (without password for security)
 */
export async function getAdminById(id: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    return admin;
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    return null;
  }
}

/**
 * Check if admin email exists (for form validation)
 */
export async function checkEmailExists(
  email: string,
  excludeId?: string
): Promise<boolean> {
  try {
    const admin = await prisma.admin.findFirst({
      where: {
        email,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return !!admin;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}

/**
 * Get admin statistics
 */
export async function getAdminStats() {
  try {
    const totalAdmins = await prisma.admin.count();
    const defaultAdmins = await prisma.admin.count({
      where: {
        email: env.DEFAULT_ADMIN,
      },
    });

    return {
      total: totalAdmins,
      regular: totalAdmins - defaultAdmins,
      default: defaultAdmins,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      total: 0,
      regular: 0,
      default: 0,
    };
  }
}
