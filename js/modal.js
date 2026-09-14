export function modal(){
  const btnOpenComments = document.getElementById("btnOpenComments");
  const btnCloseComments = document.getElementById("btnCloseComments");
  const commentModal = document.getElementById("commentModal");

  if (btnOpenComments && commentModal) {
    btnOpenComments.addEventListener("click", (e) => {
      e.preventDefault();
      commentModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    if (btnCloseComments) {
      btnCloseComments.addEventListener("click", () => {
        commentModal.classList.remove("active");
        document.body.style.overflow = "auto";
      });
    }
    commentModal.addEventListener("click", (e) => {
      if (e.target === commentModal) {
        commentModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });

  }


  const btnOpenDupes = document.getElementById("btnOpenDupes");
  const btnCloseDup = document.getElementById("btnCloseDup");
  const dupModal = document.getElementById("dupModal");

  if (btnOpenDupes && dupModal) {
    btnOpenDupes.addEventListener("click", (e) => {
      e.preventDefault();
      dupModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    if (btnCloseDup) {
      btnCloseDup.addEventListener("click", () => {
        dupModal.classList.remove("active");
        document.body.style.overflow = "auto";
      });
    }
    dupModal.addEventListener("click", (e) => {
      if (e.target === dupModal) {
        dupModal.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });

  }

  // --- 3. MUADİL EKLEME MODALI (4.2.1) ---

// --- 4.2.1 MUADİL EKLEME MODALI ---
  const btnAddDupList = document.querySelectorAll(".lk-btn-add-dup");
  const btnCloseAddDupe = document.getElementById("btnCloseAddDupe");
  const addDupeModal = document.getElementById("addDupeModal");

  if (btnAddDupList.length > 0 && addDupeModal) {
    btnAddDupList.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Tıklanan satırdaki ürün adını modal başlığına taşıma
        const productRow = btn.closest(".lk-dup-product-row");
        if (productRow) {
          const categoryName = productRow.querySelector(".lk-product-category")?.textContent;
          const modalTitle = addDupeModal.querySelector("h3");
          if (categoryName && modalTitle) {
            modalTitle.textContent = categoryName;
          }
        }

        // 4.2.1 modalını aç
        addDupeModal.classList.add("active");
      });
    });

    if (btnCloseAddDupe) {
      btnCloseAddDupe.addEventListener("click", () => {
        addDupeModal.classList.remove("active");
      });
    }

    addDupeModal.addEventListener("click", (e) => {
      if (e.target === addDupeModal) {
        addDupeModal.classList.remove("active");
      }
    });
  }
}


  


