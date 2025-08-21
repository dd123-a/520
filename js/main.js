// 烟花粒子系统
class Fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        this.canvas.id = 'fireworks';
        this.canvas.style.position = 'fixed';
        this.canvas.style.bottom = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '30vh';
        this.canvas.style.zIndex = '999';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.display = 'none';
        
        this.resizeCanvas();
        document.body.appendChild(this.canvas);
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.3; // 只占屏幕底部30%
    }
    
    createFirework(x, y) {
        const colors = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#ffd700', '#ff6b6b', '#4ecdc4'];
        const numParticles = 20 + Math.random() * 15; // 减少粒子数量
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6, // 减少水平速度
                vy: (Math.random() - 0.5) * 6 - 2, // 减少垂直速度，偏向上方
                life: 1,
                decay: Math.random() * 0.015 + 0.01,
                size: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    
    start() {
        this.isActive = true;
        this.canvas.style.display = 'block';
        this.animate();
        
        // 创建多个烟花
        const fireworkInterval = setInterval(() => {
            if (this.isActive) {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height * 0.5 + this.canvas.height * 0.1; // 适配底部区域
                this.createFirework(x, y);
            } else {
                clearInterval(fireworkInterval);
            }
        }, 500); // 增加间隔，减少频率
        
        // 3秒后停止
        setTimeout(() => this.stop(), 3000);
    }
    
    stop() {
        this.isActive = false;
        setTimeout(() => {
            this.canvas.style.display = 'none';
            this.particles = [];
        }, 2000);
    }
    
    animate() {
        if (!this.isActive && this.particles.length === 0) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清除背景，不要拖尾效果
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // 重力
            p.life -= p.decay;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// 星空动画
class StarField {
    constructor() {
        this.canvas = document.getElementById('stars');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 200;
        
        this.resizeCanvas();
        this.createStars();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            star.y += star.speed;
            
            if (star.y > this.canvas.height) {
                star.y = -star.size;
                star.x = Math.random() * this.canvas.width;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 215, 0, ${star.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 时间线功能
class Timeline {
    constructor() {
        this.container = document.querySelector('.timeline-container');
        this.loadTimelineData();
        this.setupScrollAnimation();
    }
    
    async loadTimelineData() {
        try {
            const response = await fetch('js/data/timeline.json');
            const data = await response.json();
            this.renderTimeline(data);
        } catch (error) {
            console.error('加载时间线数据失败:', error);
        }
    }
    
    renderTimeline(data) {
        const html = data.map(item => `
            <div class="timeline-item">
                <div class="timeline-date">${item.date}</div>
                <div class="timeline-content">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('');
        
        this.container.innerHTML = html;
    }
    
    setupScrollAnimation() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        setTimeout(() => {
            document.querySelectorAll('.timeline-item').forEach(item => {
                observer.observe(item);
            });
        }, 100);
    }
}

// 倒计时功能
class Countdown {
    constructor() {
        this.targetDate = new Date('2025-08-29T00:00:00').getTime();
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        this.updateCountdown();
        this.timer = setInterval(() => this.updateCountdown(), 1000);
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        
        if (distance < 0) {
            this.showFireworks();
            clearInterval(this.timer);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.elements.days.textContent = this.padZero(days);
        this.elements.hours.textContent = this.padZero(hours);
        this.elements.minutes.textContent = this.padZero(minutes);
        this.elements.seconds.textContent = this.padZero(seconds);
    }
    
    padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    
    showFireworks() {
        document.querySelector('#countdown h2').textContent = '七夕快乐! 🎆';
        window.fireworksInstance.start();
    }
}

// 音乐控制
class MusicController {
    constructor() {
        this.audio = document.getElementById('bgm');
        this.toggleBtn = document.getElementById('musicToggle');
        this.isPlaying = false;
        
        this.toggleBtn.addEventListener('click', () => this.toggleMusic());
        
        // 页面加载后提示用户点击播放
        this.toggleBtn.style.animation = 'pulse 2s infinite';
    }
    
    toggleMusic() {
        if (this.isPlaying) {
            this.audio.pause();
            this.toggleBtn.textContent = '♫';
            this.toggleBtn.style.animation = 'pulse 2s infinite';
        } else {
            this.audio.play().catch(e => {
                console.log('音频播放失败:', e);
            });
            this.toggleBtn.textContent = '🔇';
            this.toggleBtn.style.animation = 'none';
        }
        this.isPlaying = !this.isPlaying;
    }
}

// 滚动监听器 - 滚动到底部触发烟花
class ScrollTrigger {
    constructor() {
        this.hasTriggered = false;
        window.addEventListener('scroll', () => this.checkBottom());
    }
    
    checkBottom() {
        if (this.hasTriggered) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= documentHeight - 50) {
            this.hasTriggered = true;
            window.fireworksInstance.start();
            
            // 5秒后重置，允许再次触发  
            setTimeout(() => {
                this.hasTriggered = false;
            }, 5000);
        }
    }
}

// 烟花控制器
class FireworksController {
    constructor() {
        this.toggleBtn = document.getElementById('fireworksToggle');
        this.toggleBtn.addEventListener('click', () => this.triggerFireworks());
    }
    
    triggerFireworks() {
        window.fireworksInstance.start();
        // 添加点击反馈动画
        this.toggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.toggleBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.fireworksInstance = new Fireworks();
    new StarField();
    new Timeline();
    new Countdown();
    new MusicController();
    new FireworksController();
    new ScrollTrigger();
});

// 添加脉冲动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);