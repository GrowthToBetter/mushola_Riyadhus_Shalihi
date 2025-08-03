"use server";

import { prisma } from "@/lib/prisma";
import { KajianItem } from "@/components/admin/schedule/kajian-schedule";
import { revalidatePath } from "next/cache";

export async function addKajian(kajian: KajianItem) {
  try {
    const newKajian = await prisma.kajian.create({
      data: {
        topic: kajian.topic,
        ustaz: kajian.ustaz,
        image:
          kajian.image ||
          "https://images.unsplash.com/photo-1578895151671-7d2e2e89dcf7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        day: kajian.day,
        timeEnd: kajian.timeEnd,
        timeStart: kajian.timeStart,
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

export async function updateKajian(kajian: KajianItem) {
  try {
    const editedKajian = await prisma.kajian.update({
      where: { id: kajian.id },
      data: {
        topic: kajian.topic,
        ustaz: kajian.ustaz,
        image: kajian.image,
        day: kajian.day,
        timeStart: kajian.timeStart,
        timeEnd: kajian.timeEnd,
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
