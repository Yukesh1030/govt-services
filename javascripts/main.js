document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------
    // Mobile Menu Toggle
    // -------------------------------------------------------
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Inject backdrop dynamically if it doesn't exist
    if (!document.querySelector('.mobile-menu-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        document.body.appendChild(backdrop);
    }

    const backdrop = document.querySelector('.mobile-menu-backdrop');

    if (mobileMenuBtn && navLinks && backdrop) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            backdrop.classList.toggle('active');
            
            // Change icon based on state
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
                document.body.style.overflow = ''; // Restore scroll
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);
        backdrop.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const item = link.closest('.nav-item');
                const hasDropdown = item && item.querySelector('.dropdown-menu');
                
                if (window.innerWidth <= 992 && hasDropdown) {
                    // If it's a mobile dropdown link, don't close the menu yet
                    // the toggle logic below handles this
                } else {
                    navLinks.classList.remove('active');
                    backdrop.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                    document.body.style.overflow = '';
                }
            });
        });

        // Mobile dropdown accordion
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown-menu');
            if (link && dropdown) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        e.stopPropagation();
                        item.classList.toggle('open');
                        
                        // Close other open accordions
                        document.querySelectorAll('.nav-item').forEach(otherItem => {
                            if (otherItem !== item) otherItem.classList.remove('open');
                        });
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
    }, 600);

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
