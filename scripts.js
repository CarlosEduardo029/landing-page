// Constantes e Variáveis
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');
const pricingToggle = document.getElementById('billing-toggle');
const backToTopBtn = document.getElementById('back-to-top');
const cookiesBanner = document.getElementById('cookies-consent');

// Estado da aplicação
const state = {
    isDarkMode: false,
    isAnnualBilling: false,
    currentTestimonialIndex: 0
};

// Utilitários
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Header Scroll Effect
const handleScroll = () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        backToTopBtn.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        backToTopBtn.classList.remove('visible');
    }
};

window.addEventListener('scroll', debounce(handleScroll, 10));

// Menu Mobile
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Fechar menu mobile ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Tema Escuro
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    state.isDarkMode = !state.isDarkMode;
    localStorage.setItem('darkMode', state.isDarkMode);
    
    // Atualiza o ícone do botão
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = state.isDarkMode ? '☀️' : '🌙';
};

// Inicializar tema baseado na preferência salva
const initTheme = () => {
    state.isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (state.isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = state.isDarkMode ? '☀️' : '🌙';
};

themeToggle.addEventListener('click', toggleDarkMode);
initTheme();

// Preços Toggle Anual/Mensal
const updatePrices = () => {
    const prices = {
        basic: { monthly: 0, annual: 0 },
        pro: { monthly: 29, annual: 279 },
        enterprise: { monthly: 79, annual: 759 }
    };

    document.querySelectorAll('.price').forEach(priceEl => {
        const plan = priceEl.closest('.price-card').getAttribute('data-plan');
        const price = state.isAnnualBilling ? prices[plan].annual : prices[plan].monthly;
        priceEl.querySelector('.amount').textContent = price;
    });
};

pricingToggle.addEventListener('change', () => {
    state.isAnnualBilling = pricingToggle.checked;
    updatePrices();
});

// Carrossel de Depoimentos
class TestimonialsCarousel {
    constructor() {
        this.slider = document.querySelector('.testimonials-slider');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.totalCards = this.cards.length;
        this.currentIndex = 0;
        
        this.initControls();
        this.startAutoPlay();
    }

    initControls() {
        const controls = document.querySelector('.testimonial-controls');
        
        // Criar dots para navegação
        const dots = document.createElement('div');
        dots.className = 'testimonial-dots';
        
        for (let i = 0; i < this.totalCards; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dots.appendChild(dot);
        }
        
        controls.appendChild(dots);
        this.updateDots();
    }

    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        this.currentIndex = index;
        const offset = -index * 100;
        this.slider.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.goToSlide(this.currentIndex);
    }

    startAutoPlay() {
        setInterval(() => this.nextSlide(), 5000);
    }
}

// Inicializar carrossel
const testimonials = new TestimonialsCarousel();

// Animações de Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('aos-animate');
        }
    });
};

window.addEventListener('scroll', debounce(animateOnScroll, 10));

// Formulário de Contato
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    try {
        // Simular envio do formulário
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Feedback visual
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Enviado com sucesso!';
        submitBtn.classList.add('success');
        
        // Resetar formulário
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = 'Enviar Mensagem';
            submitBtn.classList.remove('success');
        }, 3000);
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
    }
});

// Newsletter
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    try {
        // Simular inscrição
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Feedback visual
        const button = newsletterForm.querySelector('button');
        button.textContent = 'Inscrito!';
        button.classList.add('success');
        
        // Resetar formulário
        setTimeout(() => {
            newsletterForm.reset();
            button.textContent = 'Inscrever-se';
            button.classList.remove('success');
        }, 3000);
    } catch (error) {
        console.error('Erro ao processar inscrição:', error);
    }
});

// Cookies Banner
const initCookiesBanner = () => {
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    
    if (!hasAcceptedCookies) {
        cookiesBanner.classList.add('visible');
    }
};

document.getElementById('accept-cookies')?.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookiesBanner.classList.remove('visible');
});

document.getElementById('reject-cookies')?.addEventListener('click', () => {
    cookiesBanner.classList.remove('visible');
});

// Botão Voltar ao Topo
backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scroll para links de ancoragem
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Detectar preferência de tema do sistema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
prefersDarkScheme.addEventListener('change', e => {
    if (!localStorage.getItem('darkMode')) {
        state.isDarkMode = e.matches;
        document.body.classList.toggle('dark-mode', state.isDarkMode);
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updatePrices();
    initCookiesBanner();
    animateOnScroll();
});

// Observador de Interseção para animações lazy
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(element => {
        observer.observe(element);
    });
};

observeElements();