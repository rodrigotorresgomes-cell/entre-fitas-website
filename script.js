// Carousels state
const carousels = {
    tshirt: { currentSlide: 0, totalSlides: 2 },
    gorro: { currentSlide: 0, totalSlides: 2 },
    sweat: { currentSlide: 0, totalSlides: 2 }
};

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Verificar se há preferência salva
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    // Salvar preferência
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

// Navigation scroll effect
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Initialize carousels
function initCarousels() {
    Object.keys(carousels).forEach(id => {
        createDots(id);
        updateCarousel(id);
    });
}

// Create dots for navigation
function createDots(id) {
    const dotsContainer = document.getElementById(`${id}-dots`);
    const totalSlides = carousels[id].totalSlides;
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(id, i));
        dotsContainer.appendChild(dot);
    }
}

// Change slide
function changeSlide(id, direction) {
    const carousel = carousels[id];
    carousel.currentSlide += direction;
    
    if (carousel.currentSlide < 0) {
        carousel.currentSlide = carousel.totalSlides - 1;
    } else if (carousel.currentSlide >= carousel.totalSlides) {
        carousel.currentSlide = 0;
    }
    
    updateCarousel(id);
}

// Go to specific slide
function goToSlide(id, index) {
    carousels[id].currentSlide = index;
    updateCarousel(id);
}

// Update carousel display
function updateCarousel(id) {
    const track = document.getElementById(`${id}-track`);
    const slides = track.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll(`#${id}-dots .dot`);
    const currentSlide = carousels[id].currentSlide;
    
    // Update slides
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
    
    const sections = document.querySelectorAll('.video-section, .synopsis-section, .merch-section, .capa-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Keyboard navigation for carousels
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        const activeCarousel = document.querySelector('.carousel:hover');
        
        if (activeCarousel) {
            const carouselId = activeCarousel.querySelector('.carousel-track').id.replace('-track', '');
            changeSlide(carouselId, direction);
        }
    }
});