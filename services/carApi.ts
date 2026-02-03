// RapidAPI Cars Database with Image Service
const RAPIDAPI_KEY = '1d418a8697msh17bdf7705421537p100706jsnac9249a0a0e4';
const RAPIDAPI_HOST = 'cars-database-with-image.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Import production config
import { logError, logInfo, logWarn, FEATURES } from '../config/production';

export interface Brand {
    id: string;
    name: string;
    image: string;
}

export interface Model {
    id: string;
    name: string;
    image?: string;
}

export interface CarData {
    id: string;
    brand: string;
    model: string;
    image: string;
    year?: number;
    price?: number;
    rating?: number;
    seats?: number;
    transmission?: string;
    fuelType?: string;
}

/**
 * Fetch all car brands
 */
export async function getCarBrands(): Promise<Brand[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/brands`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.brands || [];
    } catch (error) {
        console.error('Error fetching car brands:', error);
        return [];
    }
}

/**
 * Fetch models for a specific brand
 */
export async function getCarModels(brandId: string): Promise<Model[]> {
    try {
        const response = await fetch(`${BASE_URL}/api/models?brand_id=${brandId}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.models || [];
    } catch (error) {
        console.error('Error fetching car models:', error);
        return [];
    }
}

/**
 * Get popular car brands for rental (luxury + premium + popular brands)
 */
export async function getAllPopularBrands(): Promise<Brand[]> {
    const popularBrandNames = [
        // Luxury
        'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Tesla',
        'Porsche', 'Jaguar', 'Land Rover', 'Cadillac', 'Infiniti',
        // Premium
        'Volvo', 'Acura', 'Genesis', 'Lincoln', 'Alfa Romeo',
        // Popular/Mainstream
        'Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan',
        'Mazda', 'Volkswagen', 'Ford', 'Chevrolet', 'Jeep',
        'Subaru', 'Mitsubishi', 'Suzuki', 'Renault', 'Peugeot',
        'Skoda', 'Fiat', 'Mini', 'Dodge', 'Chrysler'
    ];

    try {
        const allBrands = await getCarBrands();
        return allBrands.filter(brand =>
            popularBrandNames.some(popular =>
                brand.name.toLowerCase().includes(popular.toLowerCase())
            )
        );
    } catch (error) {
        console.error('Error fetching popular brands:', error);
        return [];
    }
}

/**
 * Get a car image for a brand (using Unsplash for high-quality car photos)
 */
function getCarImageForBrand(brandName: string, modelName: string = ''): string {
    const query = `${brandName} ${modelName}`.toLowerCase();

    // Large pool of curated car images across different types
    const imagePool = [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', // Porsche 911
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', // BMW 5
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', // Mercedes E
        'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800&q=80', // Audi A6
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', // Tesla S
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80', // Land Rover
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80', // Sport Audi
        'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80', // Porsche Taycan
        'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&q=80', // Tesla X
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // Corvette
        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80', // Mustang
        'https://images.unsplash.com/photo-1632243193741-6244456c3902?w=800&q=80', // Civic
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', // Jeep
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80', // Luxury Sedan
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', // Red SUV
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80', // Genesis
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80', // Acura
        'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0ad?w=800&q=80', // Jaguar
        'https://images.unsplash.com/photo-1502877335905-192066c26e3d?w=800&q=80', // White Sport
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', // Mustang Side
    ];

    // Priority specific matches for high accuracy on top brands
    const highAcuityMap: { [key: string]: string } = {
        'porsche 911': imagePool[0],
        'tesla model s': imagePool[4],
        'jeep': imagePool[12],
        'land rover': imagePool[5],
        'mustang': imagePool[10],
        'porsche sed': imagePool[7],
    };

    for (const key in highAcuityMap) {
        if (query.includes(key)) return highAcuityMap[key];
    }

    // Body type hints
    const isSUV = query.includes('suv') || query.includes('crossover');
    const isSport = query.includes('sport') || query.includes('coupe') || query.includes('porsche');

    // Create a unique hash based on both brand AND model name
    let hash = 0;
    const seed = query + brandName + modelName;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % imagePool.length;

    // Optional: Filter index to match body type if possible (simplified heuristic)
    // SUVs tend to be in the middle-end of our pool, sports at the start
    if (isSUV && index < 5) return imagePool[(index + 10) % imagePool.length];
    if (isSport && index > 10) return imagePool[index % 5];

    return imagePool[index];
}

/**
 * Format brand data for the rental app
 */
export function formatBrandForRental(brand: Brand, modelName?: string): CarData {
    // Generate random rental data (in production, this would come from your database)
    // Prices in thousands of INR (₹) per day for luxury car rentals in India
    const prices = [5, 8, 10, 15, 20, 25, 30, 35, 40]; // ₹5k-₹40k per day
    const ratings = [4.2, 4.5, 4.7, 4.8, 4.9];
    const seats = [2, 4, 5, 7];
    const transmissions = ['Automatic', 'Manual'];
    const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

    const finalModelName = modelName || `${brand.name} Series`;

    return {
        id: `${brand.id}-${modelName || 'default'}`,
        brand: brand.name,
        model: finalModelName,
        image: getCarImageForBrand(brand.name, finalModelName),
        price: prices[Math.floor(Math.random() * prices.length)],
        rating: ratings[Math.floor(Math.random() * ratings.length)],
        seats: seats[Math.floor(Math.random() * seats.length)],
        transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
        fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
    };
}

/**
 * Get popular cars for the home screen
 * Creates multiple model variants for each brand to provide more cars
 */
export async function getPopularCars(limit: number = 10): Promise<CarData[]> {
    try {
        // If feature flag is enabled, always use fallback cars (more reliable)
        if (FEATURES.USE_FALLBACK_CARS) {
            logInfo(`🚗 Using fallback cars (${limit} cars)...`);
            const { generateFallbackCars } = require('./fallbackCars');
            const fallbackCars = generateFallbackCars(limit);
            logInfo(`✅ Generated ${fallbackCars.length} fallback cars`);
            return fallbackCars;
        }

        logInfo(`🚗 Fetching ${limit} popular cars from API...`);
        const popularBrands = await getAllPopularBrands();
        logInfo(`📊 Got ${popularBrands.length} popular brands from API`);

        if (popularBrands.length === 0) {
            logWarn('⚠️ No brands returned from API! Using fallback cars...');
            const { generateFallbackCars } = require('./fallbackCars');
            const fallbackCars = generateFallbackCars(limit);
            logInfo(`✅ Generated ${fallbackCars.length} fallback cars`);
            return fallbackCars;
        }

        // Model variants for each brand
        const modelVariants = [
            'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible',
            'Wagon', 'Crossover', 'Sport', 'Premium', 'Executive'
        ];

        const allCars: CarData[] = [];

        // Create multiple variants for each brand
        popularBrands.forEach((brand: Brand) => {
            const numVariants = Math.min(3, Math.ceil(limit / popularBrands.length) + 1);

            for (let i = 0; i < numVariants; i++) {
                const variant = modelVariants[i % modelVariants.length];
                const modelName = `${brand.name} ${variant}`;
                allCars.push(formatBrandForRental(brand, modelName));
            }
        });

        logInfo(`✅ Generated ${allCars.length} total cars`);

        const shuffled = allCars.sort(() => Math.random() - 0.5);
        const result = shuffled.slice(0, limit);
        logInfo(`🎯 Returning ${result.length} cars (requested: ${limit})`);
        return result;
    } catch (error) {
        logError('❌ Error fetching popular cars:', error);
        // Fallback to generated cars on any error
        const { generateFallbackCars } = require('./fallbackCars');
        const fallbackCars = generateFallbackCars(limit);
        logInfo(`🔄 Using ${fallbackCars.length} fallback cars due to error`);
        return fallbackCars;
    }
}

/**
 * Search cars by brand name
 */
export async function searchCarsByBrand(query: string): Promise<CarData[]> {
    try {
        const allBrands = await getCarBrands();
        const matchingBrands = allBrands.filter(brand =>
            brand.name.toLowerCase().includes(query.toLowerCase())
        );

        return matchingBrands.map(brand => formatBrandForRental(brand));
    } catch (error) {
        console.error('Error searching cars:', error);
        return [];
    }
}
