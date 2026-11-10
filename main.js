(function () {
  const fmt = (n) => n.toLocaleString('ru-RU') + ' ₽';

  // ---------- Toast ----------
  function showToast(msg) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // ---------- Mobile nav ----------
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  // ---------- Helpers ----------
  const cardImg = (p) =>
    p.image
      ? `<img src="${p.image}" alt="${p.name}" class="product-img">`
      : `<div class="img-placeholder">Фото товара</div>`;

  const galleryImg = (p, idx = 0) =>
    p.images && p.images[idx]
      ? `<img src="${p.images[idx]}" alt="${p.name}" class="product-img">`
      : `<div class="img-placeholder">Фото товара</div>`;

  // ---------- Index page: catalog grid ----------
  const grid = document.getElementById('productGrid');
  if (grid && typeof PRODUCTS !== 'undefined') {
    grid.innerHTML = PRODUCTS.map((p) => `
      <a class="card" href="product.html?id=${p.id}">
        <div class="card-img">
          ${p.badge ? `<span class="badge ${p.badge === 'SALE' ? 'sale' : ''}">${p.badge}</span>` : ''}
          ${cardImg(p)}
        </div>
        <div class="card-body">
          <span class="card-cat">${p.category}</span>
          <h3 class="card-title">${p.name}</h3>
          <p class="card-short">${p.short}</p>
          <div class="card-foot">
            <div class="price">
              <span class="price-now">${fmt(p.price)}</span>
              ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}
            </div>
            <span class="card-arrow">→</span>
          </div>
        </div>
      </a>
    `).join('');
  }

  // ---------- Product page ----------
  const productRoot = document.getElementById('productPage');
  if (productRoot && typeof PRODUCTS !== 'undefined') {
    const id = new URLSearchParams(location.search).get('id');
    const p = PRODUCTS.find((x) => x.id === id);

    if (!p) {
      productRoot.innerHTML = `
        <div class="container" style="padding:80px 0;text-align:center">
          <h1 style="font-size:32px;font-weight:800;margin-bottom:12px">Товар не найден</h1>
          <p style="color:var(--muted);margin-bottom:24px">Возможно, ссылка устарела или товар снят с продажи.</p>
          <a class="btn btn-primary" href="index.html#catalog">К каталогу</a>
        </div>`;
      return;
    }

    document.title = `${p.name} — aciddetail`;

    // Build gallery thumbs
    const thumbsCount = p.images && p.images.length ? p.images.length : 4;
    const thumbsHtml = Array.from({ length: thumbsCount }).map((_, i) =>
      `<button class="thumb" data-idx="${i}">${galleryImg(p, i)}</button>`
    ).join('');

    productRoot.innerHTML = `
      <div class="container">
        <nav class="breadcrumbs">
          <a href="index.html">Главная</a> /
          <a href="index.html#catalog">Каталог</a> /
          <span>${p.name}</span>
        </nav>

        <div class="product-layout">
          <div class="product-gallery">
            <div class="gallery-main">${galleryImg(p, 0)}</div>
            <div class="gallery-thumbs">${thumbsHtml}</div>
          </div>

          <div class="product-info">
            <span class="product-cat">${p.category}</span>
            <h1>${p.name}</h1>

            <div class="product-price">
              <span class="price-now">${fmt(p.price)}</span>
              ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span>` : ''}
            </div>

            <p class="product-desc">${p.description}</p>

            <ul class="features-list">
              ${p.features.map((f) => `<li>${f}</li>`).join('')}
            </ul>

            <div class="product-actions">
              <a class="btn btn-primary" href="#" data-buy>Купить</a>
              <a class="btn btn-ghost" href="index.html#catalog">В каталог</a>
            </div>

            <div class="product-meta">
              <div class="meta-item"><b>${p.material || 'PETG'}</b><span>материал</span></div>
              <div class="meta-item"><b>${p.printTime || '2–4 дня'}</b><span>печать</span></div>
              <div class="meta-item"><b>${p.warranty || '6 мес'}</b><span>гарантия</span></div>
            </div>
          </div>
        </div>

        <div class="specs-block">
          <h2 class="section-title" style="margin-bottom:20px">Характеристики</h2>
          <table class="specs-table">
            <tbody>
              ${Object.entries(p.specs).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Thumbnails switching
    const mainImg = productRoot.querySelector('.gallery-main');
    const thumbs = productRoot.querySelectorAll('.thumb');
    thumbs.forEach((t) => {
      t.addEventListener('click', () => {
        thumbs.forEach((x) => x.classList.remove('active'));
        t.classList.add('active');
        const idx = Number(t.dataset.idx);
        mainImg.innerHTML = galleryImg(p, idx);
      });
    });
    if (thumbs[0]) thumbs[0].classList.add('active');

    // Buy button
    const buyBtn = productRoot.querySelector('[data-buy]');
    if (buyBtn) {
      buyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Заявка отправлена — менеджер свяжется с вами');
      });
    }
  }
})();