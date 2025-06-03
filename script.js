/**
 * BindValue.dev - JavaScript Principal
 * 
 * Este arquivo contém todas as funcionalidades JavaScript da landing page,
 * incluindo navegação, interações de UI, animações e formulários.
 * 
 * @author BindValue.dev
 * @version 1.1.0
 */

/**
 * Inicialização quando o DOM estiver completamente carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos os módulos
    HeaderController.init();
    MobileMenuController.init();
    NavigationController.init();
    FAQController.init();
    TestimonialSlider.init();
    ContactFormController.init();
    SmoothScroller.init();
});

/**
 * Controlador do Header
 * Gerencia comportamentos do cabeçalho, incluindo mudanças no scroll
 */
const HeaderController = {
    header: null,
    logoImg: null,
    scrollThreshold: 50,
    
    /**
     * Inicializa o controlador do header
     */
    init: function() {
        this.header = document.getElementById('main-header');
        this.logoImg = document.getElementById('main-logo-img');
        
        if (!this.header) return;
        
        // Verificar estado inicial
        this.checkScroll();
        
        // Adicionar listener de scroll
        window.addEventListener('scroll', this.checkScroll.bind(this));
        
        // Inicializar tratamento de erro de logo
        this.initLogoErrorHandling();
    },
    
    /**
     * Verifica a posição do scroll e atualiza o header conforme necessário
     */
    checkScroll: function() {
        const isScrolled = window.scrollY > this.scrollThreshold;
        
        // Atualizar classe do header
        this.header.classList.toggle('scrolled', isScrolled);
        
        // Atualizar logo se existir
        if (this.logoImg) {
            this.logoImg.src = isScrolled 
                ? 'images/logo_bindvalue_light.webp' 
                : 'images/logo_bindvalue.webp';
        }
    },
    
    /**
     * Inicializa o tratamento de erros para imagens de logo
     */
    initLogoErrorHandling: function() {
        const logoImages = document.querySelectorAll('.logo-image');
        
        logoImages.forEach(img => {
            // Verificar se a imagem já falhou ao carregar
            if (!img.complete || img.naturalWidth === 0) {
                this.handleLogoError(img);
            }
            
            // Adicionar handler para falhas futuras
            img.onerror = () => this.handleLogoError(img);
        });
    },
    
    /**
     * Trata erros de carregamento de imagens de logo
     * @param {HTMLImageElement} imgElement - Elemento de imagem que falhou
     */
    handleLogoError: function(imgElement) {
        const logoContainer = imgElement.closest('.logo');
        if (logoContainer) {
            logoContainer.classList.add('logo-image-failed');
        }
    }
};

/**
 * Controlador do Menu Mobile
 * Gerencia a abertura, fechamento e interações do menu mobile
 */
const MobileMenuController = {
    mobileMenu: null,
    menuToggle: null,
    closeMenu: null,
    overlay: null,
    mobileNavLinks: null,
    
    /**
     * Inicializa o controlador do menu mobile
     */
    init: function() {
        this.mobileMenu = document.getElementById('mobile-menu');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.closeMenu = document.querySelector('.close-menu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav a');
        
        if (!this.mobileMenu || !this.menuToggle) return;
        
        // Criar e configurar overlay
        this.createOverlay();
        
        // Adicionar event listeners
        this.menuToggle.addEventListener('click', this.openMenu.bind(this));
        this.closeMenu.addEventListener('click', this.closeMenu.bind(this));
        this.overlay.addEventListener('click', this.closeMenu.bind(this));
        
        // Adicionar eventos aos links do menu mobile
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', this.closeMenu.bind(this));
        });
    },
    
    /**
     * Cria o elemento overlay para o menu mobile
     */
    createOverlay: function() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'overlay';
        document.body.appendChild(this.overlay);
    },
    
    /**
     * Abre o menu mobile
     */
    openMenu: function() {
        this.mobileMenu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previne rolagem do body
    },
    
    /**
     * Fecha o menu mobile
     */
    closeMenu: function() {
        this.mobileMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restaura rolagem do body
    }
};

    /**
     * Controlador de Navegação
     * Gerencia o estado ativo dos links de navegação com base na seção visível
     */
    const NavigationController = {
        navLinks: null,
        sections: null,
        offsetAdjustment: 100, // Ajuste para considerar o header fixo
        
        /**
         * Inicializa o controlador de navegação
         */
        init: function() {
            this.navLinks = document.querySelectorAll('.nav a');
            this.sections = document.querySelectorAll('section[id]');
            
            if (this.navLinks.length === 0 || this.sections.length === 0) return;
            
            // Verificar links ativos inicialmente
            this.setActiveNavLink();
            
            // Adicionar listener de scroll com throttle para melhor performance
            window.addEventListener('scroll', this.throttle(this.setActiveNavLink.bind(this), 100));
            
            // Adicionar listener de redimensionamento para ajustar em caso de mudança de layout
            window.addEventListener('resize', this.throttle(this.setActiveNavLink.bind(this), 250));
        },
        
        /**
         * Atualiza os links ativos com base na seção visível atual
         */
        setActiveNavLink: function() {
            let currentSection = '';
            const scrollPosition = window.scrollY + this.offsetAdjustment;
            
            // Encontrar a seção atual com base na posição de scroll
            // Usando Intersection Observer API para melhor performance
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                // Verificar se a seção está visível na viewport
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Atualizar classes dos links
            this.navLinks.forEach(link => {
                // Remover classe active de todos os links
                link.classList.remove('active');
                
                // Adicionar classe active ao link correspondente à seção atual
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
            
            // Se estiver no topo da página e nenhuma seção estiver ativa, ativar o primeiro link
            if (scrollPosition < 100 && currentSection === '') {
                const firstLink = this.navLinks[0];
                if (firstLink) firstLink.classList.add('active');
            }
        },
        
        /**
         * Função de throttle para limitar a frequência de execução de funções
         * @param {Function} func - Função a ser limitada
         * @param {number} limit - Limite de tempo em ms
         * @returns {Function} - Função com throttle aplicado
         */
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // Inicializar quando o DOM estiver completamente carregado
    document.addEventListener('DOMContentLoaded', function() {
        NavigationController.init();
    });

/**
 * Controlador de FAQ
 * Gerencia a abertura e fechamento dos itens de FAQ
 */
const FAQController = {
    faqItems: null,
    
    /**
     * Inicializa o controlador de FAQ
     */
    init: function() {
        this.faqItems = document.querySelectorAll('.faq-item');
        
        if (this.faqItems.length === 0) return;
        
        // Adicionar eventos de clique
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQItem(item));
            }
        });
    },
    
    /**
     * Alterna o estado de um item de FAQ
     * @param {HTMLElement} item - O item de FAQ a ser alternado
     */
    toggleFAQItem: function(item) {
        // Fechar outros itens abertos
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Alternar o estado do item atual
        item.classList.toggle('active');
    }
};

/**
 * Slider de Depoimentos
 * Gerencia a exibição e rotação automática dos depoimentos
 */
const TestimonialSlider = {
    dots: null,
    testimonials: null,
    currentIndex: 0,
    autoRotateInterval: 6000, // 6 segundos
    autoRotateTimer: null,
    
    /**
     * Inicializa o slider de depoimentos
     */
    init: function() {
        this.dots = document.querySelectorAll('.dot');
        this.testimonials = document.querySelectorAll('.testimonial');
        
        if (this.dots.length === 0 || this.testimonials.length === 0) return;
        
        // Mostrar o primeiro depoimento
        this.showTestimonial(0);
        
        // Adicionar eventos aos dots
        this.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                this.currentIndex = i;
                this.showTestimonial(i);
                this.resetAutoRotate(); // Reiniciar timer ao clicar
            });
        });
        
        // Iniciar rotação automática
        this.startAutoRotate();
    },
    
    /**
     * Exibe um depoimento específico
     * @param {number} index - Índice do depoimento a ser exibido
     */
    showTestimonial: function(index) {
        // Atualizar visibilidade dos depoimentos
        this.testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        
        // Atualizar estado dos dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },
    
    /**
     * Inicia a rotação automática dos depoimentos
     */
    startAutoRotate: function() {
        this.autoRotateTimer = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
            this.showTestimonial(this.currentIndex);
        }, this.autoRotateInterval);
    },
    
    /**
     * Reinicia o timer de rotação automática
     */
    resetAutoRotate: function() {
        clearInterval(this.autoRotateTimer);
        this.startAutoRotate();
    }
};

/**
 * Controlador do Formulário de Contato
 * Gerencia o envio e feedback do formulário de contato
 */
const ContactFormController = {
    contactForm: null,
    
    /**
     * Inicializa o controlador do formulário de contato
     */
    init: function() {
        this.contactForm = document.getElementById('demo-form');
        
        if (!this.contactForm) return;
        
        // Adicionar evento de envio
        this.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
    },
    
    /**
     * Trata o envio do formulário
     * @param {Event} e - Evento de submit
     */
    handleSubmit: function(e) {
        e.preventDefault();
        
        // Obter botão de envio
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Atualizar estado do botão
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // Simular processamento (substituir por chamada AJAX real)
        setTimeout(() => {
            this.showSuccessMessage();
        }, 1500);
    },
    
    /**
     * Exibe mensagem de sucesso após envio do formulário
     */
    showSuccessMessage: function() {
        // Criar mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <h3>Solicitação enviada com sucesso!</h3>
            <p>Entraremos em contato em breve para agendar sua demonstração.</p>
        `;
        
        // Substituir formulário pela mensagem
        this.contactForm.innerHTML = '';
        this.contactForm.appendChild(successMessage);
        
        // Estilizar mensagem de sucesso
        this.styleSuccessMessage(successMessage);
    },
    
    /**
     * Aplica estilos à mensagem de sucesso
     * @param {HTMLElement} message - Elemento da mensagem de sucesso
     */
    styleSuccessMessage: function(message) {
        message.style.textAlign = 'center';
        message.style.padding = '30px';
        
        const successIcon = message.querySelector('.success-icon');
        if (successIcon) {
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
        }
    }
};

/**
 * Controlador de Rolagem Suave
 * Implementa rolagem suave de alta performance (60fps+) para toda a página
 */
const SmoothScroller = {
    // Configurações
    settings: {
        frameRate: 1000/60, // 60fps
        animationTime: 400,  // Tempo total da animação em ms
        stepSize: 50,       // Tamanho do passo em pixels
        pulseAlgorithm: true, // Usar algoritmo de pulso para desaceleração
        pulseScale: 4,      // Escala do pulso
        pulseNormalize: 1,  // Normalização do pulso
        accelerationDelta: 50, // Delta para aceleração
        accelerationMax: 3,  // Aceleração máxima
        keyboardSupport: true, // Suporte para teclado
        arrowScroll: 50,     // Quantidade de pixels para rolagem com setas
        touchpadSupport: true // Suporte para touchpad
    },
    
    // Estado
    frameID: null,
    direction: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    position: {
        x: 0,
        y: 0
    },
    targetPosition: {
        x: 0,
        y: 0
    },
    isScrolling: false,
    lastScrollTime: 0,
    
    /**
     * Inicializa o controlador de rolagem suave
     */
    init: function() {
        // Definir posição inicial
        this.position.x = window.scrollX || window.pageXOffset;
        this.position.y = window.scrollY || window.pageYOffset;
        this.targetPosition = {...this.position};
        
        // Adicionar event listeners
        this.addEventListeners();
        
        // Iniciar loop de animação
        this.startAnimationLoop();
    },
    
    /**
     * Adiciona os event listeners necessários
     */
    addEventListeners: function() {
        // Substituir o evento de scroll padrão
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: false });
        
        // Adicionar suporte para links de âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleAnchorClick.bind(this));
        });
        
        // Adicionar suporte para teclado se habilitado
        if (this.settings.keyboardSupport) {
            window.addEventListener('keydown', this.handleKeyDown.bind(this));
        }
        
        // Detectar mudanças de tamanho da janela
        window.addEventListener('resize', this.handleResize.bind(this));
    },
    
    /**
     * Inicia o loop de animação para rolagem suave
     */
    startAnimationLoop: function() {
        // Usar requestAnimationFrame para sincronizar com a taxa de atualização do monitor
        const loop = () => {
            this.updateScroll();
            this.frameID = requestAnimationFrame(loop);
        };
        
        this.frameID = requestAnimationFrame(loop);
    },
    
    /**
     * Atualiza a posição de rolagem com animação suave
     */
    updateScroll: function() {
        if (this.isScrolling) {
            // Calcular diferença entre posição atual e alvo
            const dx = this.targetPosition.x - this.position.x;
            const dy = this.targetPosition.y - this.position.y;
            
            // Verificar se chegamos perto o suficiente do alvo
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                this.position = {...this.targetPosition};
                this.isScrolling = false;
            } else {
                // Aplicar easing para movimento suave
                this.position.x += dx * 0.08;
                this.position.y += dy * 0.08;
            }
            
            // Aplicar a posição calculada
            window.scrollTo(this.position.x, this.position.y);
        }
    },
    
    /**
     * Manipula eventos de rolagem nativa
     * @param {Event} e - Evento de scroll
     */
    handleScroll: function(e) {
        // Atualizar posição alvo com base na posição atual da janela
        const now = performance.now();
        
        // Limitar a frequência de atualizações para melhorar performance
        if (now - this.lastScrollTime > 50) {
            this.targetPosition.x = window.scrollX || window.pageXOffset;
            this.targetPosition.y = window.scrollY || window.pageYOffset;
            this.isScrolling = true;
            this.lastScrollTime = now;
        }
    },
    
    /**
     * Manipula cliques em links de âncora
     * @param {Event} e - Evento de clique
     */
    handleAnchorClick: function(e) {
        const href = e.currentTarget.getAttribute('href');
        
        // Verificar se é um link de âncora válido
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                // Calcular posição do elemento alvo
                const rect = targetElement.getBoundingClientRect();
                const offsetTop = rect.top + window.scrollY;
                
                // Definir nova posição alvo
                this.targetPosition.y = offsetTop;
                this.isScrolling = true;
            }
        }
    },
    
    /**
     * Manipula eventos de teclado para rolagem
     * @param {KeyboardEvent} e - Evento de teclado
     */
    handleKeyDown: function(e) {
        // Verificar teclas de seta
        switch (e.key) {
            case 'ArrowUp':
                this.targetPosition.y -= this.settings.arrowScroll;
                this.isScrolling = true;
                e.preventDefault();
                break;
            case 'ArrowDown':
                this.targetPosition.y += this.settings.arrowScroll;
                this.isScrolling = true;
                e.preventDefault();
                break;
            case 'PageUp':
                this.targetPosition.y -= window.innerHeight;
                this.isScrolling = true;
                e.preventDefault();
                break;
            case 'PageDown':
                this.targetPosition.y += window.innerHeight;
                this.isScrolling = true;
                e.preventDefault();
                break;
            case 'Home':
                this.targetPosition.y = 0;
                this.isScrolling = true;
                e.preventDefault();
                break;
            case 'End':
                this.targetPosition.y = document.body.scrollHeight;
                this.isScrolling = true;
                e.preventDefault();
                break;
        }
        
        // Limitar a posição alvo aos limites da página
        this.targetPosition.y = Math.max(0, Math.min(this.targetPosition.y, document.body.scrollHeight - window.innerHeight));
    },
    
    /**
     * Manipula eventos de redimensionamento da janela
     */
    handleResize: function() {
        // Atualizar posição atual e alvo
        this.position.x = window.scrollX || window.pageXOffset;
        this.position.y = window.scrollY || window.pageYOffset;
        this.targetPosition = {...this.position};
    },
    
    /**
     * Rola suavemente para um elemento específico
     * @param {string|HTMLElement} target - Seletor ou elemento para rolar até
     * @param {number} offset - Deslocamento opcional em pixels
     */
    scrollToElement: function(target, offset = 0) {
        let targetElement;
        
        if (typeof target === 'string') {
            targetElement = document.querySelector(target);
        } else if (target instanceof HTMLElement) {
            targetElement = target;
        }
        
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            this.targetPosition.y = rect.top + window.scrollY - offset;
            this.isScrolling = true;
        }
    },
    
    /**
     * Rola suavemente para uma posição Y específica
     * @param {number} y - Posição Y para rolar
     */
    scrollToY: function(y) {
        this.targetPosition.y = y;
        this.isScrolling = true;
    }
};
