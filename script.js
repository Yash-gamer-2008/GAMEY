// --- CONFIGURATION ---
const API_URL = "https://api.example.com/contact"; // Configurable backend API URL

// --- DOM ELEMENTS ---
document.addEventListener('DOMContentLoaded', () => {
    // Navbar Elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');
    
    // Back to top
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Modal Elements
    const modal = document.getElementById('video-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalVideo = document.getElementById('modal-video');
    const playButtons = document.querySelectorAll('.play-btn');
    
    // Form Elements
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');

    // --- NAVBAR & MOBILE MENU ---
    
    // Scroll effect for navbar and back-to-top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTopBtn.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTopBtn.classList.remove('visible');
        }
        
        // Active link highlighting based on scroll position
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Back to top functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- INTERSECTION OBSERVER FOR ANIMATIONS ---
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // If reduced motion is preferred, make all elements visible immediately
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }

    // --- VIDEO MODAL ---
    
    const openModal = (videoSrc) => {
        modal.classList.add('active');
        modalVideo.src = videoSrc;
        // Optional: auto-play when modal opens
        // modalVideo.play().catch(e => console.log("Auto-play prevented by browser"));
    };
    
    const closeModal = () => {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
    };

    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Prevent event from bubbling if play button is inside a link
            e.stopPropagation();
            const videoSrc = btn.getAttribute('data-video');
            if (videoSrc) {
                openModal(videoSrc);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- CONTACT FORM VALIDATION ---
    
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset status
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            
            // Get values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !message) {
                formStatus.textContent = 'ERROR: All fields are required.';
                formStatus.classList.add('status-error');
                return;
            }
            
            if (!validateEmail(email)) {
                formStatus.textContent = 'ERROR: Invalid communication address format.';
                formStatus.classList.add('status-error');
                return;
            }
            
            if (message.length < 10) {
                formStatus.textContent = 'ERROR: Transmission data too short (min 10 chars).';
                formStatus.classList.add('status-error');
                return;
            }
            
            // Simulation of API Call
            setLoadingState(true);
            
            // Simulate network request delay
            setTimeout(() => {
                setLoadingState(false);
                // Fake success
                formStatus.textContent = 'TRANSMISSION SUCCESSFUL. GAMEY WILL RESPOND SHORTLY.';
                formStatus.classList.add('status-success');
                contactForm.reset();
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 1500);
        });
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            btnText.style.display = 'none';
            loader.style.display = 'block';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
        } else {
            btnText.style.display = 'inline-block';
            loader.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }

    // --- CANVAS PARTICLES FOR HERO (If reduced motion is not checked) ---
    
    if (!prefersReducedMotion) {
        initParticles();
    }
});

// Canvas Particles System
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Resize canvas
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Mouse position for interactivity
    let mouse = {
        x: null,
        y: null,
        radius: 100
    }
    
    canvas.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    canvas.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.8 ? '#e60023' : (Math.random() > 0.5 ? '#00e5ff' : '#ffffff');
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Loop edges
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
            
            // Interactive mouse repel
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    this.x -= forceDirectionX * force * 2;
                    this.y -= forceDirectionY * force * 2;
                }
            }
        }
        
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function createParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 10000;
        
        // Limit max particles for performance
        if(numberOfParticles > 200) numberOfParticles = 200;
        
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    
    createParticles();
    animateParticles();
    
    // Recreate particles on resize
    window.addEventListener('resize', () => {
        createParticles();
    });
}
