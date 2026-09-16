// Profil Üst Alanını (Header) users.json Verisiyle Doldurma
export function renderMyProfileHeader(currentUser) {
  if (!currentUser) return;

  //Profil Resmi (users.json -> avatar)
  const avatarImgs = document.querySelectorAll('.lk-avatar, .lk-my-avatar');
  avatarImgs.forEach(img => {
    if (currentUser.avatar) {
      img.src = currentUser.avatar;
      img.alt = currentUser.name || 'Profil Resmi';
    }
  });

  const nameElements = document.querySelectorAll('.lk-my-username, .kullanici-adi, .lk-kullanici-adi, .lk-my-profile-name');
  nameElements.forEach(el => {
    el.textContent = currentUser.name || currentUser.username || 'Damla Altun';
  });

  // Takipçi Sayısı (users.json -> followerCount: 1250)
  const followerEl = document.querySelector('.takipci-sayi') || document.querySelector('.followers-count');
  if (followerEl) {
    followerEl.textContent = currentUser.followerCount !== undefined ? currentUser.followerCount : 0;
  }
}
// Navbardaki Hesap Profil Resmini Güncelleyen Fonksiyon
export function renderNavbarAvatar(currentUser) {
  if (!currentUser || !currentUser.avatar) return;

  // Navbardaki Hesap avatarını yakala
  const navbarAvatars = document.querySelectorAll('.lk-account-dropdown .lk-avatar, .hesap-avatar');
  navbarAvatars.forEach(img => {
    img.src = currentUser.avatar;
    img.alt = currentUser.name || 'Profil';
  });
}


// Gönderileri Ekrana Basma
export function renderMyPosts(posts, container) {
  if (!container) return;

  // Paylaşım sayısını güncelle
  const statCountEl = document.querySelector('.paylasim-sayi');
  if (statCountEl) {
    statCountEl.textContent = posts ? posts.length : 0;
  }

  // Gönderi yoksa kullanıcıya bilgi ver
  if (!posts || posts.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted fs-5">Henüz hiç paylaşım yapılmadı.</p>
      </div>
    `;
    return;
  }

  // Gönderi kartlarını dök ve detail.html?postId=... bağla
  container.innerHTML = posts.map(post => `
    <div class="col">
      <div class="lk-my-post-card">
        <a href="detail.html?postId=${post.postId}">
          <img src="${post.imageUrl}" alt="Gönderi" class="lk-my-post-img">
        </a>
      </div>
    </div>
  `).join('');
}