/**
 * Example: How to integrate RapidAPI into your home screen
 * 
 * This file shows you how to replace the hardcoded car data
 * with real data from the RapidAPI Cars Database
 */

import { useState, useEffect } from 'react';
import { searchCarsByBrand, type CarData } from '@/services/carApi';

// Example 1: Fetch cars on component mount
export function useCarData() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);

        // Fetch luxury cars from different brands
        // Note: searchCarsByBrand returns all matches, so we slice to get the desired limit
        const bmwCars = (await searchCarsByBrand('BMW')).slice(0, 3);
        const mercedesCars = (await searchCarsByBrand('Mercedes-Benz')).slice(0, 2);
        const audiCars = (await searchCarsByBrand('Audi')).slice(0, 2);
        const teslaCars = (await searchCarsByBrand('Tesla')).slice(0, 1);

        // Combine all cars
        const allCars = [
          ...bmwCars,
          ...mercedesCars,
          ...audiCars,
          ...teslaCars,
        ];

        setCars(allCars);
        setError(null);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  return { cars, loading, error };
}

// Example 2: How to modify your home.tsx
/*

import { useCarData } from '@/services/carApiExample';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Replace hardcoded RECOMMENDATIONS with API data
  const { cars, loading, error } = useCarData();
  
  const filteredCars = cars.filter(car =>
    `${car.make} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
          <Text style={styles.loadingText}>Loading cars...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {!loading && !error && (
        <ScrollView>
          {filteredCars.map((car) => (
            <TouchableOpacity
              key={car.id}
              style={styles.feedCard}
              onPress={() => router.push(`/car/${car.id}`)}
            >
              <Image 
                source={{ uri: car.image || 'https://via.placeholder.com/400x200' }} 
                style={styles.feedImage} 
              />
              <Text style={styles.feedTitle}>{car.make} {car.model}</Text>
              <Text style={styles.feedSpecs}>
                {car.specs?.transmission} • {car.specs?.seats} Seats
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

*/

// Example 3: Search cars by query
export async function searchCarsByQuery(query: string): Promise<CarData[]> {
  try {
    const results = await searchCarsByBrand(query);
    return results.slice(0, 10);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Example 4: Get car by specific make and model
export async function getSpecificCar(make: string, model: string): Promise<CarData | null> {
  try {
    const results = await searchCarsByBrand(make);
    const match = results.find(car => car.model.toLowerCase().includes(model.toLowerCase()));

    if (match) {
      return match;
    }

    return null;
  } catch (error) {
    console.error('Error fetching specific car:', error);
    return null;
  }
}
