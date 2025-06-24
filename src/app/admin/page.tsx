import ParticipantAdmin from "@/components/admin/editAdmin/Hero";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const data = await prisma.admin.findMany();
  return (
    <ParticipantAdmin adminData={data}></ParticipantAdmin>
  );
}
