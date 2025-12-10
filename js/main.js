/* ---------------------------------------------------
   STICKY NAVBAR ON SCROLL
--------------------------------------------------- */
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* ---------------------------------------------------
   SMOOTH SCROLL FOR NAV LINKS
--------------------------------------------------- */
const navLinks = document.querySelectorAll("a[href^='#']");

navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth"
      });
    }
  });
});

/* ---------------------------------------------------
   MOBILE NAV TOGGLE
--------------------------------------------------- */
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const primaryNav = document.querySelector("#primary-navigation");

if (mobileNavToggle && primaryNav) {
  mobileNavToggle.addEventListener("click", () => {
    const isVisible = primaryNav.getAttribute("data-visible") === "true";
    
    if (isVisible) {
      primaryNav.setAttribute("data-visible", "false");
      mobileNavToggle.setAttribute("aria-expanded", "false");
      mobileNavToggle.querySelector("i").classList.remove("fa-xmark");
      mobileNavToggle.querySelector("i").classList.add("fa-bars");
    } else {
      primaryNav.setAttribute("data-visible", "true");
      mobileNavToggle.setAttribute("aria-expanded", "true");
      mobileNavToggle.querySelector("i").classList.remove("fa-bars");
      mobileNavToggle.querySelector("i").classList.add("fa-xmark");
    }
  });

  // Close menu when clicking a link
  const navLinks = primaryNav.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      primaryNav.setAttribute("data-visible", "false");
      mobileNavToggle.setAttribute("aria-expanded", "false");
      mobileNavToggle.querySelector("i").classList.remove("fa-xmark");
      mobileNavToggle.querySelector("i").classList.add("fa-bars");
    });
  });
}

/* ---------------------------------------------------
   RESERVATION FORM HANDLING & THANK YOU MODAL
--------------------------------------------------- */
const reservationForm = document.getElementById("reservationForm");
const thankYouModal = document.getElementById("thankYouModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModal = document.getElementById("closeModal");

if (reservationForm) {
  reservationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const guestName = document.getElementById("guestName").value;
    const guestEmail = document.getElementById("guestEmail").value;
    const guestPhone = document.getElementById("guestPhone").value;
    const guestCount = document.getElementById("guestCount").value;
    const reservationDate = document.getElementById("reservationDate").value;
    const reservationTime = document.getElementById("reservationTime").value;
    const specialRequests = document.getElementById("specialRequests").value;

    if (!guestName || !guestEmail || !guestPhone || !guestCount || !reservationDate || !reservationTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const dateObj = new Date(reservationDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    document.getElementById("confirmName").textContent = guestName;
    document.getElementById("confirmDateTime").textContent = `${formattedDate} at ${reservationTime}`;
    document.getElementById("confirmGuests").textContent = `${guestCount} ${guestCount === '1' ? 'Guest' : 'Guests'}`;
    document.getElementById("confirmEmail").textContent = guestEmail;

    thankYouModal.classList.add("show");
    document.body.style.overflow = "hidden";

    reservationForm.reset();
  });
}

function closeThankYouModal() {
  thankYouModal.classList.remove("show");
  document.body.style.overflow = "auto";
}

if (closeModalBtn) closeModalBtn.addEventListener("click", closeThankYouModal);
if (closeModal) closeModal.addEventListener("click", closeThankYouModal);

if (thankYouModal) {
  thankYouModal.querySelector(".thank-you-overlay").addEventListener("click", closeThankYouModal);
}

/* ---------------------------------------------------
   GALLERY HOVER EFFECT
--------------------------------------------------- */
const galleryImages = document.querySelectorAll("#gallery img");

galleryImages.forEach(img => {
  img.addEventListener("mouseenter", () => {
    img.style.transform = "scale(1.05)";
  });

  img.addEventListener("mouseleave", () => {
    img.style.transform = "scale(1)";
  });
});

/* ---------------------------------------------------
   GALLERY SLIDER FUNCTIONALITY
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
  const galleryTrack = document.querySelector(".gallery-track-horizontal");
  const prevBtn = document.querySelector(".gallery-prev-btn");
  const nextBtn = document.querySelector(".gallery-next-btn");
  
  if (galleryTrack && prevBtn && nextBtn) {
    let currentIndex = 0;
    const totalImages = 9;

    function getMaxIndex() {
      const itemsPerSlide = window.innerWidth >= 992 ? 3 : 1;
      return totalImages - itemsPerSlide;
    }
    
    function updateGallery() {
      const itemsPerSlide = window.innerWidth >= 992 ? 3 : 1;
      const step = 100 / itemsPerSlide;
      galleryTrack.style.transform = `translateX(-${currentIndex * step}%)`;
    }
    
    nextBtn.addEventListener("click", () => {
      const maxIndex = getMaxIndex();
      currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
      updateGallery();
    });

    prevBtn.addEventListener("click", () => {
      const maxIndex = getMaxIndex();
      currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
      updateGallery();
    });

    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateGallery();
    });
  }
});

/* ---------------------------------------------------
   SCROLL DOWN (HERO → RESERVATION)
--------------------------------------------------- */
function scrollToNextSection() {
  const next = document.querySelector("#reservation");
  if (next) next.scrollIntoView({ behavior: "smooth" });
}

/* ---------------------------------------------------
   SCROLL TOP BUTTON FUNCTIONALITY (FAST START + SLOW END)
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {

  const scrollTopBtn = document.getElementById("scroll-top");

  if (scrollTopBtn) {

    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight - 200) {
        scrollTopBtn.classList.add("active");
      } else {
        scrollTopBtn.classList.remove("active");
      }
    });

    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      slowScrollToTop();
    });

    function slowScrollToTop() {
      const startY = window.pageYOffset;
      const duration = 1200;
      const startTime = performance.now();

      // FAST START → SLOW END
      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        window.scrollTo(0, startY * (1 - eased));

        if (progress < 1) requestAnimationFrame(animateScroll);
      }

      requestAnimationFrame(animateScroll); // NO DELAY, INSTANT START
    }
  }
});
