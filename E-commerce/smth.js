// E-commerce Enhanced UX Implementation
class ECommerceStore {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.currentSort = 'featured';
        this.currentFilters = {
            price: { min: 0, max: 2000 },
            categories: [],
            brands: [],
            rating: null,
            features: []
        };
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.updateCartBadge();
        this.updateWishlistBadge();
        this.renderProducts();
    }

    // Sample product data with image src
    loadProducts() {
        this.products = [
            {
                id: 1,
                name: "MacBook Pro 16\"",
                category: "laptops",
                brand: "apple",
                price: 2399,
                originalPrice: 2599,
                rating: 4.8,
                reviewCount: 124,
                src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
                alt: "MacBook Pro 16-inch laptop",
                features: ["M2 Pro Chip", "16GB RAM", "1TB SSD", "Free Shipping"],
                inStock: true,
                onSale: true,
                isNew: false
            },
            {
                id: 2,
                name: "iPhone 15 Pro",
                category: "smartphones",
                brand: "apple",
                price: 999,
                originalPrice: 999,
                rating: 4.9,
                reviewCount: 89,
                src: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
                alt: "iPhone 15 Pro smartphone",
                features: ["A17 Pro Chip", "128GB", "5G", "Free Shipping"],
                inStock: true,
                onSale: false,
                isNew: true
            },
            {
                id: 3,
                name: "Galaxy S24 Ultra",
                category: "smartphones",
                brand: "samsung",
                price: 1199,
                originalPrice: 1299,
                rating: 4.7,
                reviewCount: 67,
                src: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
                alt: "Samsung Galaxy S24 Ultra",
                features: ["Snapdragon 8 Gen 3", "256GB", "S Pen", "Free Shipping"],
                inStock: true,
                onSale: true,
                isNew: true
            },
            {
                id: 4,
                name: "Dell XPS 13",
                category: "laptops",
                brand: "dell",
                price: 1299,
                originalPrice: 1499,
                rating: 4.6,
                reviewCount: 156,
                src: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
                alt: "Dell XPS 13 laptop",
                features: ["Intel i7", "16GB RAM", "512GB SSD", "Free Shipping"],
                inStock: true,
                onSale: true,
                isNew: false
            },
            {
                id: 5,
                name: "iPad Air",
                category: "tablets",
                brand: "apple",
                price: 749,
                originalPrice: 749,
                rating: 4.5,
                reviewCount: 203,
                src: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
                alt: "iPad Air tablet",
                features: ["M1 Chip", "64GB", "5G Ready", "Free Shipping"],
                inStock: true,
                onSale: false,
                isNew: false
            },
            {
                id: 6,
                name: "ThinkPad X1 Carbon",
                category: "laptops",
                brand: "lenovo",
                price: 1699,
                originalPrice: 1899,
                rating: 4.4,
                reviewCount: 89,
                src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
                alt: "Lenovo ThinkPad X1 Carbon",
                features: ["Intel i7", "16GB RAM", "1TB SSD", "Free Shipping"],
                inStock: false,
                onSale: true,
                isNew: false
            },
            {
                id: 7,
                name: "AirPods Pro",
                category: "accessories",
                brand: "apple",
                price: 249,
                originalPrice: 249,
                rating: 4.8,
                reviewCount: 312,
                src: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
                alt: "Apple AirPods Pro",
                features: ["Active Noise Cancellation", "Spatial Audio", "Free Shipping"],
                inStock: true,
                onSale: false,
                isNew: false
            },
            {
                id: 8,
                name: "Galaxy Tab S9",
                category: "tablets",
                brand: "samsung",
                price: 899,
                originalPrice: 999,
                rating: 4.6,
                reviewCount: 45,
                src: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
                alt: "Samsung Galaxy Tab S9",
                features: ["Snapdragon 8 Gen 2", "128GB", "S Pen", "Free Shipping"],
                inStock: true,
                onSale: true,
                isNew: true
            }
        ];
        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        // Filter event listeners
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());
        
        // Price range inputs
        document.getElementById('priceMin').addEventListener('input', (e) => this.handlePriceInput(e, 'min'));
        document.getElementById('priceMax').addEventListener('input', (e) => this.handlePriceInput(e, 'max'));
        document.getElementById('priceRangeMin').addEventListener('input', (e) => this.handlePriceRange(e, 'min'));
        document.getElementById('priceRangeMax').addEventListener('input', (e) => this.handlePriceRange(e, 'max'));
        
        // DEBUG: Log all filter inputs to see what we're working with
        console.log('Category filter inputs:', document.querySelectorAll('input[type="checkbox"][value="laptops"], input[type="checkbox"][value="smartphones"], input[type="checkbox"][value="tablets"], input[type="checkbox"][value="accessories"]'));
        
        // Category and brand filters - FIXED: Use data attributes or more reliable selectors
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                console.log('Filter changed:', input.value, input.checked);
                this.handleFilterChange();
            });
        });
        
        // Rating filters
        document.querySelectorAll('.rating-option input').forEach(input => {
            input.addEventListener('change', () => this.handleFilterChange());
        });
        
        // Sort functionality
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applySorting();
        });
        
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Cart functionality
        document.getElementById('cartBtn').addEventListener('click', () => this.toggleCart());
        document.querySelector('.close-cart').addEventListener('click', () => this.toggleCart());
        
        // Checkout functionality
        document.getElementById('checkoutBtn').addEventListener('click', () => this.openCheckout());
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => this.closeModal(e.target));
        });
        
        // Checkout steps
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', (e) => this.nextStep(e.target));
        });
        
        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', (e) => this.prevStep(e.target));
        });
        
        // Place order
        document.getElementById('checkoutForm').addEventListener('submit', (e) => this.placeOrder(e));
        
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Image error handling
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' && e.target.classList.contains('product-img')) {
                this.handleImageError(e.target);
            }
        }, true);
    }

    // Handle broken images
    handleImageError(imgElement) {
        const productCard = imgElement.closest('.product-card');
        const category = productCard?.querySelector('.product-category')?.textContent?.toLowerCase();
        
        const placeholders = {
            'laptops': '💻',
            'smartphones': '📱',
            'tablets': '📱',
            'accessories': '🎧'
        };
        
        const placeholder = placeholders[category] || '📦';
        
        // Replace image with placeholder div
        const imageContainer = imgElement.parentElement;
        imageContainer.innerHTML = `
            <div class="image-placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: #f8fafc; color: #64748b; border-radius: 8px;">
                ${placeholder}
            </div>
        `;
    }

    // Advanced Filtering System
    handleFilterChange() {
        console.log('Filter change triggered');
        this.updateCurrentFilters();
        this.applyFilters();
    }

    updateCurrentFilters() {
        // Categories - FIXED: Get all checked category checkboxes
        const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"][value="laptops"], input[type="checkbox"][value="smartphones"], input[type="checkbox"][value="tablets"], input[type="checkbox"][value="accessories"]');
        this.currentFilters.categories = Array.from(categoryCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        console.log('Selected categories:', this.currentFilters.categories);

        // Brands - FIXED: Get all checked brand checkboxes
        const brandCheckboxes = document.querySelectorAll('input[type="checkbox"][value="apple"], input[type="checkbox"][value="samsung"], input[type="checkbox"][value="dell"], input[type="checkbox"][value="lenovo"]');
        this.currentFilters.brands = Array.from(brandCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        console.log('Selected brands:', this.currentFilters.brands);

        // Rating
        const ratingInput = document.querySelector('.rating-option input:checked');
        this.currentFilters.rating = ratingInput ? parseInt(ratingInput.value) : null;

        // Features
        const featureCheckboxes = document.querySelectorAll('input[type="checkbox"][value="free-shipping"], input[type="checkbox"][value="in-stock"], input[type="checkbox"][value="on-sale"]');
        this.currentFilters.features = Array.from(featureCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        console.log('Current filters:', this.currentFilters);
    }

    applyFilters() {
        console.log('Applying filters...');
        
        this.filteredProducts = this.products.filter(product => {
            let includeProduct = true;

            // Price filter
            if (product.price < this.currentFilters.price.min || product.price > this.currentFilters.price.max) {
                includeProduct = false;
            }

            // Category filter - FIXED: Only filter if categories are selected
            if (includeProduct && this.currentFilters.categories.length > 0) {
                includeProduct = this.currentFilters.categories.includes(product.category);
                console.log(`Product ${product.name} category ${product.category} - included: ${includeProduct}`);
            }

            // Brand filter - FIXED: Only filter if brands are selected
            if (includeProduct && this.currentFilters.brands.length > 0) {
                includeProduct = this.currentFilters.brands.includes(product.brand);
            }

            // Rating filter
            if (includeProduct && this.currentFilters.rating && product.rating < this.currentFilters.rating) {
                includeProduct = false;
            }

            // Features filter
            if (includeProduct && this.currentFilters.features.length > 0) {
                if (this.currentFilters.features.includes('free-shipping') && !product.features.includes('Free Shipping')) {
                    includeProduct = false;
                }
                if (this.currentFilters.features.includes('in-stock') && !product.inStock) {
                    includeProduct = false;
                }
                if (this.currentFilters.features.includes('on-sale') && !product.onSale) {
                    includeProduct = false;
                }
            }

            return includeProduct;
        });

        console.log('Filtered products count:', this.filteredProducts.length);
        this.applySorting();
        this.updateResultsInfo();
    }

    // Enhanced Sorting System
    applySorting() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // Assuming newer products have higher IDs
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // 'featured'
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
        }
        this.renderProducts();
    }

    // Price Range Handling
    handlePriceInput(e, type) {
        const value = parseInt(e.target.value) || 0;
        const rangeInput = document.getElementById(`priceRange${type === 'min' ? 'Min' : 'Max'}`);
        
        if (type === 'min') {
            const maxValue = parseInt(document.getElementById('priceMax').value) || 2000;
            if (value > maxValue) {
                e.target.value = maxValue;
                return;
            }
            this.currentFilters.price.min = Math.min(value, maxValue);
        } else {
            const minValue = parseInt(document.getElementById('priceMin').value) || 0;
            if (value < minValue) {
                e.target.value = minValue;
                return;
            }
            this.currentFilters.price.max = Math.max(value, minValue);
        }
        
        rangeInput.value = value;
        this.updatePriceDisplay();
        this.applyFilters();
    }

    handlePriceRange(e, type) {
        const value = parseInt(e.target.value);
        const numberInput = document.getElementById(`price${type === 'min' ? 'Min' : 'Max'}`);
        
        numberInput.value = value;
        
        if (type === 'min') {
            this.currentFilters.price.min = value;
        } else {
            this.currentFilters.price.max = value;
        }
        
        this.updatePriceDisplay();
        this.applyFilters();
    }

    updatePriceDisplay() {
        const display = document.getElementById('priceDisplay');
        display.textContent = `$${this.currentFilters.price.min} - $${this.currentFilters.price.max}`;
    }

    // Search Functionality
    handleSearch(query) {
        if (query.length === 0) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.brand.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.applySorting();
        this.updateResultsInfo();
    }

    // Clear All Filters
    clearFilters() {
        console.log('Clearing all filters');
        
        // Reset all checkboxes and inputs
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        document.getElementById('priceMin').value = '';
        document.getElementById('priceMax').value = '';
        document.getElementById('priceRangeMin').value = 0;
        document.getElementById('priceRangeMax').value = 2000;
        
        this.currentFilters = {
            price: { min: 0, max: 2000 },
            categories: [],
            brands: [],
            rating: null,
            features: []
        };
        
        this.updatePriceDisplay();
        this.filteredProducts = [...this.products];
        this.applySorting();
        this.updateResultsInfo();
    }

    // Product Rendering with Image src
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        if (this.filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-light);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button class="btn primary" onclick="store.clearFilters()" style="margin-top: 1rem;">
                        Clear All Filters
                    </button>
                </div>
            `;
            return;
        }

        this.filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });

        this.updateResultsInfo();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.src}" 
                     alt="${product.alt || product.name}" 
                     class="product-img"
                     loading="lazy"
                     onerror="store.handleImageError(this)">
                <div class="product-badges">
                    ${product.onSale ? '<span class="badge-sale">SALE</span>' : ''}
                    ${product.isNew ? '<span class="badge-new">NEW</span>' : ''}
                    ${!product.inStock ? '<span class="badge-out">OUT OF STOCK</span>' : ''}
                </div>
                <button class="wishlist-btn ${this.wishlist.includes(product.id) ? 'active' : ''}" 
                        onclick="store.toggleWishlist(${product.id})">
                    <i class="${this.wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="product-content">
                <div class="product-category">${this.formatCategory(product.category)}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${this.generateStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-features">
                    ${product.features.slice(0, 2).map(feature => `
                        <div class="feature">
                            <i class="fas fa-check"></i>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="product-actions">
                    <button class="btn primary" onclick="store.addToCart(${product.id})" 
                            ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="btn secondary quick-view" onclick="store.quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Cart Management
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                cartId: Date.now()
            });
        }

        this.saveCart();
        this.updateCartBadge();
        this.showToast('Product added to cart!', 'success');
        
        // If cart is open, update it
        if (document.getElementById('cartSidebar').classList.contains('active')) {
            this.renderCart();
        }
    }

    removeFromCart(cartId) {
        this.cart = this.cart.filter(item => item.cartId !== cartId);
        this.saveCart();
        this.updateCartBadge();
        this.renderCart();
        this.showToast('Product removed from cart', 'error');
    }

    updateQuantity(cartId, change) {
        const item = this.cart.find(item => item.cartId === cartId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(cartId);
                return;
            }
            this.saveCart();
            this.renderCart();
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.src}" 
                         alt="${item.alt || item.name}" 
                         class="cart-item-img"
                         loading="lazy"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="image-placeholder" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 1.5rem; background: #f8fafc; color: #64748b; border-radius: 6px;">
                        ${this.getPlaceholderEmoji(item.category)}
                    </div>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="store.updateQuantity(${item.cartId}, -1)">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" onclick="store.updateQuantity(${item.cartId}, 1)">+</button>
                        <button class="remove-item" onclick="store.removeFromCart(${item.cartId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getPlaceholderEmoji(category) {
        const emojis = {
            'laptops': '💻',
            'smartphones': '📱',
            'tablets': '📱',
            'accessories': '🎧'
        };
        return emojis[category] || '📦';
    }

    // Wishlist Management
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Removed from wishlist', 'error');
        } else {
            this.wishlist.push(productId);
            this.showToast('Added to wishlist!', 'success');
        }
        
        this.saveWishlist();
        this.updateWishlistBadge();
        this.renderProducts(); // Re-render to update heart icons
    }

    // Checkout Process
    openCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'error');
            return;
        }
        
        this.toggleCart();
        this.renderCheckout();
        document.getElementById('checkoutModal').style.display = 'block';
    }

    renderCheckout() {
        this.renderOrderSummary();
        this.calculateTotals();
    }

    renderOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <div class="order-item-info">
                    <img src="${item.src}" 
                         alt="${item.alt || item.name}" 
                         class="order-item-img"
                         loading="lazy"
                         onerror="this.style.display='none'">
                    <span>${item.name} × ${item.quantity}</span>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = document.querySelector('input[name="shipping"]:checked').value === 'express' ? 9.99 : 0;
        const total = subtotal + shipping;

        document.getElementById('reviewSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('reviewShipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('reviewTotal').textContent = `$${total.toFixed(2)}`;
    }

    nextStep(button) {
        const currentStep = document.querySelector('.checkout-step.active');
        const nextStepId = button.getAttribute('data-next');
        const nextStep = document.getElementById(`step${nextStepId}`);
        
        // Validate current step
        if (!this.validateStep(currentStep.id)) {
            return;
        }
        
        currentStep.classList.remove('active');
        nextStep.classList.add('active');
        
        // Update step indicator
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) <= parseInt(nextStepId)) {
                step.classList.add('active');
            }
        });
        
        if (nextStepId === '3') {
            this.calculateTotals();
        }
    }

    prevStep(button) {
        const currentStep = document.querySelector('.checkout-step.active');
        const prevStepId = button.getAttribute('data-prev');
        const prevStep = document.getElementById(`step${prevStepId}`);
        
        currentStep.classList.remove('active');
        prevStep.classList.add('active');
        
        // Update step indicator
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) <= parseInt(prevStepId)) {
                step.classList.add('active');
            }
        });
    }

    validateStep(stepId) {
        const inputs = document.querySelectorAll(`#${stepId} input[required]`);
        for (let input of inputs) {
            if (!input.value.trim()) {
                this.showToast('Please fill in all required fields', 'error');
                input.focus();
                return false;
            }
        }
        return true;
    }

    placeOrder(e) {
        e.preventDefault();
        
        // Simulate order processing
        this.showToast('Order placed successfully!', 'success');
        
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartBadge();
        
        // Close modals
        this.closeModal(document.getElementById('checkoutModal'));
        
        // Reset checkout form
        document.getElementById('checkoutForm').reset();
        document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        document.querySelector('.step[data-step="1"]').classList.add('active');
    }

    // Quick View with Image src
    quickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('quickViewModal');
        const content = document.getElementById('quickViewContent');
        
        content.innerHTML = `
            <div class="quick-view-product">
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="${product.src}" 
                             alt="${product.alt || product.name}" 
                             class="quick-view-img"
                             loading="lazy"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="image-placeholder" style="display: none; width: 100%; height: 300px; align-items: center; justify-content: center; font-size: 4rem; background: #f8fafc; color: #64748b; border-radius: 8px;">
                            ${this.getPlaceholderEmoji(product.category)}
                        </div>
                    </div>
                </div>
                <div class="product-details">
                    <h2>${product.name}</h2>
                    <div class="product-rating">
                        <div class="stars">${this.generateStars(product.rating)}</div>
                        <span class="rating-count">${product.rating} (${product.reviewCount} reviews)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice > product.price ? 
                            `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    </div>
                    <p class="product-description">High-quality product with excellent features and performance. Perfect for everyday use with premium build quality.</p>
                    <div class="product-features">
                        <h4>Features:</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                    <div class="product-actions">
                        <button class="btn primary" onclick="store.addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="btn secondary" onclick="store.toggleWishlist(${product.id})">
                            <i class="${this.wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
                            ${this.wishlist.includes(product.id) ? 'Remove from' : 'Add to'} Wishlist
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    // UI Helpers
    toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
        this.renderCart();
    }

    closeModal(modal) {
        modal.closest('.modal').style.display = 'none';
    }

    updateResultsInfo() {
        const count = document.getElementById('resultsCount');
        const activeFilters = document.getElementById('activeFilters');
        
        count.textContent = `${this.filteredProducts.length} products`;
        
        const activeFilterCount = Object.values(this.currentFilters).reduce((count, filter) => {
            if (Array.isArray(filter)) return count + filter.length;
            if (filter && typeof filter === 'object') return count + (filter.min > 0 || filter.max < 2000 ? 1 : 0);
            if (filter) return count + 1;
            return count;
        }, 0);
        
        if (activeFilterCount > 0) {
            activeFilters.textContent = `${activeFilterCount} active filters`;
            activeFilters.style.display = 'block';
        } else {
            activeFilters.style.display = 'none';
        }
    }

    updateCartBadge() {
        const badge = document.querySelector('#cartBtn .badge');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    updateWishlistBadge() {
        const badge = document.querySelector('#wishlistBtn .badge');
        badge.textContent = this.wishlist.length;
        badge.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
    }

    showToast(message, type = '') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Local Storage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.store = new ECommerceStore();
});