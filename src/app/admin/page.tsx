import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Settings, Activity } from "lucide-react";

export default function AdminPage() {
  const stats = [
    {
      title: "Total Admin",
      value: "5",
      description: "Admin aktif",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Jadwal Kegiatan",
      value: "12",
      description: "Kegiatan bulan ini",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Sistem",
      value: "Online",
      description: "Status server",
      icon: Activity,
      color: "bg-emerald-500",
    },
    {
      title: "Pengaturan",
      value: "Normal",
      description: "Konfigurasi sistem",
      icon: Settings,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Admin</h1>
        <p className="text-muted-foreground text-lg">
          Selamat datang di panel administrasi Mushola Riyadhus Shalihi
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 dark:text-white">Admin Terdaftar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Admin Utama</p>
                <p className="text-sm text-muted-foreground">admin@email.com</p>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Admin Kedua</p>
                <p className="text-sm text-muted-foreground">admin2@email.com</p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Standby</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 dark:text-white">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Login Admin</p>
              <p className="text-sm text-muted-foreground">2 menit yang lalu</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Update Jadwal</p>
              <p className="text-sm text-muted-foreground">1 jam yang lalu</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Tambah Admin Baru</p>
              <p className="text-sm text-muted-foreground">3 jam yang lalu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
