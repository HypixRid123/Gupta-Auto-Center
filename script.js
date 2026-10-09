/* =========================================
   GUPTA AUTO CENTER — INTERACTIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // 1. AUTOMATIC FOOTER YEAR
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. MOBILE NAVIGATION
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    });
  }

  // 3. SMOOTH SCROLL FOR INTERNAL LINKS
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      // Update the URL without reloading the page.
      if (history.replaceState) {
        history.replaceState(null, "", targetId);
      }
    });
  });

  // 4. ACTIVE NAVIGATION LINK
  const navLinks = [
    ...document.querySelectorAll('.main-nav a[href^="#"]')
  ];

  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visibleSections.length) return;

        const activeId = visibleSections[0].target.id;

        navLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // 5. SCROLL-REVEAL ANIMATIONS
  const revealSelectors = [
    ".hero-copy",
    ".hero-visual",
    ".brand-strip-heading",
    ".section-intro",
    ".service-card",
    ".bike-panel",
    ".section-heading-row",
    ".products-cta",
    ".about-photo",
    ".about-copy",
    ".gallery-grid figure",
    ".contact-inner > div"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(",")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    revealElements.forEach((element, index) => {
      element.classList.add("js-reveal");

      // Small stagger for cards and gallery images.
      if (
        element.matches(".service-card, .gallery-grid figure")
      ) {
        element.style.setProperty(
          "--reveal-delay",
          `${(index % 4) * 80}ms`
        );
      }
    });

    // Add reveal styling through JS so content remains visible
    // if JavaScript is disabled.
    const revealStyle = document.createElement("style");

    revealStyle.textContent = `
      .js-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition:
          opacity 650ms ease,
          transform 650ms cubic-bezier(.2,.7,.2,1);
        transition-delay: var(--reveal-delay, 0ms);
      }

      .js-reveal.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      @media (prefers-reduced-motion: reduce) {
        .js-reveal {
          opacity: 1;
          transform: none;
          transition: none;
        }
      }
    `;

    document.head.appendChild(revealStyle);

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // 6. BRAND BANNER: PAUSE WHILE THE CURSOR IS OVER IT
  const brandTicker = document.getElementById("brandTicker");
  const brandTrack = brandTicker?.querySelector(".brand-track");

  if (brandTicker && brandTrack) {
    brandTicker.addEventListener("mouseenter", () => {
      brandTrack.style.animationPlayState = "paused";
    });

    brandTicker.addEventListener("mouseleave", () => {
      brandTrack.style.animationPlayState = "running";
    });

    brandTicker.addEventListener("focusin", () => {
      brandTrack.style.animationPlayState = "paused";
    });

    brandTicker.addEventListener("focusout", (event) => {
      if (!brandTicker.contains(event.relatedTarget)) {
        brandTrack.style.animationPlayState = "running";
      }
    });
  }

  // 7. RGB LOGO ORBIT: SUBTLE RESPONSE TO POINTER MOVEMENT
  const logo = document.querySelector(".brand");
  const rgbOrbit = document.querySelector(".rgb-orbit");

  if (
    logo &&
    rgbOrbit &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    logo.addEventListener("mouseenter", () => {
      rgbOrbit.style.filter = "brightness(1.12) saturate(1.2)";
    });

    logo.addEventListener("mouseleave", () => {
      rgbOrbit.style.filter = "";
    });
  }

  // 8. OPTIONAL KEYBOARD ACCESS FOR THE BRAND TICKER
  if (brandTicker && !brandTicker.hasAttribute("tabindex")) {
    brandTicker.setAttribute("tabindex", "0");
    brandTicker.setAttribute(
      "aria-label",
      "Motorcycle brand banner. Focus to pause the scrolling logos."
    );
  }

  // 9. WHATSAPP LINKS OPEN IN A NEW TAB VIA THEIR HTML ATTRIBUTES.
  // No extra handler is needed; this keeps links functional
  // without interfering with normal browser navigation.

  console.log("Gupta Auto Center website initialized successfully.");
});
