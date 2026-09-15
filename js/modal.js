import { addCommentToPost, deleteCommentFromPost, addDupeToPost } from './services/postService.js';
import { createCommentHTML } from './renderers/postDetailRenderer.js';

// 1. Genel Modal Açma/Kapatma Fonksiyonu
export function modal() {
  const btnCloseComments = document.getElementById("btnCloseComments");
  const commentModal = document.getElementById("commentModal");

  if (!commentModal) return;

  const closeModal = () => {
    commentModal.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  if (btnCloseComments) {
    btnCloseComments.addEventListener("click", closeModal);
  }

  commentModal.addEventListener("click", (e) => {
    if (e.target === commentModal) {
      closeModal();
    }
  });
}

// 2. Yorum Modalını Yöneten Fonksiyon
export function setupCommentModal(currentPost) {
  const btnOpenComments = document.getElementById("btnOpenComments");
  const btnCloseComments = document.getElementById("btnCloseComments");
  const commentModal = document.getElementById("commentModal");
  const modalCommentList = document.querySelector(".lk-modal-comment-list");
  const commentInput = commentModal?.querySelector(".lk-input-wrapper input");
  const btnShare = commentModal?.querySelector(".lk-btn-share");
  const mainCommentList = document.querySelector(".lk-comment-list");

  if (!commentModal || !currentPost) return;

  const renderAllComments = () => {
    if (!currentPost.comments) currentPost.comments = [];
    const commentsHTML = currentPost.comments.map((c, index) => createCommentHTML(c, index)).join('');
    
    if (modalCommentList) modalCommentList.innerHTML = commentsHTML;
    if (mainCommentList) mainCommentList.innerHTML = commentsHTML;

    bindDeleteButtons();
    bindReplyButtons();
  };

  const bindReplyButtons = () => {
    const replyBtns = document.querySelectorAll('.lk-btn-reply');
    replyBtns.forEach(btn => {
      btn.onclick = (e) => {
        const targetUser = e.target.dataset.user;
        if (targetUser && commentInput) {
          commentModal.classList.add("active");
          document.body.style.overflow = "hidden";
          commentInput.value = `@${targetUser} `;
          commentInput.focus();
        }
      };
    });
  };

  const bindDeleteButtons = () => {
    const deleteBtns = document.querySelectorAll('.lk-btn-delete-comment');
    deleteBtns.forEach(btn => {
      btn.onclick = async (e) => {
        const index = parseInt(e.target.dataset.index, 10);
        const updatedPost = await deleteCommentFromPost(currentPost.postId, index);
        
        if (updatedPost) {
          currentPost.comments = updatedPost.comments;
          renderAllComments();
        }
      };
    });
  };

  if (btnOpenComments) {
    btnOpenComments.onclick = (e) => {
      e.preventDefault();
      renderAllComments();
      commentModal.classList.add("active");
      document.body.style.overflow = "hidden";
    };
  }

  const closeModal = () => {
    commentModal.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  if (btnCloseComments) btnCloseComments.onclick = closeModal;

  commentModal.onclick = (e) => {
    if (e.target === commentModal) closeModal();
  };

  const handleAddComment = async () => {
    const text = commentInput.value.trim();
    if (!text) return;

    const result = await addCommentToPost(currentPost.postId, text);
    if (result) {
      currentPost.comments = result.updatedPost.comments;
      renderAllComments();
      commentInput.value = "";
      if (modalCommentList) modalCommentList.scrollTop = modalCommentList.scrollHeight;
    }
  };

  if (btnShare) btnShare.onclick = handleAddComment;

  if (commentInput) {
    commentInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddComment();
      }
    };
  }
}

// 3. Muadil Modallarını Yöneten Fonksiyon
export function setupDupeModals(currentPost) {
  const btnOpenDupModal = document.getElementById('btnOpenDupModal');
  const dupModal = document.getElementById('dupModal');
  const btnCloseDup = document.getElementById('btnCloseDup');
  const dupProductList = dupModal?.querySelector('.lk-dup-product-list');

  const addDupeModal = document.getElementById('addDupeModal');
  const btnCloseAddDupe = document.getElementById('btnCloseAddDupe');
  const formAddDupe = document.getElementById('formAddDupe');
  const modalCategoryTitle = addDupeModal?.querySelector('.etiket h3');
  const fileUpload = document.getElementById('fileUpload');
  const uploadSpan = document.querySelector('.lk-upload-field span');

  let selectedCategory = '';

  if (!currentPost) return;

  // 1. Ürünleri Dinamik Doldur
  const renderDupProducts = () => {
    if (dupProductList && currentPost.products) {
      dupProductList.innerHTML = currentPost.products.map(p => `
        <div class="lk-dup-product-row">
          <div class="lk-product-info">
            <img class="etiket-isaret" src="images/etiket-isaret.svg" alt="Etiket">
            <span class="lk-product-category">${p.category}</span>
            <span class="lk-brand">${p.brand}</span>
            ${p.link ? `<a href="${p.link}" class="link-icon" target="_blank"><img src="images/link.svg" alt="Link"></a>` : ''}
          </div>
          <button type="button" class="lk-btn-add-dup" data-category="${p.category}">Muadil Ekle</button>
        </div>
      `).join('');

      bindAddDupButtons();
    }
  };

  // 2. Muadil Ekle Butonuna Tıklandığında Ekleme Modalını Aç
  const bindAddDupButtons = () => {
    const addDupBtns = dupProductList?.querySelectorAll('.lk-btn-add-dup');
    addDupBtns?.forEach(btn => {
      btn.onclick = (e) => {
        selectedCategory = e.target.dataset.category;
        if (modalCategoryTitle) modalCategoryTitle.textContent = selectedCategory;
        if (addDupeModal) addDupeModal.classList.add('active');
      };
    });
  };

  // 3. Muadil Önerileri + Butonuna Tıklama
  if (btnOpenDupModal) {
    btnOpenDupModal.onclick = (e) => {
      e.preventDefault();
      renderDupProducts();
      if (dupModal) dupModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  }

  // 4. Kapatma Butonları
  if (btnCloseDup) {
    btnCloseDup.onclick = () => {
      dupModal?.classList.remove('active');
      document.body.style.overflow = 'auto';
    };
  }

  if (btnCloseAddDupe) {
    btnCloseAddDupe.onclick = () => {
      addDupeModal?.classList.remove('active');
    };
  }

  // Dışarı tıklayınca kapatma
  window.addEventListener('click', (e) => {
    if (e.target === dupModal) {
      dupModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    if (e.target === addDupeModal) {
      addDupeModal.classList.remove('active');
    }
  });

  // 5. Görsel Seçildiğinde Dosya Adını Ekrana Yazma
  if (fileUpload && uploadSpan) {
    fileUpload.onchange = () => {
      if (fileUpload.files.length > 0) {
        uploadSpan.textContent = fileUpload.files[0].name;
      } else {
        uploadSpan.textContent = "Yükle";
      }
    };
  }

  // 6. Form Gönderildiğinde Sıkıştırıp Kaydetme
  if (formAddDupe) {
    formAddDupe.onsubmit = async (e) => {
      e.preventDefault();

      const brandInput = formAddDupe.querySelector('input[placeholder*="Marka"]');
      const linkInput = formAddDupe.querySelector('input[type="url"]');

      let imageBase64 = null;

      if (fileUpload && fileUpload.files && fileUpload.files[0]) {
        const file = fileUpload.files[0];
        // Görsel Sıkıştırma Mantığı (Canvas ile optimize edildi)
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 350;
              const scaleSize = MAX_WIDTH / img.width;
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;

              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      const dupeData = {
        category: selectedCategory,
        brand: brandInput.value.trim(),
        link: linkInput ? linkInput.value.trim() : '#',
        image: imageBase64
      };

      try {
        const updatedPost = await addDupeToPost(currentPost.postId, dupeData);
        if (updatedPost) {
          currentPost.dupes = updatedPost.dupes;
          formAddDupe.reset();
          if (uploadSpan) uploadSpan.textContent = "Yükle";
          
          addDupeModal?.classList.remove('active');
          dupModal?.classList.remove('active');
          document.body.style.overflow = 'auto';

          location.reload();
        }
      } catch (err) {
        console.error("Muadil ekleme hatası:", err);
      }
    };
  }
}