(function () {
  "use strict";

  // Original loading transition.
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (preloader) preloader.classList.add("hidden");
  }
  window.addEventListener("load", function () {
    window.setTimeout(hidePreloader, 900);
  });
  window.setTimeout(hidePreloader, 4000);

  // Original interactive particle network in the hero.
  var canvas = document.getElementById("particleCanvas");
  if (canvas && canvas.getContext && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var context = canvas.getContext("2d");
    var particles = [];
    var mouse = { x: null, y: null };
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      var bounds = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = [];
      var count = Math.min(Math.floor(bounds.width / 16), 72);
      for (var particleIndex = 0; particleIndex < count; particleIndex += 1) {
        particles.push({
          x: Math.random() * bounds.width,
          y: Math.random() * bounds.height,
          vx: (Math.random() - 0.5) * 0.42,
          vy: (Math.random() - 0.5) * 0.42,
          radius: Math.random() * 1.35 + 0.45,
          opacity: Math.random() * 0.35 + 0.12,
        });
      }
    }

    canvas.addEventListener("pointermove", function (event) {
      var bounds = canvas.getBoundingClientRect();
      mouse.x = event.clientX - bounds.left;
      mouse.y = event.clientY - bounds.top;
    });
    canvas.addEventListener("pointerleave", function () {
      mouse.x = null;
      mouse.y = null;
    });

    function animateParticles() {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      particles.forEach(function (particle, index) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        if (mouse.x !== null) {
          var pointerX = mouse.x - particle.x;
          var pointerY = mouse.y - particle.y;
          var pointerDistance = Math.hypot(pointerX, pointerY);
          if (pointerDistance < 140) {
            particle.x -= pointerX * 0.008;
            particle.y -= pointerY * 0.008;
          }
        }
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(0,212,255," + particle.opacity + ")";
        context.fill();
        for (var connectionIndex = index + 1; connectionIndex < particles.length; connectionIndex += 1) {
          var other = particles[connectionIndex];
          var distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 115) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = "rgba(0,212,255," + 0.1 * (1 - distance / 115) + ")";
            context.lineWidth = 0.55;
            context.stroke();
          }
        }
      });
      window.requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animateParticles();
  }

  var navbar = document.getElementById("navbar");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

  function updateNavigation() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 18);
    var marker = window.scrollY + 150;
    var current = "home";
    sections.forEach(function (section) {
      if (marker >= section.offsetTop) current = section.id;
    });
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove("active");
    navLinks.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开导航");
    document.body.classList.remove("menu-open");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var opening = !navLinks.classList.contains("active");
      navToggle.classList.toggle("active", opening);
      navLinks.classList.toggle("active", opening);
      navToggle.setAttribute("aria-expanded", String(opening));
      navToggle.setAttribute("aria-label", opening ? "关闭导航" : "打开导航");
      document.body.classList.toggle("menu-open", opening);
    });
    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateNavigation();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  updateNavigation();

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".event-track");
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".event-slide"));
    var dotsContainer = carousel.querySelector(".carousel-dots");
    var previous = carousel.querySelector(".carousel-prev");
    var next = carousel.querySelector(".carousel-next");
    var interval = Number(carousel.dataset.interval) || 6000;
    var index = 0;
    var timer = null;

    if (!track || slides.length === 0) return;

    slides.forEach(function (_, slideIndex) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (slideIndex === 0 ? " active" : "");
      dot.setAttribute("aria-label", "查看第 " + (slideIndex + 1) + " 个活动");
      dot.addEventListener("click", function () {
        show(slideIndex);
        restart();
      });
      dotsContainer.appendChild(dot);
    });

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      slides.forEach(function (slide, slideIndex) {
        slide.setAttribute("aria-hidden", String(slideIndex !== index));
      });
      Array.prototype.slice.call(dotsContainer.children).forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }
    function start() {
      if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setInterval(function () {
        show(index + 1);
      }, interval);
    }
    function restart() {
      stop();
      start();
    }

    if (previous)
      previous.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    if (next)
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);
    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        show(index - 1);
        restart();
      }
      if (event.key === "ArrowRight") {
        show(index + 1);
        restart();
      }
    });
    if (slides.length < 2) carousel.querySelector(".carousel-controls").style.display = "none";
    start();
  });

  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
  var contentCards = Array.prototype.slice.call(document.querySelectorAll("[data-content-type]"));
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.filter;
      filters.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      contentCards.forEach(function (card) {
        card.classList.toggle("hidden", filter !== "all" && card.dataset.contentType !== filter);
      });
    });
  });

  function openQrPreview(image) {
    var modal = document.createElement("div");
    modal.className = "qr-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", image.alt);
    modal.innerHTML =
      '<div class="qr-modal-panel"><button class="qr-modal-close" type="button" aria-label="关闭二维码">×</button><img src="' +
      image.src +
      '" alt="' +
      image.alt +
      '"><p>' +
      image.alt +
      "，请使用对应平台扫码关注</p></div>";
    document.body.appendChild(modal);
    document.body.classList.add("menu-open");
    var escapeHandler = function (event) {
      if (event.key === "Escape" && document.body.contains(modal)) close();
    };
    var close = function () {
      document.removeEventListener("keydown", escapeHandler);
      modal.remove();
      document.body.classList.remove("menu-open");
      image.focus();
    };
    modal.querySelector(".qr-modal-close").addEventListener("click", close);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) close();
    });
    document.addEventListener("keydown", escapeHandler);
    modal.querySelector(".qr-modal-close").focus();
  }

  document.querySelectorAll(".social-qr").forEach(function (image) {
    image.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openQrPreview(image);
    });
    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openQrPreview(image);
      }
    });
  });

  // Reintroduce the original scroll-entry language across data-driven sections.
  document.querySelectorAll(".section-heading, .community-copy, .join-panel").forEach(function (element) {
    if (!element.hasAttribute("data-aos")) element.setAttribute("data-aos", "fade-up");
  });
  document.querySelectorAll(".content-card, .product-card, .social-card").forEach(function (element, index) {
    element.setAttribute("data-aos", "fade-up");
    element.setAttribute("data-aos-delay", String((index % 3) * 90));
  });
  document.querySelectorAll(".event-shell").forEach(function (element) {
    element.setAttribute("data-aos", "zoom-in-up");
  });
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 820,
      easing: "ease-out-cubic",
      once: true,
      offset: 55,
      disable: function () {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      },
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
