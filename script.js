document.addEventListener('DOMContentLoaded', () => {
    
    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => {
        observer.observe(el);
    });


    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth Scroll for Anchor Links (Optional fallback/enhancement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }

                const headerOffset = 70; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    const currencyFormatter = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });
    const calcAreaInput = document.getElementById('calc-area');
    const calcBaseboardInput = document.getElementById('calc-baseboard');
    const calcTransitionsInput = document.getElementById('calc-transitions');
    const calcOldFloor = document.getElementById('calc-old-floor');
    const calcPrep = document.getElementById('calc-prep');
    const totalDisplay = document.getElementById('calculator-total');
    const breakdownList = document.getElementById('calculator-breakdown');

    const prices = {
        demontaz: 40, // Kč / m²
        odvoz: 30,
        prebrouseni: 150,
        vysati: 20,
        pokladka: 240,
        listyInstall: 120,
        prechodInstall: 150,
        vinyl: 649,
        listyMaterial: 249,
        prechodMaterial: 160,
        doprava: 600,
        manipulace: 900
    };

    const formatPrice = (value) => `${currencyFormatter.format(Math.round(value))} Kč`;

    const updateCalculator = () => {
        const area = Math.max(parseFloat(calcAreaInput?.value) || 0, 0);
        const baseboard = Math.max(parseFloat(calcBaseboardInput?.value) || 0, 0);
        const transitions = Math.max(parseInt(calcTransitionsInput?.value, 10) || 0, 0);
        const lines = [];
        let total = 0;

        const addLine = (label, amount) => {
            if (amount <= 0) return;
            lines.push({ label, amount });
            total += amount;
        };

        if (area > 0) {
            if (calcOldFloor?.checked) {
                addLine('Demontáž staré podlahy (40 Kč/m²)', area * prices.demontaz);
                addLine('Odvoz a likvidace (30 Kč/m²)', area * prices.odvoz);
            }
            if (calcPrep?.checked) {
                addLine('Přebroušení podkladu (150 Kč/m²)', area * prices.prebrouseni);
                addLine('Vysátí podkladu (20 Kč/m²)', area * prices.vysati);
            }

            addLine('Pokládka click vinylu (240 Kč/m²)', area * prices.pokladka);
            if (baseboard > 0) {
                addLine('Montáž soklových lišt (120 Kč/bm)', baseboard * prices.listyInstall);
            }
            if (transitions > 0) {
                addLine('Instalace přechodových lišt (150 Kč/ks)', transitions * prices.prechodInstall);
            }

            addLine('Vinylový materiál (649 Kč/m²)', area * prices.vinyl);
            if (baseboard > 0) {
                addLine('Soklové lišty (249 Kč/bm)', baseboard * prices.listyMaterial);
            }
            if (transitions > 0) {
                addLine('Přechodové lišty (160 Kč/ks)', transitions * prices.prechodMaterial);
            }

            addLine('Doprava na místo (600 Kč)', prices.doprava);
            addLine('Manipulace a výnos materiálu (900 Kč)', prices.manipulace);
        }

        if (area <= 0) {
            breakdownList.innerHTML = '<li>Zadejte výměru podlahy pro orientační výpočet.</li>';
            totalDisplay.textContent = '0 Kč';
            return;
        }

        breakdownList.innerHTML = lines.map(line => `
            <li>
                <span>${line.label}</span>
                <span>${formatPrice(line.amount)}</span>
            </li>
        `).join('');
        totalDisplay.textContent = formatPrice(total);
    };

    [calcAreaInput, calcBaseboardInput, calcTransitionsInput].forEach(input => {
        input?.addEventListener('input', updateCalculator);
    });
    [calcOldFloor, calcPrep].forEach(input => {
        input?.addEventListener('change', updateCalculator);
    });

    updateCalculator();
});
