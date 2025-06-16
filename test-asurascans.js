const { MANGA, PROVIDERS_LIST } = require('./dist');

console.log('Testing AsuraScans integration...\n');

// Test 1: Check if AsuraScans is in PROVIDERS_LIST
console.log('1. Checking if AsuraScans is in PROVIDERS_LIST...');
const asuraInList = PROVIDERS_LIST.MANGA.find(provider => provider.name === 'AsuraScans');
console.log('AsuraScans found in PROVIDERS_LIST:', !!asuraInList);
if (asuraInList) {
  console.log('   - Name:', asuraInList.name);
  console.log('   - Base URL:', asuraInList.baseUrl);
}

// Test 2: Check if AsuraScans can be instantiated
console.log('\n2. Testing AsuraScans instantiation...');
try {
  const asura = new MANGA.AsuraScans();
  console.log('AsuraScans instantiated successfully');
  console.log('   - Name:', asura.name);
  console.log('   - Base URL:', asura.baseUrl);
  console.log('   - Class Path:', asura.classPath);
} catch (error) {
  console.error('Error instantiating AsuraScans:', error.message);
}

// Test 3: Test search functionality (basic test)
console.log('\n3. Testing AsuraScans search functionality...');
async function testSearch() {
  try {
    const asura = new MANGA.AsuraScans();
    console.log('Attempting to search for "Solo Leveling"...');
    const results = await asura.search('Solo Leveling');
    console.log('Search completed successfully');
    console.log('   - Current Page:', results.currentPage);
    console.log('   - Has Next Page:', results.hasNextPage);
    console.log('   - Results Count:', results.results.length);
    if (results.results.length > 0) {
      console.log('   - First Result:', results.results[0].title);
    }
  } catch (error) {
    console.error('Error during search:', error.message);
  }
}

testSearch();
