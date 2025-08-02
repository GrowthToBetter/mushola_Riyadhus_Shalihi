// filepath: d:\DEV\PROJECT\Website\Web Masjid\mushola_Riyadhus_Shalihi\src\app\admin\edit\page.tsx
import Hero from "@/components/admin/editAdmin/Hero";
import { getAllUsers } from "@/utils/userGetServerAction";

export default async function EditAdminPage() {
  try {
    const adminData = await getAllUsers();
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Admin</h1>
          <p className="text-muted-foreground">
            Kelola data admin yang terdaftar di sistem
          </p>
        </div>
        <Hero adminData={adminData} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Admin</h1>
          <p className="text-muted-foreground">
            Kelola data admin yang terdaftar di sistem
          </p>
        </div>
        <div className="text-center py-10">
          <p className="text-red-500">Gagal memuat data admin</p>
        </div>
      </div>
    );
  }
}