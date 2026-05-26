export interface Hotel {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  tag: string | null;
  city?: string;
}

const mockDatabase: Record<string, Hotel[]> = {
  default: [
    {
      id: 1,
      name: "Grand Aqua Resort",
      rating: 4.9,
      reviews: 1240,
      price: 450,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
      tag: null,
      city: "Global",
    },
    {
      id: 2,
      name: "Nomad Collective",
      rating: 4.7,
      reviews: 890,
      price: 180,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=600&auto=format&fit=crop",
      tag: "BEST VALUE",
      city: "Global",
    },
    {
      id: 3,
      name: "Arctic Hideout",
      rating: 4.8,
      reviews: 420,
      price: 320,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop",
      tag: null,
      city: "Global",
    },
  ],
  tokyo: [
    {
      id: 101,
      name: "Park Hyatt Tokyo",
      rating: 4.9,
      reviews: 2150,
      price: 650,
      image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=600&auto=format&fit=crop",
      tag: "LUXURY",
      city: "Tokyo",
    },
    {
      id: 102,
      name: "Shibuya Capsule Hotel",
      rating: 4.5,
      reviews: 3200,
      price: 45,
      image: "https://images.unsplash.com/photo-1554797589-7241f4b5bf0a?q=80&w=600&auto=format&fit=crop",
      tag: "BEST VALUE",
      city: "Tokyo",
    },
  ],
  paris: [
    {
      id: 201,
      name: "Le Meurice",
      rating: 4.9,
      reviews: 1540,
      price: 850,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
      tag: "LUXURY",
      city: "Paris",
    },
    {
      id: 202,
      name: "Montmartre Boutique",
      rating: 4.6,
      reviews: 1120,
      price: 210,
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop",
      tag: "BEST VALUE",
      city: "Paris",
    },
  ],
  london: [
    {
      id: 301,
      name: "The Savoy",
      rating: 4.9,
      reviews: 3100,
      price: 720,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop",
      tag: "LUXURY",
      city: "London",
    },
    {
      id: 302,
      name: "Soho Stylish Loft",
      rating: 4.7,
      reviews: 950,
      price: 280,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop",
      tag: "TRENDING",
      city: "London",
    },
  ],
  "new york": [
    {
      id: 401,
      name: "The Plaza",
      rating: 4.8,
      reviews: 4200,
      price: 900,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600&auto=format&fit=crop",
      tag: "LUXURY",
      city: "New York",
    },
    {
      id: 402,
      name: "Brooklyn Arthouse",
      rating: 4.8,
      reviews: 670,
      price: 240,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
      tag: "BEST VALUE",
      city: "New York",
    },
  ]
};

export async function getHotels(locations: { city: string, lat?: number, lng?: number }[]): Promise<Hotel[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const validCities = locations.map(l => l.city.trim().toLowerCase()).filter(c => c.length > 0);
  
  if (validCities.length === 0) {
    return mockDatabase.default;
  }

  // Collect results for all searched cities
  const resultsMatrix: Hotel[][] = [];
  
  for (const city of validCities) {
    if (mockDatabase[city]) {
      resultsMatrix.push(mockDatabase[city]);
    } else {
      // Return default global items if city not found, but tag them to the searched city
      const fallback = mockDatabase.default.map((h, i) => ({
        ...h,
        id: h.id + Math.random(),
        city: city.charAt(0).toUpperCase() + city.slice(1)
      }));
      resultsMatrix.push(fallback);
    }
  }

  // Interleave the results: take 1 from city 1, 1 from city 2, etc.
  const interleaved: Hotel[] = [];
  let index = 0;
  let hasMore = true;

  while (hasMore) {
    hasMore = false;
    for (const cityResults of resultsMatrix) {
      if (index < cityResults.length) {
        interleaved.push(cityResults[index]);
        hasMore = true;
      }
    }
    index++;
  }

  return interleaved;
}
