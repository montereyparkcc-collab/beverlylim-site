const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const pressLightbox = document.getElementById("press-lightbox");
const pressLightboxImage = pressLightbox?.querySelector(".press-lightbox-image");
const pressLightboxClose = pressLightbox?.querySelector(".press-lightbox-close");

if (pressLightbox && pressLightboxImage) {
  document.querySelectorAll(".press-feature-photo-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      const fullSrc = button.dataset.fullSrc || image?.getAttribute("src");

      if (!fullSrc || !image) {
        return;
      }

      pressLightboxImage.src = fullSrc;
      pressLightboxImage.alt = image.alt;
      pressLightbox.showModal();
    });
  });

  pressLightboxClose?.addEventListener("click", () => {
    pressLightbox.close();
  });

  pressLightbox.addEventListener("click", (event) => {
    if (event.target === pressLightbox) {
      pressLightbox.close();
    }
  });

  pressLightbox.addEventListener("close", () => {
    pressLightboxImage.removeAttribute("src");
    pressLightboxImage.alt = "";
  });
}
