// RapidAPI Cars Database with Image Service
const RAPIDAPI_KEY = '1d418a8697msh17bdf7705421537p100706jsnac9249a0a0e4';
const RAPIDAPI_HOST = 'cars-database-with-image.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

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
function getCarImageForBrand(brandName: string): string {
    // Map of popular brands to their Unsplash search queries
    const carImageMap: { [key: string]: string } = {
        // Luxury
        'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        'Mercedes-Benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
        'Audi': 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800&q=80',
        'Tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        'Lexus': 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80',
        'Porsche': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'Jaguar': 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
        'Land Rover': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
        'Cadillac': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
        'Infiniti': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',

        // Premium
        'Volvo': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
        'Acura': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        'Genesis': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
        'Lincoln': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
        'Alfa Romeo': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',

        // Popular brands
        'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
        'Honda': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
        'Hyundai': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
        'Kia': 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80',
        'Nissan': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        'Mazda': 'https://images.unsplash.com/photo-1617531653520-bd466c2db2e2?w=800&q=80',
        'Volkswagen': 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=800&q=80',
        'Ford': 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80',
        'Chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        'Jeep': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
        'Subaru': 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80',
        'Mitsubishi': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        'Suzuki': 'https://images.unsplash.com/photo-1617531653520-bd466c2db2e2?w=800&q=80',
        'Renault': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
        'Peugeot': 'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800&q=80',
        'Skoda': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80',
        'Fiat': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
        'Mini': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        'Dodge': 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80',
        'Chrysler': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    };

    // Return specific image if available, otherwise use a reliable fallback
    if (carImageMap[brandName]) {
        return carImageMap[brandName];
    }

    // Fallback to a curated set of generic luxury car images
    const fallbackImages = [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
        'https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800&q=80',
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    ];

    // Use brand name to consistently pick a fallback image
    const index = brandName.length % fallbackImages.length;
    return fallbackImages[index];
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

    return {
        id: `${brand.id}-${modelName || 'default'}`,
        brand: brand.name,
        model: modelName || `${brand.name} Series`,
        image: getCarImageForBrand(brand.name), // Use actual car photos instead of logos
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
        const popularBrands = await getAllPopularBrands();

        // Model variants for each brand
        const modelVariants = [
            'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible',
            'Wagon', 'Crossover', 'Sport', 'Premium', 'Executive'
        ];

        const allCars: CarData[] = [];

        // Create multiple variants for each brand
        popularBrands.forEach((brand: Brand) => {
            // Create 2-3 variants per brand
            const numVariants = Math.min(3, Math.ceil(limit / popularBrands.length) + 1);

            for (let i = 0; i < numVariants; i++) {
                const variant = modelVariants[i % modelVariants.length];
                const modelName = `${brand.name} ${variant}`;
                allCars.push(formatBrandForRental(brand, modelName));
            }
        });

        // Shuffle and return the requested number
        const shuffled = allCars.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, limit);
    } catch (error) {
        console.error('Error fetching popular cars:', error);
        return [];
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
