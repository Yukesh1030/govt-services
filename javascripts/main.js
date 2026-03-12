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
        const toggleMenu = (show) => {
            const shouldShow = typeof show === 'boolean' ? show : !navLinks.classList.contains('active');
            
            navLinks.classList.toggle('active', shouldShow);
            backdrop.classList.toggle('active', shouldShow);
            
            const icon = mobileMenuBtn.querySelector('i');
            if (shouldShow) {
                icon.classList.replace('ph-list', 'ph-x');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.replace('ph-x', 'ph-list');
                document.body.style.overflow = '';
                // Close all dropdowns when menu closes
                document.querySelectorAll('.nav-item.open').forEach(item => item.classList.remove('open'));
            }
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        backdrop.addEventListener('click', () => toggleMenu(false));

        // Toggle dropdowns on mobile
        navLinks.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (!navLink) return;

            const navItem = navLink.closest('.nav-item');
            const hasDropdown = navItem && navItem.querySelector('.dropdown-menu');
            
            const isMobile = getComputedStyle(mobileMenuBtn).display !== 'none';
            
            if (isMobile && hasDropdown) {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = navItem.classList.contains('open');
                
                // Close other open dropdowns
                document.querySelectorAll('.nav-item.open').forEach(item => {
                    if (item !== navItem) item.classList.remove('open');
                });
                
                // Flip the current one
                if (isOpen) {
                    navItem.classList.remove('open');
                } else {
                    navItem.classList.add('open');
                }
                return;
            }

            // For links without dropdowns, close the menu and let navigation happen
            if (isMobile) {
                toggleMenu(false);
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

    // Remove remaining skeleton classes - moved to coordinate with preloader for smoother transitions
    window.cleanSkeletons = function() {
        document.querySelectorAll('.skeleton-bg, .skeleton-text, .skeleton-img, .skeleton-btn, .skeleton-badge').forEach(el => {
            el.classList.remove('skeleton-bg', 'skeleton-text', 'skeleton-img', 'skeleton-btn', 'skeleton-badge');
        });
    };

    // -------------------------------------------------------
    // Slider Logic
    // -------------------------------------------------------
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');


    let currentSlide = 0;
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
                stopSlider(); startSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopSlider(); startSlider();
            });
        }
    }

    // -------------------------------------------------------
    // Scroll Animations (IntersectionObserver)
    // -------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // stop observing once animated in to save resources
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anim-el').forEach(el => {
        scrollObserver.observe(el);
    });

    // -------------------------------------------------------
    // DS Section: Scroll Animations (ds-anim)
    // -------------------------------------------------------
    const dsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('ds-visible');
                dsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.ds-anim').forEach(el => dsObserver.observe(el));

    // -------------------------------------------------------
    // DS Section: Animated Counters
    // -------------------------------------------------------
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value.toLocaleString('en-IN');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('en-IN');
        }
        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.ds-counter-num[data-target]').forEach(el => counterObserver.observe(el));
});

// -------------------------------------------------------
// DS Section: Tab switcher (Apply Online section)
// -------------------------------------------------------
function dsSetTab(btn, tabId) {
    document.querySelectorAll('.ds-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Hide all grids
    document.querySelectorAll('.ds-apply-grid').forEach(grid => {
        grid.style.display = 'none';
        // Reset animations so they replay on reveal
        grid.querySelectorAll('.ds-apply-card').forEach(card => card.classList.remove('ds-visible'));
    });
    
    // Show target grid
    const targetGrid = document.getElementById(`ds-tab-${tabId}`);
    if (targetGrid) {
        targetGrid.style.display = 'grid';
        
        // Directly apply the visible class to trigger CSS animation
        setTimeout(() => {
            targetGrid.querySelectorAll('.ds-apply-card').forEach(el => el.classList.add('ds-visible'));
        }, 50);
    }
}

// -------------------------------------------------------
// DS Section: Application Tracker show result & Validate
// -------------------------------------------------------
function validateAndTrackApp() {
    const arnInput = document.getElementById('ds-arn-input');
    const mobileInput = document.getElementById('ds-arn-mobile');
    
    // Custom validation logic beyond HTML5 patterns
    const arnRegex = /^[A-Za-z0-9]{10}$/;
    
    if (arnInput && !arnRegex.test(arnInput.value)) {
        alert('Invalid ARN Format. Please enter a 10-character alphanumeric code.');
        arnInput.focus();
        return;
    }
    
    if (mobileInput && mobileInput.value.length !== 10) {
        alert('Please enter a valid 10-digit mobile number.');
        mobileInput.focus();
        return;
    }

    const result = document.getElementById('ds-track-result');
    if (result) {
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// -------------------------------------------------------
// DS Section: Grievance form confirmation & Validate
// -------------------------------------------------------
function validateGrievance() {
    const textInput = document.getElementById('ds-grievance-text');
    
    // Ensure complaint has some body to it
    if (textInput && textInput.value.trim().length < 10) {
        alert('Please provide a more detailed description of your grievance (minimum 10 characters).');
        textInput.focus();
        return;
    }

    const btn = document.querySelector('.ds-submit-btn');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="ph ph-check-circle"></i> Submitted Successfully!';
    btn.style.background = '#059669';
    setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        // Redirect to 404
        window.location.href = 'NotFound.html';
    }, 2000);
}

// -------------------------------------------------------
// MS Section: Scroll Animations (ms-anim)
// -------------------------------------------------------
(function() {
    const msObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('ms-visible');
                msObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.ms-anim').forEach(el => msObserver.observe(el));
})();

// -------------------------------------------------------
// MS Section: Video play ripple effect
// -------------------------------------------------------
function msPlayVideo(btn, id) {
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = 'ph ph-spinner';
    icon.style.animation = 'spin 0.8s linear infinite';
    setTimeout(() => {
        icon.className = 'ph ph-check-circle';
        icon.style.animation = '';
        icon.style.color = '#10b981';
    }, 1200);
}

// -------------------------------------------------------
// MS Section: Press Contact form confirmation
// -------------------------------------------------------
function msFormSubmit(form) {
    const btn = form.querySelector('.ms-submit-btn');
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ph ph-check-circle"></i> Request Sent!';
    btn.style.background = '#10b981';
    form.reset();
    setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        // Redirect to 404
        window.location.href = 'NotFound.html';
    }, 1500);
}

// Spinner keyframes via JS (avoids needing an extra CSS rule)
(function() {
    if (!document.getElementById('ms-spin-style')) {
        const s = document.createElement('style');
        s.id = 'ms-spin-style';
        s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(s);
    }
})();

// -------------------------------------------------------
// HP Section: Scroll Animations (hp-anim)
// -------------------------------------------------------
(function() {
    const hpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('hp-visible');
                hpObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hp-anim').forEach(el => hpObserver.observe(el));
})();

// -------------------------------------------------------
// HP Section: Animated Counters (hp-stat-big)
// -------------------------------------------------------
(function() {
    function hpAnimCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();
        (function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.floor(eased * target);
            // Format large numbers compactly
            if (target >= 1000000) {
                el.textContent = (val / 1000000).toFixed(val >= 100000000 ? 0 : 1) + 'Cr';
            } else if (target >= 1000) {
                el.textContent = (val / 1000).toFixed(val >= 10000 ? 1 : 1) + 'K';
            } else {
                el.textContent = val.toLocaleString('en-IN');
            }
            if (p < 1) requestAnimationFrame(step);
            else {
                if (target >= 1000000) el.textContent = (target/1000000).toFixed(0) + 'Cr';
                else if (target >= 1000) el.textContent = (target/1000).toFixed(0) + 'K';
                else el.textContent = target.toLocaleString('en-IN');
            }
        })(start);
    }

    const hpCounterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hpAnimCounter(entry.target);
                hpCounterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hp-stat-big[data-target]').forEach(el => hpCounterObserver.observe(el));
})();

// -------------------------------------------------------
// Global Loading Animations
// -------------------------------------------------------
(function() {
    // Top Progress Bar Logic
    const progressBar = document.createElement('div');
    progressBar.id = 'top-progress';
    document.body.appendChild(progressBar);

    function setProgress(percent) {
        progressBar.style.width = percent + '%';
        if (percent >= 100) {
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => {
                    progressBar.style.width = '0';
                    progressBar.style.opacity = '1';
                }, 300);
            }, 500);
        } else {
            progressBar.style.opacity = '1';
        }
    }

    // Simulate progress on load
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        setProgress(progress);
    }, 200);

    // Global utility to handle button loading states
    window.setButtonLoading = function(btn, isLoading) {
        if (!btn) return;
        if (isLoading) {
            btn.classList.add('btn-loading');
            btn.setAttribute('disabled', 'true');
        } else {
            btn.classList.remove('btn-loading');
            btn.removeAttribute('disabled');
        }
    };

    // Preloader fade out when DOM is ready (much faster than window.load)
    const handleInitialLoad = () => {
        const preloader = document.querySelector('.preloader');
        if (preloader && !preloader.classList.contains('fade-out')) {
            setTimeout(() => {
                if (window.cleanSkeletons) window.cleanSkeletons();
                preloader.classList.add('fade-out');
                setProgress(100);
                
                setTimeout(() => {
                    window.dispatchEvent(new Event('scroll'));
                }, 600);
            }, 500); // Small delay for visual comfort
        }
    };

    // Trigger on DOMContentLoaded for speed, but keep load as backup
    document.addEventListener('DOMContentLoaded', handleInitialLoad);
    window.addEventListener('load', handleInitialLoad);
})();

// FAQ Accordion
function hpToggleFaq(btn) {
    const item = btn.closest('.hp-faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.hp-faq-item.open').forEach(i => i.classList.remove('open'));
    // Toggle
    if (!isOpen) item.classList.add('open');
}

// HP2 Newsletter Subscription with Redirect
function handleHP2Newsletter(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button[type="submit"]');
    
    if (!email || !email.value) return;

    // Show immediate feedback
    if (window.setButtonLoading) {
        window.setButtonLoading(btn, true);
    } else {
        btn.innerHTML = 'Processing...';
        btn.disabled = true;
    }

    // Small delay to simulate processing, then redirect
    setTimeout(() => {
        // Redirect to 404 page as requested by user
        // Note: Using relative path from within html/ directory usually, 
        // but if called from index.html it might be different.
        // However, this is specifically for HP2 pages which are in html/
        window.location.href = 'HP2NotFound.html';
    }, 1000);
}

// HP1 Newsletter Subscription with Redirect
function handleHP1Newsletter(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    
    // Show immediate feedback if utility is available
    if (window.setButtonLoading) {
        window.setButtonLoading(btn, true);
    }

    // Determine redirect path based on current location
    let redirectUrl = 'html/NotFound.html';
    if (window.location.pathname.includes('/html/')) {
        redirectUrl = 'NotFound.html';
    }

    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 1000);
}
