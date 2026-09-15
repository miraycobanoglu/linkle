import { saveUsersToStorage } from '../services/userService.js';

export function renderProfiles(users, container) {
  if (!container) return;

  // 1. Ekranı temizle ve profilleri bas
  container.innerHTML = users.map(user => {
    const iconSrc = user.isFollowing ? 'images/person-added.svg' : 'images/person_add.svg';

    return `
      <div class="lk-profile-item" data-id="${user.userId}">
        <div class="lk-profile-info">
          <img src="${user.avatar}" class="lk-avatar" alt="${user.name}">
          <div>
            <span class="lk-profile-name">${user.name}</span>
            <p class="lk-follower-count" style="font-size:12px; color:#777; margin:0;">
              ${user.followerCount} takipçi
            </p>
          </div>
        </div>
        <div class="lk-profile-actions">
          <a href="profile-detail.html?userId=${user.userId}" class="lk-btn-incele">İncele</a>
          
          <button type="button" class="lk-btn-follow" aria-label="Takip Butonu">
            <img src="${iconSrc}" alt="icon" class="lk-follow-icon">
          </button>
        </div>
      </div>
    `;
  }).join('');

  // 2. Sadece "Takip Et" butonlarını yakala ve tıklama olayı ekle
  const followButtons = container.querySelectorAll('.lk-btn-follow');

  followButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Sayfa zıplamasını engelle
      
      const itemDiv = btn.closest('.lk-profile-item');
      const userId = itemDiv.dataset.id;
      const user = users.find(u => u.userId === userId);

      if (user) {
        // Durumu değiştir
        user.isFollowing = !user.isFollowing;
        user.followerCount += user.isFollowing ? 1 : -1;

        // Ekranı güncelle
        const img = btn.querySelector('img');
        const countP = itemDiv.querySelector('.lk-follower-count');

        img.src = user.isFollowing ? 'images/person-added.svg' : 'images/person_add.svg';
        countP.textContent = `${user.followerCount} takipçi`;

        // LocalStorage'a kaydet
        saveUsersToStorage(users);
      }
    });
  });
}