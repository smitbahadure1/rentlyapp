// Fallback car data (Ensuring Strict Image-Name Matching)
import { CarData, KNOWN_CARS_DATA } from './carApi';

const PRICES = [5, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const RATINGS = [4.5, 4.7, 4.8, 4.9, 5.0];
const TRANSMISSIONS = ['Automatic'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

export function generateFallbackCars(count: number = 80): CarData[] {
    const cars: CarData[] = [];

    // Cycle through our known cars to generate the requested count
    for (let i = 0; i < count; i++) {
        const knownCar = KNOWN_CARS_DATA[i % KNOWN_CARS_DATA.length];

        // Add random variation to price/rating/specs but keep Name + Image STRICTLY paired
        cars.push({
            id: `fallback-${i}-${knownCar.brand}-${knownCar.model.replace(/\s+/g, '-')}`,
            brand: knownCar.brand,
            model: knownCar.model, // Strictly use the known model name
            image: knownCar.image, // Strictly use the paired image
            price: PRICES[Math.floor(Math.random() * PRICES.length)],
            rating: RATINGS[Math.floor(Math.random() * RATINGS.length)],
            seats: knownCar.type === 'SUV' ? 5 : (knownCar.type === 'Coupe' ? 2 : 4),
            transmission: 'Automatic',
            fuelType: FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)],
        });
    }

    return cars;
}
