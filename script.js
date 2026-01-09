// script.js

// Enhanced animation script
document.addEventListener('DOMContentLoaded', function() {
    const curvePath = document.getElementById('curvePath');
    const ball = document.getElementById('ball');
    const curveWrapper = document.querySelector('.curve-wrapper');
    const dataPointsContainer = document.getElementById('dataPointsContainer');
    
    if (!curvePath || !ball || !curveWrapper) return;
    
    // Create data points along the curve
    function createDataPoints() {
        if (!dataPointsContainer || !curvePath) return;
        
        const pathLength = curvePath.getTotalLength();
        const pointsCount = 12;
        
        for (let i = 0; i < pointsCount; i++) {
            const point = curvePath.getPointAtLength((i / pointsCount) * pathLength);
            const svgPoint = curveWrapper.querySelector('svg').createSVGPoint();
            svgPoint.x = point.x;
            svgPoint.y = point.y;
            const screenPoint = svgPoint.matrixTransform(curveWrapper.querySelector('svg').getScreenCTM());
            const containerRect = curveWrapper.getBoundingClientRect();
            
            const dataPoint = document.createElement('div');
            dataPoint.className = 'data-point';
            dataPoint.style.left = (screenPoint.x - containerRect.left - 3) + 'px';
            dataPoint.style.top = (screenPoint.y - containerRect.top - 3) + 'px';
            dataPoint.style.animationDelay = (i * 0.2) + 's';
            
            dataPointsContainer.appendChild(dataPoint);
        }
    }
    
    // Create floating particles
    function createParticles() {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size and position
            const size = Math.random() * 4 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation
            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 2;
            particle.style.animation = `floatParticle ${duration}s ease-in-out ${delay}s infinite`;
            
            curveWrapper.appendChild(particle);
        }
    }
    
    // Animation variables
    let progress = 0;
    const bounceHeight = 32;
    
    function animate() {
        const pathLength = curvePath.getTotalLength();
        const point = curvePath.getPointAtLength(progress * pathLength);
        
        // Calculate bounce offset
        const bounceOffset = Math.sin(Date.now() / 200) * bounceHeight;
        
        // Calculate direction
        const nextProgress = Math.min(progress + 0.01, 1);
        const nextPoint = curvePath.getPointAtLength(nextProgress * pathLength);
        
        const dx = nextPoint.x - point.x;
        const dy = nextPoint.y - point.y;
        
        // Calculate perpendicular vector
        const perpX = -dy;
        const perpY = dx;
        const length = Math.sqrt(perpX * perpX + perpY * perpY);
        const normX = perpX / length;
        const normY = perpY / length;
        
        // Apply bounce
        const bounceX = point.x + normX * bounceOffset;
        const bounceY = point.y + normY * bounceOffset;
        
        // Position the ball
        const svgPoint = curveWrapper.querySelector('svg').createSVGPoint();
        svgPoint.x = bounceX;
        svgPoint.y = bounceY;
        const screenPoint = svgPoint.matrixTransform(curveWrapper.querySelector('svg').getScreenCTM());
        
        const containerRect = curveWrapper.getBoundingClientRect();
        ball.style.left = (screenPoint.x - containerRect.left - 7) + 'px';
        ball.style.top = (screenPoint.y - containerRect.top - 7) + 'px';
        
        // Create trail effect
        if (Math.random() > 0.7) {
            const trail = document.createElement('div');
            trail.className = 'particle';
            trail.style.width = '2px';
            trail.style.height = '2px';
            trail.style.left = ball.style.left;
            trail.style.top = ball.style.top;
            trail.style.background = 'rgba(13, 148, 136, 0.4)';
            trail.style.animation = 'none';
            trail.style.opacity = '0.8';
            
            curveWrapper.appendChild(trail);
            
            // Remove trail after animation
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.style.transition = 'opacity 1s';
                    trail.style.opacity = '0';
                    setTimeout(() => {
                        if (trail.parentNode) {
                            curveWrapper.removeChild(trail);
                        }
                    }, 1000);
                }
            }, 100);
        }
        
        // Update progress
        progress += 0.003;
        if (progress > 1) {
            progress = 0;
        }
        
        requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    setTimeout(() => {
        createDataPoints();
        createParticles();
        
        // Initial positioning
        const initialPoint = curvePath.getPointAtLength(0);
        const svgPoint = curveWrapper.querySelector('svg').createSVGPoint();
        svgPoint.x = initialPoint.x;
        svgPoint.y = initialPoint.y;
        const screenPoint = svgPoint.matrixTransform(curveWrapper.querySelector('svg').getScreenCTM());
        
        const containerRect = curveWrapper.getBoundingClientRect();
        ball.style.left = (screenPoint.x - containerRect.left - 7) + 'px';
        ball.style.top = (screenPoint.y - containerRect.top - 7) + 'px';
        
        // Start animation
        animate();
    }, 500);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Clear and recreate data points
        if (dataPointsContainer) {
            dataPointsContainer.innerHTML = '';
            createDataPoints();
        }
    });
});
// Performance Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('performanceModal');
    const closeModalBtn = document.getElementById('closeModal');
    const yearTabs = document.querySelectorAll('.year-tab');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    const performanceTable = document.getElementById('performanceTable');
    const modalStrategyName = document.getElementById('modalStrategyName');
    
    // Sample monthly data for each strategy
    const strategyData = {
        'compounder': {
            name: 'The Compounder',
            years: {
                '2025': [
                    { month: 'Jan 25', strategy: '+12.3%', benchmark: '+8.2%', alpha: '+4.1%' },
                    { month: 'Feb 25', strategy: '+8.7%', benchmark: '+7.1%', alpha: '+1.6%' },
                    { month: 'Mar 25', strategy: '+15.2%', benchmark: '+10.4%', alpha: '+4.8%' },
                    { month: 'Apr 25', strategy: '-2.1%', benchmark: '-1.2%', alpha: '-0.9%' },
                    { month: 'May 25', strategy: '+10.4%', benchmark: '+9.1%', alpha: '+1.3%' },
                    { month: 'Jun 25', strategy: '+7.8%', benchmark: '+6.4%', alpha: '+1.4%' }
                ],
                '2024': [
                    { month: 'Jan 24', strategy: '+5.2%', benchmark: '+4.1%', alpha: '+1.1%' },
                    { month: 'Feb 24', strategy: '+3.8%', benchmark: '+2.9%', alpha: '+0.9%' },
                    { month: 'Mar 24', strategy: '+8.4%', benchmark: '+6.2%', alpha: '+2.2%' },
                    { month: 'Apr 24', strategy: '+2.1%', benchmark: '+1.8%', alpha: '+0.3%' },
                    { month: 'May 24', strategy: '+4.7%', benchmark: '+3.9%', alpha: '+0.8%' },
                    { month: 'Jun 24', strategy: '+6.3%', benchmark: '+5.1%', alpha: '+1.2%' }
                ],
                '2023': [
                    { month: 'Jan 23', strategy: '+9.2%', benchmark: '+7.4%', alpha: '+1.8%' },
                    { month: 'Feb 23', strategy: '+5.7%', benchmark: '+4.8%', alpha: '+0.9%' },
                    { month: 'Mar 23', strategy: '+11.3%', benchmark: '+9.2%', alpha: '+2.1%' },
                    { month: 'Apr 23', strategy: '+3.9%', benchmark: '+3.1%', alpha: '+0.8%' },
                    { month: 'May 23', strategy: '+7.4%', benchmark: '+6.2%', alpha: '+1.2%' },
                    { month: 'Jun 23', strategy: '+8.9%', benchmark: '+7.3%', alpha: '+1.6%' }
                ],
                '2022': [
                    { month: 'Jan 22', strategy: '+6.8%', benchmark: '+5.4%', alpha: '+1.4%' },
                    { month: 'Feb 22', strategy: '+4.2%', benchmark: '+3.3%', alpha: '+0.9%' },
                    { month: 'Mar 22', strategy: '+9.7%', benchmark: '+7.8%', alpha: '+1.9%' },
                    { month: 'Apr 22', strategy: '+2.4%', benchmark: '+1.9%', alpha: '+0.5%' },
                    { month: 'May 22', strategy: '+5.9%', benchmark: '+4.7%', alpha: '+1.2%' },
                    { month: 'Jun 22', strategy: '+7.3%', benchmark: '+6.1%', alpha: '+1.2%' }
                ]
            }
        }
        // Add similar data for other strategies...
    };
    
    // Open modal when View Details is clicked
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const strategyId = this.getAttribute('data-strategy');
            const strategy = strategyData[strategyId] || strategyData['compounder'];
            
            modalStrategyName.textContent = `${strategy.name} - Monthly Performance`;
            loadYearData(strategy, '2025');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Year tab switching
    yearTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            
            // Update active tab
            yearTabs.forEach(t => t.classList.remove('active', 'bg-tortoise-accent', 'text-white'));
            yearTabs.forEach(t => t.classList.add('bg-slate-800', 'text-slate-300'));
            this.classList.remove('bg-slate-800', 'text-slate-300');
            this.classList.add('active', 'bg-tortoise-accent', 'text-white');
            
            // Load data for selected year
            const currentStrategy = document.querySelector('.view-details-btn[data-strategy]').getAttribute('data-strategy');
            const strategy = strategyData[currentStrategy] || strategyData['compounder'];
            loadYearData(strategy, year);
        });
    });
    
    // Load year data into table
    function loadYearData(strategy, year) {
        const months = strategy.years[year] || [];
        performanceTable.innerHTML = '';
        
        months.forEach(monthData => {
            const row = document.createElement('tr');
            row.className = 'border-b border-slate-800/50 hover:bg-slate-800/30';
            row.innerHTML = `
                <td class="py-3 px-4 text-slate-300">${monthData.month}</td>
                <td class="py-3 px-4 text-right font-medium text-white">${monthData.strategy}</td>
                <td class="py-3 px-4 text-right text-slate-400">${monthData.benchmark}</td>
                <td class="py-3 px-4 text-right text-tortoise-accent">${monthData.alpha}</td>
            `;
            performanceTable.appendChild(row);
        });
    }
    
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
// Disclaimer Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const disclaimerModal = document.getElementById('disclaimerModal');
    const acceptBtn = document.getElementById('acceptDisclaimer');
    const rejectBtn = document.getElementById('rejectDisclaimer');
    
    // Check if user has already accepted disclaimer
    if (!localStorage.getItem('disclaimerAccepted')) {
        // Show modal after 1 second delay
        setTimeout(() => {
            disclaimerModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }, 1000);
    }
    
    // Accept disclaimer
    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('disclaimerAccepted', 'true');
        disclaimerModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
    
    // Reject disclaimer (exit site)
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            window.location.href = 'https://google.com'; // Redirect to safe site
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !disclaimerModal.classList.contains('hidden')) {
            disclaimerModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
});
// Bottom Navigation Active State
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    // Function to set active link based on scroll position
    function setActiveLink() {
        const scrollPos = window.scrollY + 100; // Offset for better detection
        
        // Find current section
        let currentSection = '';
        
        // Check each section
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        // Set active state on links
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('href').substring(1);
            
            if (linkSection === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Set active link on scroll
    window.addEventListener('scroll', setActiveLink);
    
    // Set active link on click with smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Initial call
    setTimeout(setActiveLink, 100);
});
