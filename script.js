// ===== GLOBAL VARIABLES =====
let typingIndex = 0;
let particles = [];

// ===== DOM ELEMENTS =====
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('backToTop');
const typingText = document.getElementById('typing-text');
const particlesBg = document.getElementById('particles-bg');
const customCursor = document.querySelector('.custom-cursor');
const customCursorFollower = document.querySelector('.custom-cursor-follower');
const contactForm = document.getElementById('contactForm');
const projectModal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const projectCards = document.querySelectorAll('.project-card');
const notification = document.getElementById('notification');
const resumeBtn = document.getElementById('resume-btn');

// ===== TYPING ANIMATION =====
const typingWords = [
    'Computer Science Student',
    'Tech Enthusiast',
    'Community Leader',
    'Problem Solver',
    'Creative Thinker'
];

function typeWriter() {
    if (typingIndex < typingWords.length) {
        const currentWord = typingWords[typingIndex];
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < currentWord.length) {
                typingText.textContent += currentWord.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 100);
            } else {
                setTimeout(eraseText, 2000);
            }
        }
        
        function eraseText() {
            if (typingText.textContent.length > 0) {
                typingText.textContent = typingText.textContent.slice(0, -1);
                setTimeout(eraseText, 50);
            } else {
                typingIndex++;
                setTimeout(typeWriter, 500);
            }
        }
        
        typeChar();
    } else {
        typingIndex = 0;
        setTimeout(typeWriter, 1000);
    }
}

// ===== PARTICLE SYSTEM =====
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.1;
        if (this.opacity > 0.1) this.opacity -= 0.01;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    particlesBg.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add new particles
        if (particles.length < 50) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
        
        // Update and draw particles
        particles.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            
            if (particle.size <= 0.2 || particle.opacity <= 0.1) {
                particles.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
        customCursorFollower.style.left = e.clientX + 'px';
        customCursorFollower.style.top = e.clientY + 'px';
    });
    
    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .experience-card, .leadership-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            customCursor.style.transform = 'scale(1.5)';
            customCursorFollower.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            customCursor.style.transform = 'scale(1)';
            customCursorFollower.style.transform = 'scale(1)';
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== NAVIGATION ACTIVE STATE =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ===== SCROLL PROGRESS =====
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate skill cards
                if (entry.target.classList.contains('skill-card')) {
                    // Skill cards now just fade in, no progress bars
                }
                
                // Animate stats
                if (entry.target.classList.contains('stat-item')) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber) {
                        const target = parseInt(statNumber.getAttribute('data-target'));
                        animateNumber(statNumber, target);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('[data-aos], .skill-card, .tool-item, .stat-item');
    animateElements.forEach(el => observer.observe(el));
}

// ===== NUMBER ANIMATION =====
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

// ===== PROJECT MODAL =====
function initProjectModal() {
    const projectData = {
        'pranaah': {
            title: 'Pranaah - Blood Donation Platform',
            description: 'A comprehensive web application built with Python Django that connects blood donors with recipients. Features include user registration, donor search, appointment scheduling, and real-time notifications. The platform aims to streamline the blood donation process and save lives through efficient donor-recipient matching.',
            image: 'https://via.placeholder.com/400x250/f8fafc/ff6b6b?text=Pranaah+Detailed',
            tech: ['Python', 'Django', 'HTML/CSS', 'JavaScript', 'SQLite', 'Bootstrap'],
            live: '#',
            code: '#'
        },
        'memory-game': {
            title: 'Memory Card Game',
            description: 'An interactive memory testing game built with vanilla JavaScript. Players match pairs of cards with smooth animations and sound effects. Features include score tracking, timer, difficulty levels, and responsive design for all devices.',
            image: 'https://via.placeholder.com/400x250/f8fafc/4ecdc4?text=Memory+Game+Detailed',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage'],
            live: '#',
            code: '#'
        },
        'portfolio': {
            title: 'Personal Portfolio',
            description: 'A modern, responsive portfolio website showcasing my skills, projects, and achievements. Features include smooth animations, interactive elements, particle effects, and a clean, professional design that adapts to all devices.',
            image: 'https://via.placeholder.com/400x250/f8fafc/6366f1?text=Portfolio+Detailed',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
            live: '#',
            code: '#'
        }
    };
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const data = projectData[projectId];
            
            if (data) {
                document.getElementById('modalTitle').textContent = data.title;
                document.getElementById('modalDescription').textContent = data.description;
                document.getElementById('modalImage').src = data.image;
                document.getElementById('modalLive').href = data.live;
                document.getElementById('modalCode').href = data.code;
                
                // Update tech tags
                const modalTech = document.getElementById('modalTech');
                modalTech.innerHTML = '';
                data.tech.forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = tech;
                    modalTech.appendChild(tag);
                });
                
                projectModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            closeModal();
        }
    });
}

function closeModal() {
    projectModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ===== CONTACT FORM =====
function initContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Sending message...', 'info');
        
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    const notificationEl = document.getElementById('notification');
    const messageEl = document.getElementById('notificationMessage');
    
    messageEl.textContent = message;
    
    // Update notification style based on type
    notificationEl.className = `notification ${type}`;
    
    // Show notification
    setTimeout(() => {
        notificationEl.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notificationEl.classList.remove('show');
    }, 5000);
}

// ===== RESUME DOWNLOAD =====
function initResumeDownload() {
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Resume download started...', 'info');
        
        // Simulate download
        setTimeout(() => {
            showNotification('Resume downloaded successfully!', 'success');
        }, 1500);
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        // Add scrolled class
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2000);
    
    // Initialize all features
    typeWriter();
    initParticles();
    initCustomCursor();
    initSmoothScrolling();
    initMobileMenu();
    initBackToTop();
    initScrollAnimations();
    initProjectModal();
    initContactForm();
    initResumeDownload();
    initNavbarScroll();
    
    // Event listeners
    window.addEventListener('scroll', throttle(() => {
        updateActiveNavLink();
        updateScrollProgress();
    }, 100));
    
    // Handle window resize
    window.addEventListener('resize', throttle(() => {
        // Recalculate any layout-dependent values
    }, 250));
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// ===== ANALYTICS (OPTIONAL) =====
function trackEvent(eventName, eventData = {}) {
    // Google Analytics or other analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom event tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        trackEvent('navigation_click', {
            section: e.target.getAttribute('href')
        });
    }
    
    if (e.target.matches('.project-card')) {
        trackEvent('project_view', {
            project: e.target.getAttribute('data-project')
        });
    }
    
    if (e.target.matches('#resume-btn')) {
        trackEvent('resume_download');
    }
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Add keyboard navigation for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && projectModal.classList.contains('show')) {
            const focusableElements = projectModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    // Add ARIA labels and roles
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        section.setAttribute('role', 'region');
        section.setAttribute('aria-labelledby', section.id + '-title');
    });
}

// Initialize accessibility features
initAccessibility(); 