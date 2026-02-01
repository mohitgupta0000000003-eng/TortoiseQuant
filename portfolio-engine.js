// portfolio-engine.js

// Global variables
let allStrategies = [];
let visibleStrategies = 6;
let currentStrategyId = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPortfolioData();
    setupModal();
    setupLoadMore();
});

// Load portfolio data from JSON
async function loadPortfolioData() {
    try {
        const response = await fetch('data/portfolio-data.json');
        const data = await response.json();
        allStrategies = data.strategies;
        
        // Display initial strategies
        displayStrategies();
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        document.getElementById('portfolio-container').innerHTML = `
            <div class="col-span-3 text-center py-12">
                <p class="text-slate-400">Error loading portfolio data. Please check the console.</p>
            </div>
        `;
    }
}

// Display strategies
function displayStrategies() {
    const container = document.getElementById('portfolio-container');
    container.innerHTML = '';
    
    const strategiesToShow = allStrategies.slice(0, visibleStrategies);
    
    strategiesToShow.forEach(strategy => {
        const card = createStrategyCard(strategy);
        container.appendChild(card);
    });
    
    // Update load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (visibleStrategies >= allStrategies.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Create a strategy card
function createStrategyCard(strategy) {
    const years = Object.keys(strategy.performance).sort().reverse();
    const currentYear = years[0];
    const currentData = strategy.performance[currentYear];
    
    // Get color classes based on strategy color
    const colorClasses = getColorClasses(strategy.color);
    
    const card = document.createElement('div');
    card.className = 'portfolio-card group';
    card.innerHTML = `
        <div class="card-gradient rounded-3xl p-8 h-full">
            <div class="flex justify-between items-start mb-6">
                <div>
                    <h3 class="text-2xl font-bold text-white mb-2">${strategy.name}</h3>
                    <span class="inline-block px-3 py-1 ${colorClasses.bg} ${colorClasses.text} rounded-full text-xs font-medium">
                        ${strategy.category}
                    </span>
                </div>
            </div>
            
            <p class="text-slate-400 mb-8">
                ${strategy.description}
            </p>
            
            <!-- Yearly Performance -->
            <div class="mb-8">
                <h4 class="text-white font-medium mb-4 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    Calendar Year Performance
                </h4>
                <div class="space-y-3">
                    ${years.slice(0,4).map(year => {
                        const data = strategy.performance[year];
                        const isCurrentYear = year === currentYear;
                        const yearLabel = isCurrentYear ? `CY${year.slice(-2)} YTD` : `CY${year.slice(-2)}`;
                        return `
                            <div class="flex justify-between items-center">
                                <span class="text-slate-300">${yearLabel}</span>
                                <div class="text-right">
                                    <span class="text-white font-semibold">${data.ytd}</span>
                                    <span class="text-slate-400 text-sm ml-2">(${strategy.benchmark_name}: ${data.benchmark_ytd})</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="pt-6 border-t border-slate-800">
                <div class="flex space-x-3">
                    <button class="flex-1 view-details-btn px-4 py-3 bg-tortoise-accent/10 text-tortoise-accent rounded-lg text-sm font-medium hover:bg-tortoise-accent/20 transition-colors flex items-center justify-center"
                            data-strategy-id="${strategy.id}">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4-3h2v13h-2z"/>
                        </svg>
                        View Monthly Details
                    </button>
                    <a href="downloads/${strategy.holdings_file}" class="download-btn px-4 py-3 bg-tortoise-accent/20 text-tortoise-accent rounded-lg text-sm font-medium hover:bg-tortoise-accent/30 transition-colors flex items-center justify-center">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                        Holdings <br> (Feb-26)
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Add click event for view details
    card.querySelector('.view-details-btn').addEventListener('click', () => {
        openPerformanceModal(strategy);
    });
    
    return card;
}

// Get color classes based on color name
function getColorClasses(color) {
    const colors = {
        'blue': {
            bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
            text: 'text-blue-400'
        },
        'emerald': {
            bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20',
            text: 'text-emerald-400'
        },
        'purple': {
            bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
            text: 'text-purple-400'
        },
        'cyan': {
            bg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20',
            text: 'text-cyan-400'
        },
        'orange': {
            bg: 'bg-gradient-to-br from-orange-500/20 to-orange-600/20',
            text: 'text-orange-400'
        },
        'pink': {
            bg: 'bg-gradient-to-br from-pink-500/20 to-pink-600/20',
            text: 'text-pink-400'
        }
    };
    
    return colors[color] || colors.blue;
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('performanceModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    closeModalBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Open performance modal
function openPerformanceModal(strategy) {
    currentStrategyId = strategy.id;
    const modal = document.getElementById('performanceModal');
    const modalStrategyName = document.getElementById('modalStrategyName');
    const yearTabs = document.getElementById('yearTabs');
    const cumulativeDisplay = document.getElementById('cumulativeDisplay');
    const currentYearLabel = document.getElementById('currentYearLabel');
    const cumulativeStrategy = document.getElementById('cumulativeStrategy');
    const cumulativeBenchmark = document.getElementById('cumulativeBenchmark');
    const performanceTable = document.getElementById('performanceTable');
    
    // Set strategy name
    modalStrategyName.textContent = `${strategy.name} - Monthly Performance`;
    
    // Create year tabs
    const years = Object.keys(strategy.performance).sort().reverse();
    yearTabs.innerHTML = years.map((year, index) => {
        const yearData = strategy.performance[year];
        return `
            <button class="year-tab px-4 py-2 rounded-lg text-sm font-medium ${index === 0 ? 'active bg-tortoise-accent text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}" 
                    data-year="${year}"
                    data-ytd="${yearData.ytd}"
                    data-benchmark-ytd="${yearData.benchmark_ytd}">
                CY${year.slice(-2)}
            </button>
        `;
    }).join('');
    
    // Set initial cumulative data for first year
    if (years.length > 0) {
        const firstYearData = strategy.performance[years[0]];
        currentYearLabel.textContent = `CY${years[0].slice(-2)}`;
        cumulativeStrategy.textContent = firstYearData.ytd;
        cumulativeBenchmark.textContent = firstYearData.benchmark_ytd;
    }
    
    // Add click events to year tabs
    yearTabs.querySelectorAll('.year-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            const ytd = this.getAttribute('data-ytd');
            const benchmarkYtd = this.getAttribute('data-benchmark-ytd');
            
            // Update active tab
            yearTabs.querySelectorAll('.year-tab').forEach(t => {
                t.classList.remove('active', 'bg-tortoise-accent', 'text-white');
                t.classList.add('bg-slate-800', 'text-slate-300');
            });
            this.classList.remove('bg-slate-800', 'text-slate-300');
            this.classList.add('active', 'bg-tortoise-accent', 'text-white');
            
            // Update cumulative display
            currentYearLabel.textContent = `CY${year.slice(-2)}`;
            cumulativeStrategy.textContent = ytd;
            cumulativeBenchmark.textContent = benchmarkYtd;
            
            // Load data for selected year
            loadYearData(strategy, year);
        });
    });
    
    // Load initial year data
    if (years.length > 0) {
        loadYearData(strategy, years[0]);
    }
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function loadYearData(strategy, year) {
    const performanceTable = document.getElementById('performanceTable');
    const months = strategy.performance[year]?.months || [];
    
    performanceTable.innerHTML = '';
    
    months.forEach(monthData => {
        const returnValue = parseFloat(monthData.return);
        
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-800/50 hover:bg-slate-800/30';
        row.innerHTML = `
            <td class="py-3 px-4 text-slate-300 align-middle">${monthData.month}</td>
            <td class="py-3 px-4 text-center font-medium ${returnValue >= 0 ? 'text-white' : 'text-red-400'} align-middle">${monthData.return}</td>
            <td class="py-3 px-4 text-center align-middle">
                <a href="${monthData.holdings_excel}" 
                   download
                   class="inline-flex items-center px-3 py-1.5 bg-tortoise-accent/10 text-tortoise-accent rounded-lg text-sm font-medium hover:bg-tortoise-accent/20 transition-colors">
                    <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    Excel
                </a>
            </td>
        `;
        performanceTable.appendChild(row);
    });
}
// Close modal
function closeModal() {
    const modal = document.getElementById('performanceModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Setup load more button
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    loadMoreBtn.addEventListener('click', function() {
        visibleStrategies += 6;
        displayStrategies();
    });
}
    // CV Modal Functionality
    const cvModal = document.getElementById('cvModal');
    const viewFullCVBtn = document.getElementById('viewFullCV');
    const closeCVModalBtn = document.getElementById('closeCVModal');
    const closeCVModalBtn2 = document.getElementById('closeCVModalBtn');
    const viewFullStoryBtn = document.getElementById('viewFullStory');
    
    // Open CV Modal from original button
    if (viewFullCVBtn) {
        viewFullCVBtn.addEventListener('click', function() {
            cvModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Open CV Modal from new "View Complete Profile" button
    if (viewFullStoryBtn) {
        viewFullStoryBtn.addEventListener('click', function() {
            cvModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close CV Modal
    if (closeCVModalBtn) {
        closeCVModalBtn.addEventListener('click', closeCVModal);
    }
    
    if (closeCVModalBtn2) {
        closeCVModalBtn2.addEventListener('click', closeCVModal);
    }
    
    // Close modal when clicking outside
    cvModal.addEventListener('click', function(e) {
        if (e.target === cvModal) {
            closeCVModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !cvModal.classList.contains('hidden')) {
            closeCVModal();
        }
    });
    
    function closeCVModal() {
        cvModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }