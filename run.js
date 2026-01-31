const { getAll } = require('./src/dashboard')

async function main() {
  if (typeof fetch === 'undefined') {
    console.warn('Global fetch is not available. Run with Node 18+ for built-in fetch.');
  }
  try {
    const products = await getAll()
    console.log(JSON.stringify(products, null, 2))
  } catch (err) {
    console.error('Error fetching products:', err)
    process.exit(1)
  }
}

main()
