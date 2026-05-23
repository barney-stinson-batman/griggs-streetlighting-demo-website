/* ===========================
   GRIGGS STREET LIGHTING
   script.js — Interactions & Animations
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. NAVBAR SCROLL ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── 2. HAMBURGER MENU ──────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── 3. LAMP GRID BACKGROUND ────────────────────────────────────
  const lampGrid = document.getElementById('lampGrid');
  if (lampGrid) {
    const cols = Math.ceil(window.innerWidth / 120) + 1;
    const rows = Math.ceil(window.innerHeight / 120) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lamp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        lamp.setAttribute('viewBox', '0 0 40 52');
        lamp.setAttribute('width', '40');
        lamp.setAttribute('height', '52');
        lamp.style.cssText = `
          position: absolute;
          left: ${c * 120 + (r % 2) * 60}px;
          top:  ${r * 120}px;
        `;

        lamp.innerHTML = `
          <circle cx="20" cy="12" r="8" stroke="white" stroke-width="1" fill="none"/>
          <line x1="20" y1="20" x2="20" y2="44" stroke="white" stroke-width="1"/>
          <line x1="12" y1="44" x2="28" y2="44" stroke="white" stroke-width="1"/>
        `;

        lampGrid.appendChild(lamp);
      }
    }
  }

  // ─── 4. SCROLL REVEAL ───────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.service-card, .breakdown-card, .feature-item, .value-card, .who-card, ' +
    '.process-step, .story-stat-card, .contact-item, .area-tag, .trust-item'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Also reveal section headers
  document.querySelectorAll('.section-header, .detail-intro-text, .why-content, .story-text, .cert-text').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ─── 5. COUNTER ANIMATION ───────────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const dur    = 1800;
          const step   = 16;
          const inc    = target / (dur / step);
          let current  = 0;

          const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.round(current);
          }, step);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ─── 6. CONTACT FORM ────────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError    = document.getElementById('nameError');
    const emailError   = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const submitBtn    = document.getElementById('submitBtn');
    const btnText      = document.getElementById('btnText');
    const btnLoading   = document.getElementById('btnLoading');
    const formSuccess  = document.getElementById('formSuccess');

    const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const showError = (el, msg) => { if (el) el.textContent = msg; };
    const clearError = (el)   => { if (el) el.textContent = ''; };

    // Live validation
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        nameInput.value.trim().length < 2
          ? showError(nameError, 'Please enter your name')
          : clearError(nameError);
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        !validateEmail(emailInput.value.trim())
          ? showError(emailError, 'Please enter a valid email address')
          : clearError(emailError);
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        messageInput.value.trim().length < 10
          ? showError(messageError, 'Please enter a message (at least 10 characters)')
          : clearError(messageError);
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validate
      if (!nameInput || nameInput.value.trim().length < 2) {
        showError(nameError, 'Please enter your name');
        valid = false;
      } else { clearError(nameError); }

      if (!emailInput || !validateEmail(emailInput.value.trim())) {
        showError(emailError, 'Please enter a valid email address');
        valid = false;
      } else { clearError(emailError); }

      if (!messageInput || messageInput.value.trim().length < 10) {
        showError(messageError, 'Please enter a message (at least 10 characters)');
        valid = false;
      } else { clearError(messageError); }

      if (!valid) return;

      // Simulate submission
      if (btnText)    btnText.style.display    = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';
      if (submitBtn)  submitBtn.disabled        = true;

      setTimeout(() => {
        form.style.display        = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }, 1600);
    });
  }

  // ─── 7. ACTIVE NAV LINK ─────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // ─── 8. SMOOTH HOVER UNDERLINE on service cards ─────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.cursor = 'pointer';
    });
  });

  // ─── 9. GOLD ACCENT on section tags (staggered fade-in) ─────────
  document.querySelectorAll('.section-tag').forEach((tag, i) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(8px)';
    tag.style.transition = 'opacity 0.5s, transform 0.5s';
    tag.style.transitionDelay = `${i * 0.05}s`;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        tag.style.opacity = '1';
        tag.style.transform = 'translateY(0)';
        obs.disconnect();
      }
    }, { threshold: 0.2 });

    obs.observe(tag);
  });

  // ─── 10. PAGE TRANSITION ────────────────────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';

  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // Fade out on internal link clicks
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('tel:') &&
        !href.startsWith('mailto:') && !href.startsWith('http')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 350);
      });
    }
  });

});
