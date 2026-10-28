
document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.querySelector("#currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // === Mobile Navigation ===
  const nav = document.querySelector(
    "#supportNavbar, #navbarNav, .support-navbar .navbar-collapse"
  );

  if (nav && window.bootstrap?.Collapse) {
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992) {
          window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
        }
      });
    });
  }

  // === FAQ Accordion ===
  const faqQuestions = document.querySelectorAll(".quick-faq-question");

  faqQuestions.forEach((question) => {
    const answerId = question.getAttribute("aria-controls");
    const answer = answerId
      ? document.getElementById(answerId)
      : question.closest(".quick-faq-item")?.querySelector(".quick-faq-answer");

    if (!answer) return;

    answer.hidden = question.getAttribute("aria-expanded") !== "true";

    question.addEventListener("click", () => {
      const isOpen = question.getAttribute("aria-expanded") === "true";

      faqQuestions.forEach((otherQuestion) => {
        const otherId = otherQuestion.getAttribute("aria-controls");
        const otherAnswer = otherId
          ? document.getElementById(otherId)
          : otherQuestion.closest(".quick-faq-item")?.querySelector(".quick-faq-answer");

        otherQuestion.setAttribute("aria-expanded", "false");

        if (otherAnswer) {
          otherAnswer.hidden = true;
        }
      });

      if (!isOpen) {
        question.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });

  // === FAQ Search ===
  const faqSearch = document.querySelector("#faqSearch");
  const faqItems = document.querySelectorAll(
    "[data-faq-item], .quick-faq-item"
  );
  const faqResultCount = document.querySelector("#faqResultCount");
  const faqNoResults = document.querySelector("#faqNoResults");
  const clearFaqSearch = document.querySelector("#clearFaqSearch");
  const resetFaqSearch = document.querySelector("#resetFaqSearch");

  function filterFaqs(value = "") {
    const query = value.trim().toLowerCase();
    let visibleCount = 0;

    faqItems.forEach((item) => {
      const searchableText = [
        item.textContent,
        item.dataset.category || "",
        item.dataset.keywords || ""
      ].join(" ").toLowerCase();

      const matches = searchableText.includes(query);

      item.hidden = !matches;

      if (matches) {
        visibleCount++;
      } else {
        const question = item.querySelector(
          ".quick-faq-question, .faq-question"
        );

        const answerId = question?.getAttribute("aria-controls");
        const answer = answerId
          ? document.getElementById(answerId)
          : item.querySelector(".quick-faq-answer, .faq-answer");

        if (question) {
          question.setAttribute("aria-expanded", "false");
        }

        if (answer) {
          answer.hidden = true;
        }
      }
    });

    if (faqResultCount) {
      faqResultCount.textContent = query
        ? `${visibleCount} hasil ditemukan`
        : `${visibleCount} pertanyaan`;
    }

    if (faqNoResults) {
      faqNoResults.hidden = visibleCount > 0;
    }

    if (clearFaqSearch) {
      clearFaqSearch.hidden = !query;
    }
  }

  if (faqSearch) {
    faqSearch.addEventListener("input", () => {
      filterFaqs(faqSearch.value);
    });
  }

  function resetSearch() {
    if (!faqSearch) return;

    faqSearch.value = "";
    filterFaqs("");
    faqSearch.focus();
  }

  clearFaqSearch?.addEventListener("click", resetSearch);
  resetFaqSearch?.addEventListener("click", resetSearch);

  // === Header Search ===
  const headerSearchForm = document.querySelector("#headerSearchForm");
  const headerSearch = document.querySelector(
    "#headerSearch, .header-search input"
  );

  if (headerSearchForm && headerSearch) {
    headerSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const query = headerSearch.value.trim();

      if (!query) {
        headerSearch.focus();
        return;
      }

      if (faqSearch) {
        faqSearch.value = query;
        filterFaqs(query);
      }

      const target = document.querySelector(
        "#faq, #quickAnswers, .quick-answers, [data-faq-section]"
      );

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } else {
        showNotice(`Pencarian: "${query}"`);
      }
    });
  }

  // === Help Categories ===
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      const href = card.getAttribute("href");

      if (href && href !== "#") return;

      event.preventDefault();

      const category = (
        card.dataset.category ||
        card.querySelector("h3")?.textContent ||
        ""
      ).trim();

      if (faqSearch) {
        faqSearch.value = category;
        filterFaqs(category);
      }

      const target = document.querySelector(
        "#faq, #quickAnswers, .quick-answers, [data-faq-section]"
      );

      target?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // === Contact Form ===
  const contactForm = document.querySelector(
    "#contactForm, .contact-form form, form[data-contact-form]"
  );

  const formStatus = document.querySelector(
    "#formStatus, .form-status"
  );

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitButton = contactForm.querySelector(
        '[type="submit"]'
      );

      const originalText = submitButton?.innerHTML || "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Memproses...";
      }

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.setAttribute("role", "status");
        formStatus.textContent =
          "Formulir valid. Hubungkan backend atau layanan email agar pesan terkirim ke tim support.";
      }

      window.setTimeout(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }
      }, 700);
    });
  }

  // === Live Chat ===
  document.querySelectorAll(
    "[data-live-chat], .live-chat-card .primary-button"
  ).forEach((button) => {
    button.addEventListener("click", (event) => {
      const href = button.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();

        showNotice(
          "Live Chat belum terhubung ke layanan support."
        );
      }
    });
  });

  // === Language Selector ===
  const languageSelect = document.querySelector("#languageSelect");

  languageSelect?.addEventListener("change", () => {
    const selectedLanguage =
      languageSelect.options[languageSelect.selectedIndex]?.text;

    showNotice(
      `Bahasa dipilih: ${selectedLanguage}. Terjemahan perlu dihubungkan secara terpisah.`
    );
  });

  // === Scroll Reveal ===
  const revealElements = document.querySelectorAll(
    ".support-hero-copy, .live-chat-card, .section-heading, .category-card, .quick-answers, .contact-copy, .contact-form"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    revealElements.forEach((element, index) => {
      element.classList.add("support-reveal");
      element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 70}ms`
      );
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // === Notification ===
  function showNotice(message) {
    let notice = document.querySelector("#supportNotice");

    if (!notice) {
      notice = document.createElement("div");
      notice.id = "supportNotice";
      notice.className = "support-notice";
      notice.setAttribute("role", "status");
      notice.setAttribute("aria-live", "polite");

      document.body.appendChild(notice);
    }

    notice.textContent = message;
    notice.classList.add("is-visible");

    window.clearTimeout(notice.hideTimer);

    notice.hideTimer = window.setTimeout(() => {
      notice.classList.remove("is-visible");
    }, 4000);
  }

  // === Dynamic Animation Styles ===
  if (!document.querySelector("#supportJsStyles")) {
    const style = document.createElement("style");

    style.id = "supportJsStyles";
    style.textContent = `
      .support-reveal {
        opacity: 0;
        transform: translateY(18px);
        transition:
          opacity .65s ease var(--reveal-delay, 0ms),
          transform .65s ease var(--reveal-delay, 0ms);
      }

      .support-reveal.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .support-notice {
        position: fixed;
        z-index: 9999;
        right: 22px;
        bottom: 22px;
        max-width: min(380px, calc(100vw - 32px));
        padding: 13px 17px;
        border: 1px solid #087bff;
        border-radius: 12px;
        background: #031b38;
        color: #edf5ff;
        font-size: 13px;
        line-height: 1.5;
        box-shadow: 0 12px 35px rgba(0, 0, 0, .35);
        opacity: 0;
        pointer-events: none;
        transform: translateY(12px);
        transition: opacity .25s ease, transform .25s ease;
      }

      .support-notice.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      [hidden] {
        display: none !important;
      }

      @media (prefers-reduced-motion: reduce) {
        .support-reveal,
        .support-notice {
          transition: none !important;
          transform: none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // === Initial State ===
  if (faqItems.length) {
    filterFaqs(faqSearch?.value || "");
  }
});