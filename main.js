document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    //  MOBILE MENU — fully functional branded drawer
    // ============================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.querySelector('.navbar');

    // Build the mobile drawer once and insert into body
    function buildMobileDrawer() {
        if (document.getElementById('mobileDrawer')) return;

        // Collect nav links from the desktop <ul class="nav-links">
        const desktopLinks = document.querySelector('.nav-links');
        const navActions = document.querySelector('.nav-actions');

        const drawer = document.createElement('div');
        drawer.id = 'mobileDrawer';
        drawer.setAttribute('aria-hidden', 'true');
        drawer.innerHTML = `
            <div class="drawer-overlay" id="drawerOverlay"></div>
            <div class="drawer-panel" id="drawerPanel">
                <div class="drawer-header">
                    <a href="index.html" class="drawer-logo" style="display: flex; align-items: center; gap: 8px; text-decoration: none;">
                        <img src="imges/NIM logo.png" alt="NIM Logo" style="height: 52px; width: auto; border-radius: 6px; object-fit: contain;">
                    </a>
                    <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <nav class="drawer-nav">
                    ${desktopLinks ? desktopLinks.innerHTML : ''}
                </nav>
                <div class="drawer-actions">
                    ${navActions ? navActions.innerHTML : ''}
                </div>
                <div class="drawer-footer">
                    <span>© 2026 NIM School Management</span>
                </div>
            </div>
        `;
        document.body.appendChild(drawer);

        // Close events
        document.getElementById('drawerOverlay').addEventListener('click', closeMenu);
        document.getElementById('drawerCloseBtn').addEventListener('click', closeMenu);

        // Close when clicking any link inside drawer
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // small delay so page can start navigating
                setTimeout(closeMenu, 180);
            });
        });
    }

    function openMenu() {
        buildMobileDrawer();
        const drawer = document.getElementById('mobileDrawer');
        drawer.setAttribute('aria-hidden', 'false');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
        // animate hamburger → X
        mobileMenuBtn?.classList.add('menu-open');
    }

    function closeMenu() {
        const drawer = document.getElementById('mobileDrawer');
        if (!drawer) return;
        drawer.setAttribute('aria-hidden', 'true');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
        mobileMenuBtn?.classList.remove('menu-open');
    }

    mobileMenuBtn?.addEventListener('click', () => {
        const drawer = document.getElementById('mobileDrawer');
        if (drawer && drawer.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // ============================================================
    //  NAVBAR SCROLL EFFECT
    // ============================================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // ============================================================
    //  SCROLL REVEAL ANIMATIONS
    // ============================================================
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .pricing-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // ============================================================
    //  SMOOTH SCROLL for anchor links
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ============================================================
    //  HERO CAROUSEL
    // ============================================================
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides.length === 0) return;
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Handle wrapping
        currentSlide = (index + slides.length) % slides.length;
        
        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Recreate Lucide icons for the new active slide content just in case
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlideShow() {
        stopSlideShow();
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlideShow(); // Reset timer on click
        });
    });

    // Start slider if we have slides
    if (slides.length > 0) {
        startSlideShow();
    }

    // ============================================================
    //  STATS COUNTER ANIMATION
    // ============================================================
    const statsSection = document.querySelector('.hero-stats');
    const counters = document.querySelectorAll('.counter');
    
    if (statsSection && counters.length > 0) {
        const countUp = (counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = counter.getAttribute('data-target').includes('.');
            const duration = 2000; // 2 seconds animation
            const frameRate = 1000 / 60; // 60 fps
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const animate = () => {
                frame++;
                const progress = frame / totalFrames;
                // Ease out quad
                const easeProgress = progress * (2 - progress);
                const currentValue = easeProgress * target;

                if (isDecimal) {
                    counter.textContent = currentValue.toFixed(1);
                } else {
                    counter.textContent = Math.floor(currentValue);
                }

                if (frame < totalFrames) {
                    requestAnimationFrame(animate);
                } else {
                    if (isDecimal) {
                        counter.textContent = target.toFixed(1);
                    } else {
                        counter.textContent = target;
                    }
                }
            };

            requestAnimationFrame(animate);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => countUp(counter));
                    statsObserver.unobserve(entry.target); // Run once
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }

    // ============================================================
    //  FLOATING ACTIONS (WhatsApp & Scroll Top)
    // ============================================================
    function injectFloatingActions() {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'floating-actions';
        actionsDiv.innerHTML = `
            <button class="floating-btn scroll-top-btn" id="scrollTopBtn" title="Scroll to Top">
                <i data-lucide="arrow-up"></i>
            </button>
            <a href="https://wa.me/923001234567" class="floating-btn whatsapp-btn" target="_blank" title="Chat on WhatsApp">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
        `;
        document.body.appendChild(actionsDiv);

        // Re-initialize icons for the new HTML
        if (window.lucide) window.lucide.createIcons();

        const scrollBtn = document.getElementById('scrollTopBtn');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    injectFloatingActions();

    // ============================================================
    //  ANIMATED COUNTERS — NIM Trust CTA Section
    // ============================================================
    function initNimCounters() {
        const counters = document.querySelectorAll('.nim-counter');
        if (!counters.length) return;

        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 1800; // ms
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOut(progress);
                el.textContent = Math.round(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            }
            requestAnimationFrame(update);
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(counter => observer.observe(counter));
    }

    initNimCounters();
});
