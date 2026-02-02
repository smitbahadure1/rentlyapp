// Simple in-memory store for car data
// In a production app, you'd use AsyncStorage or a state management library

let carDataStore: { [key: string]: any } = {};

export function storeCarData(carId: string, carData: any) {
    carDataStore[carId] = carData;
}

export function getCarData(carId: string) {
    return carDataStore[carId];
}

export function clearCarDataStore() {
    carDataStore = {};
}
