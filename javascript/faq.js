
document.addEventListener("DOMContentLoaded", () => {
  const faqSearch = document.querySelector("#faqSearch");
  const clearSearch = document.querySelector("#clearFaqSearch");
  const resetSearch = document.querySelector("#resetFaqSearch");
  const faqList = document.querySelector("#faqList");
  const faqItems = Array.from(
    document.querySelectorAll("[data-faq-item]")
  );
  const noResults = document.querySelector("#faqNoResults");
  const resultCount = document.querySelector("#faqResultCount");
  const currentYear = document.querySelector("#currentYear");
  const headerSearchForm = document.querySelector("#headerSearchForm");
  const headerSearch = document.querySelector("#headerSearch");

  // Tahun footer.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (!faqList || !faqItems.length) return;

  let animationId = 0;

  // Animasi accordion.
  function toggleFaq(item, shouldOpen) {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";

    if (isOpen === shouldOpen) return;

    button.setAttribute("aria-expanded", String(shouldOpen));
    item.classList.toggle("is-open", shouldOpen);

    answer.getAnimations().forEach((animation) => animation.cancel());

    if (shouldOpen) {
      answer.hidden = false;

      const height = answer.scrollHeight;

      answer.animate(
        [
          {
            height: "0px",
            opacity: 0,
            overflow: "hidden"
          },
          {
            height: `${height}px`,
            opacity: 1,
            overflow: "hidden"
          }
        ],
        {
          duration: 280,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)"
        }
      );
    } else {
      const height = answer.scrollHeight;

      const animation = answer.animate(
        [
          {
            height: `${height}px`,
            opacity: 1,
            overflow: "hidden"
          },
          {
            height: "0px",
            opacity: 0,
            overflow: "hidden"
          }
        ],
        {
          duration: 220,
          easing: "ease-in"
        }
      );

      animation.onfinish = () => {
        if (button.getAttribute("aria-expanded") === "false") {
          answer.hidden = true;
        }
      };
    }
  }

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");

    button?.addEventListener("click", () => {
      const shouldOpen =
        button.getAttribute("aria-expanded") !== "true";

      toggleFaq(item, shouldOpen);
    });
  });

  // Pencarian FAQ.
  function filterFaq() {
    const query = (faqSearch?.value || "")
      .trim()
      .toLowerCase();

    let visibleCount = 0;

    faqItems.forEach((item) => {
      const question =
        item.querySelector(".faq-question")?.textContent || "";

      const answer =
        item.querySelector(".faq-answer")?.textContent || "";

      const keywords = item.dataset.keywords || "";
      const searchableText =
        `${question} ${answer} ${keywords}`.toLowerCase();

      const matches = searchableText.includes(query);

      item.hidden = !matches;

      if (matches) {
        visibleCount++;
      } else {
        toggleFaq(item, false);
      }
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }

    if (faqList) {
      faqList.hidden = visibleCount === 0;
    }

    if (clearSearch) {
      clearSearch.hidden = query.length === 0;
    }

    if (resultCount) {
      if (query) {
        resultCount.textContent =
          `${visibleCount} ${visibleCount === 1 ? "result" : "results"} found`;
      } else {
        resultCount.textContent =
          "Browse frequently asked questions";
      }
    }
  }

  faqSearch?.addEventListener("input", filterFaq);

  function resetFaq() {
    if (faqSearch) {
      faqSearch.value = "";
    }

    filterFaq();
    faqSearch?.focus();
  }

  clearSearch?.addEventListener("click", resetFaq);
  resetSearch?.addEventListener("click", resetFaq);

  // Sinkronisasi pencarian header dengan halaman event.
  headerSearchForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = headerSearch?.value.trim();

    if (!query) {
      headerSearch?.focus();
      return;
    }

    window.location.href =
      `index.html?search=${encodeURIComponent(query)}#featured`;
  });

  // Animasi elemen saat masuk ke viewport.
  const motionTargets = [
    ".faq-hero-copy",
    ".hero-note",
    ".help-card",
    ".faq-toolbar",
    ".faq-support-banner",
    ".footer-main > div"
  ];

  const animatedElements = document.querySelectorAll(
    motionTargets.join(", ")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.animate(
            [
              {
                opacity: 0,
                transform: "translateY(22px)"
              },
              {
                opacity: 1,
                transform: "translateY(0)"
              }
            ],
            {
              duration: 650,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "both"
            }
          );

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    animatedElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(22px)";
      element.style.willChange = "opacity, transform";
      element.style.animationDelay = `${Math.min(index * 70, 280)}ms`;

      revealObserver.observe(element);
    });
  }

  // Efek hover pada kartu FAQ.
  faqItems.forEach((item) => {
    item.addEventListener("pointerenter", () => {
      if (window.matchMedia("(hover: hover)").matches) {
        item.style.transform = "translateY(-2px)";
      }
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });

  // Tampilan awal.
  filterFaq();
});