/**
 * Neural Particles - Efeito de partículas e conexões neurais para fundo da seção hero
 * Desenvolvido para simular conexões de IA em um fundo translúcido
 */

class NeuralParticles {
    constructor(options = {}) {
        // Configurações padrão
        this.options = {
            selector: '.pdf-forms', // Seletor da seção onde o canvas será inserido
            particleCount: 80, // Número de partículas
            particleColor: '#ffffff', // Cor base das partículas
            lineColor: '#ffffff', // Cor base das linhas
            particleRadius: 2, // Raio das partículas
            lineWidth: 0.5, // Espessura das linhas
            connectDistance: 150, // Distância máxima para conectar partículas
            speed: 0.5, // Velocidade das partículas
            pulseSpeed: 0.01, // Velocidade de pulsação
            responsive: true, // Ajustar automaticamente ao redimensionar
            opacity: 0.8, // Opacidade base
            ...options // Sobrescrever com opções personalizadas
        };

        // Elementos DOM
        this.container = document.querySelector(this.options.selector);
        this.canvas = null;
        this.ctx = null;
        
        // Estado
        this.particles = [];
        this.animationFrame = null;
        this.width = 0;
        this.height = 0;
        this.pulseValue = 0;
        
        // Inicializar
        this.init();
    }
    
    /**
     * Inicializa o canvas e as partículas
     */
    init() {
        if (!this.container) {
            console.error(`Elemento ${this.options.selector} não encontrado`);
            return;
        }
        
        // Criar canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'neural-particles-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        // Estilizar canvas
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none'; // Permite cliques nos elementos abaixo
        
        // Verificar se o container já tem position
        const containerPosition = window.getComputedStyle(this.container).position;
        if (containerPosition === 'static') {
            this.container.style.position = 'relative';
        }
        
        // Inserir canvas como primeiro filho do container
        this.container.insertBefore(this.canvas, this.container.firstChild);
        
        // Configurar tamanho
        this.resize();
        
        // Criar partículas
        this.createParticles();
        
        // Iniciar animação
        this.animate();
        
        // Adicionar evento de redimensionamento
        if (this.options.responsive) {
            window.addEventListener('resize', this.resize.bind(this));
        }
    }
    
    /**
     * Ajusta o tamanho do canvas
     */
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        // Ajustar para densidade de pixels do dispositivo
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Recriar partículas se já existirem
        if (this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    /**
     * Cria as partículas
     */
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                radius: Math.random() * this.options.particleRadius + 1,
                color: this.options.particleColor,
                opacity: Math.random() * 0.5 + 0.2 // Opacidade variável
            });
        }
    }
    
    /**
     * Anima as partículas e conexões
     */
    animate() {
        // Limpar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Atualizar valor de pulsação
        this.pulseValue += this.options.pulseSpeed;
        if (this.pulseValue > Math.PI * 2) {
            this.pulseValue = 0;
        }
        
        // Desenhar conexões primeiro (para ficarem atrás das partículas)
        this.drawConnections();
        
        // Atualizar e desenhar partículas
        this.particles.forEach(particle => {
            // Mover partícula
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Verificar limites
            if (particle.x < 0 || particle.x > this.width) {
                particle.vx = -particle.vx;
            }
            if (particle.y < 0 || particle.y > this.height) {
                particle.vy = -particle.vy;
            }
            
            // Desenhar partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.getRGBA(particle.color, particle.opacity * this.options.opacity);
            this.ctx.fill();
        });
        
        // Continuar animação
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
    
    /**
     * Desenha as conexões entre partículas
     */
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                // Calcular distância
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Conectar se estiver dentro da distância máxima
                if (distance < this.options.connectDistance) {
                    // Opacidade baseada na distância (mais próximo = mais opaco)
                    const opacity = (1 - distance / this.options.connectDistance) * 
                                   this.options.opacity * 
                                   0.5 * // Reduzir opacidade geral das linhas
                                   (0.8 + Math.sin(this.pulseValue) * 0.2); // Efeito de pulsação
                    
                    // Desenhar linha
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = this.getRGBA(this.options.lineColor, opacity);
                    this.ctx.lineWidth = this.options.lineWidth;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    /**
     * Converte cor e opacidade para formato RGBA
     */
    getRGBA(color, opacity) {
        // Se a cor já for rgba, ajustar apenas a opacidade
        if (color.startsWith('rgba')) {
            return color.replace(/[\d\.]+\)$/g, `${opacity})`);
        }
        
        // Se for hex ou rgb, converter para rgba
        let r, g, b;
        
        if (color.startsWith('#')) {
            // Hex para RGB
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (color.startsWith('rgb')) {
            // RGB para componentes
            const rgbValues = color.match(/\d+/g);
            r = parseInt(rgbValues[0]);
            g = parseInt(rgbValues[1]);
            b = parseInt(rgbValues[2]);
        } else {
            // Cor padrão
            r = g = b = 255;
        }
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    /**
     * Para a animação e remove o canvas
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        if (this.options.responsive) {
            window.removeEventListener('resize', this.resize);
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar com cores que combinam com o gradiente da hero
    const neuralParticles = new NeuralParticles({
        particleCount: 100,
        particleColor: '#ffffff',
        lineColor: '#ffffff',
        particleRadius: 1.5,
        lineWidth: 0.5,
        connectDistance: 150,
        speed: 0.3,
        opacity: 0.4
    });
});
