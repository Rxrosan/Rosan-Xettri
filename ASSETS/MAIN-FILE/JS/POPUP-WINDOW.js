document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("close-popup");
    const carouselItems = document.querySelectorAll(".carousel-item");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const indicatorsContainer = document.querySelector(".carousel-indicators");
    
    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 5000; // 5 seconds
    
    // Create indicators
    carouselItems.forEach((_, index) => {
        const indicator = document.createElement("span");
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    const indicators = document.querySelectorAll(".carousel-indicators span");
    
    // Show the popup window
    function showPopup() {
        popup.classList.add("show");
        startAutoSlide();
    }
    
    // Close the popup window
    function closePopup() {
        popup.classList.remove("show");
        stopAutoSlide();
    }
    
    // Update carousel display
    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            item.classList.toggle("active", index === currentIndex);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = (index + carouselItems.length) % carouselItems.length;
        updateCarousel();
        resetAutoSlide();
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Auto slide functionality
    function startAutoSlide() {
        if (!autoSlideInterval) {
            autoSlideInterval = setInterval(nextSlide, slideDuration);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
    
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Event listeners
    closePopupButton.addEventListener("click", closePopup);
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);
    
    // Close when clicking outside content
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (popup.classList.contains("show")) {
            if (e.key === "Escape") {
                closePopup();
            } else if (e.key === "ArrowLeft") {
                prevSlide();
            } else if (e.key === "ArrowRight") {
                nextSlide();
            }
        }
    });
    
    // Initialize
    updateCarousel();
    showPopup();
});
