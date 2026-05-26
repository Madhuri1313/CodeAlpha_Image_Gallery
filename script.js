document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements Selector
    const loader = document.getElementById("loader");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxCategory = document.getElementById("lightbox-category");
    const imageCounter = document.getElementById("image-counter");
    const closeBtn = document.querySelector(".close-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const navLinks = document.querySelectorAll(".nav-links a");

    let activeItems = [...galleryItems]; // Track visible items inside the filtered context
    let currentIndex = 0;

    /* ==========================================
       1. PAGE INITIAL LOADER
       ========================================== */
    window.addEventListener("load", () => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.visibility = "hidden";
        }, 500);
    });

    // Fallback: Ensure loader disappears even if global load stalls slightly
    setTimeout(() => {
        if (loader && loader.style.visibility !== "hidden") {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }
    }, 2000);


    /* ==========================================
       2. CATEGORY FILTER SYSTEM
       ========================================== */
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from previous active button
            const activeFilter = document.querySelector(".filter-btn.active");
            if (activeFilter) activeFilter.classList.remove("active");
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            // Filter logic with smooth scaling animations
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute("data-category");
                
                if (filterValue === "all" || itemCategory === filterValue) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            });

            // Re-calculate context array of visible items for Lightbox index sync
            activeItems = galleryItems.filter(item => !item.classList.contains("hidden"));
        });
    });


    /* ==========================================
       3. LIGHTBOX SYSTEM OPERATIONS
       ========================================== */
    const updateLightbox = () => {
        if (activeItems.length === 0) return;
        
        const currentItem = activeItems[currentIndex];
        const imgTarget = currentItem.querySelector("img");
        const titleTarget = currentItem.querySelector(".item-title");
        const categoryTarget = currentItem.querySelector(".item-category");

        // Set info inside modal
        lightboxImg.src = imgTarget.src;
        lightboxImg.alt = imgTarget.alt;
        lightboxTitle.textContent = titleTarget.textContent;
        lightboxCategory.textContent = categoryTarget.textContent;
        
        // Update Counter display string
        imageCounter.textContent = `${currentIndex + 1} / ${activeItems.length}`;
    };

    const openLightbox = (index) => {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background body scroll
    };

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable background scrolling
    };

    const nextImage = () => {
        if (activeItems.length === 0) return;
        currentIndex = (currentIndex + 1) % activeItems.length; // Loop around to index 0 safely
        updateLightbox();
    };

    const prevImage = () => {
        if (activeItems.length === 0) return;
        currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length; // Anti-negative loop safety
        updateLightbox();
    };

    // Bind Click Events dynamically to current contextual active items
    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            // Locate correct item index within the currently filtered array pool
            const filterIndex = activeItems.indexOf(item);
            if (filterIndex !== -1) {
                openLightbox(filterIndex);
            }
        });
    });

    // Control Event Listeners
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (nextBtn) nextBtn.addEventListener("click", nextImage);
    if (prevBtn) prevBtn.addEventListener("click", prevImage);

    // Click outside image space to shut down Lightbox Overlay
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });


    /* ==========================================
       4. KEYBOARD NAVIGATION ACCESSIBILITY
       ========================================== */
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        
        if (e.key === "ArrowRight") {
            nextImage();
        } else if (e.key === "ArrowLeft") {
            prevImage();
        } else if (e.key === "Escape") {
            closeLightbox();
        }
    });


    /* ==========================================
       5. NEW: DYNAMIC NAVBAR SCROLL TRACKER
       ========================================== */
    const sections = document.querySelectorAll("main.gallery-container, section.info-section");
    
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Triggers when element occupies primary viewport zone
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});