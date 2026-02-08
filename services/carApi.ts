// RapidAPI Cars Database with Image Service
const RAPIDAPI_KEY = '1d418a8697msh17bdf7705421537p100706jsnac9249a0a0e4';
const RAPIDAPI_HOST = 'cars-database-with-image.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Import production config
import { FEATURES, logError, logInfo, logWarn } from '../config/production';

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
/**
 * Get a car image for a brand (using Unsplash for high-quality car photos)
 */
export function getCarImageForBrand(brandName: string, modelName: string = ''): string {
    const query = `${brandName} ${modelName}`.toLowerCase();
    const brandLower = brandName.toLowerCase();

    // Comprehensive Brand Map
    const BRAND_IMAGES: { [key: string]: string[] } = {
        'porsche': [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', // 911
            'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80', // Taycan
        ],
        'bmw': [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', // 5 Series
            'https://images.unsplash.com/photo-1523983254932-c7e6571c9d60?w=800&q=80', // M4
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80', // X5
        ],
        'mercedes-benz': [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', // E Class
            'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80', // AMG
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80', // G Wagon
        ],
        'mercedes': [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        ],
        'audi': [
            'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800&q=80', // A6
            'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80', // Sport
            'https://images.unsplash.com/photo-1606152421811-996d5ad2b5ce?w=800&q=80', // R8
        ],
        'tesla': [
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', // S
            'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&q=80', // X
            'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', // 3
        ],
        'land rover': [
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80', // Range Rover
            'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80', // Defender
        ],
        'chevrolet': [
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // Corvette
            'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80', // Camaro
        ],
        'ford': [
            'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80', // Mustang
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', // Mustang Side
        ],
        'honda': [
            'https://images.unsplash.com/photo-1632243193741-6244456c3902?w=800&q=80', // Civic
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', // Accord
        ],
        'toyota': [
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80', // Supra
            'https://images.unsplash.com/photo-1629897048514-34fd5dfc8a69?w=800&q=80', // Camry/Generic
            'https://images.unsplash.com/photo-1609520505218-7421da4c3c7c?w=800&q=80', // Generic SUV
        ],
        'jeep': [
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', // Wrangler/Rubicon
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', // Cherokee
        ],
        'genesis': [
            'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
        ],
        'acura': [
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        ],
        'jaguar': [
            'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0ad?w=800&q=80', // F-Type
            'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=800&q=80', // F-Pace
        ],
        'lexus': [
            'https://images.unsplash.com/photo-1606152421811-996d5ad2b5ce?w=800&q=80', // LC (Uses Audi R8 placeholder if needed, looking for better)
            // Using generic luxury:
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80',
        ],
        'volvo': [
            'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', // Generic Euro style
        ],
        'hyundai': [
            'https://images.unsplash.com/photo-1621007947382-f3f502173340?w=800&q=80', // Sonata/Elantra style
        ],
        'nissan': [
            'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=800&q=80', // GTR
        ],
        'ferrari': [
            'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
        ],
        'lamborghini': [
            'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80',
        ],
        'rolls royce': [
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
        ]
    };

    // Generic fallbacks by body type
    const GENERIC_SUV = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80';
    const GENERIC_SEDAN = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80';
    const GENERIC_SPORT = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80';

    // Check for direct brand match
    if (BRAND_IMAGES[brandLower]) {
        const images = BRAND_IMAGES[brandLower];
        // Determistic random based on model length to vary images for same brand but keep consistent for same model
        const index = modelName.length % images.length;
        return images[index];
    }

    // Check for partial brand match in our keys
    const matchedBrandKey = Object.keys(BRAND_IMAGES).find(key => brandLower.includes(key) || key.includes(brandLower));
    if (matchedBrandKey) {
        const images = BRAND_IMAGES[matchedBrandKey];
        const index = modelName.length % images.length;
        return images[index];
    }

    // Heuristics based on query keywords
    if (query.includes('suv') || query.includes('jeep') || query.includes('rover')) return GENERIC_SUV;
    if (query.includes('sport') || query.includes('coupe') || query.includes('convertible') || query.includes('gt')) return GENERIC_SPORT;

    // Last resort: Deterministic random from a high quality luxury pool
    const LUXURY_POOL = [
        GENERIC_SEDAN,
        GENERIC_SUV,
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    ];

    let hash = 0;
    for (let i = 0; i < query.length; i++) {
        hash = ((hash << 5) - hash) + query.charCodeAt(i);
        hash |= 0;
    }
    return LUXURY_POOL[Math.abs(hash) % LUXURY_POOL.length];
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
