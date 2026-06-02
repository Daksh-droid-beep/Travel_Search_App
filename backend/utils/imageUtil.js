// Curated high-res Unsplash images for top travel destinations (Fallback engine)
const curatedDatabase = {
  paris: {
    hero: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80', // Notre Dame / Seine
      'https://images.unsplash.com/photo-1509060464153-4466739f78ad?auto=format&fit=crop&w=600&q=80', // Louvre
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=600&q=80', // Arc de Triomphe
      'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=600&q=80'  // Eiffel Tower sunset
    ]
  },
  tokyo: {
    hero: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80', // Tokyo neon / tower
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', // Sensoji Temple
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=600&q=80', // Shibuya Crossing
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=600&q=80'  // Cherry blossoms / Mt Fuji
    ]
  },
  bali: {
    hero: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?auto=format&fit=crop&w=600&q=80', // Temple / beach
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ca6?auto=format&fit=crop&w=600&q=80', // Ubud Forest
      'https://images.unsplash.com/photo-1537953773315-0810ac260a70?auto=format&fit=crop&w=600&q=80', // Tegallalang Rice Terraces
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80'  // Luxury villa sunset
    ]
  },
  london: {
    hero: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=600&q=80', // Big Ben
      'https://images.unsplash.com/photo-1513026705753-bc31df43b444?auto=format&fit=crop&w=600&q=80', // London Eye
      'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=600&q=80', // Tower Bridge
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'  // Red telephone box
    ]
  },
  newyork: {
    hero: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1485871904602-ef5a2c727003?auto=format&fit=crop&w=600&q=80', // Times Square
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80', // Central Park
      'https://images.unsplash.com/photo-1492666673288-3c4b4576ad9a?auto=format&fit=crop&w=600&q=80', // Brooklyn Bridge
      'https://images.unsplash.com/photo-1422405153578-4bd676b19036?auto=format&fit=crop&w=600&q=80'  // Manhattan skyline
    ]
  },
  rome: {
    hero: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1529260830199-4455f9091b2e?auto=format&fit=crop&w=600&q=80', // Colosseum
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80', // Trevi Fountain
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=600&q=80', // Vatican St Peters
      'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=600&q=80'  // Roman street
    ]
  },
  delhi: {
    hero: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80', // Taj Mahal / Agra close-by
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80', // Humayun Tomb
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=600&q=80', // India Gate
      'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=600&q=80'  // Lotus Temple
    ]
  },
  mumbai: {
    hero: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=600&q=80', // Gateway of India
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80', // Marine Drive
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80', // Bandra Worli Sea Link
      'https://images.unsplash.com/photo-1623945347395-654db40e7cb2?auto=format&fit=crop&w=600&q=80'  // Chhatrapati Shivaji Terminus
    ]
  }
};

// Curated default beautiful landscapes for any other queries
const defaultAdventureImages = [
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', // Canyon road trip
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', // Beach shore
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80', // Snowy mountain range
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', // Forest bridge
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', // Lake / canoe
  'https://images.unsplash.com/photo-1500835595337-f740268f4327?auto=format&fit=crop&w=800&q=80'  // Traveler standing on cliff
];

export const getDestinationImages = async (query) => {
  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

  // 1. Try to search via Unsplash API if configured
  if (apiKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=6&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const urls = data.results.map((img) => img.urls.regular);
          return {
            hero: urls[0],
            gallery: urls.slice(1, 5),
          };
        }
      }
    } catch (err) {
      console.error('Error fetching from Unsplash API:', err);
    }
  }

  // 2. Try to dynamically pull relevant travel images from Unsplash's public search page
  try {
    const searchResponse = await fetch(
      `https://unsplash.com/s/photos/${encodeURIComponent(query)}`
    );
    if (searchResponse.ok) {
      const html = await searchResponse.text();
      // Match Unsplash high-res photo image IDs from the HTML page content
      const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-_]+/g;
      const matches = html.match(regex);
      
      if (matches && matches.length > 0) {
        // Remove duplicates
        const uniqueUrls = [...new Set(matches)];
        
        // Append format parameters to crop them as high-quality regular photos
        const hero = `${uniqueUrls[0]}?auto=format&fit=crop&w=1200&q=80`;
        const gallery = uniqueUrls.slice(1, 5).map(
          (url) => `${url}?auto=format&fit=crop&w=600&q=80`
        );
        
        return {
          hero,
          gallery
        };
      }
    }
  } catch (err) {
    console.error('Keyless Unsplash search page parsing failed:', err);
  }

  // 3. Curated database matching as fallback
  for (const key of Object.keys(curatedDatabase)) {
    if (cleanQuery.includes(key)) {
      return curatedDatabase[key];
    }
  }

  // 4. Curated default landscapes
  return {
    hero: `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80`,
    gallery: [
      `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80`,
      `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80`,
      `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80`,
      `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80`
    ]
  };
};
