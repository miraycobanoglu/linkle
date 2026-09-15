// Gönderileri HTML grid içerisine basar
export function renderPosts(posts, containerElement) {
  if (!containerElement) return;

  if (posts.length === 0) {
    containerElement.innerHTML = `<p class="text-muted">Henüz hiç kombin paylaşılmamış.</p>`;
    return;
  }

  const postsHTML = posts.map(post => `
    <div class="lk-post-card" data-post-id="${post.postId}">
      <img src="${post.imageUrl}" alt="Kombin" class="lk-post-img">
      <a href="detail.html?postId=${post.postId}" class="lk-btn-card-incele">İncele</a>
    </div>
  `).join('');

  containerElement.innerHTML = postsHTML;
}