document.addEventListener("DOMContentLoaded", () => {
  // --- 1. MOBILE MENU ---
  // Toggles the mobile menu and prevents background scrolling when open.
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const body = document.body;

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      body.classList.toggle("no-scroll");
    });
  }

  // --- 2. UNIFIED SMOOTH SCROLL & MENU CLOSE ---
  // This single function handles all anchor links (#) for smooth scrolling
  // and closes the mobile menu if it's open.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent the default jump

      // Close mobile menu if it's active
      if (navMenu && navMenu.classList.contains("active")) {
        mobileMenuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        body.classList.remove("no-scroll");
      }

      // Perform smooth scroll with offset for the sticky navbar
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Adjust the offset (-80) to match your navbar's height
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });


  // --- 3. HERO SLIDER ---
  // Manages the main banner slider with auto-play and navigation.
  const heroSlider = document.querySelector(".hero-slider");
  if (heroSlider) {
    const slides = document.querySelectorAll(".hero-slide");
    const sliderDots = document.querySelector(".slider-dots");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const nextBtn = document.querySelector(".slider-btn.next");
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
      slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("slider-dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        sliderDots.appendChild(dot);
      });

      const dots = document.querySelectorAll(".slider-dot");

      function goToSlide(n) {
        if (!slides[currentSlide] || !dots[currentSlide]) return;
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
      }

      function nextSlide() {
        goToSlide(currentSlide + 1);
      }

      function startSlideShow() {
        stopSlideShow(); // Ensure no multiple intervals are running
        slideInterval = setInterval(nextSlide, 5000);
      }

      function stopSlideShow() {
        clearInterval(slideInterval);
      }

      nextBtn?.addEventListener("click", () => {
        nextSlide();
        stopSlideShow();
        setTimeout(startSlideShow, 1000); // Delay restart for smoother feel
      });

      prevBtn?.addEventListener("click", () => {
        goToSlide(currentSlide - 1);
        stopSlideShow();
        setTimeout(startSlideShow, 1000);
      });

      heroSlider.addEventListener("mouseenter", stopSlideShow);
      heroSlider.addEventListener("mouseleave", startSlideShow);

      startSlideShow();
    }
  }

  // --- 4. TESTIMONIALS CAROUSEL ---
  // Manages the testimonials slider showing 2 cards, sliding one by one every 3 seconds.
  const testimonialsCarousel = document.querySelector(".testimonials-carousel");
  if (testimonialsCarousel) {
    const track = document.querySelector(".testimonials-track");
    const cards = document.querySelectorAll(".testimonial-card");
    let currentIndex = 0;
    let autoSlideInterval;
    let isPaused = false;

    if (cards.length > 0) {
      const totalCards = cards.length;
      const cardWidth = cards[0].offsetWidth + 30; // width + 2 * margin

      function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % (totalCards - 1); // Loop through unique cards (6 unique, duplicated)
        updateCarousel();
      }

      function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000);
      }

      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }

      // Pause on hover
      testimonialsCarousel.addEventListener("mouseenter", () => {
        stopAutoSlide();
      });

      testimonialsCarousel.addEventListener("mouseleave", () => {
        if (!isPaused) startAutoSlide();
      });

      // Initial setup
      updateCarousel();
      startAutoSlide();
    }
  }

  // --- 5. INFINITE SCROLLERS (FOR 'WHO WE ARE' & 'PARTNERS') ---
  // A reusable function to create a seamless, infinite scroll effect.
  const setupInfiniteScroller = (selector) => {
    const scroller = document.querySelector(selector);
    if (scroller) {
      const items = Array.from(scroller.children);
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', true); // Important for accessibility
        scroller.appendChild(clone);
      });
    }
  };

  setupInfiniteScroller(".who-images-slider");
  setupInfiniteScroller(".logo-track");


  // --- 6. ANIMATED NUMBER COUNTER ---
  // Animates numbers when the 'Impact Stats' section scrolls into view.
  const statsSection = document.querySelector("#impact-stats");
  if (statsSection) {
    const statNumbers = document.querySelectorAll(".stat-number");
    let hasAnimated = false; // Prevents re-animating on scroll

    const startCounter = (element) => {
      const targetText = element.textContent;
      const suffix = targetText.replace(/[\d.-]/g, "");
      const target = parseFloat(targetText);
      if (isNaN(target)) return;

      let current = 0;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      const hasDecimal = targetText.includes(".");

      const updateCount = () => {
        current += increment;
        if (current >= target) {
          element.textContent = targetText;
          return;
        }
        let displayValue = hasDecimal ? current.toFixed(1) : Math.floor(current);
        element.textContent = displayValue + suffix;
        setTimeout(updateCount, stepTime);
      };
      updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          statNumbers.forEach(startCounter);
          hasAnimated = true; // Set flag to true
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

  // --- 7. ADDITIONAL SMOOTHNESS: Preload images for smoother scrolling ---
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
  });

  // --- 8. GALLERY TABS FUNCTIONALITY ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Remove active class from all buttons and panes
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Add active class to clicked button and corresponding pane
      btn.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // --- 9. LIGHTBOX FUNCTIONALITY ---
  window.openLightbox = function (src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = src;
    lightbox.style.display = 'block';
    body.classList.add('no-scroll');
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    body.classList.remove('no-scroll');
  };

  // Close lightbox on outside click
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
      closeLightbox();
    }
  });

  // Close menu on link click (for mobile)
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('no-scroll');
      }
    });
  });

}); // Closes the DOMContentLoaded listener