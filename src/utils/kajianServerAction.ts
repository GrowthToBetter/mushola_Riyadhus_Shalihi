"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UploadImageCloudinary } from "./uploadImage";

export async function addKajian(data: FormData) {
  try {
    const photo_profile = data.get("image") as File;
    const ArrayBuffer = await photo_profile.arrayBuffer();
    const upload = await UploadImageCloudinary(Buffer.from(ArrayBuffer));
    const newKajian = await prisma.kajian.create({
      data: {
        topic: data.get("topic") as string,
        ustaz: data.get("ustaz") as string,
        image:
          (upload.data?.url as string) ||
          "https://images.unsplash.com/photo-1578895151671-7d2e2e89dcf7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        day: data.get("day") as
          | "Senin"
          | "Selasa"
          | "Rabu"
          | "Kamis"
          | "Jumat"
          | "Sabtu"
          | "Minggu",
        timeEnd: data.get("timeEnd") as string,
        timeStart: data.get("timeStart") as string,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/schedule");
    return newKajian;
  } catch (error) {
    console.error("Error adding kajian:", error);
    throw new Error("Failed to add kajian");
  }
}

export async function deleteKajian(id: string) {
  try {
    await prisma.kajian.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/admin/schedule");
  } catch (error) {
    console.error("Error deleting kajian:", error);
    throw new Error("Failed to delete kajian");
  }
}

export async function updateKajian(kajian: FormData) {
  try {
    const editedKajian = await prisma.kajian.update({
      where: { id: kajian.get("id") as string },
      data: {
        topic: kajian.get("topic") as string,
        ustaz: kajian.get("ustaz") as string,
        image: kajian.get("image") as string,
        day: kajian.get("day") as
          | "Senin"
          | "Selasa"
          | "Rabu"
          | "Kamis"
          | "Jumat"
          | "Sabtu"
          | "Minggu",
        timeStart: kajian.get("timeStart") as string,
        timeEnd: kajian.get("timeEnd") as string,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/schedule");
    return editedKajian;
  } catch (error) {
    console.error("Error updating kajian:", error);
    throw new Error("Failed to update kajian");
  }
}

export async function getKajian() {
  try {
    const kajianList = await prisma.kajian.findMany({
      orderBy: { day: "asc" },
    });
    return kajianList;
  } catch (error) {
    console.error("Error fetching kajian:", error);
    throw new Error("Failed to fetch kajian");
  }
}

export async function addKajianImage(data: FormData, kajianId: string) {
  try {
    const photo_profile = data.get("photo_profile") as File;
    const ArrayBuffer = await photo_profile.arrayBuffer();
    const upload = await UploadImageCloudinary(Buffer.from(ArrayBuffer));
    const update = await prisma.kajian.update({
      where: { id: kajianId },
      data: {
        image:
          (upload.data?.url as string) ||
          "https://images.unsplash.com/photo-1578895151671-7d2e2e89dcf7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/schedule");
    return update;
  } catch (error) {
    console.error("Error updating kajian image:", error);
    throw new Error("Failed to update kajian image");
  }
}
