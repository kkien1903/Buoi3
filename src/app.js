const API = 'https://api.escuelajs.co/api/v1/products'

const el = id => document.getElementById(id)
const $tbody = document.querySelector('#productsTable tbody')
const $search = el('search')
const $perPage = el('perPage')
const $prev = el('prev')
const $next = el('next')
const $pages = el('pages')
const $tooltip = el('tooltip')

let products = []
let filtered = []
let currentPage = 1
let perPage = parseInt($perPage.value,10)
let sortBy = null
let sortDir = 1

async function fetchProducts(){
  const res = await fetch(API)
  if(!res.ok) throw new Error('Failed to fetch')
  products = await res.json()
  filtered = products.slice()
  render()
}

function render(){
  applySort()
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / perPage))
  currentPage = Math.min(currentPage, pages)
  const start = (currentPage-1)*perPage
  const pageItems = filtered.slice(start, start+perPage)

  $tbody.innerHTML = ''
  for(const p of pageItems){
    const tr = document.createElement('tr')
    const imgSrc = p.images?.[0] || 'https://placehold.co/600x400?text=No+Image'
    tr.innerHTML = `
      <td>${p.id}</td>
      <td><img class="product-img" src="${imgSrc}" alt="${escapeHtml(p.title)}" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=No+Image'"/></td>
      <td>${escapeHtml(p.title)}</td>
      <td>${p.price}</td>
      <td>${p.category?.name||''}</td>
      <td class="desc-col" title="${escapeHtml(p.description||'')}">${escapeHtml(p.description||'')}</td>
    `
    tr.addEventListener('mouseenter', e => showTooltip(e, p.description))
    tr.addEventListener('mousemove', e => moveTooltip(e))
    tr.addEventListener('mouseleave', hideTooltip)
    $tbody.appendChild(tr)
  }

  // pages
  $pages.textContent = `Page ${currentPage} / ${pages} (${total})`
  $prev.disabled = currentPage<=1
  $next.disabled = currentPage>=pages
}

function escapeHtml(str){
  if(!str) return ''
  return str.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))
}

function applySort(){
  if(!sortBy) return
  filtered.sort((a,b)=>{
    const va = (a[sortBy]||'').toString().toLowerCase()
    const vb = (b[sortBy]||'').toString().toLowerCase()
    if(va<vb) return -1*sortDir
    if(va>vb) return 1*sortDir
    return 0
  })
}

function updateFilter(){
  const q = $search.value.trim().toLowerCase()
  filtered = products.filter(p => p.title.toLowerCase().includes(q))
  currentPage = 1
  render()
}

// tooltip functions
function showTooltip(e, text){
  if(!text) return
  $tooltip.style.display='block'
  $tooltip.innerText = text
  moveTooltip(e)
}
function moveTooltip(e){
  const winW = window.innerWidth
  const tooltipW = 320
  let left = e.clientX + 12
  if(left + tooltipW > winW) left = e.clientX - tooltipW - 12
  $tooltip.style.left = left + 'px'
  $tooltip.style.top = (e.clientY + 12) + 'px'
}
function hideTooltip(){
  $tooltip.style.display='none'
}

// events
$search.addEventListener('input', updateFilter)
$perPage.addEventListener('change', ()=>{ perPage = parseInt($perPage.value,10); currentPage=1; render() })
$prev.addEventListener('click', ()=>{ currentPage = Math.max(1,currentPage-1); render() })
$next.addEventListener('click', ()=>{ currentPage++; render() })

document.addEventListener('click', e=>{
  const btn = e.target.closest('.sort-btn')
  if(!btn) return
  const key = btn.dataset.sort
  if(sortBy===key) sortDir = -sortDir
  else { sortBy = key; sortDir = 1 }
  render()
})

fetchProducts().catch(err=>{
  console.error(err)
  $tbody.innerHTML = `<tr><td colspan="6">Error loading products</td></tr>`
})
