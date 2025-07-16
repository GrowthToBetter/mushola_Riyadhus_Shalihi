# Prayer Times API Documentation

## MyQuran API

### Endpoint
```
https://api.myquran.com/v2/sholat/jadwal/{CITY_ID}/{YEAR}/{MONTH}/{DAY}
```

### City ID
- Depok Area: 1634

### Response Structure
```json
{
  "status": true,
  "request": {
    "path": "/sholat/jadwal/1634/2025/07/16"
  },
  "data": {
    "id": 1634,
    "lokasi": "KOTA MALANG",
    "daerah": "JAWA TIMUR",
    "jadwal": {
      "tanggal": "Rabu, 16/07/2025",
      "imsak": "04:14",
      "subuh": "04:24",
      "terbit": "05:41",     // Syuruq (Sunrise)
      "dhuha": "06:10",     // Dhuha time
      "dzuhur": "11:39",
      "ashar": "14:59",
      "maghrib": "17:30",
      "isya": "18:43",
      "date": "2025-07-16"
    }
  }
}
```

### Prayer Times Mapping
- **Imsak**: `jadwal.imsak` - Time to stop eating before Fajr
- **Subuh/Fajr**: `jadwal.subuh` - Dawn prayer
- **Syuruq**: `jadwal.terbit` - Sunrise (time when sun appears)
- **Dhuha**: `jadwal.dhuha` - Mid-morning prayer time
- **Dzuhur**: `jadwal.dzuhur` - Noon prayer
- **Ashar**: `jadwal.ashar` - Afternoon prayer
- **Maghrib**: `jadwal.maghrib` - Sunset prayer
- **Isya**: `jadwal.isya` - Night prayer

### Notes
- Syuruq (sunrise) is displayed for informational purposes
- For "next prayer" calculations, Imsak and Syuruq are excluded as they are not obligatory prayer times
- Fallback times are provided in case API is unavailable
- Times are in local Indonesian time (WIB)

### Implementation
The application fetches prayer times daily and displays them with color coding:
- Imsak: Pink
- Subuh: Cyan  
- Syuruq: Yellow
- Dzuhur: Emerald
- Ashar: Lime
- Maghrib: Orange
- Isya: Indigo

### Error Handling
- API failures fall back to static prayer times
- Loading states are shown during API calls
- Console logging for debugging API issues