// Fallback car data when RapidAPI is rate-limited
import { CarData } from './carApi';

const UNSPLASH_CARS = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    'https://images.unsplash.com/photo-1542362567-b07e54a88620?w=800&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
    'https://images.unsplash.com/photo-1502877335905-192066c26e3d?w=800&q=80',
    'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=800&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
];

const BRANDS = [
    'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Tesla',
    'Porsche', 'Jaguar', 'Land Rover', 'Cadillac', 'Infiniti',
    'Volvo', 'Acura', 'Genesis', 'Lincoln', 'Alfa Romeo',
    'Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan',
    'Mazda', 'Volkswagen', 'Ford', 'Chevrolet', 'Jeep',
    'Subaru', 'Mitsubishi', 'Suzuki', 'Renault', 'Peugeot',
];

const MODELS = [
    'Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible',
    'Wagon', 'Crossover', 'Sport', 'Premium', 'Executive'
];

const PRICES = [5, 8, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const RATINGS = [4.2, 4.5, 4.7, 4.8, 4.9];
const SEATS = [2, 4, 5, 7];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

export function generateFallbackCars(count: number = 80): CarData[] {
    const cars: CarData[] = [];

    for (let i = 0; i < count; i++) {
        const brand = BRANDS[i % BRANDS.length];
        const model = MODELS[Math.floor(Math.random() * MODELS.length)];
        const imageIndex = i % UNSPLASH_CARS.length;

        cars.push({
            id: `${i}-${brand}-${model}`,
            brand,
            model: `${brand} ${model}`,
            image: UNSPLASH_CARS[imageIndex],
            price: PRICES[Math.floor(Math.random() * PRICES.length)],
            rating: RATINGS[Math.floor(Math.random() * RATINGS.length)],
            seats: SEATS[Math.floor(Math.random() * SEATS.length)],
            transmission: TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)],
            fuelType: FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)],
        });
    }

    return cars;
}
