document.addEventListener("DOMContentLoaded", () => {

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Dynamic Footer Year
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Typing Animation
    const typingText = document.getElementById("typing-text");
    const words = [
        "UI/UX Designer",
        "IT Student",
        "Front-End Builder"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        if (!typingText) return;

        const currentWord = words[wordIndex];

        if (deleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingText.textContent = currentWord.substring(0, charIndex);

        let speed = deleting ? 50 : 100;

        if (!deleting && charIndex === currentWord.length) {
            deleting = true;
            speed = 1500;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();

});

// =========================
// ACTIVE NAV LINK ON SCROLL
// =========================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 160;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
});

// =========================
// SCROLL REVEAL FOR CARDS
// =========================
const revealElements = document.querySelectorAll(
    ".about-card, .skill-card, .project-card, .contact-item, .contact-form"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach((el) => {
    el.classList.add("reveal-item");
    revealObserver.observe(el);
});

// =========================
// MOBILE MENU TOGGLE
// =========================
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-links");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// =========================
// SCROLL PROGRESS BAR
// =========================
const scrollProgress = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
    if (!scrollProgress) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
});

// =========================
// SUBTLE CURSOR SPOTLIGHT
// =========================
const spotlight = document.getElementById("cursor-spotlight");

if (spotlight && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
        spotlight.style.left = `${e.clientX}px`;
        spotlight.style.top = `${e.clientY}px`;
    });
}

// =========================
// ONE-CLICK COPY EMAIL TOAST
// =========================
const copyEmailBtn = document.getElementById("copy-email-btn");
const toast = document.getElementById("toast-notification");
let toastTimer;

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
        const email = "kelvinkenneth.parone@gmail.com";
        try {
            await navigator.clipboard.writeText(email);
            showToast("Email copied to clipboard!");
        } catch {
            showToast("Email: " + email);
        }
    });
}

// =========================
// REAL CONTACT FORM SUBMISSION (WEB3FORMS)
// =========================
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        const senderName = (formData.get("name") || "").toString().trim() || "there";

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }
        formStatus.textContent = "Sending your message...";

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                formStatus.textContent = `Thanks, ${senderName}! Your message has been sent.`;
                if (typeof showToast === "function") {
                    showToast("Message sent successfully!");
                }
                contactForm.reset();
            } else {
                formStatus.textContent = "Couldn't send right now. Please try again or email me directly.";
                if (typeof showToast === "function") {
                    showToast("Message failed to send.");
                }
            }
        } catch {
            formStatus.textContent = "Network error. Please email kelvinkenneth.parone@gmail.com directly.";
            if (typeof showToast === "function") {
                showToast("Network error while sending.");
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i data-lucide="send"></i>';
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        }
    });
}