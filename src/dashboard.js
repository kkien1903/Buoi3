async function getAll() {
  const url = 'https://api.escuelajs.co/api/v1/products'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
  return res.json()
}

module.exports = { getAll }
