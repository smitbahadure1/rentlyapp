// Fallback car data when RapidAPI is rate-limited
import { CarData, getCarImageForBrand } from './carApi';

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
        const fullModelName = `${brand} ${model}`;

        cars.push({
            id: `${i}-${brand}-${model}`,
            brand,
            model: fullModelName,
            image: getCarImageForBrand(brand, fullModelName),
            price: PRICES[Math.floor(Math.random() * PRICES.length)],
            rating: RATINGS[Math.floor(Math.random() * RATINGS.length)],
            seats: SEATS[Math.floor(Math.random() * SEATS.length)],
            transmission: TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)],
            fuelType: FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)],
        });
    }

    return cars;
}
