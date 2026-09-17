import { modal, setupCommentModal, setupDupeModals, setupCreatePostModal } from "./modal.js";
import { dropdown } from "./dropdown.js";
import { getAllPosts, getPostById, getMyPosts, getCurrentUserId } from './services/postService.js';
import { renderPosts } from './renderers/postRenderer.js';
import { getUsers, getUserById } from './services/userService.js';
import { renderProfiles } from './renderers/profilesRenderer.js';
import { renderProfileDetail } from './renderers/profileDetailRenderer.js';
import { renderPostDetail } from "./renderers/postDetailRenderer.js"; 
import { renderMyPosts, renderMyProfileHeader, renderNavbarAvatar } from "./renderers/myPostRenderer.js";

document.addEventListener('DOMContentLoaded', async () => {

  try { modal(); } catch (e) {}
  try { dropdown(); } catch (e) {}
  try { setupCreatePostModal(); } catch (e) {}

  // GLOBAL: HANGİ SAYFADA OLURSA OLSUN NAVBAR AVATARINI GÜNCELLE
  try {
    const currentUserId = getCurrentUserId(); // 'user-1'
    const users = await getUsers();
    const currentUser = users ? users.find(u => String(u.userId || u.id) === String(currentUserId)) : null;
    
    if (currentUser) {
      renderNavbarAvatar(currentUser);
    }
  } catch (e) {
    console.error("Navbar avatarı güncellenirken hata oluştu:", e);
  }

  const urlParams = new URLSearchParams(window.location.search);

  // 1. KOMBİN DETAY SAYFASI (detail.html?postId=post-101)
  const postId = urlParams.get('postId');
  if (postId) {
    try {
      const post = await getPostById(postId);
      if (post) {
        renderPostDetail(post);
        setupCommentModal(post);
        setupDupeModals(post);
      }
    } catch (e) {}
  }

  // 2. PROFİL DETAY SAYFASI (profile-detail.html?userId=user-2)
  const userId = urlParams.get('userId');
  if (userId) {
    try {
      const user = await getUserById(userId);
      if (user) await renderProfileDetail(user);
    } catch (e) {}
  }

  // 3. ANA SAYFA (index.html)
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');

  if (postsContainer) {
    try {
      let posts = await getAllPosts();
      let users = await getUsers();
      
      renderPosts(posts, postsContainer);

      // Arama İnput Event Listener
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();

          if (!query) {
            renderPosts(posts, postsContainer);
            return;
          }

          const filteredPosts = posts.filter(post => {
            const postOwner = users.find(u => String(u.userId || u.id) === String(post.userId));
            const nameMatch = postOwner?.name?.toLowerCase().includes(query);
            const usernameMatch = postOwner?.username?.toLowerCase().includes(query);
            const brandMatch = post.products?.some(p => p.brand?.toLowerCase().includes(query));
            const descMatch = post.description?.toLowerCase().includes(query);

            return nameMatch || usernameMatch || brandMatch || descMatch;
          });

          renderPosts(filteredPosts, postsContainer);
        });
      }

      // Filtreleme / Sıralama Mantığı
      const filterOptionBtn = document.getElementById('filterOptionBtn');
      const filterDropdown = document.querySelector('.lk-filter-dropdown');
      const currentFilterText = document.getElementById('currentFilterText');

      if (filterOptionBtn) {
        filterOptionBtn.addEventListener('click', () => {
          let sortedPosts = [...posts];

          if (currentFilterText.textContent === 'En Yeniler') {
            sortedPosts.sort((a, b) => {
              const countA = a.comments ? a.comments.length : 0;
              const countB = b.comments ? b.comments.length : 0;
              return countB - countA;
            });

            currentFilterText.textContent = 'En Çok Yorum Alanlar';
            filterOptionBtn.textContent = 'En Yeniler';
          } else {
            currentFilterText.textContent = 'En Yeniler';
            filterOptionBtn.textContent = 'En Çok Yorum Alanlar';
          }

          renderPosts(sortedPosts, postsContainer);

          if (filterDropdown) filterDropdown.classList.remove('active');
        });
      }

    } catch (e) {
      console.error("Ana sayfa yüklenirken hata oluştu:", e);
    }
  }

  // 4. PROFİLLER SAYFASI (profiles.html)
  const profilesContainer = document.getElementById('profilesContainer');
  if (profilesContainer) {
    try {
      const users = await getUsers();
      renderProfiles(users, profilesContainer);

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          const filteredUsers = users.filter(user => 
            user.name?.toLowerCase().includes(query) || 
            user.username?.toLowerCase().includes(query)
          );
          renderProfiles(filteredUsers, profilesContainer);
        });
      }
    } catch (e) {}
  }

  // 5. SAYFAM SAYFASI (sayfam.html)
  const myPostsGrid = document.querySelector('.lk-my-posts-grid .row');
  if (myPostsGrid) {
    try {
      const currentUserId = getCurrentUserId();
      const users = await getUsers();
      const currentUser = users ? users.find(u => String(u.userId || u.id) === String(currentUserId)) : null;

      if (currentUser) {
        renderMyProfileHeader(currentUser);
      }

      const myPosts = await getMyPosts();
      renderMyPosts(myPosts, myPostsGrid);
    } catch (e) {
      console.error("Sayfam yüklenirken hata oluştu:", e);
    }
  }

});