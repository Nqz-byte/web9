
document.addEventListener("DOMContentLoaded", () => {
  const money = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  });

  const formatPrice = (price) => {
    return `R ${money.format(price)}`;
  };

  const parsePrice = (text) => {
    const match = text.replace(/,/g, "").match(/[\d.]+/);

    if (!match) return 0;

    return Number(match[0].replace(/\./g, "")) || 0;
  };

  // === Ticket Selection ===
  const ticketTypes = [...document.querySelectorAll(".ticket-type")];
  const totalOutput = document.querySelector(".ticket-total output");
  const checkoutButton = document.querySelector(".ticket-checkout-button");
  const ticketMessage = document.querySelector(".ticket-selection-message");

  const getTicketPrice = (ticket) => {
    const priceElement = ticket.querySelector(".ticket-type-info p");
    return priceElement ? parsePrice(priceElement.textContent) : 0;
  };

  const getQuantity = (ticket) => {
    const output = ticket.querySelector(".quantity-control output");
    return output ? Math.max(0, Number(output.textContent) || 0) : 0;
  };

  const updateTicketSummary = () => {
    let total = 0;
    let quantity = 0;

    ticketTypes.forEach((ticket) => {
      const count = getQuantity(ticket);
      const price = getTicketPrice(ticket);
      const output = ticket.querySelector(".quantity-control output");
      const buttons = ticket.querySelectorAll(".quantity-control button");

      total += count * price;
      quantity += count;

      if (output) {
        output.textContent = count;
      }

      if (buttons.length >= 2) {
        buttons[0].disabled = count <= 0;
        buttons[1].disabled = count >= 10;
      }

      ticket.dataset.quantity = count;
    });

    if (totalOutput) {
      totalOutput.textContent = formatPrice(total);
    }

    if (checkoutButton) {
      checkoutButton.disabled = quantity === 0;
      checkoutButton.setAttribute("aria-disabled", String(quantity === 0));
    }

    if (ticketMessage) {
      ticketMessage.textContent =
        quantity > 0
          ? `${quantity} tiket dipilih`
          : "";
    }

    return { total, quantity };
  };

  ticketTypes.forEach((ticket) => {
    const buttons = ticket.querySelectorAll(".quantity-control button");
    const output = ticket.querySelector(".quantity-control output");

    if (!output || buttons.length < 2) return;

    output.textContent = Math.min(10, Math.max(0, Number(output.textContent) || 0));

    buttons[0].addEventListener("click", () => {
      const current = getQuantity(ticket);

      if (current > 0) {
        output.textContent = current - 1;
        updateTicketSummary();
      }
    });

    buttons[1].addEventListener("click", () => {
      const current = getQuantity(ticket);

      if (current < 10) {
        output.textContent = current + 1;
        updateTicketSummary();
      }
    });
  });

  updateTicketSummary();

  // === Checkout ===
  if (checkoutButton) {
    checkoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      const selection = updateTicketSummary();

      if (selection.quantity === 0) {
        if (ticketMessage) {
          ticketMessage.textContent = "Pilih minimal satu tiket terlebih dahulu.";
        }
        return;
      }

      const tickets = ticketTypes
        .map((ticket) => {
          const count = getQuantity(ticket);
          const name = ticket.querySelector(".ticket-type-info h3");

          if (count === 0) return null;

          return {
            name: name ? name.textContent.trim() : "Ticket",
            quantity: count,
            price: getTicketPrice(ticket),
            subtotal: count * getTicketPrice(ticket)
          };
        })
        .filter(Boolean);

      const order = {
        event: document.querySelector(".event-hero h1")?.textContent.trim() || "",
        tickets,
        total: selection.total,
        currency: "ZAR"
      };

      document.dispatchEvent(
        new CustomEvent("event-ticket-checkout", {
          detail: order
        })
      );

      if (ticketMessage) {
        ticketMessage.textContent =
          "Pilihan tiket siap. Sistem pembayaran perlu dihubungkan.";
      }

      console.log("Data pesanan:", order);
    });
  }

  // === Ticket Navigation ===
  document.querySelectorAll('a[href="#ticketSelection"], a[href="#tickets"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      const firstButton = target.querySelector(".quantity-control button:last-child");

      if (firstButton) {
        window.setTimeout(() => firstButton.focus({ preventScroll: true }), 400);
      }
    });
  });

  // === Gallery ===
  const galleryDialog = document.querySelector(".gallery-dialog");
  const galleryDialogImage = galleryDialog?.querySelector("img");
  const galleryCounter = document.querySelector("#galleryCounter");

  const galleryItems = [
    ...document.querySelectorAll(
      ".gallery-main-image, .gallery-thumbnail, .event-gallery-photo"
    )
  ];

  const galleryImages = galleryItems
    .map((item) => {
      const backgroundImage = getComputedStyle(item).backgroundImage;
      const backgroundMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      const image = item.querySelector("img");

      return {
        src: image?.currentSrc || image?.src || backgroundMatch?.[1] || "",
        alt: image?.alt || item.getAttribute("aria-label") || "Event gallery",
        element: item
      };
    })
    .filter((item) => item.src);

  let activeImageIndex = 0;

  const showGalleryImage = (index) => {
    if (!galleryDialog || !galleryDialogImage || galleryImages.length === 0) return;

    activeImageIndex = (index + galleryImages.length) % galleryImages.length;

    const image = galleryImages[activeImageIndex];

    galleryDialogImage.src = image.src;
    galleryDialogImage.alt = image.alt;

    if (galleryCounter) {
      galleryCounter.textContent =
        `${activeImageIndex + 1} / ${galleryImages.length}`;
    }

    galleryItems.forEach((item) => {
      item.classList.toggle("is-selected", item === image.element);
    });
  };

  const openGallery = (item) => {
    if (!galleryDialog || !galleryImages.length) return;

    const index = galleryImages.findIndex((image) => image.element === item);

    showGalleryImage(index >= 0 ? index : 0);

    if (typeof galleryDialog.showModal === "function") {
      if (!galleryDialog.open) {
        galleryDialog.showModal();
      }
    } else {
      galleryDialog.setAttribute("open", "");
    }
  };

  galleryItems.forEach((item) => {
    item.setAttribute("aria-haspopup", "dialog");

    if (item.tagName !== "BUTTON" && item.tagName !== "A") {
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
    }

    item.addEventListener("click", (event) => {
      event.preventDefault();
      openGallery(item);
    });

    item.addEventListener("keydown", (event) => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        item.tagName !== "BUTTON" &&
        item.tagName !== "A"
      ) {
        event.preventDefault();
        openGallery(item);
      }
    });
  });

  const closeGallery = galleryDialog?.querySelector(".gallery-dialog-close");
  const previousImage = galleryDialog?.querySelector(".gallery-dialog-prev");
  const nextImage = galleryDialog?.querySelector(".gallery-dialog-next");

  closeGallery?.addEventListener("click", () => {
    if (galleryDialog.open && galleryDialog.close) {
      galleryDialog.close();
    } else {
      galleryDialog.removeAttribute("open");
    }
  });

  previousImage?.addEventListener("click", () => {
    showGalleryImage(activeImageIndex - 1);
  });

  nextImage?.addEventListener("click", () => {
    showGalleryImage(activeImageIndex + 1);
  });

  galleryDialog?.addEventListener("click", (event) => {
    if (event.target === galleryDialog) {
      galleryDialog.close?.();
    }
  });

  galleryDialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showGalleryImage(activeImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showGalleryImage(activeImageIndex + 1);
    }
  });

  // === Header Search ===
  const searchForm = document.querySelector(".event-header-search");
  const searchInput = searchForm?.querySelector('input[type="search"], input');

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const query = searchInput.value.trim();

      if (!query) {
        searchInput.focus();
        return;
      }

      const destination = searchForm.getAttribute("action") || "events.html";
      const url = new URL(destination, window.location.href);

      url.searchParams.set("q", query);
      window.location.href = url.href;
    });
  }

  // === Scroll Animations ===
  const animatedElements = document.querySelectorAll(
    ".event-about, .event-highlights, .event-lineup, .ticket-selection, .event-extra-grid, .similar-event-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    animatedElements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
      observer.observe(element);
    });
  } else {
    animatedElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }
});