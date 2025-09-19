// ===== MODAL MANAGEMENT MODULE (General) =====
const ModalManager = (() => {
    const showModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }
    };

    const hideModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            // Restore body scrolling
            document.body.style.overflow = '';
        }
    };

    const setupCloseButtons = () => {
        document.querySelectorAll('.close-modal-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetModalId = e.currentTarget.dataset.target;
                hideModal(targetModalId);
            });
        });
    };

    return {
        showModal,
        hideModal,
        setupCloseButtons
    };
})();

// ===== NAVIGATION MODULE =====
const NavigationManager = (() => {
    const toggleMobileNav = () => {
        const navLinks = document.getElementById('nav-links');
        const hamburger = document.getElementById('hamburger');

        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    };

    const highlightActiveNavLink = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            // Exclude admin-settings-link from active state logic for scroll
            if (link.id !== 'admin-settings-link') {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === currentSection) {
                    link.classList.add('active');
                }
            }
        });
    };

    const setupClickOutside = () => {
        document.addEventListener('click', (e) => {
            const navLinks = document.getElementById('nav-links');
            const hamburger = document.getElementById('hamburger');
            const profileDropdown = document.getElementById('profile-dropdown');
            const profileButton = document.querySelector('.profile-button');

            // Close mobile nav if open and click is outside
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }

            // Close profile dropdown if open and click is outside
            if (profileDropdown.classList.contains('show') && !profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }

            // Close modals if click is outside modal content (but not on the modal itself if it's not directly inside the modal wrapper)
            // This is handled by not making the modal clickable outside, but only the close button.
            // For this setup, we rely on close buttons.
        });
    };

    return {
        toggleMobileNav,
        highlightActiveNavLink,
        setupClickOutside
    };
})();

// ===== INITIALIZATION (Main) =====
document.addEventListener('DOMContentLoaded', function() {
    // Setup modal close buttons
    ModalManager.setupCloseButtons();

    // Setup mobile navigation
    document.getElementById('hamburger').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent dropdown from closing immediately
        NavigationManager.toggleMobileNav();
    });

    // Setup click outside listeners for nav and dropdown
    NavigationManager.setupClickOutside();

    // Highlight active nav link on scroll
    window.addEventListener('scroll', NavigationManager.highlightActiveNavLink);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore href="#"

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                document.getElementById('nav-links').classList.remove('active');
                document.getElementById('hamburger').classList.remove('active');
            }
        });
    });
});