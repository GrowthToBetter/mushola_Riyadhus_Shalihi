import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Settings, Activity } from "lucide-react";
import { getAllUsers, getAdminStats } from "@/utils/userGetServerAction";
import { getKajian } from "@/utils/kajianServerAction"; // Import kajian actions

export default async function AdminPage() {
  // Get real data
  const adminStats = await getAdminStats();
  const adminList = await getAllUsers();
  const kajianList = await getKajian();

  // Get current user from admin list (since getCurrentUser is not available)
  const currentUser = adminList[0] || {
    username: "Admin",
    email: "admin@example.com",
  };

  const stats = [
    {
      title: "Total Admin",
      value: adminStats.total.toString(),
      description: "Admin aktif",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Jadwal Kajian",
      value: kajianList.length.toString(),
      description: "Kajian terjadwal",
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

  // Get recent activities (mock data for now, you can implement real activity logging later)
  const recentActivities = [
    {
      action: `Login Admin - ${currentUser?.username}`,
      time: "Baru saja",
    },
    {
      action: "Dashboard dimuat",
      time: "1 menit yang lalu",
    },
    {
      action: `Total ${kajianList.length} kajian tersedia`,
      time: "2 menit yang lalu",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard Admin
        </h1>
        <p className="text-muted-foreground text-lg">
          Selamat datang di panel administrasi Mushola Riyadhus Shalihi,{" "}
          {currentUser?.username}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="shadow-sm hover:shadow-md transition-shadow py-4"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 ">
        <Card className="shadow-sm py-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 dark:text-white">
              Admin Terdaftar ({adminList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {adminList.length > 0 ? (
              adminList.slice(0, 3).map((admin, index) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {admin.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {admin.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      admin.email === process.env.DEFAULT_ADMIN || index === 0
                        ? "default"
                        : "secondary"
                    }
                    className={
                      admin.email === process.env.DEFAULT_ADMIN || index === 0
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }
                  >
                    {admin.email === process.env.DEFAULT_ADMIN || index === 0
                      ? "Online"
                      : "Aktif"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Tidak ada admin terdaftar
                </p>
              </div>
            )}
            {adminList.length > 3 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  +{adminList.length - 3} admin lainnya
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm py-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 dark:text-white">
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Kajian Overview */}
      <Card className="shadow-sm py-4">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white">
            Ringkasan Kajian ({kajianList.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kajianList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {kajianList.slice(0, 6).map((kajian) => (
                <div
                  key={kajian.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {kajian.topic}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {kajian.ustaz}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {kajian.day}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {kajian.timeStart} - {kajian.timeEnd}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada kajian terjadwal
              </p>
              <p className="text-sm text-muted-foreground">
                Tambahkan kajian pertama di halaman Schedule
              </p>
            </div>
          )}

          {kajianList.length > 6 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                +{kajianList.length - 6} kajian lainnya. Lihat semua di halaman
                Schedule.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
