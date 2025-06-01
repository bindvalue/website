// JavaScript para a Landing Page da BindValue.dev

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const header = document.getElementById('main-header');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const navLinks = document.querySelectorAll('.nav a');
    const overlay = document.createElement('div');
    
    // Configurar overlay
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Função para verificar o scroll e atualizar o header
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        const logoImg = document.getElementById('main-logo-img');

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            if (logoImg) {
                logoImg.src = 'images/logo_bindvalue_light.webp';
            }
        } else {
            header.classList.remove('scrolled');
            if (logoImg) {
                logoImg.src = 'images/logo_bindvalue.webp';
            }
        }
    }

    // Função para ativar o fallback quando a imagem falhar
    function handleLogoError(imgElement) {
        const logoContainer = imgElement.closest('.logo');
        if (logoContainer) {
            logoContainer.classList.add('logo-image-failed');
        }
    }

    // Executa após o DOM carregar
    document.addEventListener('DOMContentLoaded', function () {
        const logoImages = document.querySelectorAll('.logo-image');

        logoImages.forEach(function (img) {
            // Se a imagem já falhou ao carregar
            if (!img.complete || img.naturalWidth === 0) {
                handleLogoError(img);
            }

            // Caso falhe após o carregamento
            img.onerror = () => handleLogoError(img);
        });
    });
    // Verificar scroll inicial
    checkScroll();
    
    // Adicionar evento de scroll
    window.addEventListener('scroll', checkScroll);
    
    // Abrir menu mobile
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Fechar menu mobile
    function closeMenuMobile() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeMenu.addEventListener('click', closeMenuMobile);
    overlay.addEventListener('click', closeMenuMobile);
    
    // Fechar menu ao clicar em links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenuMobile);
    });
    
    // Atualizar links ativos no menu
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Verificar links ativos no carregamento e no scroll
    setActiveNavLink();
    window.addEventListener('scroll', setActiveNavLink);
    
    // Manter o código JavaScript original abaixo
    
    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fechar outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle atual
            item.classList.toggle('active');
        });
    });
    
    // Testimonial Slider
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Inicializar slider
    showTestimonial(currentTestimonial);
    
    // Adicionar eventos aos dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentTestimonial = i;
            showTestimonial(currentTestimonial);
        });
    });
    
    // Auto-rotação do slider
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 6000);
    
    // Formulário de contato
    const contactForm = document.getElementById('demo-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de envio de formulário
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular processamento
            setTimeout(() => {
                // Mostrar mensagem de sucesso
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h3>Solicitação enviada com sucesso!</h3>
                    <p>Entraremos em contato em breve para agendar sua demonstração.</p>
                `;
                
                // Substituir formulário pela mensagem
                contactForm.innerHTML = '';
                contactForm.appendChild(successMessage);
                
                // Estilizar mensagem de sucesso
                successMessage.style.textAlign = 'center';
                successMessage.style.padding = '30px';
                
                const successIcon = successMessage.querySelector('.success-icon');
                successIcon.style.width = '70px';
                successIcon.style.height = '70px';
                successIcon.style.background = 'linear-gradient(135deg, #FF6B35 0%, #1A2A56 100%)';
                successIcon.style.borderRadius = '50%';
                successIcon.style.display = 'flex';
                successIcon.style.justifyContent = 'center';
                successIcon.style.alignItems = 'center';
                successIcon.style.margin = '0 auto 20px';
                successIcon.style.color = '#fff';
                successIcon.style.fontSize = '30px';
            }, 1500);
        });
    }
});
