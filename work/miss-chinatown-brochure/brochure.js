(() => {
  const ZOOM_LEVELS = [1, 1.5, 2, 3]

  const HINTS = {
    cover: "Open the cover to step inside—then drag or flip to turn it over.",
    inside: "Drag sideways to turn it over, use the arrow keys, or tap “Read up close” to zoom.",
    outside: "Drag sideways to turn it over, use the arrow keys, or tap “Read up close” to zoom.",
  }

  function initBrochure(root) {
    const outsideSrc = root.dataset.outside
    const insideSrc = root.dataset.inside
    if (!outsideSrc || !insideSrc) return

    const ALTS = {
      cover: root.dataset.altCover || "Front cover of the brochure.",
      inside: root.dataset.altInside || "Inside spread of the brochure.",
      outside: root.dataset.altOutside || "Outside spread of the brochure.",
    }

    const deck = root.querySelector(".brochure-deck")
    const coverStage = root.querySelector(".brochure-stage--cover")
    const openStage = root.querySelector(".brochure-stage--open")
    const card = root.querySelector(".brochure-card")
    const primaryBtn = root.querySelector("[data-brochure-primary]")
    const closeBtn = root.querySelector("[data-brochure-close]")
    const openBtn = root.querySelector("[data-brochure-open]")
    const zoomBtn = root.querySelector("[data-brochure-zoom]")
    const hint = root.querySelector("[data-brochure-hint]")
    const dots = Array.from(root.querySelectorAll("[data-view]"))
    const lightbox = root.querySelector(".brochure-lightbox")
    const lightboxImg = root.querySelector("[data-lightbox-img]")
    const lightboxCover = root.querySelector("[data-lightbox-cover]")
    const lightboxCoverImg = lightboxCover?.querySelector("img")
    const lightboxZoomLabel = root.querySelector("[data-lightbox-zoom-label]")

    if (!deck || !card || !primaryBtn || !lightbox) return

    root.querySelectorAll("[data-src-outside]").forEach((img) => {
      img.src = outsideSrc
    })
    root.querySelectorAll("[data-src-inside]").forEach((img) => {
      img.src = insideSrc
      img.alt = ALTS.inside
    })
    root.querySelectorAll("[data-alt-outside]").forEach((img) => {
      img.alt = ALTS.outside
    })
    if (lightboxCoverImg) {
      lightboxCoverImg.src = outsideSrc
      lightboxCoverImg.alt = ALTS.cover
    }

    let view = "cover"
    let dragging = false
    let dragRotation = null
    let zoomIndex = 0
    let pointer = null

    const isOpen = () => view !== "cover"
    const baseRotation = () => (view === "outside" ? 180 : 0)

    const setView = (next) => {
      view = next
      deck.dataset.state = next

      const open = isOpen()
      coverStage.hidden = open
      openStage.hidden = !open

      if (!dragging) {
        card.style.transform = `rotateY(${baseRotation()}deg)`
      }

      if (closeBtn) closeBtn.hidden = !open
      primaryBtn.hidden = false
      primaryBtn.textContent = open
        ? view === "inside"
          ? "Flip to outside"
          : "Flip to inside"
        : "Open the brochure"

      dots.forEach((dot) => {
        dot.setAttribute("aria-pressed", String(dot.dataset.view === view))
      })

      if (hint) hint.textContent = HINTS[view]
      syncLightbox()
    }

    const flipOpenSide = () => {
      setView(view === "outside" ? "inside" : "outside")
    }

    const onPointerDown = (e) => {
      if (!isOpen()) return
      pointer = { id: e.pointerId, startX: e.clientX, base: baseRotation() }
      card.setPointerCapture(e.pointerId)
      dragging = true
      dragRotation = baseRotation()
      card.classList.add("is-dragging")
    }

    const onPointerMove = (e) => {
      if (!pointer || pointer.id !== e.pointerId) return
      const width = card.clientWidth || 600
      const delta = ((e.clientX - pointer.startX) / width) * -180
      dragRotation = pointer.base + delta
      card.style.transform = `rotateY(${dragRotation}deg)`
    }

    const endDrag = (e) => {
      if (!pointer || pointer.id !== e.pointerId) return
      const rotation = dragRotation ?? baseRotation()
      const normalized = ((rotation % 360) + 360) % 360
      const next = normalized > 90 && normalized < 270 ? "outside" : "inside"
      dragging = false
      dragRotation = null
      pointer = null
      card.classList.remove("is-dragging")
      setView(next)
    }

    openBtn?.addEventListener("click", () => setView("inside"))
    closeBtn?.addEventListener("click", () => setView("cover"))
    primaryBtn.addEventListener("click", () => {
      if (!isOpen()) setView("inside")
      else flipOpenSide()
    })

    dots.forEach((dot) => {
      dot.addEventListener("click", () => setView(dot.dataset.view))
    })

    card.addEventListener("pointerdown", onPointerDown)
    card.addEventListener("pointermove", onPointerMove)
    card.addEventListener("pointerup", endDrag)
    card.addEventListener("pointercancel", endDrag)
    card.addEventListener("dblclick", () => openLightbox())

    const syncLightbox = () => {
      if (!lightbox.open) return
      if (view === "cover") {
        lightboxImg.hidden = true
        lightboxCover.hidden = false
        lightboxCover.style.width = `${ZOOM_LEVELS[zoomIndex] * 28}%`
        lightboxCover.style.maxWidth = zoomIndex === 0 ? "22rem" : "none"
      } else {
        lightboxCover.hidden = true
        lightboxImg.hidden = false
        lightboxImg.src = view === "inside" ? insideSrc : outsideSrc
        lightboxImg.alt = ALTS[view]
        lightboxImg.style.width = `${ZOOM_LEVELS[zoomIndex] * 100}%`
        lightboxImg.style.maxWidth = zoomIndex === 0 ? "72rem" : "none"
      }
      if (lightboxZoomLabel) {
        lightboxZoomLabel.textContent = `${Math.round(ZOOM_LEVELS[zoomIndex] * 100)}%`
      }
    }

    const openLightbox = () => {
      zoomIndex = 0
      lightbox.showModal()
      syncLightbox()
    }

    zoomBtn?.addEventListener("click", openLightbox)
    root.querySelector("[data-lightbox-close]")?.addEventListener("click", () =>
      lightbox.close(),
    )
    root.querySelector("[data-lightbox-zoom-in]")?.addEventListener("click", () => {
      zoomIndex = Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1)
      syncLightbox()
    })
    root.querySelector("[data-lightbox-zoom-out]")?.addEventListener("click", () => {
      zoomIndex = Math.max(0, zoomIndex - 1)
      syncLightbox()
    })

    root.querySelectorAll("[data-lightbox-view]").forEach((btn) => {
      btn.addEventListener("click", () => setView(btn.dataset.lightboxView))
    })

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.close()
    })

    const handlesKeys = () =>
      root.classList.contains("is-key-active") ||
      (root.classList.contains("brochure-viewer--featured") &&
        !document.querySelector(".brochure-viewer.is-key-active"))

    root.addEventListener("pointerenter", () => root.classList.add("is-key-active"))
    root.addEventListener("pointerleave", () => root.classList.remove("is-key-active"))
    root.addEventListener("focusin", () => root.classList.add("is-key-active"))

    window.addEventListener("keydown", (e) => {
      if (lightbox.open) {
        if (e.key === "Escape") lightbox.close()
        if (e.key === "ArrowLeft") {
          if (view === "outside") setView("inside")
          else if (view === "inside") setView("cover")
        }
        if (e.key === "ArrowRight") {
          if (view === "cover") setView("inside")
          else if (view === "inside") setView("outside")
        }
        return
      }
      if (!handlesKeys()) return
      if (e.key === "ArrowLeft") {
        if (view === "outside") setView("inside")
        else if (view === "inside") setView("cover")
      }
      if (e.key === "ArrowRight") {
        if (view === "cover") setView("inside")
        else if (view === "inside") setView("outside")
      }
    })

    setView("cover")
  }

  document.querySelectorAll(".brochure-viewer").forEach(initBrochure)
})()
