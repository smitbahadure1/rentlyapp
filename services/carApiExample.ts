/**
 * Example: How to integrate RapidAPI into your home screen
 * 
 * This file shows you how to replace the hardcoded car data
 * with real data from the RapidAPI Cars Database
 */

import { useState, useEffect } from 'react';
import { searchCars, formatCarForApp, type CarData } from '@/services/carApi';

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
                const bmwCars = await searchCars({ make: 'BMW', limit: 3 });
                const mercedesCars = await searchCars({ make: 'Mercedes-Benz', limit: 2 });
                const audiCars = await searchCars({ make: 'Audi', limit: 2 });
                const teslaCars = await searchCars({ make: 'Tesla', limit: 1 });

                // Combine and format all cars
                const allCars = [
                    ...bmwCars,
                    ...mercedesCars,
                    ...audiCars,
                    ...teslaCars,
                ].map(formatCarForApp);

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
        const results = await searchCars({
            make: query,
            limit: 10
        });

        return results.map(formatCarForApp);
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

// Example 4: Get car by specific make and model
export async function getSpecificCar(make: string, model: string): Promise<CarData | null> {
    try {
        const results = await searchCars({ make, model, limit: 1 });

        if (results.length > 0) {
            return formatCarForApp(results[0]);
        }

        return null;
    } catch (error) {
        console.error('Error fetching specific car:', error);
        return null;
    }
}
