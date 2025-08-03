/* eslint-disable prefer-const */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, BookOpen, Building2 } from "lucide-react";
import { getKajian } from "@/utils/kajianServerAction";

// Import the KajianItem type from the server action
export interface KajianItem {
  id?: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu";
  ustaz: string;
  timeStart: string;
  timeEnd: string;
  topic: string;
  image: string | null;
}

export default function MushollaLanding() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentKajianSlide, setCurrentKajianSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<
    { name: string; time: string; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [kajianSchedule, setKajianSchedule] = useState<KajianItem[]>([]);
  const [kajianLoading, setKajianLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState({
    name: "",
    time: "",
    remaining: "",
  });

  // Fetch kajian data from database
  const fetchKajianData = async () => {
    try {
      setKajianLoading(true);
      const data = await getKajian();

      // Transform the data to match the expected format
      const transformedData = data.map((kajian) => ({
        ...kajian,
        time: `${kajian.timeStart} - ${kajian.timeEnd} WIB`,
        description: `Kajian ${kajian.topic} bersama ${kajian.ustaz}`,
        image:
          kajian.image ||
          "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop&crop=center&q=80",
      }));

      setKajianSchedule(transformedData);
    } catch (error) {
      console.error("Failed to fetch kajian data:", error);
      // Fallback to some default data if fetch fails
      setKajianSchedule([
        {
          day: "Senin",
          ustaz: "Ustaz Belum Ditentukan",
          timeStart: "19:30",
          timeEnd: "21:00",
          topic: "Kajian Rutin",
          image:
            "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop&crop=center&q=80",
        },
      ]);
    } finally {
      setKajianLoading(false);
    }
  };

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
        `https://api.myquran.com/v2/sholat/jadwal/1225/${year}/${month}/${day}`
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
          { name: "Syuruq", time: jadwal.terbit, color: "text-yellow-400" },
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
          { name: "Syuruq", time: "05:42", color: "text-yellow-400" },
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
        { name: "Syuruq", time: "05:42", color: "text-yellow-400" },
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

    // Skip Imsak and Syuruq for next prayer calculation
    const mainPrayers = prayers.filter(
      (p) => p.name !== "Imsak" && p.name !== "Syuruq"
    );

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

  // Fetch Hijri date from API
  const fetchHijriDate = async () => {
    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();

      const response = await fetch(
        `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Hijri date");
      }

      const data = await response.json();

      if (data.code === 200 && data.data && data.data.hijri) {
        const hijri = data.data.hijri;
        const hijriDateString = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;
        setHijriDate(hijriDateString);
      } else {
        // Fallback Hijri date calculation (approximate)
        setHijriDate("23 Muharram 1447 H");
      }
    } catch (error) {
      console.error("Error fetching Hijri date:", error);
      // Fallback Hijri date
      setHijriDate("23 Muharram 1447 H");
    }
  };

  const slides = [
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop",
      title: "Musholla Riyadhus Shalihin",
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

  // Fetch all data on mount
  useEffect(() => {
    if (isClient) {
      fetchPrayerTimes();
      fetchHijriDate();
      fetchKajianData();
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

    const kajianTimer = setInterval(() => {
      setCurrentKajianSlide((prev) => (prev + 1) % kajianSchedule.length);
    }, 4000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(kajianTimer);
    };
  }, [isClient, slides.length, kajianSchedule.length]);

  // Refresh kajian data periodically (every 5 minutes)
  useEffect(() => {
    if (!isClient) return;

    const kajianRefreshTimer = setInterval(() => {
      fetchKajianData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(kajianRefreshTimer);
  }, [isClient]);

  // Disable browser zoom and context menu on mount
  useEffect(() => {
    // Force zoom to 100% and prevent zoom
    const setZoomLevel = () => {
      // Force browser zoom to 100%
      document.body.style.zoom = "1";
      document.body.style.transform = "scale(1)";
      document.body.style.transformOrigin = "top left";

      // Set viewport meta for mobile devices
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement("meta");
        viewport.setAttribute("name", "viewport");
        document.head.appendChild(viewport);
      }
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      );
    };

    setZoomLevel();

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts that could interfere with TV display
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F11 (fullscreen), Ctrl+Plus/Minus (zoom), F5 (refresh), etc.
      if (
        e.key === "F11" ||
        e.key === "F5" ||
        (e.ctrlKey &&
          (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")) ||
        (e.metaKey &&
          (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0"))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable mouse wheel zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent touch gestures that could cause zoom
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Don't render time-sensitive content until client-side
  if (!isClient) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* 16:9 Static Canvas Container */}
        <div
          className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white shadow-2xl"
          style={{
            width: "100vw",
            height: "100vh",
            aspectRatio: "16 / 9",
            maxWidth: "100vw",
            maxHeight: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "hidden",
          }}
        >
          {/* Static Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>

          {/* Overlay Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Static Header - Fixed Height */}
            <header
              className="bg-black/30 backdrop-blur-sm border-b border-gray-700/30 relative z-40 flex-shrink-0"
              style={{ height: "90px", padding: "8px 16px" }}
            >
              <div className="flex justify-between items-center h-full w-full">
                <div className="flex items-center space-x-4">
                  <div
                    className="bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1
                      className="font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap"
                      style={{ fontSize: "36px", lineHeight: "1.2" }}
                    >
                      MUSHOLLA RIYADHUS SHALIHIN
                    </h1>
                    <div
                      className="flex items-center space-x-2 text-gray-300"
                      style={{ fontSize: "18px", marginTop: "4px" }}
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="whitespace-nowrap">
                        Taman Mutiara Cinere, Depok
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <div
                    className="relative bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-mono font-bold shadow-xl text-center"
                    style={{
                      padding: "12px 40px",
                      borderRadius: "16px",
                      fontSize: "28px",
                    }}
                  >
                    {/* Left decoration - minimalist clock */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="relative w-6 h-6">
                        <div className="w-6 h-6 border-2 border-black/80 rounded-full bg-black/10"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-2 bg-black/90 rounded-full origin-bottom animate-clock-hand"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-black/90 rounded-full"></div>
                      </div>
                    </div>
                    --:--:--
                    {/* Right decoration - minimalist indicator */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-black/70 rounded-full animate-pulse-slow"></div>
                        <div
                          className="w-2 h-2 bg-black/70 rounded-full animate-pulse-slow"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-end space-x-4"
                    style={{ marginTop: "4px" }}
                  >
                    <div
                      className="text-gray-300 whitespace-nowrap"
                      style={{ fontSize: "18px" }}
                    >
                      Loading...
                    </div>
                    <div className="w-px h-4 bg-gray-500"></div>
                    <div
                      className="text-emerald-300 whitespace-nowrap font-medium"
                      style={{ fontSize: "18px" }}
                    >
                      Loading...
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Loading Info Cards - Fixed Layout */}
            <div
              className="flex-1 min-h-0"
              style={{ padding: "24px 32px 80px" }}
            >
              <div
                className="grid grid-cols-3 gap-8 h-full"
                style={{ height: "calc(100vh - 180px)" }}
              >
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="bg-black/40 backdrop-blur-md border-gray-500/30 h-full"
                  >
                    <CardContent className="h-full" style={{ padding: "32px" }}>
                      <div className="animate-pulse flex flex-col h-full">
                        <div
                          className="bg-gray-600 rounded mb-6"
                          style={{ height: "24px", width: "50%" }}
                        ></div>
                        <div className="flex-1 flex flex-col justify-center space-y-4">
                          <div
                            className="bg-gray-600 rounded"
                            style={{ height: "48px", width: "75%" }}
                          ></div>
                          <div
                            className="bg-gray-600 rounded"
                            style={{ height: "32px", width: "50%" }}
                          ></div>
                          <div
                            className="bg-gray-600 rounded"
                            style={{ height: "24px", width: "66%" }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Loading indicator at bottom - Fixed Position */}
            <div
              className="absolute text-center"
              style={{
                bottom: "80px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-6"
                style={{ width: "80px", height: "80px" }}
              ></div>
              <p className="text-gray-400" style={{ fontSize: "20px" }}>
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden fixed inset-0">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.src})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-sm border-b border-gray-700/30 px-4 py-2 relative z-40 flex-shrink-0">
          <div className="flex justify-between items-center max-w-none mx-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                  MUSHOLLA RIYADHUS SHALIHIN
                </h1>
                <div className="flex items-center space-x-2 text-lg text-gray-300">
                  <MapPin className="w-5 h-5" />
                  <span className="whitespace-nowrap">
                    Taman Mutiara Cinere, Depok
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-4">
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-10 py-3 rounded-2xl text-3xl font-mono font-bold shadow-xl text-center">
                {/* Left decoration - minimalist clock */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="relative w-6 h-6">
                    <div className="w-6 h-6 border-2 border-black/80 rounded-full bg-black/10"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-2 bg-black/90 rounded-full origin-bottom animate-clock-hand"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-black/90 rounded-full"></div>
                  </div>
                </div>
                {currentTime}
                {/* Right decoration - minimalist indicator */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-black/70 rounded-full animate-pulse-slow"></div>
                    <div
                      className="w-2 h-2 bg-black/70 rounded-full animate-pulse-slow"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-4 mt-1">
                <div className="text-lg text-gray-300 whitespace-nowrap">
                  {currentDate}
                </div>
                <div className="w-px h-4 bg-gray-500"></div>
                <div className="text-lg text-emerald-300 whitespace-nowrap font-medium">
                  {hijriDate || "Loading..."}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Info Cards - Overlay on Slider */}
        <div className="px-4 py-2 flex-1 relative z-30 min-h-0 mb-16">
          <div
            className="grid grid-cols-2 gap-4"
            style={{ height: "calc(100vh - 170px)" }}
          >
            {/* Left Column - Split into 2 rows */}
            <div className="flex flex-col gap-3 h-full">
              {/* Next Prayer Countdown - Top Half */}
              <Card className="bg-black/40 backdrop-blur-md border-emerald-500/30 flex-1">
                <CardContent className="p-4 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-7 h-7 text-emerald-400" />
                        <span className="text-2xl font-semibold text-emerald-400">
                          Sholat Selanjutnya
                        </span>
                      </div>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-lg px-4 py-2">
                        {nextPrayer.name || "LOADING..."}
                      </Badge>
                    </div>
                    <div className="flex-1 flex flex-col justify-center text-center">
                      <div className="text-5xl font-mono text-emerald-400 font-bold mb-2 tracking-wider">
                        {nextPrayer.remaining || "--:--:--"}
                      </div>
                      {nextPrayer.time && (
                        <div className="text-lg text-gray-300 font-medium">
                          Waktu sholat: {nextPrayer.time}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prayer Times - Bottom Half */}
              <Card className="bg-black/40 backdrop-blur-md border-gray-500/30 flex-1">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-7 h-7 text-emerald-400" />
                      <h3 className="text-2xl font-semibold text-emerald-400">
                        Jadwal Sholat
                      </h3>
                    </div>
                    {loading && (
                      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    {prayerTimes.length > 0 ? (
                      prayerTimes.map((prayer, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-0.5 2xl:py-2 px-3 rounded bg-black/20 border border-gray-600/20"
                        >
                          <span className="text-base font-medium text-gray-200">
                            {prayer.name}
                          </span>
                          <span
                            className={`text-base font-mono font-bold ${prayer.color}`}
                          >
                            {prayer.time}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400 text-base">
                        {loading ? "Memuat..." : "Gagal memuat jadwal"}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-500 text-center">
                    Data dari MyQuran • Wilayah Depok
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Kajian Schedule Full Height */}
            <Card className="bg-black/40 backdrop-blur-md border-orange-500/30 h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-7 h-7 text-orange-400" />
                    <h3 className="text-2xl font-semibold text-orange-400">
                      Kajian Rutin
                    </h3>
                  </div>
                  {kajianLoading && (
                    <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>

                {/* Kajian Slider Container */}
                <div className="relative flex-1 flex flex-col">
                  {kajianSchedule.length > 0 ? (
                    kajianSchedule.map((kajian, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 flex flex-col transition-all duration-1000 ease-in-out ${
                          index === currentKajianSlide
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {/* Image Container with 1:1 aspect ratio */}
                        <div
                          className="relative w-full rounded overflow-hidden mb-3"
                          style={{ aspectRatio: "1 / 1" }}
                        >
                          {kajian.image &&
                          (kajian.image.startsWith("http") ||
                            kajian.image.startsWith("https")) ? (
                            // Use regular img for external URLs
                            <img
                              src={kajian.image}
                              alt={`Poster ${kajian.topic}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop&crop=center&q=80";
                              }}
                            />
                          ) : (
                            // Use placeholder for missing images
                            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                              <BookOpen className="w-16 h-16 text-orange-400/60" />
                            </div>
                          )}

                          {/* Day badge on image */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-base">
                              {kajian.day}
                            </Badge>
                          </div>
                        </div>

                        {/* Content Below Image */}
                        <div className="flex-1 flex flex-col justify-between space-y-3">
                          <div className="text-center">
                            <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
                              {kajian.topic}
                            </h4>

                            <p className="text-base text-gray-300 line-clamp-3 leading-relaxed">
                              {`Kajian ${kajian.topic} bersama ${kajian.ustaz}`}
                            </p>
                          </div>

                          <div className="flex justify-between items-center text-base pt-2 border-t border-orange-500/20">
                            <span className="text-orange-300 font-semibold truncate">
                              {kajian.ustaz || "Ustaz akan diumumkan"}
                            </span>
                            <span className="text-gray-400 text-right font-medium">
                              {`${kajian.timeStart} - ${kajian.timeEnd} WIB`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <BookOpen className="w-16 h-16 text-orange-400/60 mb-4" />
                      <p className="text-lg text-gray-400 mb-2">
                        {kajianLoading
                          ? "Memuat jadwal kajian..."
                          : "Belum ada jadwal kajian"}
                      </p>
                      {!kajianLoading && (
                        <p className="text-sm text-gray-500">
                          Silakan tambahkan jadwal kajian di panel admin
                        </p>
                      )}
                    </div>
                  )}

                  {/* Navigation Controls */}
                  {kajianSchedule.length > 0 && (
                    <div className="flex items-center justify-center mt-auto pt-2">
                      {/* Slide Indicators */}
                      <div className="flex space-x-2">
                        {kajianSchedule.map((_, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === currentKajianSlide
                                ? "bg-orange-400 scale-125"
                                : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Running Text - Enhanced with dynamic kajian info */}
      <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-sm py-2 overflow-hidden z-50 h-8">
        <div className="relative h-full">
          <div className="absolute whitespace-nowrap text-white text-sm animate-marquee-smooth flex items-center h-full font-medium">
            🕌 Selamat Datang di Musholla Riyadhus Shalihin | Taman Mutiara
            Cinere |
            {kajianSchedule.length > 0 && (
              <>
                {" "}
                Kajian Rutin: {kajianSchedule
                  .map((k) => k.day)
                  .join(" - ")} |{" "}
              </>
            )}
            Info: Persiapan Hari Raya Idul Adha 1446H | Hubungi: 0812-3456-7890
            📱 | 🕌 Selamat Datang di Musholla Riyadhus Shalihin | Taman Mutiara
            Cinere |
            {kajianSchedule.length > 0 && (
              <>
                {" "}
                Kajian Rutin: {kajianSchedule
                  .map((k) => k.day)
                  .join(" - ")} |{" "}
              </>
            )}
            Info: Persiapan Hari Raya Idul Adha 1446H | Hubungi: 0812-3456-7890
            📱
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes clock-hand {
          0% {
            transform: translateX(-50%) translateY(-50%) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) translateY(-50%) rotate(360deg);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-marquee-smooth {
          animation: marquee-smooth 30s linear infinite;
        }
        .animate-clock-hand {
          animation: clock-hand 8s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
