/**
 * WaveDotsAnimation - Animação de pontos ondulados para fundo de hero
 * 
 * Este script cria um padrão de pontos ondulados animados similar à imagem de referência,
 * com gradiente de cor do vermelho ao azul e movimento suave de ondas.
 */

class WaveDotsAnimation {
    constructor(options = {}) {
        // Configurações padrão
        this.options = {
            selector: '.hero', // Seletor do elemento onde o canvas será inserido
            dotSize: 2, // Tamanho dos pontos
            dotSpacing: 30, // Espaçamento entre pontos
            waveAmplitude: 15, // Amplitude das ondas
            waveFrequency: 0.02, // Frequência das ondas
            waveSpeed: 0.01, // Velocidade da animação
            colorStart: [255, 99, 71], // Cor inicial (vermelho/laranja)
            colorEnd: [0, 191, 255], // Cor final (azul)
            opacity: 0.5, // Opacidade dos pontos
            responsive: true, // Ajustar automaticamente ao redimensionar
            ...options // Sobrescrever com opções personalizadas
        };

        // Elementos DOM
        this.container = document.querySelector(this.options.selector);
        this.canvas = null;
        this.ctx = null;
        
        // Estado
        this.dots = [];
        this.animationFrame = null;
        this.width = 0;
        this.height = 0;
        this.time = 0;
        
        // Inicializar
        this.init();
    }
    
    /**
     * Inicializa o canvas e os pontos
     */
    init() {
        if (!this.container) {
            console.error(`Elemento ${this.options.selector} não encontrado`);
            return;
        }
        
        // Criar canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'wave-dots-canvas';
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
        
        // Criar pontos
        this.createDots();
        
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
        
        // Recriar pontos se já existirem
        if (this.dots.length > 0) {
            this.createDots();
        }
    }
    
    /**
     * Cria a grade de pontos
     */
    createDots() {
        this.dots = [];
        const { dotSpacing } = this.options;
        
        // Calcular número de colunas e linhas
        const cols = Math.ceil(this.width / dotSpacing) + 2;
        const rows = Math.ceil(this.height / dotSpacing) + 2;
        
        // Criar grade de pontos
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                // Posição base do ponto
                const x = i * dotSpacing;
                const y = j * dotSpacing;
                
                // Calcular cor com base na posição
                // Usamos uma combinação de x e y para criar um gradiente diagonal
                const colorPosition = (x / this.width + y / this.height) / 2;
                const color = this.getGradientColor(colorPosition);
                
                this.dots.push({
                    baseX: x,
                    baseY: y,
                    x: x,
                    y: y,
                    color: color
                });
            }
        }
    }
    
    /**
     * Calcula a cor no gradiente com base na posição
     * @param {number} position - Posição no gradiente (0 a 1)
     * @returns {string} - Cor em formato rgba
     */
    getGradientColor(position) {
        // Garantir que a posição esteja entre 0 e 1
        position = Math.max(0, Math.min(1, position));
        
        const { colorStart, colorEnd, opacity } = this.options;
        
        // Interpolar entre as cores inicial e final
        const r = Math.round(colorStart[0] + (colorEnd[0] - colorStart[0]) * position);
        const g = Math.round(colorStart[1] + (colorEnd[1] - colorStart[1]) * position);
        const b = Math.round(colorStart[2] + (colorEnd[2] - colorStart[2]) * position);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    /**
     * Anima os pontos ondulados
     */
    animate() {
        // Limpar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Atualizar tempo
        this.time += this.options.waveSpeed;
        
        // Atualizar e desenhar pontos
        this.dots.forEach(dot => {
            // Calcular deslocamento da onda
            // Usamos funções seno e cosseno com diferentes frequências para criar um padrão mais orgânico
            const offsetX = Math.sin(dot.baseY * this.options.waveFrequency + this.time) * this.options.waveAmplitude;
            const offsetY = Math.cos(dot.baseX * this.options.waveFrequency + this.time) * this.options.waveAmplitude;
            
            // Atualizar posição
            dot.x = dot.baseX + offsetX;
            dot.y = dot.baseY + offsetY;
            
            // Desenhar ponto apenas se estiver dentro da área visível
            if (dot.x >= -this.options.dotSize && dot.x <= this.width + this.options.dotSize &&
                dot.y >= -this.options.dotSize && dot.y <= this.height + this.options.dotSize) {
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, this.options.dotSize, 0, Math.PI * 2);
                this.ctx.fillStyle = dot.color;
                this.ctx.fill();
            }
        });
        
        // Continuar animação
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
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
    const waveDotsAnimation = new WaveDotsAnimation({
        // Você pode personalizar as opções aqui
        dotSize: 2,
        dotSpacing: 30,
        waveAmplitude: 15,
        waveFrequency: 0.02,
        waveSpeed: 0.01,
        colorStart: [255, 99, 71], // Vermelho/laranja
        colorEnd: [0, 191, 255],   // Azul
        opacity: 0.5
    });
});
