// Post verilerini LocalStorage veya JSON'dan çekme
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

// Posttan yorum silme
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

// ID'ye göre tek bir post getirme (Esnek String Dönüşümü)
export async function getPostById(postId) {
  const posts = await getAllPosts();
  return posts.find(p => String(p.postId) === String(postId));
}

// Belirli bir kullanıcının paylaştığı tüm postları getirir
export async function getPostsByUserId(userId) {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => String(post.userId) === String(userId));
}

// Posta yeni yorum ekleme ve LocalStorage'ı güncelleme
export async function addCommentToPost(postId, commentText) {
  const posts = await getAllPosts();
  const postIndex = posts.findIndex(p => String(p.postId) === String(postId));

  if (postIndex !== -1) {
    const newComment = {
      user: "mevcut_kullanici",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
      text: commentText
    };

    if (!posts[postIndex].comments) {
      posts[postIndex].comments = [];
    }

    posts[postIndex].comments.push(newComment);
    posts[postIndex].commentCount = (posts[postIndex].commentCount || 0) + 1;

    localStorage.setItem('my_posts', JSON.stringify(posts));
    return { updatedPost: posts[postIndex], newComment };
  }

  return null;
}

// Posta yeni muadil önerisi ekleme
export async function addDupeToPost(postId, dupeData) {
  const posts = await getAllPosts();
  const postIndex = posts.findIndex(p => String(p.postId) === String(postId));

  if (postIndex !== -1) {
    if (!posts[postIndex].dupes) {
      posts[postIndex].dupes = [];
    }

    const newDupeGroup = {
      user: "mevcut_kullanici",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
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