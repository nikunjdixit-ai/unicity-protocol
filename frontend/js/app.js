var currentPage = "";

function initApp() {
    currentPage = document.body.getAttribute("data-page");
    initNavigation();
    initCardEntrance();
    init3DEffects();
    initParallax();
    initScrollReveal();
    updateGreeting();
}

function initNavigation() {
    var nav = document.querySelector(".sidebar");
    if (!nav) return;
    var links = nav.querySelectorAll("a");
    links.forEach(function(link) {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

function updateGreeting() {
    var el = document.getElementById("greeting");
    if (!el) return;
    var hour = new Date().getHours();
    var greeting = "Good evening";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    el.textContent = greeting;
}

function initCardEntrance() {
    var cards = document.querySelectorAll(".card, .large-score, .verify-item, .premium-report");
    cards.forEach(function(card, i) {
        card.style.opacity = "0";
        card.style.transform = "translateY(24px)";
        setTimeout(function() {
            card.style.transition = "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 80 + i * 60);
    });
}

function init3DEffects() {
    var cards = document.querySelectorAll(".card, .large-score, .verify-item, .premium-report");
    cards.forEach(function(card) {
        var ticking = false;
        card.addEventListener("mousemove", function(e) {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function() {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -4;
                var rotateY = ((x - centerX) / centerX) * 4;
                var glareX = (x / rect.width) * 100;
                var glareY = (y / rect.height) * 100;
                card.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.015)";
                card.style.background = "radial-gradient(circle at " + glareX + "% " + glareY + "%, rgba(255,255,255,0.12), transparent 60%), var(--card-bg)";
                ticking = false;
            });
        });
        card.addEventListener("mouseleave", function() {
            card.style.transition = "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
            card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
            card.style.background = "";
            setTimeout(function() {
                card.style.transition = "";
            }, 500);
        });
        card.addEventListener("mouseenter", function() {
            card.style.transition = "box-shadow 0.3s ease";
        });
    });
}

function initParallax() {
    var mainContent = document.querySelector(".main-content");
    if (!mainContent || currentPage === "index.html") return;
    var sections = mainContent.querySelectorAll("section");
    function onScroll() {
        var scrollY = window.scrollY;
        sections.forEach(function(section, i) {
            var rect = section.getBoundingClientRect();
            var visible = rect.top < window.innerHeight && rect.bottom > 0;
            if (visible) {
                var offset = (rect.top / window.innerHeight) * 15;
                section.style.transform = "translateY(" + offset + "px)";
                section.style.transition = "transform 0.1s linear";
            }
        });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
}

function initScrollReveal() {
    var elements = document.querySelectorAll(".section-label, .metric-row, .timeline-item, .blockchain-item, .premium-feature");
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    elements.forEach(function(el, i) {
        el.style.opacity = "0";
        el.style.transform = "translateY(12px)";
        el.style.transition = "opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) " + (i % 8) * 0.04 + "s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) " + (i % 8) * 0.04 + "s";
        observer.observe(el);
    });
}

function navigateTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}

function formatScore(score) {
    return score + " / 100";
}

function getRiskClass(score) {
    if (score < 30) return "risk-low";
    if (score < 70) return "risk-medium";
    return "risk-high";
}

document.addEventListener("DOMContentLoaded", initApp);
