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

    // Get form values
    const guestName = document.getElementById("guestName").value;
    const guestEmail = document.getElementById("guestEmail").value;
    const guestPhone = document.getElementById("guestPhone").value;
    const guestCount = document.getElementById("guestCount").value;
    const reservationDate = document.getElementById("reservationDate").value;
    const reservationTime = document.getElementById("reservationTime").value;
    const specialRequests = document.getElementById("specialRequests").value;

    // Validate all fields
    if (!guestName || !guestEmail || !guestPhone || !guestCount || !reservationDate || !reservationTime) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format date
    const dateObj = new Date(reservationDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Update modal with reservation details
    document.getElementById("confirmName").textContent = guestName;
    document.getElementById("confirmDateTime").textContent = `${formattedDate} at ${reservationTime}`;
    document.getElementById("confirmGuests").textContent = `${guestCount} ${guestCount === '1' ? 'Guest' : 'Guests'}`;
    document.getElementById("confirmEmail").textContent = guestEmail;

    // Show modal
    thankYouModal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Reset form
    reservationForm.reset();

    // Log reservation (in real app, this would send to backend)
    console.log("Reservation Details:", {
      name: guestName,
      email: guestEmail,
      phone: guestPhone,
      guests: guestCount,
      date: reservationDate,
      time: reservationTime,
      specialRequests: specialRequests
    });
  });
}

// Close modal handlers
function closeThankYouModal() {
  thankYouModal.classList.remove("show");
  document.body.style.overflow = "auto";
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeThankYouModal);
}

if (closeModal) {
  closeModal.addEventListener("click", closeThankYouModal);
}

// Close modal when clicking overlay
if (thankYouModal) {
  thankYouModal.querySelector(".thank-you-overlay").addEventListener("click", closeThankYouModal);
}


/* ---------------------------------------------------
   GALLERY HOVER EFFECT (Optional animation enhancer)
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
   GALLERY SLIDER FUNCTIONALITY - Horizontal Scroll
--------------------------------------------------- */
  /* ---------------------------------------------------
     GALLERY SLIDER FUNCTIONALITY - Horizontal Scroll
  --------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function() {
    const galleryTrack = document.querySelector(".gallery-track-horizontal");
    const prevBtn = document.querySelector(".gallery-prev-btn");
    const nextBtn = document.querySelector(".gallery-next-btn");
    
    if (galleryTrack && prevBtn && nextBtn) {
      let currentIndex = 0;
      const totalImages = 9;
      
      // Function to get max index
      function getMaxIndex() {
        const itemsPerSlide = window.innerWidth >= 992 ? 3 : 1;
        // Desktop: slide 1 image at a time. Max starting index = Total - Visible.
        // Mobile: slide 1 image at a time (1 visible). Max index = Total - 1.
        return totalImages - itemsPerSlide;
      }
      
      function updateGallery() {
        const itemsPerSlide = window.innerWidth >= 992 ? 3 : 1;
        // Calculate step size: 33.333% for desktop, 100% for mobile
        const step = 100 / itemsPerSlide;
        const movePercentage = currentIndex * step;
        galleryTrack.style.transform = `translateX(-${movePercentage}%)`;
      }
      
      function handleNext() {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
          currentIndex++;
        } else {
          currentIndex = 0; // Loop back to start
        }
        updateGallery();
      }

      function handlePrev() {
        const maxIndex = getMaxIndex();
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = maxIndex; // Loop to end
        }
        updateGallery();
      }

      nextBtn.addEventListener("click", handleNext);
      prevBtn.addEventListener("click", handlePrev);
  
      // Reset index on resize to prevent alignment issues
      window.addEventListener('resize', () => {
          currentIndex = 0;
          updateGallery();
      });
    }
  });

// scroll down arrow script
function scrollToNextSection() {
  const next = document.querySelector("#reservation");
  if (next) next.scrollIntoView({ behavior: "smooth" });
}

/* ---------------------------------------------------
   SCROLL TOP BUTTON FUNCTIONALITY
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function() {
  const scrollTopBtn = document.getElementById("scroll-top");

  if (scrollTopBtn) {
    // Toggle visibility based on Hero Section height (viewport height)
    window.addEventListener("scroll", () => {
      if (window.scrollY > window.innerHeight - 200) { 
        scrollTopBtn.classList.add("active");
      } else {
        scrollTopBtn.classList.remove("active");
      }
    });

    // Smooth scroll to top
    scrollTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
