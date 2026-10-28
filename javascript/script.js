
document.addEventListener("DOMContentLoaded", () => {
  const eventGrid = document.querySelector("#eventGrid");
  const eventSearchForm = document.querySelector("#eventSearchForm");
  const eventSearch = document.querySelector("#eventSearch");
  const headerSearchForm = document.querySelector("#headerSearchForm");
  const headerSearch = document.querySelector("#headerSearch");
  const categoryFilter = document.querySelector("#categoryFilter");
  const locationFilter = document.querySelector("#locationFilter");
  const prevButton = document.querySelector("#eventPrev");
  const nextButton = document.querySelector("#eventNext");
  const sliderDots = document.querySelectorAll(".slider-dot");
  const categoryLinks = document.querySelectorAll("[data-category-link]");
  const eventCards = eventGrid
    ? Array.from(eventGrid.querySelectorAll(".event-card"))
    : [];

  let currentIndex = 0;

  if (!eventGrid || eventCards.length === 0) {
    console.warn("Event grid atau event card tidak ditemukan.");
    return;
  }

  // Membuat pesan jika hasil pencarian kosong.
  const emptyMessage = document.createElement("div");
  emptyMessage.className = "event-empty";
  emptyMessage.textContent = "No events found. Try another search.";
  emptyMessage.hidden = true;
  eventGrid.insertAdjacentElement("afterend", emptyMessage);

  function getVisibleCards() {
    return eventCards.filter((card) => !card.hidden);
  }

  function updateCarousel() {
    const visibleCards = getVisibleCards();

    if (visibleCards.length === 0) {
      currentIndex = 0;
      sliderDots.forEach((dot) => {
        dot.classList.remove("active");
        dot.setAttribute("aria-current", "false");
      });
      return;
    }

    currentIndex = Math.min(currentIndex, visibleCards.length - 1);

    sliderDots.forEach((dot, index) => {
      const isActive = index === currentIndex;

      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  }

  function showEvent(index) {
    const visibleCards = getVisibleCards();

    if (visibleCards.length === 0) return;

    currentIndex =
      (index + visibleCards.length) % visibleCards.length;

    updateCarousel();

    visibleCards[currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }

  function filterEvents() {
    const searchTerm = (eventSearch?.value || "")
      .trim()
      .toLowerCase();

    const selectedCategory = categoryFilter?.value || "all";
    const selectedLocation = locationFilter?.value || "all";

    eventCards.forEach((card) => {
      const title = card.textContent.toLowerCase();
      const searchData = (
        card.dataset.search || ""
      ).toLowerCase();

      const category = (
        card.dataset.category || ""
      ).toLowerCase();

      const location = (
        card.dataset.location || ""
      ).toLowerCase();

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        searchData.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const matchesLocation =
        selectedLocation === "all" ||
        location === selectedLocation;

      card.hidden = !(
        matchesSearch &&
        matchesCategory &&
        matchesLocation
      );
    });

    emptyMessage.hidden = getVisibleCards().length > 0;
    currentIndex = 0;
    updateCarousel();
  }

  function goToEvents() {
    document.querySelector("#featured")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // Pencarian event.
  eventSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    filterEvents();
    goToEvents();
  });

  eventSearch?.addEventListener("input", filterEvents);
  categoryFilter?.addEventListener("change", filterEvents);
  locationFilter?.addEventListener("change", filterEvents);

  // Pencarian dari header.
  headerSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (eventSearch && headerSearch) {
      eventSearch.value = headerSearch.value;
    }

    filterEvents();
    goToEvents();
  });

  // Navigasi kategori.
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const category = link.dataset.categoryLink;

      if (!categoryFilter || !category) return;

      event.preventDefault();

      const availableOption = Array.from(
        categoryFilter.options
      ).some((option) => option.value === category);

      if (!availableOption) return;

      categoryFilter.value = category;

      if (eventSearch) {
        eventSearch.value = "";
      }

      if (headerSearch) {
        headerSearch.value = "";
      }

      filterEvents();
      goToEvents();
    });
  });

  // Kontrol carousel.
  prevButton?.addEventListener("click", () => {
    showEvent(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    showEvent(currentIndex + 1);
  });

  sliderDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showEvent(index);
    });
  });

  // Memastikan filter awal sesuai dengan HTML.
  filterEvents();
});