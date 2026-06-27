/* ═══════════════════════════════════════════════════════════
   Camp Doodle — Site Script
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const D = window.CD; // data from data.js

  /* ─── Utility ─────────────────────────────────────────── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

  /* ─── Image Fallback Helper ───────────────────────────── */
  function imgWithFallback(src, alt, cls) {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = alt || '';
    if (cls) img.className = cls;
    img.onerror = function () { this.style.display = 'none'; };
    img.src = src;
    return img;
  }

  function photoPlaceholder(path, label) {
    const div = document.createElement('div');
    div.className = 'photo-ph';
    div.innerHTML = `
      <div class="photo-ph-icon">📷</div>
      <div>${label || 'Photo coming soon'}</div>
      <small>${path || ''}</small>`;
    return div;
  }

  function statusLabel(status) {
    const map = { available: 'Available', reserved: 'Reserved', pending: 'Pending', keeper: 'Possible Keeper' };
    return map[status] || status;
  }

  /* ═══════════════════════════════════════════════════════
     CUSTOM CURSOR
     ═══════════════════════════════════════════════════════ */
  (function initCursor() {
    const dot  = qs('.cursor-dot');
    const ring = qs('.cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function animateRing() {
      rx += (mx - rx) * .14;
      ry += (my - ry) * .14;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });

    document.addEventListener('mouseover', e => {
      const t = e.target.closest('a, button, [role="button"], .puppy-card, .parent-card, .reel-card, .quiz-option');
      ring.classList.toggle('hovered', !!t);
    });
  })();

  /* ═══════════════════════════════════════════════════════
     SCROLL REVEAL
     ═══════════════════════════════════════════════════════ */
  (function initReveal() {
    const els = qsa('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  })();

  /* ═══════════════════════════════════════════════════════
     HEADER SCROLL STATE
     ═══════════════════════════════════════════════════════ */
  (function initHeader() {
    const h = qs('.site-header');
    if (!h) return;
    window.addEventListener('scroll', () => {
      h.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  })();

  /* ═══════════════════════════════════════════════════════
     MOBILE MENU
     ═══════════════════════════════════════════════════════ */
  (function initMobileMenu() {
    const burger   = qs('#hamburger');
    const menu     = qs('#mobile-menu');
    const close    = qs('#mobile-menu-close');
    const backdrop = qs('#mobile-menu-backdrop');
    if (!burger || !menu) return;

    function open() {
      menu.classList.add('open');
      menu.removeAttribute('aria-hidden');
      backdrop.classList.add('active');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    burger.addEventListener('click', open);
    close.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);

    // Close on nav link click
    qsa('a', menu).forEach(a => a.addEventListener('click', closeMenu));

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  })();

  /* ═══════════════════════════════════════════════════════
     MAGNETIC BUTTONS
     ═══════════════════════════════════════════════════════ */
  (function initMagnetic() {
    qsa('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  })();

  /* ═══════════════════════════════════════════════════════
     BACK TO TOP
     ═══════════════════════════════════════════════════════ */
  (function initBackToTop() {
    const btn = qs('#back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  /* ═══════════════════════════════════════════════════════
     STICKY MOBILE CTA
     ═══════════════════════════════════════════════════════ */
  (function initStickyCTA() {
    const el = qs('#sticky-cta');
    if (!el) return;
    const contact = qs('#contact');
    if (!contact) return;

    el.removeAttribute('aria-hidden');

    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0.5 });
    io.observe(contact);
  })();

  /* ═══════════════════════════════════════════════════════
     RENDER PUPPIES
     ═══════════════════════════════════════════════════════ */
  (function initPuppies() {
    const grid = qs('#puppy-grid');
    if (!grid || !D) return;

    function buildCard(puppy) {
      const card = document.createElement('article');
      card.className = 'puppy-card reveal';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View ${puppy.name} profile`);
      card.dataset.status = puppy.status;
      card.dataset.id = puppy.id;

      // Photo area
      const photoDiv = document.createElement('div');
      photoDiv.className = 'card-photo';

      const img = document.createElement('img');
      img.src = puppy.photo;
      img.alt = puppy.photoAlt || puppy.name;
      img.loading = 'lazy';
      if (puppy.photoPosition) img.style.objectPosition = puppy.photoPosition;
      img.onerror = function () { this.style.display = 'none'; };
      photoDiv.appendChild(img);

      // Placeholder (shown if image fails)
      photoDiv.appendChild(photoPlaceholder(puppy.photo, puppy.name));

      // Status badge
      const badge = document.createElement('span');
      badge.className = `status-badge ${puppy.status}`;
      badge.textContent = statusLabel(puppy.status);
      photoDiv.appendChild(badge);

      // Video overlay (if video exists)
      if (puppy.video) {
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.innerHTML = '<div class="play-icon" aria-hidden="true">▶</div>';
        photoDiv.appendChild(overlay);
      }

      card.appendChild(photoDiv);

      // Body
      const body = document.createElement('div');
      body.className = 'card-body';

      const bornLine = puppy.birthTime
        ? `${puppy.born} at ${puppy.birthTime}`
        : puppy.born;

      const idBadge = puppy.puppyId
        ? `<span class="puppy-id-badge">ID ${puppy.puppyId}</span>`
        : '';

      const vaccineBadge = puppy.vaccineDate
        ? `<div class="vaccine-badge" role="note">
            <span class="vaccine-badge-icon" aria-hidden="true">✓</span>
            First 5-way puppy vaccine given ${puppy.vaccineDate}
          </div>`
        : '';

      const readyLine = puppy.readyDate
        ? `<span><strong>Ready:</strong> ${puppy.readyDate}</span>`
        : '';

      body.innerHTML = `
        <div class="card-meta">
          <span class="card-name">${puppy.name}</span>
          ${idBadge}
        </div>
        <div class="card-sex-row">
          <span class="card-sex">${puppy.sex}</span>
          <span class="card-breed">${puppy.breed}</span>
        </div>
        <div class="card-info">
          <span><strong>Born:</strong> ${bornLine}</span>
          <span><strong>Coat:</strong> ${puppy.coat}</span>
          ${readyLine}
          ${puppy.weight ? `<span><strong>Weight:</strong> ${puppy.weight}</span>` : ''}
        </div>
        <p class="card-personality">${puppy.personality}</p>
        ${vaccineBadge}
        <div class="card-cta">
          <button class="button primary" data-action="view" aria-label="View full profile for ${puppy.name}">
            View Profile
          </button>
          <a class="button secondary" href="#contact" aria-label="Ask about ${puppy.name}">
            Ask About This Puppy
          </a>
        </div>`;

      card.appendChild(body);

      // Open modal on click / enter
      function openModal() { renderModal(puppy); }
      card.addEventListener('click', e => {
        if (!e.target.closest('a[href]')) openModal();
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
      });

      return card;
    }

    function renderPuppies(filter) {
      grid.innerHTML = '';
      const filtered = filter === 'all'
        ? D.puppies
        : D.puppies.filter(p => p.status === filter);

      if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:var(--muted);padding:1rem 0">No puppies match this filter right now.</p>';
        return;
      }

      filtered.forEach((p, i) => {
        const card = buildCard(p);
        card.style.setProperty('--delay', `${i * 0.07}s`);
        grid.appendChild(card);
      });

      // Re-observe new cards for reveal
      qsa('.puppy-card.reveal', grid).forEach(el => {
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
          });
        }, { threshold: 0.08 });
        io.observe(el);
      });
    }

    // Filter buttons
    qsa('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        qsa('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPuppies(btn.dataset.filter);
      });
    });

    renderPuppies('all');
  })();

  /* ═══════════════════════════════════════════════════════
     PUPPY MODAL
     ═══════════════════════════════════════════════════════ */
  let galleryIndex = 0;
  let galleryPhotos = [];

  function renderModal(puppy) {
    const overlay = qs('#puppy-modal');
    const body    = qs('#modal-body');
    if (!overlay || !body) return;

    galleryPhotos = puppy.photos && puppy.photos.length ? puppy.photos : [puppy.photo];
    galleryIndex = 0;

    const thumbsHtml = galleryPhotos.length > 1
      ? `<div class="modal-gallery-thumbs">${galleryPhotos.map((_, i) =>
          `<button class="gallery-thumb${i === 0 ? ' active' : ''}" aria-label="Photo ${i + 1}" data-idx="${i}"></button>`
        ).join('')}</div>`
      : '';

    const videoHtml = puppy.video
      ? `<div style="margin-top:.5rem">
          <video controls muted playsinline style="width:100%;border-radius:8px;max-height:220px;"
                 poster="${puppy.photo}" aria-label="${puppy.name} video">
            <source src="${puppy.video}" type="video/mp4">
          </video>
         </div>`
      : '';

    body.innerHTML = `
      <div class="modal-gallery">
        ${galleryPhotos.map((src, i) =>
          `<img src="${src}" alt="${puppy.name} photo ${i+1}" class="${i===0?'active':''}" loading="lazy"
                onerror="this.style.display='none'">`
        ).join('')}
        <div class="photo-ph" style="${galleryPhotos.length?'display:none':''}">
          <div class="photo-ph-icon">📷</div>
          <div>Photo coming soon</div>
          <small>${puppy.photo}</small>
        </div>
        ${thumbsHtml}
      </div>
      <div class="modal-info">
        <div class="modal-header">
          <h2 class="modal-title" id="modal-title">${puppy.name}</h2>
          <span class="status-badge ${puppy.status}" style="position:static">${statusLabel(puppy.status)}</span>
        </div>
        <dl class="modal-details">
          <div class="modal-detail-row"><dt>Sex</dt><dd>${puppy.sex}</dd></div>
          <div class="modal-detail-row"><dt>Breed</dt><dd>${puppy.breed}</dd></div>
          <div class="modal-detail-row"><dt>Coat</dt><dd>${puppy.coat}</dd></div>
          <div class="modal-detail-row"><dt>Born</dt><dd>${puppy.birthTime ? `${puppy.born} at ${puppy.birthTime}` : puppy.born}</dd></div>
          ${puppy.weight ? `<div class="modal-detail-row"><dt>Weight</dt><dd>${puppy.weight}</dd></div>` : ''}
          ${puppy.readyDate ? `<div class="modal-detail-row"><dt>Ready</dt><dd>${puppy.readyDate}</dd></div>` : ''}
          ${puppy.puppyId ? `<div class="modal-detail-row"><dt>Puppy ID</dt><dd>${puppy.puppyId}</dd></div>` : ''}
        </dl>
        ${puppy.vaccineDate ? `<div class="modal-vaccine-badge" role="note"><span aria-hidden="true">✓</span> First 5-way puppy vaccine given ${puppy.vaccineDate}. Next booster due ${puppy.nextBooster}. Ready for homes at 8 weeks.</div>` : ''}
        <p class="modal-personality">${puppy.personality}</p>
        ${videoHtml}
        <div class="modal-actions">
          <a class="button primary" href="#contact" onclick="closeModal()">
            Ask About ${puppy.name}
          </a>
          <button class="button secondary" onclick="closeModal()">← Back to Puppies</button>
        </div>
      </div>`;

    // Gallery navigation
    if (galleryPhotos.length > 1) {
      qsa('.gallery-thumb', body).forEach(btn => {
        btn.addEventListener('click', () => {
          galleryIndex = parseInt(btn.dataset.idx, 10);
          updateGallery(body);
        });
      });

      // Swipe support
      let touchStartX = 0;
      qs('.modal-gallery', body).addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      qs('.modal-gallery', body).addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          galleryIndex = diff > 0
            ? Math.min(galleryIndex + 1, galleryPhotos.length - 1)
            : Math.max(galleryIndex - 1, 0);
          updateGallery(body);
        }
      }, { passive: true });
    }

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    qs('#modal-close').focus();
  }

  function updateGallery(ctx) {
    qsa('.modal-gallery img', ctx).forEach((img, i) => {
      img.classList.toggle('active', i === galleryIndex);
    });
    qsa('.gallery-thumb', ctx).forEach((btn, i) => {
      btn.classList.toggle('active', i === galleryIndex);
    });
  }

  function closeModal() {
    const overlay = qs('#puppy-modal');
    if (!overlay) return;
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  window.closeModal = closeModal;

  (function initModal() {
    const overlay = qs('#puppy-modal');
    const closeBtn = qs('#modal-close');
    if (!overlay) return;

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
    });
  })();

  /* ═══════════════════════════════════════════════════════
     RENDER PARENTS
     ═══════════════════════════════════════════════════════ */
  (function initParents() {
    const grid = qs('#parents-grid');
    if (!grid || !D) return;

    D.parents.forEach((parent, i) => {
      const card = document.createElement('article');
      card.className = 'parent-card reveal';
      card.style.setProperty('--delay', `${i * 0.1}s`);

      card.innerHTML = `
        <div class="parent-photo">
          <img src="${parent.photo}" alt="${parent.name}" loading="lazy" onerror="this.style.display='none'">
          <div class="photo-ph" style="position:absolute;inset:0">
            <div class="photo-ph-icon">📷</div>
            <small>${parent.photo}</small>
          </div>
          <span class="parent-badge">${parent.badge}</span>
        </div>
        <div class="parent-body">
          <div class="parent-header">
            <h3 class="parent-name">${parent.name}</h3>
            <span class="parent-role">${parent.role}</span>
          </div>
          <p class="parent-story">${parent.story}</p>
          <div class="parent-traits">
            ${parent.traits.map(t => `<span class="trait-tag">${t}</span>`).join('')}
          </div>
        </div>`;

      // Hide fallback placeholder if real image loads
      const img = qs('img', card);
      const ph  = qs('.photo-ph', qs('.parent-photo', card));
      img.addEventListener('load', () => { if (ph) ph.style.display = 'none'; });

      grid.appendChild(card);
    });

    // Re-observe
    qsa('.parent-card.reveal', grid).forEach(el => {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      io.observe(el);
    });
  })();

  /* ═══════════════════════════════════════════════════════
     RENDER JOURNEY
     ═══════════════════════════════════════════════════════ */
  (function initJourney() {
    const track = qs('#journey-track');
    if (!track || !D) return;

    D.journey.forEach((step, i) => {
      const el = document.createElement('div');
      el.className = 'journey-step reveal';
      el.style.setProperty('--delay', `${i * 0.09}s`);
      el.innerHTML = `
        <div class="journey-dot" aria-hidden="true">${step.icon}</div>
        <div class="journey-content">
          <p class="journey-date">${step.date}</p>
          <h3>${step.label}</h3>
          <p>${step.note}</p>
        </div>`;
      track.appendChild(el);
    });

    // Re-observe journey steps
    qsa('.journey-step.reveal', track).forEach(el => {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.15 });
      io.observe(el);
    });
  })();

  /* ═══════════════════════════════════════════════════════
     RENDER REELS
     ═══════════════════════════════════════════════════════ */
  (function initReels() {
    const grid = qs('#reels-grid');
    if (!grid || !D) return;

    D.reels.forEach((reel, i) => {
      const card = document.createElement('div');
      card.className = 'reel-card reveal';
      card.style.setProperty('--delay', `${i * 0.08}s`);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Play: ${reel.caption}`);

      card.innerHTML = `
        <video class="reel-video" muted loop playsinline preload="none"
               poster="${reel.poster}" aria-label="${reel.caption}">
          <source src="${reel.video}" type="video/mp4">
        </video>
        <img class="reel-poster" src="${reel.poster}" alt="" loading="lazy" aria-hidden="true"
             onerror="this.style.display='none'">
        <div class="reel-ph">
          <div class="reel-ph-icon">🎬</div>
          <div>${reel.caption}</div>
          <small>${reel.video}</small>
        </div>
        <div class="reel-gradient" aria-hidden="true"></div>
        <div class="reel-play-btn" aria-hidden="true">▶</div>
        <p class="reel-caption">${reel.caption}</p>`;

      const video = qs('video', card);
      const poster = qs('.reel-poster', card);

      // Show placeholder only if poster fails
      const ph = qs('.reel-ph', card);
      if (poster) {
        poster.addEventListener('load', () => { ph.style.display = 'none'; });
      }

      function playReel() {
        // Pause all other reels
        qsa('.reel-card.playing').forEach(c => {
          if (c !== card) {
            const v = qs('video', c);
            v.pause(); v.currentTime = 0;
            c.classList.remove('playing');
          }
        });
        card.classList.add('playing');
        video.play().catch(() => {});
      }

      card.addEventListener('click', playReel);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playReel(); }
      });

      video.addEventListener('pause', () => card.classList.remove('playing'));

      grid.appendChild(card);
    });

    // Re-observe
    qsa('.reel-card.reveal', grid).forEach(el => {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      io.observe(el);
    });
  })();

  /* ═══════════════════════════════════════════════════════
     PUPPY MATCH QUIZ
     ═══════════════════════════════════════════════════════ */
  (function initQuiz() {
    const container = qs('#quiz-card');
    if (!container || !D) return;

    const questions = [
      {
        id: 'kids',
        text: 'Do you have children at home?',
        options: [
          { label: 'Yes — young kids (under 8)', icon: '👶', tags: ['gentle', 'patient', 'easygoing'] },
          { label: 'Yes — older kids', icon: '🧒', tags: ['playful', 'active', 'social'] },
          { label: 'No children', icon: '🏡', tags: ['companion', 'calm', 'any'] },
        ],
      },
      {
        id: 'energy',
        text: 'Would you prefer calm and cuddly, or playful and adventurous?',
        options: [
          { label: 'Calm and cuddly', icon: '🛋️', tags: ['calm', 'affectionate', 'companion'] },
          { label: 'Playful and adventurous', icon: '🏃', tags: ['playful', 'active', 'energetic', 'curious'] },
          { label: 'A great mix of both', icon: '⚖️', tags: ['easygoing', 'balanced', 'social'] },
        ],
      },
      {
        id: 'yard',
        text: 'Do you have a yard or outdoor space?',
        options: [
          { label: 'Yes — a big yard', icon: '🌳', tags: ['active', 'playful', 'energetic'] },
          { label: 'Yes — a small yard or patio', icon: '🌿', tags: ['easygoing', 'balanced'] },
          { label: 'No yard (apartment / condo)', icon: '🏢', tags: ['calm', 'companion', 'gentle', 'affectionate'] },
        ],
      },
      {
        id: 'experience',
        text: 'Is this your first dog?',
        options: [
          { label: 'Yes, first dog', icon: '🐾', tags: ['gentle', 'easygoing', 'patient'] },
          { label: 'No — we have experience', icon: '🐕', tags: ['any'] },
        ],
      },
      {
        id: 'sex',
        text: 'Do you have a preference on sex?',
        options: [
          { label: 'Male', icon: '💙', sexPref: 'Male' },
          { label: 'Female', icon: '💗', sexPref: 'Female' },
          { label: 'No preference', icon: '💚', sexPref: null },
        ],
      },
    ];

    let step = 0;
    const answers = []; // [{ tags: [...], sexPref: null|'Male'|'Female' }]

    function scorePuppies() {
      const allTags = answers.flatMap(a => a.tags || []);
      const sexPref = answers.find(a => a.sexPref !== undefined)?.sexPref || null;

      return D.puppies.map(p => {
        let score = 0;
        if (sexPref && p.sex === sexPref) score += 4;
        if (!sexPref) score += 1;
        allTags.forEach(tag => {
          if (tag === 'any') score += 1;
          else if (p.tags && p.tags.includes(tag)) score += 2;
        });
        if (p.status === 'available') score += 3;
        return { ...p, score };
      }).sort((a, b) => b.score - a.score);
    }

    function renderStep() {
      if (step >= questions.length) {
        renderResults();
        return;
      }

      const q = questions[step];
      const pct = Math.round((step / questions.length) * 100);

      container.innerHTML = `
        <div class="quiz-progress">
          <div class="quiz-progress-bar" role="progressbar" aria-valuenow="${step}" aria-valuemax="${questions.length}" aria-label="Quiz progress">
            <div class="quiz-progress-fill" style="width:${pct}%"></div>
          </div>
          <span class="quiz-progress-label">Step ${step + 1} of ${questions.length}</span>
        </div>
        <p class="quiz-question">${q.text}</p>
        <div class="quiz-options" role="radiogroup" aria-label="${q.text}">
          ${q.options.map((opt, i) => `
            <button class="quiz-option" data-idx="${i}" role="radio" aria-checked="false">
              <span class="quiz-option-icon" aria-hidden="true">${opt.icon}</span>
              <span>${opt.label}</span>
            </button>`).join('')}
        </div>
        <div class="quiz-nav">
          ${step > 0 ? '<button class="quiz-restart" id="quiz-back">← Back</button>' : '<span></span>'}
          ${step > 0 ? `<button class="button secondary" id="quiz-next" disabled>Next →</button>` : '<span></span>'}
        </div>`;

      // Option selection
      let selected = null;
      qsa('.quiz-option', container).forEach((btn, i) => {
        btn.addEventListener('click', () => {
          qsa('.quiz-option', container).forEach(b => {
            b.classList.remove('selected');
            b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('selected');
          btn.setAttribute('aria-checked', 'true');
          selected = i;

          const nextBtn = qs('#quiz-next', container);
          if (nextBtn) nextBtn.disabled = false;

          // Auto-advance on last question if no next button logic needed
          if (step === 0) {
            setTimeout(() => advance(selected), 300);
          }
        });
      });

      const nextBtn = qs('#quiz-next', container);
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (selected !== null) advance(selected);
        });
      }

      const backBtn = qs('#quiz-back', container);
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          step--;
          answers.pop();
          renderStep();
        });
      }
    }

    function advance(optIdx) {
      const q = questions[step];
      const opt = q.options[optIdx];
      answers[step] = { tags: opt.tags || [], sexPref: opt.sexPref };
      step++;
      renderStep();
    }

    function renderResults() {
      const ranked = scorePuppies();
      const top = ranked.slice(0, 3);

      container.innerHTML = `
        <div class="quiz-results-header">
          <h3>Here are your best matches 🐾</h3>
          <p>Based on your answers, these puppies may be a great fit for your family.</p>
        </div>
        <div class="quiz-matches">
          ${top.map(p => `
            <div class="quiz-match-card" data-id="${p.id}" role="button" tabindex="0"
                 aria-label="View ${p.name} profile">
              <div class="quiz-match-photo">
                <img src="${p.photo}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
              </div>
              <div class="quiz-match-body">
                <p class="quiz-match-name">${p.name}</p>
                <p class="quiz-match-status">${statusLabel(p.status)}</p>
                <p style="font-size:.8rem;color:var(--muted);margin-top:.25rem">${p.breed} · ${p.sex}</p>
              </div>
            </div>`).join('')}
        </div>
        <div class="quiz-nav">
          <button class="quiz-restart" id="quiz-restart">Start over</button>
          <a class="button primary" href="#contact">Ask About a Puppy</a>
        </div>`;

      // Click match card → open puppy modal
      qsa('.quiz-match-card', container).forEach(card => {
        const fn = () => {
          const puppy = D.puppies.find(p => p.id === card.dataset.id);
          if (puppy) renderModal(puppy);
        };
        card.addEventListener('click', fn);
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
        });
      });

      qs('#quiz-restart', container).addEventListener('click', () => {
        step = 0;
        answers.length = 0;
        renderStep();
      });
    }

    renderStep();
  })();

  /* ═══════════════════════════════════════════════════════
     HERO VIDEO FALLBACK
     Hides the video element if mp4 can't be loaded,
     letting the poster/img show through cleanly.
     ═══════════════════════════════════════════════════════ */
  (function initHeroVideo() {
    const video = qs('.hero-video');
    if (!video) return;
    video.addEventListener('error', () => { video.style.display = 'none'; });

    // If video has no loadable source, hide it
    if (!video.src && video.querySelectorAll('source').length === 0) {
      video.style.display = 'none';
    }
  })();

  /* ═══════════════════════════════════════════════════════
     SMOOTH ANCHOR NAV (offset for sticky header)
     ═══════════════════════════════════════════════════════ */
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const headerH = (qs('.site-header') || { offsetHeight: 68 }).offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  /* ═══════════════════════════════════════════════════════
     CONTACT: prefill "interested in" from puppy card
     ═══════════════════════════════════════════════════════ */
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href="#contact"]');
    if (!link) return;
    const card = link.closest('[data-id]');
    if (!card) return;
    const puppy = D && D.puppies.find(p => p.id === card.dataset.id);
    if (!puppy) return;
    const sel = qs('#puppy');
    if (!sel) return;
    for (const opt of sel.options) {
      if (opt.text.toLowerCase().includes(puppy.name.toLowerCase())) {
        sel.value = opt.value;
        break;
      }
    }
  });

})();
