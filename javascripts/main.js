document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------
    // Mobile Menu Toggle
    // -------------------------------------------------------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');

    if (mobileMenuBtn && navLinks) {
        // Toggle nav open/close
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target)) {
                navLinks.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }
            }
        });

        // Mobile dropdown accordion (tap to expand)
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown-menu');
            if (link && dropdown) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        item.classList.toggle('open');
                    }
                });
            }
        });
    }

    // -------------------------------------------------------
    // Skeleton Loading — remove per image as each one loads
    // -------------------------------------------------------
    document.querySelectorAll('img.skeleton-img').forEach(img => {
        const removeSkeleton = () => img.classList.remove('skeleton-img');
        if (img.complete && img.naturalWidth > 0) {
            removeSkeleton();
        } else {
            img.addEventListener('load', removeSkeleton);
            img.addEventListener('error', removeSkeleton);
        }
    });

    // Remove remaining skeleton classes after delay
    setTimeout(() => {
        document.querySelectorAll('.skeleton-bg').forEach(el => el.classList.remove('skeleton-bg'));
        document.querySelectorAll('.skeleton-text').forEach(el => el.classList.remove('skeleton-text'));
        document.querySelectorAll('.skeleton-btn').forEach(el => el.classList.remove('skeleton-btn'));
        document.querySelectorAll('.skeleton-badge').forEach(el => el.classList.remove('skeleton-badge'));
    }, 1800);

    // -------------------------------------------------------
    // Slider Logic
    // -------------------------------------------------------
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const playPauseBtn = document.querySelector('.play-pause-btn');

    let currentSlide = 0;
    let isPlaying = true;
    let slideInterval;

    function goToSlide(index) {
        if (!slides.length) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startSlider() {
        if (!slideInterval) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopSlider() {
        clearInterval(slideInterval);
        slideInterval = null;
    }

    if (slides.length > 0) {
        startSlider();

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                if (isPlaying) { stopSlider(); startSlider(); }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                if (isPlaying) { stopSlider(); startSlider(); }
            });
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                const icon = playPauseBtn.querySelector('i');
                if (isPlaying) {
                    stopSlider();
                    if (icon) { icon.classList.remove('ph-pause'); icon.classList.add('ph-play'); }
                    isPlaying = false;
                } else {
                    startSlider();
                    if (icon) { icon.classList.remove('ph-play'); icon.classList.add('ph-pause'); }
                    isPlaying = true;
                }
            });
        }
    }

    // -------------------------------------------------------
    // Smooth Scroll for anchor links
    // -------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
