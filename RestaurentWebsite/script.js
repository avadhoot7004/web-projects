document.querySelector(".hamburger-menu").addEventListener("click", function() {
    const navLinks = document.querySelector(".nav-links");

    if (navLinks.classList.contains("active")) {
        navLinks.style.maxHeight = "0px"; // Collapse smoothly
        setTimeout(() => navLinks.classList.remove("active"), 400); // Remove class after animation
    } else {
        navLinks.classList.add("active");
        navLinks.style.maxHeight = "300px"; // Expand smoothly
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form-div form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        // Get all required inputs
        const requiredFields = form.querySelectorAll("input[required]");
        let isValid = true;

        // Check if all required fields are filled
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.border = "2px solid red"; // Highlight empty fields
            } else {
                field.style.border = ""; // Reset border if filled
            }
        });

        if (isValid) {
            alert("Booked successfully!");
            form.reset(); // Clear form after successful booking
        } else {
            alert("Please fill in all required fields.");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const datetimeInput = document.getElementById("datetime-input");

    function setMinDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const minDate = `${year}-${month}-${day}T09:00`; // Today at 9 AM
        datetimeInput.min = minDate;
    }

    datetimeInput.addEventListener("input", function () {
        const selectedDate = new Date(this.value);
        const hours = selectedDate.getHours();

        // If the selected time is before 9 AM or after 11 PM, reset input
        if (hours < 9 || hours > 23) {
            alert("Please select a time between 9 AM and 11 PM.");
            this.value = ""; // Clear invalid input
        }
    });

    setMinDateTime();
});


document.addEventListener("DOMContentLoaded", function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const minDateTime = `${year}-${month}-${day}T00:00`; // Midnight today

    document.getElementById("datetime-catering").min = minDateTime;
});

document.addEventListener("DOMContentLoaded", function () {
    const cartContainer = document.querySelector(".items-in-cart");
    const cartCount = document.getElementById("cart-items");
    const emptyMessage = document.getElementById("empty-message");
    const checkoutContainer = document.querySelector(".items-checkout");
    const buyNowButton = document.querySelector(".buy-now");

    function getCartItems() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCartItems(cartItems) {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCartCount();
    }

    function updateCartCount() {
        const cartItems = getCartItems();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;
        localStorage.setItem("cartCount", totalItems);
    }

    function loadCartCount() {
        const savedCount = localStorage.getItem("cartCount");
        if (savedCount && cartCount) {
            cartCount.textContent = savedCount;
        }
    }

    function updateCheckoutSection() {
        if (!checkoutContainer) return;

        let cartItems = getCartItems();
        checkoutContainer.innerHTML = "";

        cartItems.forEach(item => {
            const itemRow = document.createElement("div");
            itemRow.classList.add("checkout-item");
            itemRow.style.display = "grid";
            itemRow.style.gridTemplateColumns = "1fr auto";
            itemRow.style.justifyContent = "space-between";
            itemRow.style.marginBottom = "10px";

            const itemNameDiv = document.createElement("div");
            itemNameDiv.classList.add("item-name");
            itemNameDiv.textContent = `${item.name} x ${item.quantity}`;

            const itemPriceDiv = document.createElement("div");
            itemPriceDiv.classList.add("item-price");
            itemPriceDiv.textContent = `${item.price}`;
            itemPriceDiv.style.textAlign = "right";

            itemRow.appendChild(itemNameDiv);
            itemRow.appendChild(itemPriceDiv);
            checkoutContainer.appendChild(itemRow);
        });

        updateTotalPrice();
    }

    function updateTotalPrice() {
        let total = 0;
        let cartItems = getCartItems();

        cartItems.forEach(item => {
            total += parseInt(item.price.replace("₹", "")) * item.quantity;
        });

        const totalPriceElement = document.createElement("h5");
        totalPriceElement.textContent = `Total: ₹${total}`;
        totalPriceElement.style.marginTop = "15px";
        totalPriceElement.style.borderTop = "1px solid #ccc";
        totalPriceElement.style.paddingTop = "10px";
        checkoutContainer.appendChild(totalPriceElement);
    }

    function addToCart(event) {
        const item = event.target.closest(".item");
        const itemName = item.querySelector("h5").textContent;
        const itemPrice = item.querySelector("p").textContent;
        const imageSrc = item.querySelector("img").src;

        let cartItems = getCartItems();
        let existingItem = cartItems.find(cartItem => cartItem.name === itemName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ name: itemName, price: itemPrice, image: imageSrc, quantity: 1 });
        }

        saveCartItems(cartItems);
        updateCartCount();
        updateCheckoutSection();
    }

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    if (addToCartButtons.length) {
        addToCartButtons.forEach(button => {
            button.addEventListener("click", addToCart);
        });
    }

    if (cartContainer) {
        let cartItems = getCartItems();
        cartContainer.innerHTML = "";

        if (cartItems.length === 0) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.style.display = "none";

            cartItems.forEach(cartItem => {
                const cartItemDiv = document.createElement("div");
                cartItemDiv.classList.add("item-with-pic");
                cartItemDiv.innerHTML = `
                    <img src="${cartItem.image}" alt="${cartItem.name}" width="100">
                    <div class="description-quantity-price">
                        <p id="item-name">${cartItem.name}</p>
                        <label for="quantity">Quantity</label>
                        <input type="number" min="1" value="${cartItem.quantity}">
                        <p id="item-price">${cartItem.price}</p>
                        <a href="#" class="remove-item">Remove</a>
                    </div>
                `;
                cartContainer.appendChild(cartItemDiv);

                cartItemDiv.querySelector("input").addEventListener("change", function (e) {
                    let newQuantity = parseInt(e.target.value, 10);
                    if (newQuantity > 0) {
                        cartItem.quantity = newQuantity;
                        saveCartItems(cartItems);
                        updateCheckoutSection();
                    }
                });

                cartItemDiv.querySelector(".remove-item").addEventListener("click", function (e) {
                    e.preventDefault();
                    cartItems = cartItems.filter(ci => ci.name !== cartItem.name);
                    saveCartItems(cartItems);
                    cartItemDiv.remove();
                    updateCartCount();
                    updateCheckoutSection();
                });
            });
        }
        updateCartCount();
        updateCheckoutSection();
    }

    if (buyNowButton) {
        buyNowButton.addEventListener("click", function (e) {
            e.preventDefault();
            alert("Purchase successful!");
            localStorage.removeItem("cart");
            localStorage.removeItem("cartCount");
            cartContainer.innerHTML = "";
            checkoutContainer.innerHTML = "";
            updateCartCount();
        });
    }

    loadCartCount();
});

// search functionality

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-box input");
    const searchResults = document.createElement("div");
    searchResults.classList.add("search-results");
    document.querySelector(".search-box").appendChild(searchResults);
    searchResults.style.display = "none"; // Hide initially

    function fetchMenuItems(callback) {
        fetch("menu.html")
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const menuItems = [];

                doc.querySelectorAll(".category").forEach(category => {
                    const categoryTitle = category.querySelector("h2").textContent;
                    const categoryId = category.getAttribute("id");
                    category.querySelectorAll(".item").forEach(item => {
                        const itemName = item.querySelector("h5").textContent;
                        menuItems.push({ name: itemName, category: categoryTitle, id: categoryId });
                    });
                });

                callback(menuItems);
            });
    }

    fetchMenuItems(menuItems => {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            searchResults.innerHTML = "";
            
            if (query.length === 0) {
                searchResults.style.display = "none";
                return;
            }

            const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(query));
            
            if (filteredItems.length === 0) {
                searchResults.style.display = "none";
                return;
            }

            searchResults.style.display = "block";
            
            filteredItems.forEach(item => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("search-result-item");
                resultItem.textContent = item.name;
                resultItem.addEventListener("click", function () {
                    window.location.href = `menu.html#${item.id}`;
                });
                searchResults.appendChild(resultItem);
            });
        });
    });

    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none";
        }
    });
});