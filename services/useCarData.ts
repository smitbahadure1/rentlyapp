import { useState, useEffect } from 'react';
import { getPopularCars, searchCarsByBrand, type CarData } from './carApi';

/**
 * Hook to fetch and manage car data from the API
 */
export function useCarData() {
    const [cars, setCars] = useState<CarData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCars() {
            try {
                setLoading(true);
                setError(null);

                const popularCars = await getPopularCars(10);
                setCars(popularCars);
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

/**
 * Hook to search cars
 */
export function useCarSearch(query: string) {
    const [results, setResults] = useState<CarData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        async function search() {
            try {
                setLoading(true);
                setError(null);

                const searchResults = await searchCarsByBrand(query);
                setResults(searchResults);
            } catch (err) {
                console.error('Error searching cars:', err);
                setError('Search failed');
            } finally {
                setLoading(false);
            }
        }

        // Debounce search
        const timeoutId = setTimeout(search, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return { results, loading, error };
}
