import { modal, setupCommentModal , setupDupeModals } from "./modal.js";
import { dropdown } from "./dropdown.js";
import { getAllPosts, getPostById } from './services/postService.js';
import { renderPosts } from './renderers/postRenderer.js';
import { getUsers, getUserById } from './services/userService.js';
import { renderProfiles } from './renderers/profilesRenderer.js';
import { renderProfileDetail } from './renderers/profileDetailRenderer.js';
import { renderPostDetail } from "./renderers/postDetailRenderer.js"; 

document.addEventListener('DOMContentLoaded', async () => {

  try { modal(); } catch (e) { console.error("Modal hatası:", e); }
  try { dropdown(); } catch (e) { console.error("Dropdown hatası:", e); }

  const urlParams = new URLSearchParams(window.location.search);

  const postId = urlParams.get('postId');
  if (postId) {
    try {
      const post = await getPostById(postId);
      if (post) {
        renderPostDetail(post);
        setupCommentModal(post); 
        setupDupeModals(post);
      }
    } catch (e) {
      console.error("Post detay yükleme hatası:", e);
    }
  }

  const userId = urlParams.get('userId');
  if (userId) {
    try {
      const user = await getUserById(userId);
      if (user) {
        await renderProfileDetail(user);
      }
    } catch (e) {
      console.error("Profil detay yükleme hatası:", e);
    }
  }

  // ANA SAYFA (index.html)
  const postsContainer = document.getElementById('postsContainer');
  if (postsContainer) {
    try {
      const currentFilterText = document.getElementById('currentFilterText');
      const filterOptionBtn = document.getElementById('filterOptionBtn');

      let posts = await getAllPosts();
      let activeFilter = 'newest'; 

      const sortByNewest = () => {
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderPosts(posts, postsContainer);
      };

      const sortByPopular = () => {
        posts.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        renderPosts(posts, postsContainer);
      };

      sortByNewest();

      if (filterOptionBtn) {
        filterOptionBtn.addEventListener('click', () => {
          if (activeFilter === 'newest') {
            activeFilter = 'popular';
            sortByPopular();
            if (currentFilterText) currentFilterText.textContent = 'En Çok Yorum Alanlar';
            filterOptionBtn.textContent = 'En Yeniler';
          } else {
            activeFilter = 'newest';
            sortByNewest();
            if (currentFilterText) currentFilterText.textContent = 'En Yeniler';
            filterOptionBtn.textContent = 'En Çok Yorum Alanlar';
          }
          filterOptionBtn.blur();
        });
      }
    } catch (e) {
      console.error("Ana sayfa post yükleme hatası:", e);
    }
  }

  // 5. PROFİLLER SAYFASI (profiles.html)
  const profilesContainer = document.getElementById('profilesContainer');
  if (profilesContainer) {
    try {
      const users = await getUsers();
      renderProfiles(users, profilesContainer);
    } catch (e) {
      console.error("Profiller yükleme hatası:", e);
    }
  }


});