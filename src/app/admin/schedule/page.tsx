"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrayerSchedule } from "@/components/admin/schedule/prayer-schedule";
import { KajianSchedule } from "@/components/admin/schedule/kajian-schedule";

export default function SchedulePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Kelola Jadwal
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Kelola jadwal sholat dan kajian masjid
        </p>
      </div>

      <Tabs defaultValue="prayer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="prayer"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Jadwal Sholat
          </TabsTrigger>
          <TabsTrigger
            value="kajian"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Jadwal Kajian
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prayer" className="space-y-0">
          <Card className="shadow-sm py-4">
            <CardContent>
              <PrayerSchedule />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kajian" className="space-y-0">
          <Card className="shadow-sm py-4">
            <CardContent>
              <KajianSchedule />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
