document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const header = document.querySelector(".header");
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("back-to-top");
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const currentYear = document.getElementById("current-year");

  /* Année automatique */
  currentYear.textContent = new Date().getFullYear();

  /* Préchargeur */
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 500);
  });

  /* Mode sombre */
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  });

  /* Menu mobile */
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Scroll : header, barre et retour haut */
  function handleScroll() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / documentHeight) * 100;

    progressBar.style.width = `${progress}%`;

    if (scrollTop > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (scrollTop > 450) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* Animation au défilement */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  /* Compteurs animés */
  const counters = document.querySelectorAll(".counter");
  let countersStarted = false;

  const statsSection = document.querySelector(".stats-grid");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;

          counters.forEach((counter) => {
            const target = Number(counter.dataset.target);
            let current = 0;
            const increment = Math.ceil(target / 40);

            const updateCounter = () => {
              current += increment;

              if (current < target) {
                counter.textContent = current;
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            };

            updateCounter();
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  /* Filtrage projets */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* Galerie / Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxTitle = document.getElementById("lightbox-title");
  const closeLightbox = document.querySelector(".lightbox-close");
  const lightboxVisual = document.querySelector(".lightbox-visual");
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const imgSrc = item.dataset.image;

      // clear previous visual content
      lightboxVisual.innerHTML = "";

      if (imgSrc) {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = item.dataset.title || "";
        lightboxVisual.appendChild(img);
      }

      lightboxTitle.textContent = item.dataset.title;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    });
  });

  function closeGallery() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    const lightboxVisual = document.querySelector(".lightbox-visual");
    if (lightboxVisual) lightboxVisual.innerHTML = "";
  }

  closeLightbox.addEventListener("click", closeGallery);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeGallery();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGallery();
    }
  });

  /* Formulaire contact :
     Ouvre le logiciel de messagerie avec les champs remplis.
     Pour un envoi réel, utilisez Formspree, Netlify Forms ou EmailJS. */
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    const emailSubject = encodeURIComponent(`[Portfolio] ${subject}`);
    const emailBody = encodeURIComponent(
      `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`
    );

    formMessage.textContent = "Ouverture de votre messagerie...";
    formMessage.style.color = "#219653";

    window.location.href = `mailto:tuomamadou10@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    setTimeout(() => {
      contactForm.reset();
      formMessage.textContent = "Merci ! Votre logiciel de messagerie a été ouvert.";
    }, 700);
  });
});