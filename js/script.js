const SITE_CONFIG = {
    businessName: 'Barber Pro',
    whatsappNumber: '551199999999',
    phone: '(11) 99999-9999',
    email: 'seuemail@exemplo.com',
    address: 'Rua Exemplo, 123 — Cidade'
};

function applySiteConfig() {
    document.title = SITE_CONFIG.businessName;

    const businessNameHeader = document.getElementById('businessNameHeader');
    const businessNameFooter = document.getElementById('businessNameFooter');
    const businessEmail = document.getElementById('businessEmail');
    const businessPhone = document.getElementById('businessPhone');
    const businessAddress = document.getElementById('businessAddress');
    const whatsappFloatLink = document.getElementById('whatsappFloatLink');

    if (businessNameHeader) businessNameHeader.textContent = SITE_CONFIG.businessName;
    if (businessNameFooter) businessNameFooter.textContent = SITE_CONFIG.businessName;
    if (businessEmail) businessEmail.textContent = SITE_CONFIG.email;
    if (businessPhone) businessPhone.textContent = SITE_CONFIG.phone;
    if (businessAddress) businessAddress.textContent = SITE_CONFIG.address;
    if (whatsappFloatLink) whatsappFloatLink.href = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
}

const banner = document.getElementById('banner');
const text = SITE_CONFIG.businessName;
let i = 0;

function typeWriter() {
    if (i < text.length) {
        banner.innerHTML += text.charAt(i);
        banner.style.opacity = '1';
        i++;
        setTimeout(typeWriter, 100);
    } else {
        // Após a digitação, mostrar os outros elementos
        document.querySelector('nav').style.display = 'flex';

        const portfolio = document.querySelector('.portfolio');
        portfolio.style.display = 'block';
        portfolio.classList.add('show');
        // Fazer o carrossel começar da segunda imagem
        setTimeout(() => {
            const imageContainer = document.querySelector('.image-container');
            if (imageContainer) {
                const containerWidth = imageContainer.offsetWidth + 10; // 10px de margin
                portfolio.scrollLeft = containerWidth;
            }

            const testimonialCarousel = document.querySelector('.testimonials .cards');
            const testimonialCard = document.querySelector('.testimonial-card');
            if (testimonialCarousel && testimonialCard) {
                testimonialCarousel.scrollLeft = testimonialCard.offsetWidth + 20;
            }
        }, 100);
        document.querySelector('.about').style.display = 'block';
        document.querySelector('.testimonials').style.display = 'block';
        document.querySelector('.contatos').style.display = 'block';
    }
}

window.onload = () => {
    applySiteConfig();
    typeWriter();
    setupContactSteps();
};

function sendToWhatsApp(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const whatsappNumber = SITE_CONFIG.whatsappNumber;

    const text = `Nome: ${name}%0AEmail: ${email}%0AMensagem: ${message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    window.open(whatsappUrl, '_blank');

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    showStep(1);
}

function isDestkop() {
    return window.innerWidth >= 768;
}

function setupContactSteps() {
     const submitButton = document.getElementById('whatsappSubmitButton');
    if(!isDestkop()){
        if (submitButton) {
            submitButton.style.display = 'block';
        } return;
    }
    const steps = document.querySelectorAll('.contact-step');
    const inputs = document.querySelectorAll('.contact-step input, .contact-step textarea');
    const updateSubmitButton = (step) => {
        if (!submitButton) return;
        submitButton.style.display = step === steps.length ? 'block' : 'none';
    };

    inputs.forEach((input) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const currentStep = Number(event.target.closest('.contact-step').dataset.step);

                if (currentStep < steps.length) {
                    showStep(currentStep + 1);
                } else {
                    document.getElementById('whatsappForm').requestSubmit();
                }
            }
        });

        input.addEventListener('focus', (event) => {
            const currentStep = Number(event.target.closest('.contact-step').dataset.step);
            updateSubmitButton(currentStep);
        });
    });

    updateSubmitButton(1);
}

function showStep(step) {
    const steps = document.querySelectorAll('.contact-step');
    const indicator = document.querySelector('.step-indicator');
    const submitButton = document.getElementById('whatsappSubmitButton');

    steps.forEach((stepElement) => {
        const stepIndex = Number(stepElement.dataset.step);
        const isVisible = stepIndex <= step;
        stepElement.classList.toggle('visible', isVisible);
        stepElement.classList.toggle('active', stepIndex === step);
    });

    if (indicator) {
        indicator.textContent = `Passo ${step} de ${steps.length}`;
    }

    if (submitButton) {
        submitButton.style.display = step === steps.length ? 'block' : 'none';
    }

    const activeInput = document.querySelector(`.contact-step[data-step="${step}"] input, .contact-step[data-step="${step}"] textarea`);
    if (activeInput) {
        activeInput.focus();
    }
}

function scrollTestimonial(direction) {
    const carousel = document.querySelector('.testimonials .cards');
    const card = document.querySelector('.testimonial-card');
    if (!carousel || !card) return;
    const gap = 20;
    const scrollAmount = card.offsetWidth + gap;
    const targetScroll = carousel.scrollLeft + direction * scrollAmount;
    carousel.scrollTo({ left: targetScroll, behavior: 'smooth' });
}

// Efeito de sombreamento ao fazer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    const maxScroll = header.offsetHeight;
    const opacity = Math.min(0.65 + (scrollPosition / maxScroll * 0.1), 0.75);
    header.style.setProperty('--shadow-opacity', opacity);
});

// Atualizar a variável CSS para o sombreamento
const style = document.createElement('style');
style.textContent = `
            header::before {
                background: rgba(0, 0, 0, var(--shadow-opacity, 0.65)) !important;
            }
        `;
document.head.appendChild(style);