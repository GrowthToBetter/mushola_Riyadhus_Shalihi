/* eslint-disable prefer-const */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, BookOpen, Users, Heart, Phone } from "lucide-react";

export default function MushollaLanding() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<
    { name: string; time: string; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState({
    name: "",
    time: "",
    remaining: "",
  });

  // Fetch prayer times from API
  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);

      // Get current date
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      // Using MyQuran API for Indonesian prayer times (Depok area)
      const response = await fetch(
        `https://api.myquran.com/v2/sholat/jadwal/1634/${year}/${month}/${day}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prayer times");
      }

      const data = await response.json();

      if (data.status && data.data && data.data.jadwal) {
        const jadwal = data.data.jadwal;
        const prayers = [
          { name: "Imsak", time: jadwal.imsak, color: "text-pink-400" },
          { name: "Subuh", time: jadwal.subuh, color: "text-cyan-400" },
          { name: "Dzuhur", time: jadwal.dzuhur, color: "text-emerald-400" },
          { name: "Ashar", time: jadwal.ashar, color: "text-lime-400" },
          { name: "Maghrib", time: jadwal.maghrib, color: "text-orange-400" },
          { name: "Isya", time: jadwal.isya, color: "text-indigo-400" },
        ];
        setPrayerTimes(prayers);

        // Calculate next prayer
        calculateNextPrayer(prayers);
      } else {
        // Fallback to static times if API fails
        const fallbackTimes = [
          { name: "Imsak", time: "04:15", color: "text-pink-400" },
          { name: "Subuh", time: "04:25", color: "text-cyan-400" },
          { name: "Dzuhur", time: "12:03", color: "text-emerald-400" },
          { name: "Ashar", time: "15:28", color: "text-lime-400" },
          { name: "Maghrib", time: "18:18", color: "text-orange-400" },
          { name: "Isya", time: "19:32", color: "text-indigo-400" },
        ];
        setPrayerTimes(fallbackTimes);
        calculateNextPrayer(fallbackTimes);
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      // Use fallback times
      const fallbackTimes = [
        { name: "Imsak", time: "04:15", color: "text-pink-400" },
        { name: "Subuh", time: "04:25", color: "text-cyan-400" },
        { name: "Dzuhur", time: "12:03", color: "text-emerald-400" },
        { name: "Ashar", time: "15:28", color: "text-lime-400" },
        { name: "Maghrib", time: "18:18", color: "text-orange-400" },
        { name: "Isya", time: "19:32", color: "text-indigo-400" },
      ];
      setPrayerTimes(fallbackTimes);
      calculateNextPrayer(fallbackTimes);
    } finally {
      setLoading(false);
    }
  };

  // Calculate next prayer and countdown
  const calculateNextPrayer = (
    prayers: { name: string; time: string; color: string }[]
  ) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Skip Imsak for next prayer calculation
    const mainPrayers = prayers.filter((p) => p.name !== "Imsak");

    for (let prayer of mainPrayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        const diff = prayerTime - currentTime;
        const hoursLeft = Math.floor(diff / 60);
        const minutesLeft = diff % 60;

        setNextPrayer({
          name: prayer.name.toUpperCase(),
          time: prayer.time,
          remaining: `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft
            .toString()
            .padStart(2, "0")}`,
        });
        return;
      }
    }

    // If no prayer left today, show first prayer of tomorrow
    const firstPrayer = mainPrayers[0];
    const [hours, minutes] = firstPrayer.time.split(":").map(Number);
    const prayerTime = hours * 60 + minutes;
    const diff = 24 * 60 - currentTime + prayerTime;
    const hoursLeft = Math.floor(diff / 60);
    const minutesLeft = diff % 60;

    setNextPrayer({
      name: firstPrayer.name.toUpperCase(),
      time: firstPrayer.time,
      remaining: `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft
        .toString()
        .padStart(2, "0")}`,
    });
  };

  const kajianSchedule = [
    {
      day: "Senin",
      ustaz: "Ust. Ahmad Fauzi",
      time: "19:30 - 21:00 WIB",
      topic: "Tafsir Al-Quran",
      image: "/api/placeholder/100/80",
    },
    {
      day: "Rabu",
      ustaz: "Ust. Muhammad Ridwan",
      time: "20:00 - 21:30 WIB",
      topic: "Fiqh Sehari-hari",
      image: "/api/placeholder/100/80",
    },
    {
      day: "Jumat",
      ustaz: "Ust. Abdullah Hakim",
      time: "19:00 - 20:30 WIB",
      topic: "Akhlak dan Tasawuf",
      image: "/api/placeholder/100/80",
    },
  ];

  const slides = [
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop",
      title: "Musholla Riyadhus Shalihi",
      subtitle: "Tempat Ibadah yang Nyaman dan Khusyuk",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=600&fit=crop",
      title: "Kajian Rutin",
      subtitle: "Menambah Ilmu Agama Bersama",
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop",
      title: "Komunitas Islami",
      subtitle: "Membangun Ukhuwah yang Kuat",
    },
  ];

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch prayer times on mount
  useEffect(() => {
    if (isClient) {
      fetchPrayerTimes();
    }
  }, [isClient]);

  // Update current time and recalculate next prayer every minute
  useEffect(() => {
    if (!isClient) return;

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );

      // Recalculate next prayer every minute
      if (prayerTimes.length > 0 && now.getSeconds() === 0) {
        calculateNextPrayer(prayerTimes);
      }
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [isClient, prayerTimes]);

  // Slide rotation
  useEffect(() => {
    if (!isClient) return;

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [isClient, slides.length]);


  // Don't render time-sensitive content until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
        {/* Static Header */}
        <header className="relative bg-gradient-to-r from-gray-900/95 to-slate-900/95 backdrop-blur-sm border-b border-gray-700/50 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
          <div className="relative flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  MUSHOLLA RIYADHUS SHALIHI
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>Taman Mutiara Cinere, Depok</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-xl text-2xl font-mono font-bold shadow-lg">
                --:--:--
              </div>
              <div className="text-sm text-gray-300 mt-1">Loading...</div>
            </div>
          </div>
        </header>

        {/* Loading content */}
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-gray-900/95 to-slate-900/95 backdrop-blur-sm border-b border-gray-700/50 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
        <div className="relative flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                MUSHOLLA RIYADHUS SHALIHI
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Taman Mutiara Cinere, Depok</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-xl text-2xl font-mono font-bold shadow-lg">
              {currentTime}
            </div>
            <div className="text-sm text-gray-300 mt-1">{currentDate}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-400px)]">
        {/* Hero/Slider Section */}
        <div className="flex-1 relative overflow-hidden">
          <div className="relative h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}>
                <div
                  className="w-full h-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${slide.src})` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-between p-8">
                    {/* Next Prayer Countdown */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 max-w-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-emerald-400" />
                          <span className="text-lg font-semibold">
                            Sholat Selanjutnya
                          </span>
                        </div>
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">
                          {nextPrayer.name || "LOADING..."}
                        </Badge>
                      </div>
                      <div className="text-3xl font-mono text-emerald-400 font-bold">
                        {nextPrayer.remaining || "--:--:--"}
                      </div>
                      {nextPrayer.time && (
                        <div className="text-sm text-gray-300 mt-2">
                          Waktu sholat: {nextPrayer.time}
                        </div>
                      )}
                    </div>

                    {/* Slide Content */}
                    <div className="text-center">
                      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {slide.title}
                      </h2>
                      <p className="text-xl text-gray-200 mb-6">
                        {slide.subtitle}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white shadow-lg scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sidebar - Prayer Times */}
        <div className="w-80 bg-gradient-to-b from-gray-900/95 to-slate-900/95 backdrop-blur-sm border-l border-gray-700/50 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Prayer Times */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Jadwal Sholat
                  </h3>
                </div>
                {loading && (
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <div className="space-y-3">
                {prayerTimes.length > 0 ? (
                  prayerTimes.map((prayer, index) => (
                    <Card
                      key={index}
                      className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                {prayer.name}
                              </h4>
                              <p className="text-xs text-gray-400">
                                Taman Mutiara Cinere
                              </p>
                            </div>
                          </div>
                          <div
                            className={`text-2xl font-mono font-bold ${prayer.color}`}>
                            {prayer.time}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {loading
                      ? "Memuat jadwal sholat..."
                      : "Gagal memuat jadwal"}
                  </div>
                )}
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                Data dari MyQuran API • Wilayah Depok
              </div>
            </div>

            {/* Community Stats */}
            <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-emerald-400">Komunitas</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">150+</div>
                    <div className="text-xs text-gray-300">Jemaah Aktif</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-xs text-gray-300">Kajian/Bulan</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-blue-400">Kontak</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-300">
                    <span className="text-gray-400">Takmir:</span> Ust. Bayu
                    Santoso
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-400">WA:</span> 0812-3456-7890
                  </div>
                  <div className="text-gray-300">
                    <span className="text-gray-400">Email:</span>{" "}
                    info@riyadhusshalihi.id
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Kajian Schedule Footer */}
      <footer className="bg-gradient-to-r from-gray-900/95 to-slate-900/95 backdrop-blur-sm border-t border-gray-700/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-emerald-400">
              Jadwal Kajian Rutin
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kajianSchedule.map((kajian, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-emerald-500/20 text-emerald-300">
                          {kajian.day}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{kajian.time}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm text-white mb-1">
                        {kajian.ustaz}
                      </h4>
                      <p className="text-sm text-emerald-400">{kajian.topic}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </footer>

      {/* Running Text */}
      <div className="bg-black py-2 overflow-hidden">
        <div className="relative h-6">
          <div className="absolute whitespace-nowrap text-white text-sm animate-marquee">
            🕌 Selamat Datang di Musholla Riyadhus Shalihi | Taman Mutiara
            Cinere | Kajian Rutin: Senin - Rabu - Jumat | Info: Persiapan Hari
            Raya Idul Adha 1446H | Hubungi: 0812-3456-7890 📱
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
