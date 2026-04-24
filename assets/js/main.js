/* ================================================
   CardioMind AILab — Main JavaScript
   ================================================ */

(function () {
    'use strict';

    // ---------- Preloader ----------
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.getElementById('preloader').classList.add('hidden');
        }, 1800);
    });

    // ---------- Navbar Scroll ----------
    var navbar = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        var scrollPos = window.scrollY + 200;
        sections.forEach(function (section) {
            var id = section.getAttribute('id');
            if (!id) return;
            var top = section.offsetTop;
            var height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ---------- Mobile Nav ----------
    var navToggle = document.getElementById('navToggle');
    var navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // ---------- Smooth Scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ---------- Stat Counter Animation ----------
    function animateCounters() {
        var counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(function (counter) {
            if (counter.dataset.animated) return;
            var rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                counter.dataset.animated = 'true';
                var target = parseInt(counter.dataset.count);
                var duration = 2000;
                var start = 0;
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var ease = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(ease * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target;
                    }
                }

                requestAnimationFrame(step);
            }
        });
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // ---------- Particle Canvas ----------
    var canvas = document.getElementById('particleCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var connections = [];
        var mouse = { x: null, y: null };

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        var count = Math.min(Math.floor(window.innerWidth / 12), 80);
        for (var i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(function (p, index) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null) {
                    var dx = mouse.x - p.x;
                    var dy = mouse.y - p.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        p.x -= dx * 0.01;
                        p.y -= dy * 0.01;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 212, 255, ' + p.opacity + ')';
                ctx.fill();

                // Draw connections
                for (var j = index + 1; j < particles.length; j++) {
                    var p2 = particles[j];
                    var ddx = p.x - p2.x;
                    var ddy = p.y - p2.y;
                    var distance = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.06 * (1 - distance / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ---------- Contact Form ----------
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00c853, #00e676)';
            setTimeout(function () {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                form.reset();
            }, 3000);
        });
    }

    // ---------- AOS Init ----------
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            disable: function () { return window.innerWidth < 768; }
        });
    }

})();
