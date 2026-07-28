(() => {
  const ASSETS = {
    outside: "../../assets/work/miss-chinatown-brochure/outside.png",
    inside: "../../assets/work/miss-chinatown-brochure/inside.png",
  };

  const ALTS = {
    cover: "Front cover of the Miss Los Angeles Chinatown brochure.",
    inside:
      "Inside of the Miss Los Angeles Chinatown brochure: the journey, evening program, and the 2026 court.",
    outside:
      "Outside of the Miss Los Angeles Chinatown brochure: about the pageant, tickets, and front cover.",
  };

  const HINTS = {
    cover: "Open the cover to step inside—then drag or flip to turn it over.",
    inside: "Drag sideways to turn it over, use the arrow keys, or tap “Read up close” to zoom.",
    outside: "Drag sideways to turn it over, use the arrow keys, or tap “Read up close” to zoom.",
  };

  const ZOOM_LEVELS = [1, 1.5, 2, 3];

  const deck = document.querySelector(".brochure-deck");
  const coverStage = document.querySelector(".brochure-stage--cover");
  const openStage = document.querySelector(".brochure-stage--open");
  const card = document.getElementById("brochure-card");
  const primaryBtn = document.getElementById("brochure-primary");
  const closeBtn = document.getElementById("brochure-close");
  const openBtn = document.getElementById("brochure-open");
  const zoomBtn = document.getElementById("brochure-zoom");
  const hint = document.getElementById("brochure-hint");
  const dots = Array.from(document.querySelectorAll(".brochure-dot"));
  const lightbox = document.getElementById("brochure-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCover = document.getElementById("lightbox-cover");
  const lightboxZoomLabel = document.getElementById("lightbox-zoom-label");

  if (!deck || !card || !primaryBtn) return;

  let view = "cover";
  let dragging = false;
  let dragRotation = null;
  let zoomIndex = 0;
  let pointer = null;

  const isOpen = () => view !== "cover";
  const baseRotation = () => (view === "outside" ? 180 : 0);

  const setView = (next) => {
    view = next;
    deck.dataset.state = next;

    const open = isOpen();
    coverStage.hidden = open;
    openStage.hidden = !open;

    if (!dragging) {
      card.style.transform = `rotateY(${baseRotation()}deg)`;
    }

    closeBtn.hidden = !open;
    primaryBtn.hidden = false;
    primaryBtn.textContent = open
      ? view === "inside"
        ? "Flip to outside"
        : "Flip to inside"
      : "Open the brochure";

    dots.forEach((dot) => {
      dot.setAttribute("aria-pressed", String(dot.dataset.view === view));
    });

    hint.textContent = HINTS[view];
    syncLightbox();
  };

  const flipOpenSide = () => {
    setView(view === "outside" ? "inside" : "outside");
  };

  const onPointerDown = (e) => {
    if (!isOpen()) return;
    pointer = { id: e.pointerId, startX: e.clientX, base: baseRotation() };
    card.setPointerCapture(e.pointerId);
    dragging = true;
    dragRotation = baseRotation();
    card.classList.add("is-dragging");
  };

  const onPointerMove = (e) => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const width = card.clientWidth || 600;
    const delta = ((e.clientX - pointer.startX) / width) * -180;
    dragRotation = pointer.base + delta;
    card.style.transform = `rotateY(${dragRotation}deg)`;
  };

  const endDrag = (e) => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const rotation = dragRotation ?? baseRotation();
    const normalized = ((rotation % 360) + 360) % 360;
    const next = normalized > 90 && normalized < 270 ? "outside" : "inside";
    dragging = false;
    dragRotation = null;
    pointer = null;
    card.classList.remove("is-dragging");
    setView(next);
  };

  openBtn?.addEventListener("click", () => setView("inside"));
  closeBtn?.addEventListener("click", () => setView("cover"));
  primaryBtn.addEventListener("click", () => {
    if (!isOpen()) setView("inside");
    else flipOpenSide();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => setView(dot.dataset.view));
  });

  card.addEventListener("pointerdown", onPointerDown);
  card.addEventListener("pointermove", onPointerMove);
  card.addEventListener("pointerup", endDrag);
  card.addEventListener("pointercancel", endDrag);
  card.addEventListener("dblclick", () => openLightbox());

  const syncLightbox = () => {
    if (!lightbox.open) return;
    if (view === "cover") {
      lightboxImg.hidden = true;
      lightboxCover.hidden = false;
      lightboxCover.style.width = `${ZOOM_LEVELS[zoomIndex] * 28}%`;
      if (zoomIndex === 0) lightboxCover.style.maxWidth = "22rem";
      else lightboxCover.style.maxWidth = "none";
    } else {
      lightboxCover.hidden = true;
      lightboxImg.hidden = false;
      lightboxImg.src = view === "inside" ? ASSETS.inside : ASSETS.outside;
      lightboxImg.alt = ALTS[view];
      lightboxImg.style.width = `${ZOOM_LEVELS[zoomIndex] * 100}%`;
      lightboxImg.style.maxWidth = zoomIndex === 0 ? "72rem" : "none";
    }
    lightboxZoomLabel.textContent = `${Math.round(ZOOM_LEVELS[zoomIndex] * 100)}%`;
  };

  const openLightbox = () => {
    zoomIndex = 0;
    lightbox.showModal();
    syncLightbox();
  };

  zoomBtn?.addEventListener("click", openLightbox);
  document.getElementById("lightbox-close")?.addEventListener("click", () => lightbox.close());
  document.getElementById("lightbox-zoom-in")?.addEventListener("click", () => {
    zoomIndex = Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1);
    syncLightbox();
  });
  document.getElementById("lightbox-zoom-out")?.addEventListener("click", () => {
    zoomIndex = Math.max(0, zoomIndex - 1);
    syncLightbox();
  });

  document.querySelectorAll("[data-lightbox-view]").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.lightboxView));
  });

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  window.addEventListener("keydown", (e) => {
    if (lightbox?.open) {
      if (e.key === "Escape") lightbox.close();
      if (e.key === "ArrowLeft") {
        if (view === "outside") setView("inside");
        else if (view === "inside") setView("cover");
      }
      if (e.key === "ArrowRight") {
        if (view === "cover") setView("inside");
        else if (view === "inside") setView("outside");
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      if (view === "outside") setView("inside");
      else if (view === "inside") setView("cover");
    }
    if (e.key === "ArrowRight") {
      if (view === "cover") setView("inside");
      else if (view === "inside") setView("outside");
    }
  });

  setView("cover");
})();
