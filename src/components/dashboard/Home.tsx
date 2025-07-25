/* eslint-disable prefer-const */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, BookOpen, Building2 } from "lucide-react";

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
    const mainPrayers = prayers.filter((p) => p.name !== "Imsak" && p.name !== "Syuruq");

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

    const kajianSchedule = [
      {
        day: "Senin",
        ustaz: "",
        time: "19:30 - 21:00 WIB",
        topic: "Penyakit Hati dan Obatnya",
        image: "https://res.cloudinary.com/dpv5uxesk/image/upload/v1752649242/WhatsApp_Image_2025-07-15_at_16.04.35_7c49c89a_co3bkw.jpg",
        description: "Memahami makna mendalam dari ayat-ayat Al-Quran dengan pendekatan tafsir modern"
      },
      {
        day: "Rabu",
        ustaz: "Ust. Muhammad Ridwan",
        time: "20:00 - 21:30 WIB",
        topic: "Fiqh Sehari-hari",
        image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400&h=400&fit=crop&crop=center&q=80",
        description: "Pembahasan hukum Islam yang aplikatif dalam kehidupan sehari-hari"
      },
      {
        day: "Jumat",
        ustaz: "Ust. Abdullah Hakim",
        time: "19:00 - 20:30 WIB",
        topic: "Akhlak dan Tasawuf",
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=400&fit=crop&crop=center&q=80",
        description: "Membangun karakter mulia dan mendekatkan diri kepada Allah SWT"
      },
      {
        day: "Sabtu",
        ustaz: "Ust. Yusuf Rahman",
        time: "16:00 - 17:30 WIB",
        topic: "Sirah Nabawiyah",
        image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=600&fit=crop",
        description: "Mempelajari sejarah hidup Rasulullah SAW sebagai teladan umat"
      },
      {
        day: "Minggu",
        ustaz: "Ust. Ibrahim Malik",
        time: "08:00 - 09:30 WIB",
        topic: "Tahfidz Al-Quran",
        image: "https://res.cloudinary.com/dpv5uxesk/image/upload/v1752649242/WhatsApp_Image_2025-07-15_at_16.04.35_7c49c89a_co3bkw.jpg",
        description: "Program menghafal Al-Quran untuk segala usia dengan metode yang mudah"
      },
    ];

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

  // Fetch prayer times on mount
  useEffect(() => {
    if (isClient) {
      fetchPrayerTimes();
      fetchHijriDate();
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

  // Disable browser zoom and context menu on mount
  useEffect(() => {
    // Force zoom to 100% and prevent zoom
    const setZoomLevel = () => {
      // Force browser zoom to 100%
      document.body.style.zoom = '1';
      document.body.style.transform = 'scale(1)';
      document.body.style.transformOrigin = 'top left';
      
      // Set viewport meta for mobile devices
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
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
        e.key === 'F11' ||
        e.key === 'F5' ||
        (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) ||
        (e.metaKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0'))
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

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
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
            width: '100vw',
            height: '100vh',
            aspectRatio: '16 / 9',
            maxWidth: '100vw',
            maxHeight: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            overflow: 'hidden'
          }}
        >
          {/* Static Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>
          
          {/* Overlay Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Static Header - Fixed Height */}
            <header 
              className="bg-black/30 backdrop-blur-sm border-b border-gray-700/30 relative z-40 flex-shrink-0"
              style={{ height: '90px', padding: '8px 16px' }}
            >
              <div className="flex justify-between items-center h-full w-full">
                <div className="flex items-center space-x-4">
                  <div 
                    className="bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 
                      className="font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap"
                      style={{ fontSize: '36px', lineHeight: '1.2' }}
                    >
                      MUSHOLLA RIYADHUS SHALIHIN
                    </h1>
                    <div 
                      className="flex items-center space-x-2 text-gray-300"
                      style={{ fontSize: '18px', marginTop: '4px' }}
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="whitespace-nowrap">Taman Mutiara Cinere, Depok</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <div 
                    className="relative bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-mono font-bold shadow-xl text-center"
                    style={{ 
                      padding: '12px 40px', 
                      borderRadius: '16px', 
                      fontSize: '28px' 
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
                        <div className="w-2 h-2 bg-black/70 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-4" style={{ marginTop: '4px' }}>
                    <div 
                      className="text-gray-300 whitespace-nowrap"
                      style={{ fontSize: '18px' }}
                    >
                      Loading...
                    </div>
                    <div className="w-px h-4 bg-gray-500"></div>
                    <div 
                      className="text-emerald-300 whitespace-nowrap font-medium"
                      style={{ fontSize: '18px' }}
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
              style={{ padding: '24px 32px 80px' }}
            >
              <div 
                className="grid grid-cols-3 gap-8 h-full"
                style={{ height: 'calc(100vh - 180px)' }}
              >
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-black/40 backdrop-blur-md border-gray-500/30 h-full">
                    <CardContent 
                      className="h-full"
                      style={{ padding: '32px' }}
                    >
                      <div className="animate-pulse flex flex-col h-full">
                        <div 
                          className="bg-gray-600 rounded mb-6"
                          style={{ height: '24px', width: '50%' }}
                        ></div>
                        <div className="flex-1 flex flex-col justify-center space-y-4">
                          <div 
                            className="bg-gray-600 rounded"
                            style={{ height: '48px', width: '75%' }}
                          ></div>
                          <div 
                            className="bg-gray-600 rounded"
                            style={{ height: '32px', width: '50%' }}
                          ></div>
                          <div 
                            className="bg-gray-600 rounded"
                            style={{ height: '24px', width: '66%' }}
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
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              <div 
                className="border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-6"
                style={{ width: '80px', height: '80px' }}
              ></div>
              <p 
                className="text-gray-400"
                style={{ fontSize: '20px' }}
              >
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
            }`}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.src})` }}>
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
                  <span className="whitespace-nowrap">Taman Mutiara Cinere, Depok</span>
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
                    <div className="w-2 h-2 bg-black/70 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
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
          <div className="grid grid-cols-2 gap-4" style={{ height: 'calc(100vh - 170px)' }}>
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
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-2">
                      {prayerTimes.length > 0 ? (
                        prayerTimes.map((prayer, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2 px-3 rounded bg-black/20 border border-gray-600/20">
                            <span className="text-base font-medium text-gray-200">{prayer.name}</span>
                            <span className={`text-base font-mono font-bold ${prayer.color}`}>
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
                <div className="flex items-center space-x-3 mb-3">
                  <BookOpen className="w-7 h-7 text-orange-400" />
                  <h3 className="text-2xl font-semibold text-orange-400">
                    Kajian Rutin
                  </h3>
                </div>
                
                {/* Kajian Slider Container */}
                <div className="relative flex-1 flex flex-col">
                  {kajianSchedule.map((kajian, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 flex flex-col transition-all duration-1000 ease-in-out ${
                        index === currentKajianSlide
                          ? "opacity-100"
                          : "opacity-0"
                      }`}>
                      
                      {/* Image Container with 1:1 aspect ratio */}
                      <div className="relative w-full rounded overflow-hidden mb-3" style={{ aspectRatio: '1 / 1' }}>
                        <img
                          src={kajian.image}
                          alt={`Poster ${kajian.topic}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/400x400/f97316/ffffff?text=Kajian+Poster";
                          }}
                        />
                        
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
                            {kajian.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center text-base pt-2 border-t border-orange-500/20">
                          <span className="text-orange-300 font-semibold truncate">
                            {kajian.ustaz}
                          </span>
                          <span className="text-gray-400 text-right font-medium">
                            {kajian.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Navigation Controls */}
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center Content - Slide Title
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center z-10">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}>
              {index === currentSlide && (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                  <h2 className="text-lg font-medium mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {slide.title}
                  </h2>
                  <p className="text-sm text-gray-300 font-light">
                    {slide.subtitle}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div> */}

        {/* Slide Indicators */}
        {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-15">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white shadow-lg scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div> */}
      </div>

      {/* Running Text - Optimized */}
      <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-sm py-2 overflow-hidden z-50 h-8">
        <div className="relative h-full">
          <div className="absolute whitespace-nowrap text-white text-sm animate-marquee-smooth flex items-center h-full font-medium">
            🕌 Selamat Datang di Musholla Riyadhus Shalihin | Taman Mutiara
            Cinere | Kajian Rutin: Senin - Rabu - Jumat | Info: Persiapan Hari
            Raya Idul Adha 1446H | Hubungi: 0812-3456-7890 📱 | 
            🕌 Selamat Datang di Musholla Riyadhus Shalihin | Taman Mutiara
            Cinere | Kajian Rutin: Senin - Rabu - Jumat | Info: Persiapan Hari
            Raya Idul Adha 1446H | Hubungi: 0812-3456-7890 📱
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
          0%, 100% {
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
      `}</style>
    </div>
  );
}
