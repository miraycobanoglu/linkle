
document.addEventListener("DOMContentLoaded", () => {
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
});

document.addEventListener("DOMContentLoaded", () => {
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
});
