import { saveUsersToStorage, getUsers } from '../services/userService.js';
import { getPostsByUserId } from '../services/postService.js';

export async function renderProfileDetail(user) {
  if (!user) return;

  // 1. Profil Bilgilerini Doldur
  const avatarImg = document.querySelector('.lk-profile-avatar');
  const usernameSpan = document.querySelector('.lk-username');
  const fullnameH1 = document.querySelector('.lk-profile-fullname');
  const followerCountStrong = document.querySelector('.takipci-sayi strong');
  const followBtn = document.querySelector('.lk-btn-follow-pill');

  if (avatarImg) avatarImg.src = user.avatar;
  if (usernameSpan) usernameSpan.textContent = `@${user.username || user.name.toLowerCase().replace(/\s+/g, '')}`;
  if (fullnameH1) fullnameH1.textContent = user.name;
  if (followerCountStrong) followerCountStrong.textContent = user.followerCount;

  // 2. Takip Butonu Durumu
  const updateButtonText = () => {
    if (followBtn) {
      if (user.isFollowing) {
        followBtn.textContent = 'Following';
        followBtn.style.background = '#e2e8f0';
        followBtn.style.color = '#334155';
      } else {
        followBtn.textContent = 'Follow';
        followBtn.style.background = 'linear-gradient(90deg, #F2E0FB 0%, #FFFFFF 100%)';
        followBtn.style.color = '#752699';
      }
    }
  };

  updateButtonText();

  if (followBtn) {
    followBtn.addEventListener('click', async () => {
      user.isFollowing = !user.isFollowing;
      user.followerCount += user.isFollowing ? 1 : -1;

      if (followerCountStrong) followerCountStrong.textContent = user.followerCount;
      updateButtonText();

      const allUsers = await getUsers();
      const updatedUsers = allUsers.map(u => u.userId === user.userId ? user : u);
      saveUsersToStorage(updatedUsers);
    });
  }

  // 3. Kullanıcının Kombinlerini Dinamik Basma
  const profileGrid = document.querySelector('.lk-profile-grid');
  if (profileGrid) {
    const userPosts = await getPostsByUserId(user.userId);

    if (userPosts && userPosts.length > 0) {
      profileGrid.innerHTML = userPosts.map(post => `
        <div class="lk-post-card">
          <img src="${post.imageUrl}" alt="Kombin" class="lk-post-img">
          <a href="detail.html?postId=${post.postId}" class="lk-btn-card-incele">İncele</a>
        </div>
      `).join('');
    } else {
      profileGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777;">Henüz paylaşım yapılmamış.</p>`;
    }
  }
}