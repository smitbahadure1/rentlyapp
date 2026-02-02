// Test more endpoints to understand the API structure
const RAPIDAPI_KEY = '1d418a8697msh17bdf7705421537p100706jsnac9249a0a0e4';
const RAPIDAPI_HOST = 'cars-database-with-image.p.rapidapi.com';

async function testAllEndpoints() {
    console.log('🚗 Testing Cars Database with Image API - Full Test\n');

    // Test 1: Get all brands
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1️⃣ Get all brands');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
        const response = await fetch('https://cars-database-with-image.p.rapidapi.com/api/brands', {
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST,
            },
        });
        const data = await response.json();
        console.log('✅ Total brands:', data.brands.length);
        console.log('Sample brands:', data.brands.slice(0, 5).map(b => b.name));
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2️⃣ Get models for BMW (brand_id)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    try {
        // First, find BMW's ID
        const brandsRes = await fetch('https://cars-database-with-image.p.rapidapi.com/api/brands', {
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST,
            },
        });
        const brandsData = await brandsRes.json();
        const bmw = brandsData.brands.find(b => b.name === 'BMW');
        console.log('BMW ID:', bmw.id);

        // Get models for BMW
        const modelsRes = await fetch(`https://cars-database-with-image.p.rapidapi.com/api/models?brand_id=${bmw.id}`, {
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST,
            },
        });
        const modelsData = await modelsRes.json();
        console.log('✅ Total BMW models:', modelsData.models?.length || 0);
        console.log('Sample models:', modelsData.models?.slice(0, 5).map(m => m.name) || []);
    } catch (error) {
        console.log('❌ Error:', error.message);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ API Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testAllEndpoints();
