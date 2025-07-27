// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive elements
    initCarousel();
    initSmoothScrolling();
    initButtonInteractions();
    initWheelInteractions();
    initAuthSystem();
    initLanguageModal();
    initMobileSidebar();
    
    // Only initialize character animations on mobile
    if (window.innerWidth <= 768) {
        initCharacterAnimations();
    }
    
    // Add mobile browser simulation
    addMobileBrowserUI();
});

// Updated Carousel functionality - single item with smooth transitions
function initCarousel() {
    const carousel = document.querySelector('.reviews-carousel');
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    
    let currentIndex = 0;
    let isAnimating = false;
    const animationDuration = 500; // Match this with CSS transition duration
    
    function updateCarousel(newIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Calculate new index with wrap-around
        newIndex = (newIndex + cards.length) % cards.length;
        
        // Set up animation classes
        const currentCard = cards[currentIndex];
        const nextCard = cards[newIndex];
        
        // Set initial states
        nextCard.style.display = 'flex';
        nextCard.classList.add(direction === 'next' ? 'enter-next' : 'enter-prev');
        
        // Start animation
        currentCard.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');
        nextCard.classList.remove(direction === 'next' ? 'enter-next' : 'enter-prev');
        
        // After animation completes
        setTimeout(() => {
            currentCard.classList.remove('active', 'exit-left', 'exit-right');
            currentCard.style.display = 'none';
            
            nextCard.classList.add('active');
            nextCard.classList.remove('enter-next', 'enter-prev');
            
            currentIndex = newIndex;
            updateDots();
            isAnimating = false;
        }, animationDuration);
    }
    
    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function nextSlide() {
        updateCarousel(currentIndex + 1, 'next');
    }
    
    function prevSlide() {
        updateCarousel(currentIndex - 1, 'prev');
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (index === currentIndex || isAnimating) return;
            const direction = index > currentIndex ? 'next' : 'prev';
            updateCarousel(index, direction);
        });
    });
    
    // Arrow click handlers
    if (leftArrow) {
        leftArrow.addEventListener('click', prevSlide);
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', nextSlide);
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Initialize carousel - show first card, hide others
    cards.forEach((card, index) => {
        card.style.display = index === 0 ? 'flex' : 'none';
        card.classList.toggle('active', index === 0);
    });
    updateDots();
    
    // Auto-advance carousel every 5 seconds
    setInterval(nextSlide, 5000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile sidebar if open
                const mobileSidebar = document.getElementById('mobileSidebar');
                if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                    closeMobileSidebar();
                }
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Button interactions
function initButtonInteractions() {
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add hover animation
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Updated wheel initialization in script.js
function initWheelInteractions() {
    const wheel = document.querySelector('.wheel');
    const wheelSegments = document.querySelectorAll('.wheel-segment');
    const centerArrow = document.querySelector('.center-arrow');
    const centerText = document.querySelector('.center-text');
    const centerType = document.querySelector('.center-type');
    const centerTitle = document.querySelector('.center-title');
    const centerDescription = document.querySelector('.center-description');

    // MBTI data for wheel configuration with proper descriptions
    const mbtiData = {
        personalityTypes: [
            { type: "ISFJ", name: "The Protector", color: "#D63384", angle: 0, description: "focuses on supporting others. They are caring, dependable, and detail-oriented, valuing loyalty and creating harmony in their environments." },
            { type: "ESFJ", name: "The Provider", color: "#DC3545", angle: 22.5, description: "thrives in social environments where they can make a difference. They are caring, outgoing and dependable, valuing harmony and supporting others." },
            { type: "ESTJ", name: "The Director", color: "#FD7E14", angle: 45, description: "excels in managing tasks, ensuring structure and upholding rules. They are practical, organized, and decisive leaders who value efficiency." },
            { type: "ISTP", name: "The Virtuoso", color: "#FFC107", angle: 67.5, description: "loves hands-on problem solving. They are practical, independent and action-oriented, valuing their freedom and staying calm under pressure." },
            { type: "ISFP", name: "The Creative", color: "#28A745", angle: 90, description: "enjoys living in the moment. They are gentle, sensitive and deeply in tune with their surroundings, valuing beauty, authenticity and quiet self-expression." },
            { type: "ESFP", name: "The Artiste", color: "#20C997", angle: 112.5, description: "brings enthusiasm, humour and heart to everything they do. They are lively, outgoing and spontaneous, thriving on connection and adventure." },
            { type: "ENFP", name: "The Free Spirit", color: "#17A2B8", angle: 135, description: "values authenticity and inspire others with their energy. They are enthusiastic, creative and curious individuals who thrive on new ideas and connections." },
            { type: "ENFJ", name: "The Giver", color: "#6F42C1", angle: 157.5, description: "values connection, harmony, and are driven to help people reach their potential. They inspire and motivate others with their charisma and empathy." },
            { type: "INFJ", name: "The Advocate", color: "#6610F2", angle: 180, description: "seeks deep meaning and connection. They are compassionate, insightful and idealistic visionaries driven by a desire to help others and inspire change." },
            { type: "INFP", name: "The Idealist", color: "#0D6EFD", angle: 202.5, description: "values authenticity and personal growth. They are imaginative and introspective, often driven by their idealism and desire to help others." },
            { type: "INTJ", name: "The Strategist", color: "#0DCAF0", angle: 225, description: "values logic, long-term planning, and efficiency. They are strategic and independent thinkers who thrive on solving complex problems." },
            { type: "INTP", name: "The Philosopher", color: "#198754", angle: 247.5, description: "seeks truth, values independence and enjoys deep analysis. They are curious and inventive thinkers who love exploring abstract ideas." },
            { type: "ENTP", name: "The Visionary", color: "#FFC107", angle: 270, description: "loves debating ideas and challenging norms. They are energetic, curious, and quick-witted innovators who turn possibilities into bold new ventures." },
            { type: "ENTJ", name: "The Commander", color: "#DC3545", angle: 292.5, description: "excels at organizing, directing, and turning vision into action. They are bold, strategic, and driven leaders who thrive on challenges." },
            { type: "ISTJ", name: "The Investigator", color: "#6C757D", angle: 315, description: "thrives on organization, structure, and follow-through. They are logical, responsible and reliable in both work and personal life." },
            { type: "ESTP", name: "The Entrepreneur", color: "#FD7E14", angle: 337.5, description: "enjoys taking risks. They are bold, energetic and practical, excelling at thinking on their feet in fast-paced situations." }
        ]
    };

    // Create SVG wheel
    function createSVGWheel() {
        // Clear existing segments but preserve center elements
        const existingCenter = wheel.querySelector('.wheel-center');
        wheel.innerHTML = '';
        if (existingCenter) {
            wheel.appendChild(existingCenter);
        }
        
        // Create SVG element
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "400");
        svg.setAttribute("height", "400");
        svg.setAttribute("viewBox", "0 0 400 400");
        svg.style.position = "absolute";
        svg.style.top = "50%";
        svg.style.left = "50%";
        svg.style.transform = "translate(-50%, -50%)";
        svg.style.zIndex = "1";
        
        const centerX = 200;
        const centerY = 200;
        const innerRadius = 120; // Increased inner radius to accommodate larger center circle
        const outerRadius = 200; // Adjusted outer radius
        const textRadius = (innerRadius + outerRadius) / 2; // Middle of the ring
        
        // Create pie slices
        mbtiData.personalityTypes.forEach((mbtiType, index) => {
            const startAngle = mbtiType.angle;
            const endAngle = startAngle + 22.5;
            
            // Convert angles to radians
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            
            // Calculate path for pie slice
            const x1 = centerX + innerRadius * Math.cos(startRad);
            const y1 = centerY + innerRadius * Math.sin(startRad);
            const x2 = centerX + outerRadius * Math.cos(startRad);
            const y2 = centerY + outerRadius * Math.sin(startRad);
            const x3 = centerX + outerRadius * Math.cos(endRad);
            const y3 = centerY + outerRadius * Math.sin(endRad);
            const x4 = centerX + innerRadius * Math.cos(endRad);
            const y4 = centerY + innerRadius * Math.sin(endRad);
            
            // Create large arc flag
            const largeArcFlag = 22.5 > 180 ? 1 : 0;
            
            // Create path
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const d = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`;
            
            path.setAttribute("d", d);
            path.setAttribute("fill", mbtiType.color);
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "1");
            path.style.cursor = "pointer";
            path.style.transition = "all 0.3s ease";
            path.style.filter = "brightness(1) saturate(1)";
            path.style.transform = "scale(1)";
            
            // Add data attributes
            path.setAttribute("data-type", mbtiType.type);
            path.setAttribute("data-title", mbtiType.name);
            path.setAttribute("data-description", mbtiType.description);
            path.setAttribute("data-color", mbtiType.color);
            
            // Create text element
            const textAngle = startAngle + 11.25; // Middle of the segment
            const textRad = (textAngle - 90) * (Math.PI / 180);
            const textX = centerX + textRadius * Math.cos(textRad);
            const textY = centerY + textRadius * Math.sin(textRad);
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", textX);
            text.setAttribute("y", textY);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "11");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("pointer-events", "none");
            text.setAttribute("text-shadow", "0 1px 2px rgba(0,0,0,0.5)");
            text.style.transition = "all 0.3s ease";
            text.textContent = mbtiType.type;
            
            // Add click event
            path.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Re-select center elements to ensure they exist
                const centerArrow = document.querySelector('.center-arrow');
                const centerText = document.querySelector('.center-text');
                const centerType = document.querySelector('.center-type');
                const centerTitle = document.querySelector('.center-title');
                const centerDescription = document.querySelector('.center-description');
                
                // Reset all paths to solid gray with smooth animation
                svg.querySelectorAll('path').forEach(p => {
                    p.style.filter = "grayscale(1) brightness(0.7)";
                    p.style.transform = "scale(1)";
                    p.style.transition = "all 0.4s ease";
                });
                
                // Highlight clicked path with subtle effect
                this.style.filter = "brightness(1.05) saturate(1.1) grayscale(0)";
                this.style.transform = "scale(1.02)";
                this.style.transition = "all 0.4s ease";
                
                // Get personality data
                const type = this.getAttribute('data-type');
                const title = this.getAttribute('data-title');
                const description = this.getAttribute('data-description');
                
                console.log('Clicking slice:', { type, title, description });
                console.log('Center elements found:', { centerArrow, centerText, centerType, centerTitle, centerDescription });
                
                // Update center content with smooth transition
                if (centerArrow) centerArrow.style.display = 'none';
                if (centerText) centerText.style.display = 'none';
                
                if (centerType) centerType.textContent = type;
                if (centerTitle) centerTitle.textContent = title;
                if (centerDescription) centerDescription.textContent = description;
                
                if (centerType) centerType.style.display = 'block';
                if (centerTitle) centerTitle.style.display = 'block';
                if (centerDescription) centerDescription.style.display = 'block';
                
                // Force a reflow to ensure the elements are visible
                if (centerType) centerType.offsetHeight;
                if (centerTitle) centerTitle.offsetHeight;
                if (centerDescription) centerDescription.offsetHeight;
                
                // Add subtle animation to center text
                if (centerType) centerType.style.animation = "fadeInUp 0.5s ease-out";
                if (centerTitle) centerTitle.style.animation = "fadeInUp 0.5s ease-out 0.1s both";
                if (centerDescription) centerDescription.style.animation = "fadeInUp 0.5s ease-out 0.2s both";
            });
            
            // Simple hover effects - temporary only, no permanent changes
            path.addEventListener('mouseenter', function() {
                // Only apply hover effect if this slice is not currently selected AND not grayed out
                const isSelected = this.style.filter === 'brightness(1.05) saturate(1.1) grayscale(0)';
                const isGrayedOut = this.style.filter === 'grayscale(1) brightness(0.7)';
                
                if (!isSelected && !isGrayedOut) {
                    this.style.filter = "brightness(1.1) saturate(1.2) grayscale(0)";
                    this.style.transform = "scale(1.02)";
                }
            });
            
            path.addEventListener('mouseleave', function() {
                // Only reset if this slice is not currently selected AND not grayed out
                const isSelected = this.style.filter === 'brightness(1.05) saturate(1.1) grayscale(0)';
                const isGrayedOut = this.style.filter === 'grayscale(1) brightness(0.7)';
                
                if (!isSelected && !isGrayedOut) {
                    this.style.filter = "brightness(1) saturate(1) grayscale(0)";
                    this.style.transform = "scale(1)";
                }
            });
            
            svg.appendChild(path);
            svg.appendChild(text);
        });
        
        wheel.appendChild(svg);
        
        // Re-select center elements after SVG creation
        const centerArrow = document.querySelector('.center-arrow');
        const centerText = document.querySelector('.center-text');
        const centerType = document.querySelector('.center-type');
        const centerTitle = document.querySelector('.center-title');
        const centerDescription = document.querySelector('.center-description');
        
        // Debug: Check if elements exist after SVG creation
        console.log('Center elements after SVG creation:', {
            centerArrow: !!centerArrow,
            centerText: !!centerText,
            centerType: !!centerType,
            centerTitle: !!centerTitle,
            centerDescription: !!centerDescription
        });
    }

    // Handle responsive wheel positioning
    function updateWheelPosition() {
        const wheelWidth = wheel.offsetWidth;
        let innerRadius, outerRadius;
        
        if (wheelWidth <= 200) {
            innerRadius = 70;
            outerRadius = 130;
        } else if (wheelWidth <= 250) {
            innerRadius = 80;
            outerRadius = 140;
        } else if (wheelWidth <= 300) {
            innerRadius = 90;
            outerRadius = 160;
        } else {
            innerRadius = 120;
            outerRadius = 200;
        }
        
        // Recreate wheel with new dimensions
        createSVGWheel();
    }
    
    // Update position on window resize
    window.addEventListener('resize', updateWheelPosition);
    
    // Initial wheel creation
    createSVGWheel();

    // Reset wheel when clicking outside
    wheel.addEventListener('click', function(e) {
        if (e.target === wheel) {
            const svg = wheel.querySelector('svg');
            if (svg) {
                svg.querySelectorAll('path').forEach(p => {
                    p.style.filter = "brightness(1) saturate(1) grayscale(0)";
                    p.style.transform = "scale(1)";
                    p.style.transition = "all 0.4s ease";
                });
            }
            centerArrow.style.display = 'block';
            centerText.style.display = 'block';
            centerType.style.display = 'none';
            centerTitle.style.display = 'none';
            centerDescription.style.display = 'none';
        }
    });
}

// Show personality type information
function showPersonalityInfo(type) {
    // Create a modal or tooltip with personality information
    const modal = document.createElement('div');
    modal.className = 'personality-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${type} Personality Type</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>This is a brief description of the ${type} personality type. Each type has unique characteristics and strengths.</p>
                <button class="cta-button">Take the Test to Learn More</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .personality-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 90%;
            max-height: 80%;
            overflow-y: auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #718096;
        }
        .modal-body {
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// Add mobile browser UI simulation
function addMobileBrowserUI() {
    const browserUI = document.createElement('div');
    browserUI.className = 'mobile-browser';
    browserUI.innerHTML = `
        <div class="browser-url">
            <span>🔒</span>
            <span>16personalitytypes.org</span>
            <span>🔄</span>
        </div>
        <div class="browser-nav">
            <span>←</span>
            <span style="opacity: 0.3;">→</span>
            <span>📤</span>
            <span>📖</span>
            <span>⊞</span>
        </div>
    `;
    
    document.body.appendChild(browserUI);
    
    // Add styles for mobile browser UI
    const style = document.createElement('style');
    style.textContent = `
        .mobile-browser {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #F7FAFC;
            border-top: 1px solid #E2E8F0;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.8rem;
            color: #4A5568;
            z-index: 1000;
        }
        .browser-url {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .browser-nav {
            display: flex;
            gap: 1rem;
        }
        .browser-nav span {
            cursor: pointer;
        }
        @media (min-width: 768px) {
            .mobile-browser {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Initialize character animations
    initCharacterAnimations();
});

// Single character animation with smooth transitions
function initCharacterAnimations() {
    const characters = [
        { 
            image: './images/character1.png',
            name: 'Green-haired Character'
        },
        { 
            image: './images/character2.png',
            name: 'Blonde Character'
        },
        { 
            image: './images/character3.png',
            name: 'Dark-haired Character'
        }
    ];

    const container = document.querySelector('.character-container');
    let currentIndex = 0;
    let isAnimating = false;
    const animationDuration = 1200; // Match with CSS transition duration

    // Initialize first character
    updateCharacter(container.querySelector('.character'), characters[0]);

    function updateCharacter(element, character) {
        element.style.backgroundImage = `url('${character.image}')`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.backgroundRepeat = 'no-repeat';
        element.setAttribute('aria-label', character.name);
    }

    function transitionToNextCharacter() {
        if (isAnimating) return;
        isAnimating = true;
        
        const newIndex = (currentIndex + 1) % characters.length;
        const currentChar = container.querySelector('.character');
        
        // Remove any existing characters first to prevent stacking
        const allCharacters = container.querySelectorAll('.character');
        allCharacters.forEach(char => {
            if (char !== currentChar) {
                container.removeChild(char);
            }
        });
        
        // Create new character
        const newChar = document.createElement('div');
        newChar.className = 'character next';
        updateCharacter(newChar, characters[newIndex]);
        container.appendChild(newChar);
        
        // Trigger reflow to enable transition
        void newChar.offsetWidth;
        
        // Start animation - current slides right, new slides in from left
        currentChar.classList.add('exit');
        newChar.classList.add('active');
        newChar.classList.remove('next');
        
        // After animation completes
        setTimeout(() => {
            container.removeChild(currentChar);
            newChar.classList.remove('next');
            currentIndex = newIndex;
            isAnimating = false;
        }, animationDuration);
    }

    // Auto-rotate every 3 seconds
    setInterval(transitionToNextCharacter, 3000);




}

// Add scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.hero, .stats, .main-content, .reports-section, .personality-wheel, .testimonials, .features, .additional-info, .final-cta, .social-section, .sustainability');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations
initScrollAnimations();

// Add scroll animation styles
const scrollAnimationStyle = document.createElement('style');
scrollAnimationStyle.textContent = `
    .hero, .stats, .main-content, .reports-section, .personality-wheel, .testimonials, .features, .additional-info, .final-cta, .social-section, .sustainability {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    .loaded .hero {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(scrollAnimationStyle);

// Authentication System
function initAuthSystem() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userDisplay = document.getElementById('userDisplay');
    
    // Get header login link
    const headerLoginLink = document.querySelector('.header-right .nav-link');
    
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    
    if (userInfo && userInfo.isLoggedIn) {
        // User is logged in, show their name in footer
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userDisplay) {
            userDisplay.style.display = 'inline';
            userDisplay.textContent = `Welcome, ${userInfo.name}!`;
        }
        
        // Update header login link to show user name
        if (headerLoginLink) {
            headerLoginLink.textContent = `Welcome, ${userInfo.name}!`;
            headerLoginLink.style.fontWeight = '600';
        }
    } else {
        // User is not logged in, show login/signup buttons
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
        if (userDisplay) userDisplay.style.display = 'none';
        
        // Reset header login link
        if (headerLoginLink) {
            headerLoginLink.textContent = 'Login';
            headerLoginLink.style.fontWeight = '400';
        }
    }
    
    // Add click handlers for footer buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    }
    
    // Add click handler for header login link
    if (headerLoginLink) {
        headerLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (userInfo && userInfo.isLoggedIn) {
                // User is logged in, show logout option
                if (confirm('Would you like to log out?')) {
                    localStorage.removeItem('userInfo');
                    window.location.reload();
                }
            } else {
                // User is not logged in, redirect to login
                window.location.href = 'login.html';
            }
        });
    }
    
    // Add logout functionality for footer user display
    if (userDisplay) {
        userDisplay.addEventListener('click', function() {
            localStorage.removeItem('userInfo');
            window.location.reload();
        });
    }
    
    // Add navigation to footer links
    const footerLinks = document.querySelectorAll('.footer-section a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent.toLowerCase();
            
            // Handle different footer links
            switch(linkText) {
                case 'about us':
                    alert('About Us page would open here');
                    break;
                case 'careers':
                    alert('Careers page would open here');
                    break;
                case 'press':
                    alert('Press page would open here');
                    break;
                case 'contact':
                    alert('Contact page would open here');
                    break;
                case 'terms of use':
                    alert('Terms of Use page would open here');
                    break;
                case 'privacy policy':
                    alert('Privacy Policy page would open here');
                    break;
                case 'cookie policy':
                    alert('Cookie Policy page would open here');
                    break;
                case 'gdpr':
                    alert('GDPR page would open here');
                    break;
                case 'help center':
                    alert('Help Center page would open here');
                    break;
                case 'faq':
                    alert('FAQ page would open here');
                    break;
                case 'report bug':
                    alert('Report Bug page would open here');
                    break;
                case 'feedback':
                    alert('Feedback page would open here');
                    break;
                default:
                    // For social media links, they already have href
                    break;
            }
        });
    });
}

// Language Modal Functionality
function initLanguageModal() {
    const languageSelector = document.getElementById('languageSelector');
    const languageModal = document.getElementById('languageModal');
    const modalClose = document.getElementById('modalClose');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Open modal when language selector is clicked
    if (languageSelector) {
        languageSelector.addEventListener('click', function(e) {
            e.preventDefault();
            languageModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    // Close modal when close button is clicked
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            languageModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Close modal when clicking outside the modal content
    if (languageModal) {
        languageModal.addEventListener('click', function(e) {
            if (e.target === languageModal) {
                languageModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            const langName = this.querySelector('.lang-name').textContent;
            const langFlag = this.querySelector('.lang-flag').src;
            
            // Update the header language selector
            const headerFlag = document.querySelector('.language-selector .flag-icon');
            const headerText = document.querySelector('.language-selector .language-text');
            
            if (headerFlag && headerText) {
                headerFlag.src = langFlag;
                headerText.textContent = langName + ' ▼';
            }
            
            // Update selected state in modal
            languageOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Close the modal
            languageModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Show a brief message (optional)
            console.log(`Language changed to: ${langName}`);
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && languageModal.classList.contains('active')) {
            languageModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Mobile Sidebar Functionality
function initMobileSidebar() {
    const menuIcon = document.querySelector('.menu-icon');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarLanguageSelector = document.getElementById('sidebarLanguageSelector');
    
    // Open sidebar when menu icon is clicked
    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            openMobileSidebar();
        });
    }
    
    // Close sidebar when close button is clicked
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }
    
    // Handle sidebar language selector
    if (sidebarLanguageSelector) {
        sidebarLanguageSelector.addEventListener('click', function() {
            // Open the language modal
            const languageModal = document.getElementById('languageModal');
            if (languageModal) {
                languageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                closeMobileSidebar(); // Close sidebar when opening language modal
            }
        });
    }
    
    // Close sidebar with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar && mobileSidebar.classList.contains('active')) {
            closeMobileSidebar();
        }
    });
    
    // Handle sidebar navigation links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                closeMobileSidebar();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function openMobileSidebar() {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileSidebar && sidebarOverlay) {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileSidebar() {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileSidebar && sidebarOverlay) {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}