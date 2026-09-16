// 1. Aktif Oturum ID'sini Döner (Varsayılan: 'user-1')
export function getCurrentUserId() {
  if (!localStorage.getItem('currentUserId')) {
    localStorage.setItem('currentUserId', 'user-1');
  }
  return localStorage.getItem('currentUserId');
}

// 2. Tüm Gönderileri Getir (LocalStorage veya JSON)
export async function getAllPosts() {
  const savedPosts = localStorage.getItem('my_posts');
  if (savedPosts) return JSON.parse(savedPosts);

  try {
    const res = await fetch('./data/posts.json');
    if (!res.ok) throw new Error('Gönderiler yüklenirken hata oluştu.');
    const data = await res.json();
    localStorage.setItem('my_posts', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('postService Hata:', error);
    return [];
  }
}

// 3. ID Eşleşmesine Göre Tek Post Getir
export async function getPostById(postId) {
  const posts = await getAllPosts();
  return posts.find(p => String(p.postId) === String(postId));
}

// 4. İstenen Kullanıcı ID'sine Göre Postları Getirir
export async function getPostsByUserId(userId) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => String(post.userId) === String(userId));
}

// 5. Oturum Açan Kullanıcının ('user-1') Postlarını Süzer
export async function getMyPosts() {
  const currentUserId = getCurrentUserId();
  return await getPostsByUserId(currentUserId);
}

// 6. Yeni Gönderi Ekleme
export async function createNewPost(postData) {
  const posts = await getAllPosts();
  const currentUserId = getCurrentUserId();

  const newPost = {
    postId: 'post-' + Date.now(),
    userId: currentUserId,
    imageUrl: postData.image || 'images/görsel.jpeg',
    createdAt: new Date().toISOString(),
    commentCount: 0,
    products: [
      {
        category: postData.tagCategory,
        brand: postData.brand,
        link: postData.productLink || '#'
      }
    ],
    comments: [],
    dupes: []
  };

  posts.unshift(newPost);
  localStorage.setItem('my_posts', JSON.stringify(posts));
  return newPost;
}

// 7. Yorum Ekleme
export async function addCommentToPost(postId, commentText) {
  const posts = await getAllPosts();
  const postIndex = posts.findIndex(p => String(p.postId) === String(postId));

  if (postIndex !== -1) {
    const newComment = {
      user: "damlaaltunn",
      avatar: "images/profiller-img.png",
      text: commentText
    };

    if (!posts[postIndex].comments) posts[postIndex].comments = [];

    posts[postIndex].comments.push(newComment);
    posts[postIndex].commentCount = (posts[postIndex].commentCount || 0) + 1;

    localStorage.setItem('my_posts', JSON.stringify(posts));
    return { updatedPost: posts[postIndex], newComment };
  }
  return null;
}

// 8. Yorum Silme
export async function deleteCommentFromPost(postId, commentIndex) {
  const posts = await getAllPosts();
  const postIndex = posts.findIndex(p => String(p.postId) === String(postId));

  if (postIndex !== -1 && posts[postIndex].comments) {
    posts[postIndex].comments.splice(commentIndex, 1);
    posts[postIndex].commentCount = Math.max(0, (posts[postIndex].commentCount || 1) - 1);

    localStorage.setItem('my_posts', JSON.stringify(posts));
    return posts[postIndex];
  }
  return null;
}

// 9. Muadil Ekleme
export async function addDupeToPost(postId, dupeData) {
  const posts = await getAllPosts();
  const postIndex = posts.findIndex(p => String(p.postId) === String(postId));

  if (postIndex !== -1) {
    if (!posts[postIndex].dupes) posts[postIndex].dupes = [];

    const newDupeGroup = {
      user: "damlaaltunn",
      avatar: "images/profiller-img.png",
      items: [
        {
          category: dupeData.category,
          brand: dupeData.brand,
          link: dupeData.link || '#',
          image: dupeData.image || null
        }
      ]
    };

    posts[postIndex].dupes.push(newDupeGroup);
    localStorage.setItem('my_posts', JSON.stringify(posts));
    return posts[postIndex];
  }
  return null;
}