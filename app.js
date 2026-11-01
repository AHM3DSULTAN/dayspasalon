const products=[
 {
  id:'medik8-c-kit',name:'C-Tetra Luxe Vitamin C Serum',brand:'Medik8',category:'Skincare',price:62.00,tag:'Bestseller',image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',desc:'A silky, nourishing vitamin C serum that helps bring radiance to your daily skincare ritual. A considered formula for a healthy looking, luminous complexion.'},

 {
  id:'environ-serum',name:'Focus Care Youth+ Serum',brand:'Environ',category:'Skincare',price:69.99,tag:'Loved by you',image:'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',desc:'A lightweight daily serum designed to leave skin feeling hydrated, smooth and refreshed. An easy addition to a thoughtful skincare routine.'},

 {
  id:'jane-foundation',name:'PurePressed Base Foundation',brand:'Jane Iredale',category:'Makeup',price:44.00,tag:'Clean beauty',image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85',desc:'A versatile mineral foundation with a soft, natural finish. Find your shade and enjoy buildable coverage for everyday wear.'},

 {
  id:'moroccanoil-treatment',name:'Moroccanoil Treatment',brand:'Moroccanoil',category:'Haircare',price:36.85,tag:'Salon favourite',image:'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85',desc:'A nourishing hair oil to smooth, condition and add a healthy looking shine. Use as part of your at-home haircare ritual.'},

 {
  id:'olaplex-no3',name:'No.3 Hair Perfector',brand:'Olaplex',category:'Haircare',price:28.00,tag:'Bestseller',image:'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&w=900&q=85',desc:'A weekly pre-shampoo hair treatment to help keep your hair feeling soft and looking its best between salon visits.'},

 {
  id:'nail-cnd',name:'CND Vinylux Weekly Polish',brand:'CND',category:'Nails',price:12.95,tag:'Salon pick',image:'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85',desc:'Bring a salon-inspired manicure home with a high-shine polish in a beautiful range of wearable shades.'},

 {
  id:'sttropez-mousse',name:'Self Tan Classic Mousse',brand:'St. Tropez',category:'Body & Tan',price:34.00,tag:'Glow favourite',image:'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85',desc:'A lightweight tanning mousse for a natural looking, sun-kissed glow. Apply evenly and allow to develop according to the product directions.'},

 {
  id:'yodeyma-perfume',name:'Yodeyma Eau de Parfum',brand:'Yodeyma',category:'Fragrance',price:19.99,tag:'Gift idea',image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85',desc:'A beautifully presented fragrance to enjoy every day or give as a thoughtful little gift.'
}
];
const categories=['All products','Skincare','Makeup','Haircare','Nails','Body & Tan','Fragrance'];
const money=n=>new Intl.NumberFormat('en-GB', {
  style:'currency',currency:'GBP'
}
).format(n);
const getCart=()=>JSON.parse(localStorage.getItem('dayspa-cart')||'[]');
const saveCart=a=> {
  localStorage.setItem('dayspa-cart',JSON.stringify(a));
  updateCartCount()};

function updateCartCount() {
  document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=getCart().reduce((s,i)=>s+i.qty,0))
}
function toast(msg) {
  let t=document.querySelector('.toast');
  if(!t) {
    t=document.createElement('div');
    t.className='toast';
    document.body.append(t)
  }
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(window._toast);
  window._toast=setTimeout(()=>t.classList.remove('show'),2100)
}
function addToCart(id,qty=1) {
  let c=getCart(),i=c.find(x=>x.id===id);
  i?i.qty+=qty:c.push( {
    id,qty
  }
  );
  saveCart(c);
  toast('Added to your basket')
}
function productCard(p) {
  return `<article class="product-card"><a href="product.html?id=${p.id}" class="product-img"><img loading="lazy" src="${p.image}" alt="${p.name}"><span class="badge">${p.tag}</span></a><div class="product-info"><div class="product-brand">${p.brand}</div><a class="product-title" href="product.html?id=${p.id}">${p.name}</a><div class="card-bottom"><span class="price">${money(p.price)}</span><button class="add-mini" data-add="${p.id}" aria-label="Add ${p.name} to basket">+</button></div></div></article>`
}
function renderProducts(el,items) {
  if(el)el.innerHTML=items.map(productCard).join('')
}
function setupCommon() {
  updateCartCount();
  document.querySelectorAll('[data-menu]').forEach(b=>b.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open')));
  document.addEventListener('click',e=> {
    const b=e.target.closest('[data-add]');
    if(b)addToCart(b.dataset.add)
  }
  );
  document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear())
}
function setupCatalogue() {
  const grid=document.querySelector('#catalog-products');
  if(!grid)return;
  let cat=new URLSearchParams(location.search).get('category')||'All products';
  const filterButtons=document.querySelector('#filters');
  filterButtons.innerHTML=categories.map(x=>`<div class="filter-group"><button class="${x===cat?'selected':''}" data-category="${x}">${x}</button></div>`).join('');
  function update() {
    let list=cat==='All products'?products:products.filter(p=>p.category===cat);
    const sort=document.querySelector('#sort')?.value;
    if(sort==='low')list.sort((a,b)=>a.price-b.price);
    if(sort==='high')list.sort((a,b)=>b.price-a.price);
    renderProducts(grid,list);
    document.querySelector('#results-count').textContent=`Showing ${list.length} ${list.length===1?'product':'products'}`;
    filterButtons.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.category===cat))
  }
  filterButtons.addEventListener('click',e=> {
    const b=e.target.closest('[data-category]');
    if(b) {
      cat=b.dataset.category;
      history.replaceState( {},
'',cat==='All products'?'catalogue.html':`catalogue.html?category=${encodeURIComponent(cat)}`);
      update()
    }
  }
  );
  document.querySelector('#sort')?.addEventListener('change',update);
  update()
}
function setupProduct() {
  const root=document.querySelector('#product-detail');
  if(!root)return;
  let p=products.find(x=>x.id===new URLSearchParams(location.search).get('id'))||products[0];
  document.title=`${p.name} | The Day Spa Salon`;
  root.innerHTML=`<div class="detail-photo"><img src="${p.image}" alt="${p.name}"></div><div class="detail-copy"><div class="crumb"><a href="index.html">Home</a> / <a href="catalogue.html?category=${encodeURIComponent(p.category)}">${p.category}</a> / ${p.name}</div><div class="product-brand">${p.brand}</div><h1>${p.name}</h1><div class="price">${money(p.price)}</div><p>${p.desc}</p><div class="quantity"><button data-q="-1" aria-label="Decrease quantity">−</button><span id="detail-qty">1</span><button data-q="1" aria-label="Increase quantity">+</button></div><div class="detail-actions"><button class="btn" id="detail-add">ADD TO BASKET</button><a class="btn light" href="basket.html">VIEW BASKET</a></div><div class="detail-meta">Complimentary UK delivery on orders over £50<br>Need a hand choosing? <a class="text-link" href="support.html">Talk to our team</a></div></div>`;
  let q=1;
  root.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=> {
    q=Math.max(1,q+Number(b.dataset.q));
    document.querySelector('#detail-qty').textContent=q
  }
  );
  document.querySelector('#detail-add').onclick=()=>addToCart(p.id,q)
}
function setupBasket() {
  const root=document.querySelector('#basket-content');
  if(!root)return;
  function render() {
    const cart=getCart(),items=cart.map(i=>( {
      ...i,p:products.find(p=>p.id===i.id)
    }
    )).filter(i=>i.p);
    if(!items.length) {
      root.innerHTML=`<div class="empty"><div class="eyebrow">YOUR BAG</div><h2>Your basket is taking a little breather</h2><p class="page-lede" style="margin:0 auto 24px">Discover something lovely for your next self-care moment.</p><a class="btn" href="catalogue.html">EXPLORE THE SHOP</a></div>`;
      return
    }
    let subtotal=items.reduce((s,i)=>s+i.p.price*i.qty,0),promo=localStorage.getItem('dayspa-promo')||'';
    root.innerHTML=`<div class="basket-layout"><div>${items.map(i=>`<div class="basket-item"><a href="product.html?id=${i.p.id}"><img src="${i.p.image}" alt="${i.p.name}"></a><div><div class="product-brand">${i.p.brand}
    </div><h3><a href="product.html?id=${i.p.id}">${i.p.name}
    </a></h3><p>${money(i.p.price)}
    </p><div class="quantity"><button data-change="-1" data-id="${i.id}">−</button><span>${i.qty}
    </span><button data-change="1" data-id="${i.id}">+</button></div></div><div style="text-align:right"><div class="price">${money(i.p.price*i.qty)}
    </div><button class="remove" data-remove="${i.id}">Remove</button></div></div>`).join('')}</div><aside class="summary"><h2>Order summary</h2><div class="sumline"><span>Subtotal</span><span>${money(subtotal)}</span></div><form id="promo-form" class="promo-form"><label for="promo-code">Promo code</label><div class="promo-entry"><input id="promo-code" type="text" value="${promo}" placeholder="Enter code" aria-label="Promo code"><button class="btn small" type="submit">APPLY</button></div><p class="form-note" id="promo-message">${promo?"SELFCARE10 applied — 10% off your products.":"Try SELFCARE10 for 10% off your products."}</p></form>${promo==="SELFCARE10"?`<div class="sumline"><span>Discount (SELFCARE10)</span><span>−${money(subtotal*.1)}
    </span></div>`:""}<div class="sumline"><span>Delivery</span><span>${subtotal>=50?'Complimentary':'£4.95'}</span></div><div class="sumline sumtotal"><span>Total</span><span>${money(subtotal-(promo==="SELFCARE10"?subtotal*.1:0)+(subtotal>=50?0:4.95))}</span></div><p class="form-note">Delivery calculated for UK orders. Complimentary delivery over £50.</p><button class="btn" id="checkout">CONTINUE TO CHECKOUT</button><a href="catalogue.html" class="text-link" style="display:inline-block;margin-top:17px">Continue shopping</a></aside></div>`;
    root.querySelectorAll('[data-change]').forEach(b=>b.onclick=()=> {
      let c=getCart(),i=c.find(x=>x.id===b.dataset.id);
      if(i)i.qty=Math.max(1,i.qty+Number(b.dataset.change));
      saveCart(c);
      render()
    }
    );
    root.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=> {
      saveCart(getCart().filter(i=>i.id!==b.dataset.remove));
      render()
    }
    );
    document.querySelector('#promo-form').onsubmit=e=> {
      e.preventDefault();
      const code=document.querySelector('#promo-code').value.trim().toUpperCase();
      if(code==='SELFCARE10') {
        localStorage.setItem('dayspa-promo',code);
        render()
      }
      else {
        localStorage.removeItem('dayspa-promo');
        document.querySelector('#promo-message').textContent='That code is not recognised. Try SELFCARE10.';
        document.querySelector('#promo-message').style.color='#a0473e'
      }};

    document.querySelector('#checkout').onclick=()=>toast('Checkout is a demo. Contact us to place an order.')};

  render()
}
function setupAccount() {
  const tabs=document.querySelectorAll('[data-account-tab]');
  tabs.forEach(b=>b.onclick=()=> {
    tabs.forEach(x=>x.classList.toggle('active',x===b));
    document.querySelectorAll('[data-account-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.accountPanel!==b.dataset.accountTab))
  }
  );
  document.querySelectorAll('[data-demo-form]').forEach(f=>f.onsubmit=e=> {
    e.preventDefault();
    const n=f.querySelector('.notice');
    if(n) {
      n.textContent=f.dataset.demoForm==='register'?'Your details are ready. Account creation is available in the live store.':'Thanks! This demo has received your sign-in details.';
      n.classList.remove('hidden')
    }
  }
  )
}
function setupForms() {
  document.querySelectorAll('[data-feedback-form]').forEach(f=>f.onsubmit=e=> {
    e.preventDefault();
    let n=f.querySelector('.notice');
    n?.classList.remove('hidden');
    if(n)n.textContent=f.dataset.feedbackForm==='contact'?'Thank you. Your message has been prepared. Our team will be in touch shortly.':'Thank you for subscribing. You are on the list.';
    f.reset()
  }
  )
}
document.addEventListener('DOMContentLoaded',()=> {
  setupCommon();
  renderProducts(document.querySelector('#featured-products'),products.slice(0,4));
  setupCatalogue();
  setupProduct();
  setupBasket();
  setupAccount();
  setupForms()
}
);


