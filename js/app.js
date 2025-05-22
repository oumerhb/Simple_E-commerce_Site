document.addEventListener('DOMContentLoaded', () => {
    
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.overlay');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const testimonialDots = document.querySelectorAll('.dot');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const orderCompleteModal = document.getElementById('order-complete-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const continueShopping = document.querySelector('.continue-shopping-btn');
    const newsletterForm = document.getElementById('newsletter-form');
    
    
    let cart = [];
    let currentSlide = 0;
    
    // Initialize
    init();
    
    // Initialize the app
    function init() {
        renderProducts();
        setupEventListeners();
        loadCartFromLocalStorage();
        updateCartCount();
    }
    
    // Setup Event Listeners
    function setupEventListeners() {
        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', filterProducts);
        });
        
        // Cart toggle
        cartToggle.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', toggleCart);
        overlay.addEventListener('click', closeOverlayDependents);
        
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Testimonial dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => changeTestimonialSlide(index));
        });
        
        // Checkout button
        checkoutBtn.addEventListener('click', openCheckoutModal);
        
        // Close modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeAllModals);
        });
        
        // Checkout form submission
        checkoutForm.addEventListener('submit', handleCheckout);
        
        // Continue shopping button
        continueShopping.addEventListener('click', closeAllModals);
        
        // Newsletter form
        newsletterForm.addEventListener('submit', handleNewsletter);
    }
    
    // Render products to the grid
    function renderProducts(category = 'all') {
        productGrid.innerHTML = '';
        
        let productsToRender = products;
        if (category !== 'all') {
            productsToRender = products.filter(product => product.category === category);
        }
        
        productsToRender.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
        
        // Add event listeners to the quick view buttons and add to cart buttons
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', openQuickView);
        });
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
    }
    
    // Create a product card element
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        
        card.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-btns">
                    <div class="product-btn quick-view-btn" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <div class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Filter products by category
    function filterProducts() {
        const category = this.getAttribute('data-filter');
        
        // Update active button
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Render filtered products
        renderProducts(category);
    }
    
    // Toggle cart sidebar
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    
    // Close overlay dependents (cart, mobile menu)
    function closeOverlayDependents() {
        cartSidebar.classList.remove('open');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        closeAllModals();
    }
    
    // Change testimonial slide
    function changeTestimonialSlide(index) {
        testimonialSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        testimonialDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        testimonialSlides[index].style.display = 'flex';
        testimonialDots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Open quick view modal
    function openQuickView() {
        const productId = this.dataset.id;
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
        const modal = document.getElementById('quick-view-modal');
        const modalImage = document.getElementById('modal-product-image');
        const modalTitle = document.getElementById('modal-product-title');
        const modalPrice = document.getElementById('modal-product-price');
        const modalDescription = document.getElementById('modal-product-description');
        const modalAddToCart = document.getElementById('modal-add-to-cart');
        
        modalImage.src = product.image;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `$${product.price.toFixed(2)}`;
        modalDescription.textContent = product.description;
        modalAddToCart.dataset.id = product.id;
        
        // Add event listener to the add to cart button
        modalAddToCart.addEventListener('click', function() {
            addToCartById(product.id);
            closeAllModals();
        });
        
        // Add event listeners for quantity buttons
        const quantityDown = document.querySelector('.quantity-down');
        const quantityUp = document.querySelector('.quantity-up');
        const quantityInput = document.getElementById('product-quantity');
        
        quantityDown.addEventListener('click', function() {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
        
        quantityUp.addEventListener('click', function() {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });
        
        modal.classList.add('open');
        overlay.classList.add('active');
    }
    
    // Add to cart
    function addToCart() {
        const productId = this.dataset.id;
        addToCartById(productId);
    }
    
    // Add to cart by ID
    function addToCartById(productId, quantity = 1) {
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
        // Check if the product is already in the cart
        const existingCartItem = cart.find(item => item.id == productId);
        
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        // Save cart to localStorage
        saveCartToLocalStorage();
        
        // Update cart UI
        updateCartUI();
        updateCartCount();
        
        // Show a toast notification
        showToast(`${product.name} added to cart!`);
        
        // Open the cart
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
    }
    
    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Trigger reflow for animation
        toast.offsetHeight;
        
        // Add show class
        toast.classList.add('show');
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Update cart UI
    function updateCartUI() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalPrice = document.getElementById('cart-total-price');
        
        // Clear cart items container
        cartItemsContainer.innerHTML = '';
        
        // Check if cart is empty
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotalPrice.textContent = '$0.00';
            return;
        }
        
        let total = 0;
        
        // Add cart items
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <div class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
            
            total += item.price * item.quantity;
        });
        
        // Update total price
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons and remove buttons
        const decreaseBtns = document.querySelectorAll('.decrease-quantity');
        const increaseBtns = document.querySelectorAll('.increase-quantity');
        const removeBtns = document.querySelectorAll('.cart-item-remove');
        
        decreaseBtns.forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        increaseBtns.forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        removeBtns.forEach(btn => {
            btn.addEventListener('click', removeFromCart);
        });
    }
    
    // Update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCount.textContent = totalItems;
    }
    
    // Decrease quantity
    function decreaseQuantity() {
        const productId = this.dataset.id;
        const cartItem = cart.find(item => item.id == productId);
        
        if (cartItem) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
            } else {
                cart = cart.filter(item => item.id != productId);
            }
            
            saveCartToLocalStorage();
            updateCartUI();
            updateCartCount();
        }
    }
    
    // Increase quantity
    function increaseQuantity() {
        const productId = this.dataset.id;
        const cartItem = cart.find(item => item.id == productId);
        
        if (cartItem) {
            cartItem.quantity++;
            
            saveCartToLocalStorage();
            updateCartUI();
            updateCartCount();
        }
    }
    
    // Remove from cart
    function removeFromCart() {
        const productId = this.dataset.id;
        
        cart = cart.filter(item => item.id != productId);
        
        saveCartToLocalStorage();
        updateCartUI();
        updateCartCount();
    }
    
    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('habeshanCart', JSON.stringify(cart));
    }
    
    // Load cart from localStorage
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('habeshanCart');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }
    
    // Open checkout modal
    function openCheckoutModal() {
        if (cart.length === 0) {
            showToast('Your cart is empty!');
            return;
        }
        
        // Update checkout items
        updateCheckoutItems();
        
        // Open modal
        checkoutModal.classList.add('open');
        cartSidebar.classList.remove('open');
    }
    
    // Update checkout items
    function updateCheckoutItems() {
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutShipping = document.getElementById('checkout-shipping');
        const checkoutTotal = document.getElementById('checkout-total');
        
        checkoutItems.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            
            checkoutItem.innerHTML = `
                <div class="checkout-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="checkout-item-details">
                    <h4 class="checkout-item-title">${item.name}</h4>
                    <div class="checkout-item-price">
                        <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            `;
            
            checkoutItems.appendChild(checkoutItem);
            
            subtotal += item.price * item.quantity;
        });
        
        // Calculate shipping (free over $50)
        const shipping = subtotal >= 50 ? 0 : 5.99;
        const total = subtotal + shipping;
        
        checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        checkoutShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Handle checkout form submission
    function handleCheckout(e) {
        e.preventDefault();
        
        // Generate random order number
        const orderNumber = generateOrderNumber();
        document.getElementById('order-number').textContent = orderNumber;
        
        // Close checkout modal and open order complete modal
        checkoutModal.classList.remove('open');
        orderCompleteModal.classList.add('open');
        
        // Clear cart
        cart = [];
        saveCartToLocalStorage();
        updateCartUI();
        updateCartCount();
    }
    
    // Generate random order number
    function generateOrderNumber() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        
        let orderNumber = '';
        
        // Add 2 random letters
        for (let i = 0; i < 2; i++) {
            orderNumber += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        
        // Add 6 random numbers
        for (let i = 0; i < 6; i++) {
            orderNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        return orderNumber;
    }
    
    // Close all modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.classList.remove('open');
        });
        
        overlay.classList.remove('active');
    }
    
    
    function handleNewsletter(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            
            showToast('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        }
    }
    
    // Add CSS for toast notifications
    function addToastStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--success-color);
                color: white;
                padding: 12px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--box-shadow);
                z-index: 9999;
                opacity: 0;
                transform: translateY(100px);
                transition: all 0.3s ease;
            }
            
            .toast.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    addToastStyles();
    
    function autoRotateTestimonials() {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            changeTestimonialSlide(currentSlide);
        }, 5000);
    }
    
    changeTestimonialSlide(0);
    autoRotateTestimonials();
}); 