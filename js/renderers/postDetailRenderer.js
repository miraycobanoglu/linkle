// Yorum Şablonu Fonksiyonu
export function createCommentHTML(c, index) {
  const isMyComment = c && c.user === "mevcut_kullanici";

  return `
    <div class="lk-comment-item lk-comment-row" data-index="${index}">
      <img src="${(c && c.avatar) || 'images/profiller-img.png'}" alt="${(c && c.user) || 'kullanıcı'}" class="lk-avatar-sm lk-comment-avatar">
      <div class="lk-comment-content lk-comment-details">
        <h6 class="lk-comment-user"><a href="#">${(c && c.user) || ''}</a></h6>
        <p class="lk-comment-text">${(c && c.text) || ''}</p>
        <div class="lk-comment-footer" style="display: flex; align-items: center; gap: 12px; margin-top: 6px;">
          <span class="lk-comment-meta lk-btn-reply" data-user="${(c && c.user) || ''}" style="font-size: 13px; color: #777; cursor: pointer;">Yanıtla</span>
          <button class="lk-btn-like" type="button" style="background: none; border: none; padding: 0; cursor: pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          ${isMyComment ? `<button class="lk-btn-delete-comment" data-index="${index}" type="button" style="background:none; border:none; color:#ef4444; font-size:12px; cursor:pointer; margin-left: auto;">Sil</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Detay Sayfasını Çizen Ana Fonksiyon
export function renderPostDetail(post) {
  if (!post) return;

  // 1. Görsel
  const heroImg = document.querySelector('.lk-detail-img-box img');
  if (heroImg && post.imageUrl) {
    heroImg.src = post.imageUrl;
  }

  // 2. Ürünler Listesi
  const productListEl = document.querySelector('.lk-product-list');
  if (productListEl && post.products) {
    productListEl.innerHTML = post.products.map(p => `
      <li class="urunler">
        <img class="etiket-isaret" src="images/etiket-isaret.svg" alt="Etiket">
        <span class="etiket">${p.category}</span>
        <strong class="marka">${p.brand}</strong>
        ${p.link ? `<a href="${p.link}" class="link-icon" target="_blank"><img src="images/link.svg" alt="Link"></a>` : ''}
      </li>
    `).join('');
  }

  // 3. Yorumlar Listesi
  const commentListEl = document.querySelector('.lk-comment-list');
  if (commentListEl && post.comments) {
    commentListEl.innerHTML = post.comments.map((c, idx) => createCommentHTML(c, idx)).join('');
  }

  // 4. Muadil Önerileri Listesi
  const dupeListEl = document.querySelector('.lk-dupe-list');
  if (dupeListEl && post.dupes) {
    dupeListEl.innerHTML = post.dupes.map(d => `
      <div class="lk-dupe-item">
        <img src="${d.avatar || 'images/profiller-img.png'}" alt="${d.user}" class="lk-avatar-sm">
        <div class="lk-dupe-content">
          <h6 class="lk-dupe-user"><a href="#">${d.user}</a></h6>
          <ul class="lk-dupe-products">
            ${(d.items || []).map(item => `
              <li>
                <img class="etiket-isaret" src="images/etiket-isaret.svg" alt="Etiket">
                <span>${item.category}</span>
                <span class="lk-brand">${item.brand}</span>
                <div class="lk-item-actions">
                  ${item.link ? `
                    <a href="${item.link}" class="link-icon" target="_blank">
                      <img src="images/link.svg" alt="Link">
                    </a>` : ''} ${item.image ? ` <a href="${item.image}" class="gorsel-icon" target="_blank" rel="noopener noreferrer">
                      <img src="images/görsel-icon.svg" alt="Görsel">
                    </a>` : ''}
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }
}