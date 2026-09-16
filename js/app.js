import { modal, setupCommentModal, setupDupeModals, setupCreatePostModal } from "./modal.js";
import { dropdown } from "./dropdown.js";
import { getAllPosts, getPostById, getMyPosts, getCurrentUserId } from './services/postService.js';
import { renderPosts } from './renderers/postRenderer.js';
import { getUsers, getUserById } from './services/userService.js';
import { renderProfiles } from './renderers/profilesRenderer.js';
import { renderProfileDetail } from './renderers/profileDetailRenderer.js';
import { renderPostDetail } from "./renderers/postDetailRenderer.js"; 
import { renderMyPosts, renderMyProfileHeader } from "./renderers/myPostRenderer.js";

document.addEventListener('DOMContentLoaded', async () => {

  try { modal(); } catch (e) {}
  try { dropdown(); } catch (e) {}
  try { setupCreatePostModal(); } catch (e) {}

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
  if (postsContainer) {
    try {
      let posts = await getAllPosts();
      renderPosts(posts, postsContainer);
    } catch (e) {}
  }

  // 4. PROFİLLER SAYFASI (profiles.html)
  const profilesContainer = document.getElementById('profilesContainer');
  if (profilesContainer) {
    try {
      const users = await getUsers();
      renderProfiles(users, profilesContainer);
    } catch (e) {}
  }

  // 5. SAYFAM SAYFASI (sayfam.html)
  const myPostsGrid = document.querySelector('.lk-my-posts-grid .row');
  if (myPostsGrid) {
    try {
      const currentUserId = getCurrentUserId(); // 'user-1'

      // users.json içinden userId === 'user-1' olan kullanıcıyı bul
      const users = await getUsers();
      const currentUser = users ? users.find(u => String(u.userId || u.id) === String(currentUserId)) : null;

      // Header bilgilerini yazdır (Damla Altun, avatar, takipçi sayısı)
      if (currentUser) {
        renderMyProfileHeader(currentUser);
      }

      // user-1'e ait postları süz ve bas
      const myPosts = await getMyPosts();
      renderMyPosts(myPosts, myPostsGrid);
    } catch (e) {
      console.error("Sayfam yüklenirken hata oluştu:", e);
    }
  }

});