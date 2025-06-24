"use server";

import { SignInFormData } from "@/app/auth/signin/page";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";
import bcrypt from "bcrypt";
import { env } from "@/env";
import { AdminForm } from "@/components/admin/editAdmin/Hero";


export async function deleteAdminData(id:string){
  try {
    await prisma.admin.delete({
      where: {
        id,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin/edit");
    return { status: 200, message: "Admin deleted successfully" };
  } catch {
    return {status: 500, message: "Failed to delete admin"}
  }
}


export async function storeData(formData: SignInFormData) {
  const { email, password } = formData;

  try {
    // Cari admin berdasarkan email
    let admin = await prisma.admin.findUnique({
      where: { email },
    });

    // Jika tidak ditemukan dan bukan email default, tolak login
    if (!admin && email !== env.DEFAULT_ADMIN) {
      return {
        ok: false,
        message: "User tidak ditemukan",
      };
    }

    // Jika tidak ditemukan tapi email adalah admin@gmail.com, buat admin dummy
    if (!admin && email === env.DEFAULT_ADMIN) {
      admin = {
        id: "default-id",
        email: env.DEFAULT_ADMIN,
        username: "admin",
        password: await bcrypt.hash(env.DEFAULT_ADMIN_PASSWORD, 10), // Default password
      };
    }
    if (!admin?.password) {
      return {
        ok: false,
        message: "Password tidak tersedia",
      };
    }

    // Validasi password
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return {
        ok: false,
        message: "Password salah",
      };
    }

    return {
      ok: true,
      data: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    };
  } catch {
    return {
      ok: false,
      message: "Terjadi kesalahan",
    };
  }
}

export async function addUser(data: AdminForm) {
  try {
    const hashedPassword = await hash(data.password, 10);
    await prisma.admin.create({
      data: {
        email: data.email,
        password: hashedPassword,
        username: data.username,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin/edit");
    return { status: 200, message: "User added successfully" };
  } catch {
   return { status: 500, message: "Failed to add user" };
  }
}
export async function updateUser(data: AdminForm, id: string) {
  try {
    const hashedPassword = await hash(data.password, 10);
    await prisma.admin.update({
      where: {
        id,
      },
      data: {
        email: data.email,
        password: hashedPassword,
        username: data.username,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin/edit");
    return { status: 200, message: "User added successfully" };
  } catch {
    return {
      status: 500,
      message: "Failed to add user",
    }
  }
}

export async function getEmailAdmin() {
  const email = await prisma.admin.findMany({ select: { email: true } });
  return email;
}
