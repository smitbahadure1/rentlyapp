import { getCarMakes, getCarModels, searchCars, getLuxuryCars } from './carApi';

/**
 * Test the RapidAPI integration
 */
export async function testCarAPI() {
    console.log('🚗 Testing RapidAPI Cars Database...\n');

    try {
        // Test 1: Get car makes
        console.log('1️⃣ Fetching car makes...');
        const makes = await getCarMakes();
        console.log(`✅ Found ${makes.length} car makes`);
        console.log('Sample makes:', makes.slice(0, 5));
        console.log('');

        // Test 2: Get models for BMW
        console.log('2️⃣ Fetching BMW models...');
        const bmwModels = await getCarModels('BMW');
        console.log(`✅ Found ${bmwModels.length} BMW models`);
        console.log('Sample models:', bmwModels.slice(0, 5));
        console.log('');

        // Test 3: Search for luxury cars
        console.log('3️⃣ Searching for luxury cars...');
        const luxuryCars = await searchCars({ make: 'BMW', limit: 3 });
        console.log(`✅ Found ${luxuryCars.length} BMW cars`);
        console.log('Sample car:', luxuryCars[0]);
        console.log('');

        // Test 4: Get popular luxury cars
        console.log('4️⃣ Fetching popular luxury cars...');
        const popularCars = await getLuxuryCars();
        console.log(`✅ Found ${popularCars.length} luxury cars`);
        console.log('');

        console.log('✅ All tests completed successfully!');
        return true;
    } catch (error) {
        console.error('❌ API test failed:', error);
        return false;
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testCarAPI();
}
