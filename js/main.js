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

const tileLightbox = document.getElementById("tile-lightbox");
if (tileLightbox) {
  const panel = tileLightbox.querySelector(".tile-lightbox-panel");
  const caption = tileLightbox.querySelector(".tile-lightbox-caption");
  const closeBtn = tileLightbox.querySelector(".tile-lightbox-close");
  const prevBtn = tileLightbox.querySelector(".tile-lightbox-prev");
  const nextBtn = tileLightbox.querySelector(".tile-lightbox-next");

  const tiles = Array.from(document.querySelectorAll(".tile-swatch-btn")).map((button) => ({
    src: button.dataset.src || "",
    name: button.dataset.name || "",
    cat: button.dataset.cat || "",
  }));
  let current = 0;

  const setCaption = (name, cat) => {
    caption.textContent = name;
    if (cat) {
      const sub = document.createElement("span");
      sub.textContent = cat;
      caption.appendChild(sub);
    }
  };

  const show = (index) => {
    const count = tiles.length;
    if (!count) return;
    current = (index + count) % count;
    const tile = tiles[current];
    if (!tile.src) return;
    panel.style.backgroundImage = `url('${tile.src}')`;
    panel.setAttribute("aria-label", `${tile.name} print, shown enlarged and repeated`);
    setCaption(tile.name, tile.cat);
  };

  const step = (delta) => show(current + delta);

  document.querySelectorAll(".tile-swatch-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
      if (!tiles[index] || !tiles[index].src) return;
      show(index);
      tileLightbox.showModal();
    });
  });

  prevBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    step(-1);
  });
  nextBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    step(1);
  });

  tileLightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  });

  closeBtn?.addEventListener("click", () => tileLightbox.close());

  tileLightbox.addEventListener("click", (event) => {
    if (event.target === tileLightbox) {
      tileLightbox.close();
    }
  });

  tileLightbox.addEventListener("close", () => {
    panel.style.backgroundImage = "";
    panel.setAttribute("aria-label", "");
    caption.textContent = "";
  });

  // Deter casual downloading of the enlarged pattern.
  tileLightbox.addEventListener("contextmenu", (event) => event.preventDefault());
  tileLightbox.addEventListener("dragstart", (event) => event.preventDefault());
}

const pwLightbox = document.getElementById("pw-lightbox");
if (pwLightbox) {
  const image = pwLightbox.querySelector(".pw-lightbox-image");
  const closeBtn = pwLightbox.querySelector(".pw-lightbox-close");
  const prevBtn = pwLightbox.querySelector(".pw-lightbox-prev");
  const nextBtn = pwLightbox.querySelector(".pw-lightbox-next");

  const pieces = Array.from(document.querySelectorAll(".pw-btn")).map((button) => {
    const img = button.querySelector("img");
    return { src: img?.getAttribute("src") || "", alt: img?.alt || "" };
  });
  let current = 0;

  const show = (index) => {
    const count = pieces.length;
    if (!count) return;
    current = (index + count) % count;
    const piece = pieces[current];
    if (!piece.src) return;
    image.src = piece.src;
    image.alt = piece.alt;
  };

  const step = (delta) => show(current + delta);

  document.querySelectorAll(".pw-btn").forEach((button, index) => {
    button.addEventListener("click", () => {
      if (!pieces[index] || !pieces[index].src) return;
      show(index);
      pwLightbox.showModal();
    });
  });

  prevBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    step(-1);
  });
  nextBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    step(1);
  });

  pwLightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  });

  closeBtn?.addEventListener("click", () => pwLightbox.close());

  pwLightbox.addEventListener("click", (event) => {
    if (event.target === pwLightbox) {
      pwLightbox.close();
    }
  });

  pwLightbox.addEventListener("close", () => {
    image.removeAttribute("src");
    image.alt = "";
  });

  // Deter casual downloading of the enlarged artwork.
  pwLightbox.addEventListener("contextmenu", (event) => event.preventDefault());
  pwLightbox.addEventListener("dragstart", (event) => event.preventDefault());
}
