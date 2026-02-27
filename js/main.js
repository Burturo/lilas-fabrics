/* ============================================
   LILA'S FABRICS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ===== LOADER =====
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.getElementById('loader').classList.add('hidden');
    }, 2500);
  });


  // ===== NAVBAR SCROLL EFFECT =====
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });


  // ===== HAMBURGER MENU =====
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  window.closeMobile = function () {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };


  // ===== SCROLL REVEAL ANIMATIONS =====
  var revealElements = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });


  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ===== COUNTER ANIMATION =====
  var statNum = document.querySelector('.about-stat-num');
  if (statNum) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var current = 0;
          var target = 200;
          var interval = setInterval(function () {
            current += 4;
            if (current >= target) {
              statNum.textContent = '200+';
              clearInterval(interval);
            } else {
              statNum.textContent = current + '+';
            }
          }, 20);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(statNum);
  }


  // ===== PRODUCT FILTER + RESPONSIVE PAGINATION =====
  (function () {
    var grid = document.getElementById('productsGrid');
    var paginationEl = document.getElementById('productsPagination');
    var tabs = document.querySelectorAll('.products-tab');
    var allCards = Array.prototype.slice.call(grid.querySelectorAll('.product-card[data-category]'));

    var currentFilter = 'all';
    var currentPage = 1;

    // Items per page: desktop=8 (2 rows x 4), tablet=6 (3 rows x 2), mobile=4 (2 rows x 2)
    function getPerPage() {
      var w = window.innerWidth;
      if (w <= 768) return 4;
      if (w <= 1024) return 6;
      return 8;
    }

    function getFiltered() {
      if (currentFilter === 'all') return allCards;
      return allCards.filter(function (c) {
        return c.getAttribute('data-category') === currentFilter;
      });
    }

    function getTotalPages() {
      return Math.max(1, Math.ceil(getFiltered().length / getPerPage()));
    }

    // Main render
    function render() {
      var filtered = getFiltered();
      var perPage = getPerPage();
      var totalPages = getTotalPages();
      if (currentPage > totalPages) currentPage = totalPages;

      var start = (currentPage - 1) * perPage;
      var end = start + perPage;
      var pageItems = filtered.slice(start, end);

      // Hide all
      allCards.forEach(function (card) {
        card.style.display = 'none';
        card.classList.remove('filter-show', 'filter-hide');
      });

      // Stagger reveal visible
      pageItems.forEach(function (card, i) {
        card.style.display = '';
        card.classList.add('filter-hide');
        setTimeout(function () {
          card.classList.remove('filter-hide');
          card.classList.add('filter-show');
        }, i * 70);
      });

      buildPagination(filtered.length, totalPages);
    }

    // Build pagination buttons
    function buildPagination(total, totalPages) {
      paginationEl.innerHTML = '';
      if (totalPages <= 1) return;

      // Prev
      var prev = document.createElement('button');
      prev.className = 'page-btn arrow' + (currentPage <= 1 ? ' disabled' : '');
      prev.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
      prev.addEventListener('click', function () {
        if (currentPage > 1) { currentPage--; render(); scrollToProducts(); }
      });
      paginationEl.appendChild(prev);

      // Page numbers
      for (var i = 1; i <= totalPages; i++) {
        (function (p) {
          var btn = document.createElement('button');
          btn.className = 'page-btn' + (p === currentPage ? ' active' : '');
          btn.textContent = p;
          btn.addEventListener('click', function () {
            currentPage = p; render(); scrollToProducts();
          });
          paginationEl.appendChild(btn);
        })(i);
      }

      // Next
      var next = document.createElement('button');
      next.className = 'page-btn arrow' + (currentPage >= totalPages ? ' disabled' : '');
      next.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
      next.addEventListener('click', function () {
        if (currentPage < totalPages) { currentPage++; render(); scrollToProducts(); }
      });
      paginationEl.appendChild(next);

      // Counter text
      var perPage = getPerPage();
      var s = (currentPage - 1) * perPage + 1;
      var e = Math.min(currentPage * perPage, total);
      var info = document.createElement('span');
      info.className = 'page-info';
      info.textContent = s + '–' + e + ' sur ' + total + ' tissus';
      paginationEl.appendChild(info);
    }

    function scrollToProducts() {
      var hdr = document.querySelector('.products-header');
      if (hdr) {
        var y = hdr.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }

    // Tab clicks
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentFilter = tab.getAttribute('data-filter');
        currentPage = 1;
        render();
      });
    });

    // Re-render on resize
    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { render(); }, 250);
    });

    // Go!
    render();
  })();


  // ===== WISHLIST HEART TOGGLE =====
  var wishlists = document.querySelectorAll('.product-wishlist');
  wishlists.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var span = this.querySelector('span');
      if (span.textContent === '♡') {
        span.textContent = '♥';
        this.style.background = 'var(--rose)';
        span.style.color = 'white';
      } else {
        span.textContent = '♡';
        this.style.background = 'white';
        span.style.color = '';
      }
    });
  });


  // ===== MODELS HORIZONTAL SLIDER =====
  var modelsTrack = document.getElementById('modelsTrack');
  var modelsSlider = document.getElementById('modelsSlider');
  var prevBtn = document.getElementById('modelsPrev');
  var nextBtn = document.getElementById('modelsNext');
  var dotsContainer = document.getElementById('modelsDots');

  if (modelsTrack && modelsSlider) {
    var modelCards = modelsTrack.querySelectorAll('.model-card');
    var currentIndex = 0;
    var cardGap = 24; // 1.5rem
    var autoPlayTimer = null;
    var isDragging = false;
    var startX = 0;
    var scrollStart = 0;

    // Calculate how many cards visible at once
    function getVisibleCount() {
      var sliderW = modelsSlider.offsetWidth;
      var cardW = modelCards[0].offsetWidth + cardGap;
      return Math.max(1, Math.floor(sliderW / cardW));
    }

    function getMaxIndex() {
      return Math.max(0, modelCards.length - getVisibleCount());
    }

    // Build dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      var total = getMaxIndex() + 1;
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.className = 'models-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function () {
          goToSlide(parseInt(this.getAttribute('data-index')));
        });
        dotsContainer.appendChild(dot);
      }
    }

    // Update dots
    function updateDots() {
      var dots = dotsContainer.querySelectorAll('.models-dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    // Update button states
    function updateButtons() {
      prevBtn.classList.toggle('disabled', currentIndex <= 0);
      nextBtn.classList.toggle('disabled', currentIndex >= getMaxIndex());
    }

    // Go to slide
    function goToSlide(index) {
      var maxIdx = getMaxIndex();
      currentIndex = Math.max(0, Math.min(index, maxIdx));
      var cardW = modelCards[0].offsetWidth + cardGap;
      var offset = currentIndex * cardW;
      modelsTrack.style.transform = 'translateX(-' + offset + 'px)';
      updateDots();
      updateButtons();
    }

    // Button clicks
    prevBtn.addEventListener('click', function () {
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    });
    nextBtn.addEventListener('click', function () {
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });

    // Drag / swipe support
    modelsTrack.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX;
      modelsTrack.classList.add('grabbing');
      modelsTrack.style.transition = 'none';
    });
    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
    });
    document.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      modelsTrack.classList.remove('grabbing');
      modelsTrack.style.transition = '';
      var diff = e.pageX - startX;
      if (Math.abs(diff) > 60) {
        if (diff < 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
        resetAutoPlay();
      }
    });

    // Touch support
    modelsTrack.addEventListener('touchstart', function (e) {
      startX = e.touches[0].pageX;
      modelsTrack.style.transition = 'none';
    }, { passive: true });
    modelsTrack.addEventListener('touchend', function (e) {
      modelsTrack.style.transition = '';
      var diff = e.changedTouches[0].pageX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
        resetAutoPlay();
      }
    });

    // Auto play
    function startAutoPlay() {
      autoPlayTimer = setInterval(function () {
        if (currentIndex >= getMaxIndex()) {
          goToSlide(0);
        } else {
          goToSlide(currentIndex + 1);
        }
      }, 4500);
    }
    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Pause on hover
    modelsSlider.addEventListener('mouseenter', function () {
      clearInterval(autoPlayTimer);
    });
    modelsSlider.addEventListener('mouseleave', function () {
      startAutoPlay();
    });

    // Keyboard arrows when section is visible
    document.addEventListener('keydown', function (e) {
      var rect = modelsSlider.getBoundingClientRect();
      var inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') { goToSlide(currentIndex - 1); resetAutoPlay(); }
      if (e.key === 'ArrowRight') { goToSlide(currentIndex + 1); resetAutoPlay(); }
    });

    // Init
    buildDots();
    updateButtons();
    startAutoPlay();

    // Rebuild dots on resize
    window.addEventListener('resize', function () {
      buildDots();
      goToSlide(Math.min(currentIndex, getMaxIndex()));
    });
  }

});
