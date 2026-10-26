/* =========================================================
   GUOSYZAMZ · 背景 canvas 动画
   - 粒子缓慢漂浮，近距离自动连线
   - 鼠标 / 触摸附近的粒子会与指针连线
   - 偶尔划过一颗流星
   - 自适应尺寸与设备像素比，尊重 reduced-motion
   ========================================================= */

(() => {
    'use strict';

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const LINK_DIST = 140;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
    const POINTER_DIST = 190;
    const POINTER_DIST_SQ = POINTER_DIST * POINTER_DIST;
    const COLORS = ['94, 234, 212', '125, 211, 252', '167, 139, 250'];

    const pointer = { x: -9999, y: -9999, active: false };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let meteors = [];
    let meteorTimer = 2.4;
    let rafId = null;
    let lastTs = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    function targetCount() {
        const byArea = Math.round((width * height) / 15000);
        return Math.max(26, Math.min(120, byArea));
    }

    function createParticle() {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(7, 26); // px / 秒
        return {
            x: rand(0, width),
            y: rand(0, height),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: rand(0.9, 2.3),
            alpha: rand(0.35, 0.9),
            color: COLORS[(Math.random() * COLORS.length) | 0],
        };
    }

    function syncParticles() {
        const count = targetCount();

        while (particles.length < count) {
            particles.push(createParticle());
        }
        if (particles.length > count) {
            particles.length = count;
        }
        for (const p of particles) {
            if (p.x > width) p.x = rand(0, width);
            if (p.y > height) p.y = rand(0, height);
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        // 逻辑坐标始终以 CSS 像素为单位
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        syncParticles();

        if (motionQuery.matches) {
            draw(0);
        }
    }

    function updateParticles(dt) {
        for (const p of particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            const margin = 30;
            if (p.x < -margin) p.x = width + margin;
            else if (p.x > width + margin) p.x = -margin;
            if (p.y < -margin) p.y = height + margin;
            else if (p.y > height + margin) p.y = -margin;
        }
    }

    function drawLinks() {
        ctx.lineWidth = 1;

        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];

            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;
                if (distSq > LINK_DIST_SQ) continue;

                const strength = 1 - Math.sqrt(distSq) / LINK_DIST;
                ctx.strokeStyle = `rgba(125, 211, 252, ${(strength * 0.22).toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }

            if (pointer.active) {
                const dx = a.x - pointer.x;
                const dy = a.y - pointer.y;
                const distSq = dx * dx + dy * dy;
                if (distSq <= POINTER_DIST_SQ) {
                    const strength = 1 - Math.sqrt(distSq) / POINTER_DIST;
                    ctx.strokeStyle = `rgba(94, 234, 212, ${(strength * 0.32).toFixed(3)})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawParticles() {
        for (const p of particles) {
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /* ---------- 流星 ---------- */

    function spawnMeteor() {
        const angle = rand(Math.PI * 0.1, Math.PI * 0.24);
        const speed = rand(260, 420);

        meteors.push({
            x: rand(-width * 0.15, width * 0.85),
            y: rand(-height * 0.15, height * 0.4),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            dirX: Math.cos(angle),
            dirY: Math.sin(angle),
            length: rand(90, 180),
            life: 0,
            maxLife: rand(1.1, 1.9),
            color: COLORS[(Math.random() * COLORS.length) | 0],
        });
    }

    function updateMeteors(dt) {
        meteorTimer -= dt;
        if (meteorTimer <= 0) {
            spawnMeteor();
            meteorTimer = rand(2.8, 6.5);
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
            const m = meteors[i];
            m.life += dt;
            if (m.life >= m.maxLife) {
                meteors.splice(i, 1);
                continue;
            }
            m.x += m.vx * dt;
            m.y += m.vy * dt;
        }
    }

    function drawMeteors() {
        for (const m of meteors) {
            const alpha = Math.sin((m.life / m.maxLife) * Math.PI) * 0.8;
            if (alpha <= 0.01) continue;

            const tailX = m.x - m.dirX * m.length;
            const tailY = m.y - m.dirY * m.length;

            const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(${m.color}, ${alpha.toFixed(3)})`);
            gradient.addColorStop(0.45, `rgba(${m.color}, ${(alpha * 0.3).toFixed(3)})`);
            gradient.addColorStop(1, `rgba(${m.color}, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // 流星头部
            ctx.fillStyle = `rgba(${m.color}, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.lineCap = 'butt';
    }

    function draw(dt) {
        ctx.clearRect(0, 0, width, height);

        if (dt > 0) {
            updateParticles(dt);
            updateMeteors(dt);
        }

        drawLinks();
        drawParticles();
        drawMeteors();
    }

    function frame(ts) {
        if (!lastTs) lastTs = ts;
        const dt = Math.min(48, ts - lastTs) / 1000;
        lastTs = ts;

        draw(dt);

        rafId = window.requestAnimationFrame(frame);
    }

    function start() {
        if (rafId !== null) return;
        lastTs = 0;
        rafId = window.requestAnimationFrame(frame);
    }

    function stop() {
        if (rafId === null) return;
        window.cancelAnimationFrame(rafId);
        rafId = null;
    }

    function applyMotionPreference() {
        if (motionQuery.matches) {
            stop();
            meteors.length = 0;
            draw(0);
        } else if (!document.hidden) {
            start();
        }
    }

    /* ---------- 事件 ---------- */

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('orientationchange', resize, { passive: true });

    window.addEventListener(
        'pointermove',
        (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = true;
        },
        { passive: true }
    );

    const hidePointer = () => {
        pointer.active = false;
        pointer.x = -9999;
        pointer.y = -9999;
    };
    document.addEventListener('pointerleave', hidePointer, { passive: true });
    window.addEventListener('blur', hidePointer);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        } else {
            applyMotionPreference();
        }
    });

    if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', applyMotionPreference);
    } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(applyMotionPreference);
    }

    /* ---------- 卡片跟随光效 ---------- */

    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener(
            'pointermove',
            (event) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
                card.style.setProperty('--my', `${event.clientY - rect.top}px`);
            },
            { passive: true }
        );
    });

    /* ---------- 启动 ---------- */

    resize();
    applyMotionPreference();
})();
