import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. UNIVERSAL TOPOLOGICAL MORPHING ENGINE (Three.js)
// ==========================================

const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 65;
camera.position.y = 8;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const colorBase = new THREE.Color(0x3f3f46);
const colorDeep = new THREE.Color(0x8c734b);

const particlesCount = 4500;
const positions = new Float32Array(particlesCount * 3);

// Memory Allocation Matrices for Custom Topologies
const basePositions = new Float32Array(particlesCount * 3);
const topologies = {
    cylinder: new Float32Array(particlesCount * 3),
    sphere: new Float32Array(particlesCount * 3),
    gantt: new Float32Array(particlesCount * 3),
    cube: new Float32Array(particlesCount * 3),
    helix: new Float32Array(particlesCount * 3),
    clock: new Float32Array(particlesCount * 3),
    radar: new Float32Array(particlesCount * 3),
    dome: new Float32Array(particlesCount * 3),
    wavefield: new Float32Array(particlesCount * 3),
    linkage: new Float32Array(particlesCount * 3),
    cone: new Float32Array(particlesCount * 3),
    clusters: new Float32Array(particlesCount * 3),
    cryptochain: new Float32Array(particlesCount * 3),
    number2: new Float32Array(particlesCount * 3)
};

const topologyConfigs = {
    base: { color: 0x3f3f46, size: 0.06 },
    cylinder: { color: 0xc3a36b, size: 0.10 },
    sphere: { color: 0x52525b, size: 0.07 },
    gantt: { color: 0xa1a1aa, size: 0.06 },
    cube: { color: 0xd4d4d8, size: 0.09 },
    helix: { color: 0x8c734b, size: 0.07 },
    clock: { color: 0xa1a1aa, size: 0.06 },
    radar: { color: 0xd97706, size: 0.11 },
    dome: { color: 0xc3a36b, size: 0.08 },
    wavefield: { color: 0x2563eb, size: 0.09 },
    linkage: { color: 0x059669, size: 0.08 },
    cone: { color: 0xd97706, size: 0.09 },
    clusters: { color: 0xdb2777, size: 0.07 },
    cryptochain: { color: 0x4f46e5, size: 0.11 },
    number2: { color: 0xc3a36b, size: 0.11 }
};

// --- Shape Construction Loops ---
for(let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;

    const bX = (Math.random() - 0.5) * 120;
    const bZ = (Math.random() - 0.5) * 120;
    basePositions[i3] = bX; basePositions[i3+1] = 0; basePositions[i3+2] = bZ;
    positions[i3] = bX; positions[i3+1] = 0; positions[i3+2] = bZ;

    const cylTheta = (i / 180) * Math.PI * 2;
    const cylRadius = 14 + Math.sin(i * 0.05) * 0.3;
    topologies.cylinder[i3] = cylRadius * Math.cos(cylTheta);
    topologies.cylinder[i3+1] = ((i / particlesCount) - 0.5) * 40;
    topologies.cylinder[i3+2] = cylRadius * Math.sin(cylTheta);

    const sphU = Math.random(); const sphV = Math.random();
    const sphTheta = sphU * 2.0 * Math.PI; const sphPhi = Math.acos(2.0 * sphV - 1.0);
    const sphRad = 22;
    topologies.sphere[i3] = sphRad * Math.sin(sphPhi) * Math.cos(sphTheta);
    topologies.sphere[i3+1] = sphRad * Math.sin(sphPhi) * Math.sin(sphTheta) + 5;
    topologies.sphere[i3+2] = sphRad * Math.cos(sphPhi);

    const trackIndex = i % 5;
    topologies.gantt[i3] = ((i % 60) - 30) * 1.8;
    topologies.gantt[i3+1] = (trackIndex - 2) * 8;
    topologies.gantt[i3+2] = Math.floor(i / 900) * 6 - 12;

    topologies.cube[i3] = ((i % 15) - 7.5) * 2.8;
    topologies.cube[i3+1] = (Math.floor((i % 225) / 15) - 7.5) * 2.8;
    topologies.cube[i3+2] = (Math.floor(i / 225) - 10) * 2.8;

    const helAlpha = (i / particlesCount) * Math.PI * 14;
    topologies.helix[i3] = 15 * Math.cos(helAlpha);
    topologies.helix[i3+1] = ((i / particlesCount) - 0.5) * 50;
    topologies.helix[i3+2] = 15 * Math.sin(helAlpha);

    const torTheta = Math.random() * Math.PI * 2;
    const torPhi = Math.random() * Math.PI * 2;
    const torRad1 = 20; const torRad2 = 4;
    topologies.clock[i3] = (torRad1 + torRad2 * Math.cos(torPhi)) * Math.cos(torTheta);
    topologies.clock[i3+1] = (torRad1 + torRad2 * Math.cos(torPhi)) * Math.sin(torTheta);
    topologies.clock[i3+2] = torRad2 * Math.sin(torPhi);

    const radRing = i % 4;
    const radRadius = (radRing + 1) * 7 + (Math.random() - 0.5) * 1.5;
    const radAngle = Math.random() * Math.PI * 2;
    topologies.radar[i3] = radRadius * Math.cos(radAngle);
    topologies.radar[i3+1] = (Math.random() - 0.5) * 2;
    topologies.radar[i3+2] = radRadius * Math.sin(radAngle);

    const dmRadius = 24; const dmTheta = Math.random() * Math.PI * 2; const dmPhi = Math.acos(Math.random());
    topologies.dome[i3] = dmRadius * Math.sin(dmPhi) * Math.cos(dmTheta);
    topologies.dome[i3+1] = dmRadius * Math.cos(dmPhi) - 10;
    topologies.dome[i3+2] = dmRadius * Math.sin(dmPhi) * Math.sin(dmTheta);

    const gridX = ((i % 67) - 33.5) * 1.8; const gridZ = (Math.floor(i / 67) - 33.5) * 1.8;
    topologies.wavefield[i3] = gridX;
    topologies.wavefield[i3+1] = Math.sin(gridX * 0.15) * Math.cos(gridZ * 0.15) * 8;
    topologies.wavefield[i3+2] = gridZ;

    const loopSide = i % 2 === 0 ? -15 : 15; const linkAngle = (i / particlesCount) * Math.PI * 4;
    topologies.linkage[i3] = loopSide + 8 * Math.cos(linkAngle);
    topologies.linkage[i3+1] = ((i / particlesCount) - 0.5) * 45;
    topologies.linkage[i3+2] = 8 * Math.sin(linkAngle);

    const coneHeight = (i / particlesCount) * 40; const coneRad = coneHeight * 0.4; const coneAngle = Math.random() * Math.PI * 2;
    topologies.cone[i3] = coneRad * Math.cos(coneAngle);
    topologies.cone[i3+1] = coneHeight - 20;
    topologies.cone[i3+2] = coneRad * Math.sin(coneAngle);

    const clustIdx = i % 3; let cx = -15, cy = 10, cz = 0;
    if (clustIdx === 1) { cx = 20; cy = -10; cz = -10; } else if (clustIdx === 2) { cx = 5; cy = 15; cz = 15; }
    topologies.clusters[i3] = cx + (Math.random() - 0.5) * 12;
    topologies.clusters[i3+1] = cy + (Math.random() - 0.5) * 12;
    topologies.clusters[i3+2] = cz + (Math.random() - 0.5) * 12;

    const knotP = 3, knotQ = 7; const knotPhi = (i / particlesCount) * Math.PI * 2 * knotP; const knotR = 18 + 5 * Math.cos(knotQ * knotPhi);
    topologies.cryptochain[i3] = knotR * Math.cos(knotPhi);
    topologies.cryptochain[i3+1] = knotR * Math.sin(knotPhi);
    topologies.cryptochain[i3+2] = 5 * Math.sin(knotQ * knotPhi);

    // O. Precise Topology Matrix for Digit '2'
    if (i < particlesCount * 0.40) {
        const pct = i / (particlesCount * 0.40);
        const theta = Math.PI - pct * (Math.PI * 1.25);
        const rad = 10;
        topologies.number2[i3] = rad * Math.cos(theta);
        topologies.number2[i3+1] = 5 + rad * Math.sin(theta);
        topologies.number2[i3+2] = (Math.random() - 0.5) * 5;
    } else if (i < particlesCount * 0.75) {
        const pct = (i - particlesCount * 0.40) / (particlesCount * 0.35);
        topologies.number2[i3] = THREE.MathUtils.lerp(7.0, -7.0, pct);
        topologies.number2[i3+1] = THREE.MathUtils.lerp(-2.0, -14.0, pct);
        topologies.number2[i3+2] = (Math.random() - 0.5) * 5;
    } else {
        const pct = (i - particlesCount * 0.75) / (particlesCount * 0.25);
        topologies.number2[i3] = THREE.MathUtils.lerp(-7.0, 9.0, pct);
        topologies.number2[i3+1] = -14.0;
        topologies.number2[i3+2] = (Math.random() - 0.5) * 5;
    }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({ size: 0.06, color: colorBase, transparent: true, opacity: 0.3, blending: THREE.NormalBlending });
const particlesMesh = new THREE.Points(geometry, material);
particlesMesh.position.x = 10;
scene.add(particlesMesh);

const clock = new THREE.Clock();
window.morphState = { mixProgress: 0 };
let activeMorphTarget = basePositions;

const raycaster = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();
const virtualPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const intersectPoint = new THREE.Vector3();

let lastMouseX = 0, lastMouseY = 0;
let mouseVelocity = 0;
let targetSizeMultiplier = 1.0;
let targetOpacityMultiplier = 1.0;

window.addEventListener('mousemove', (e) => {
    mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;

    const dx = e.clientX - lastMouseX; const dy = e.clientY - lastMouseY;
    mouseVelocity = Math.sqrt(dx*dx + dy*dy);
    lastMouseX = e.clientX; lastMouseY = e.clientY;

    targetSizeMultiplier = 1.0 + Math.min(mouseVelocity * 0.035, 1.8);
    targetOpacityMultiplier = 1.0 + Math.min(mouseVelocity * 0.02, 1.5);

    gsap.to('.ambient-matrix-grid', { x: (e.clientX / window.innerWidth - 0.5) * 25, y: (e.clientY / window.innerHeight - 0.5) * 25, duration: 0.8, ease: "power2.out" });
});

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const currentPositions = particlesMesh.geometry.attributes.position.array;
    const amplitude = window.targetAmplitude || 2.2;
    const alpha = window.morphState.mixProgress;

    raycaster.setFromCamera(mouseVec, camera);
    raycaster.ray.intersectPlane(virtualPlane, intersectPoint);

    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const bX = basePositions[i3]; const bZ = basePositions[i3 + 2];
        let waveY = Math.sin(elapsedTime * 0.4 + bX * 0.08) * Math.cos(elapsedTime * 0.3 + bZ * 0.08) * amplitude;

        const tX = activeMorphTarget[i3]; const tY = activeMorphTarget[i3 + 1]; const tZ = activeMorphTarget[i3 + 2];
        let interpX = THREE.MathUtils.lerp(bX, tX, alpha); let interpY = THREE.MathUtils.lerp(waveY, tY, alpha); let interpZ = THREE.MathUtils.lerp(bZ, tZ, alpha);

        const worldX = interpX + particlesMesh.position.x; const worldY = interpY + particlesMesh.position.y; const worldZ = interpZ + particlesMesh.position.z;
        const dX = worldX - intersectPoint.x; const dY = worldY - intersectPoint.y; const dZ = worldZ - intersectPoint.z;
        const dist = Math.sqrt(dX*dX + dY*dY + dZ*dZ);

        if (dist < 18) {
            let forceOffset = ((18 - dist) / 18) * 4.0 * (1 - alpha * 0.7);
            interpX += (dX / dist) * forceOffset; interpY += (dY / dist) * forceOffset; interpZ += (dZ / dist) * forceOffset;
        }
        currentPositions[i3] = interpX; currentPositions[i3 + 1] = interpY; currentPositions[i3 + 2] = interpZ;
    }

    targetSizeMultiplier = THREE.MathUtils.lerp(targetSizeMultiplier, 1.0, 0.08);
    targetOpacityMultiplier = THREE.MathUtils.lerp(targetOpacityMultiplier, 1.0, 0.08);

    const baseConfig = topologyConfigs[window.currentActiveShapeID] || topologyConfigs.base;
    material.size = baseConfig.size * targetSizeMultiplier;
    material.opacity = Math.min(0.3 * targetOpacityMultiplier, 0.95);

    particlesMesh.geometry.attributes.position.needsUpdate = true;
    particlesMesh.rotation.y = elapsedTime * (window.targetRotSpeed || 0.012);
    renderer.render(scene, camera);
}
animate();

let currentScrollVelocity = 1.0;
window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const scrollPercent = window.scrollY / maxScroll;
    gsap.to('.scroll-progress-bar', { width: `${scrollPercent * 100}%`, duration: 0.1, ease: "none" });

    gsap.to(camera.position, {
        y: 8 - scrollPercent * 50, z: 65 - scrollPercent * 45, duration: 0.9, ease: "power2.out",
        onUpdate: () => camera.lookAt(scrollPercent * 20, -scrollPercent * 15, 0)
    });

    if (activeMorphTarget === basePositions) {
        const currentColor = colorBase.clone().lerp(colorDeep, scrollPercent);
        material.color.set(currentColor);
    }
    window.targetAmplitude = 2.2 + (scrollPercent * 4.5);
    window.targetRotSpeed = 0.012 + (scrollPercent * 0.035);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 2. DOM ENGINES & INTERACTIVE PIPELINES
// ==========================================

// 2.1 Zero-Latency Custom Cursor Follower Engine
const cursor = document.querySelector('.custom-cursor');
const cToX = gsap.quickTo(cursor, "x", { duration: 0.05, ease: "power1.out" });
const cToY = gsap.quickTo(cursor, "y", { duration: 0.05, ease: "power1.out" });
window.addEventListener('mousemove', (e) => { cToX(e.clientX); cToY(e.clientY); });

document.querySelectorAll('a, button, .tilt-card, .working-card, .timeline-item, .nav-brand').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// 2.2 Optimized Pinned Axis Component Transformation
const projectSection = document.querySelector('.horizontal-projects-section');
const projectTrack = document.querySelector('.horizontal-track');
const htmlEl = document.documentElement;

if (projectSection && projectTrack && window.innerWidth > 968) {
    function getScrollAmount() { return -(projectTrack.scrollWidth - window.innerWidth + 120); }
    const tween = gsap.to(projectTrack, { x: getScrollAmount, ease: "none" });
    ScrollTrigger.create({
        trigger: projectSection, start: "top top", end: () => `+=${getScrollAmount() * -1}`,
        pin: true, animation: tween, scrub: 1.2, invalidateOnRefresh: true, anticipatePin: 1,
        onEnter: () => { htmlEl.style.scrollSnapType = "none"; },
        onLeave: () => { htmlEl.style.scrollSnapType = "y mandatory"; },
        onEnterBack: () => { htmlEl.style.scrollSnapType = "none"; },
        onLeaveBack: () => { htmlEl.style.scrollSnapType = "y mandatory"; }
    });
}

// 2.3 Global Topological Morph Assignation Pipeline
document.querySelectorAll('[data-morph]').forEach(targetNode => {
    targetNode.addEventListener('mouseenter', () => {
        const shapeID = targetNode.dataset.morph;
        if(topologies[shapeID]) {
            activeMorphTarget = topologies[shapeID]; window.currentActiveShapeID = shapeID;
            const cfg = topologyConfigs[shapeID] || topologyConfigs.base;
            gsap.to(window.morphState, { mixProgress: 1.0, duration: 1.1, ease: "power3.out", overwrite: "auto" });
            const targetColor = new THREE.Color(cfg.color);
            gsap.to(material.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: 0.8, ease: "power2.out", overwrite: "auto" });
        }
    });
    targetNode.addEventListener('mouseleave', () => {
        window.currentActiveShapeID = 'base'; activeMorphTarget = basePositions;
        gsap.to(window.morphState, { mixProgress: 0.0, duration: 1.3, ease: "power2.out", overwrite: "auto" });
        const baseColor = colorBase.clone().lerp(colorDeep, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1));
        gsap.to(material.color, { r: baseColor.r, g: baseColor.g, b: baseColor.b, duration: 1.0, ease: "power2.out", overwrite: "auto" });
    });
});

// 2.4 Elegant Kinetic Nav Underscore Subsystem
const navLinksContainer = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-item');
const navUnderline = document.querySelector('.nav-underline');

if(navLinksContainer && navUnderline && navItems.length > 0) {
    navItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const linkRect = e.target.getBoundingClientRect(); const containerRect = navLinksContainer.getBoundingClientRect();
            gsap.to(navUnderline, { left: linkRect.left - containerRect.left, width: linkRect.width, opacity: 1, duration: 0.4, ease: "power2.out" });
        });
    });
    navLinksContainer.addEventListener('mouseleave', () => { gsap.to(navUnderline, { opacity: 0, duration: 0.3 }); });
}

// 2.5 Premium Stagger Reveal Engine
ScrollTrigger.batch('.reveal-el', {
    start: "top bottom-=100",
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", stagger: 0.15 }),
    once: true
});

// 2.6 Magnetic Components & Quantum Ghosting Animation
document.querySelectorAll('.magnetic-el').forEach((el) => {
    const textChild = el.querySelector('.btn-text, .scramble-brand'); const ghostEcho = el.querySelector('.ghost-echo');
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }); const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    let tXTo, tYTo;
    if(textChild) { tXTo = gsap.quickTo(textChild, "x", { duration: 0.5, ease: "power3.out" }); tYTo = gsap.quickTo(textChild, "y", { duration: 0.5, ease: "power3.out" }); }

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect(); const x = e.clientX - rect.left - rect.width / 2; const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.4); yTo(y * 0.4);
        if(textChild) { tXTo(x * 0.2); tYTo(y * 0.2); }
        if(ghostEcho) { gsap.to(ghostEcho, { x: x * 0.5, y: y * 0.5, opacity: 0.4, scale: 1.1, duration: 0.3, ease: "power2.out" }); }
        cursor.classList.add('cursor-magnetic');
        gsap.to(cursor, { width: rect.width + 10, height: rect.height + 10, borderRadius: "4px", duration: 0.25 });
        cToX(rect.left + rect.width / 2); cToY(rect.top + rect.height / 2);
    });
    el.addEventListener('mouseleave', () => {
        xTo(0); yTo(0); if(textChild) { tXTo(0); tYTo(0); }
        if(ghostEcho) { gsap.to(ghostEcho, { x: 0, y: 0, opacity: 0, scale: 1, duration: 0.5, ease: "power3.out" }); }
        cursor.classList.remove('cursor-magnetic');
        gsap.to(cursor, { width: "18px", height: "18px", borderRadius: "50%", duration: 0.25 });
    });
});

// 2.7 Premium Radial Clip-Path Mask Inversion Button
const primaryBtn = document.querySelector('.btn-primary');
if(primaryBtn) {
    const tLine = primaryBtn.querySelector('.lt-top'); const rLine = primaryBtn.querySelector('.lt-right');
    const bLine = primaryBtn.querySelector('.lt-bottom'); const lLine = primaryBtn.querySelector('.lt-left');
    const revealLayer = primaryBtn.querySelector('.btn-reveal-layer');

    primaryBtn.addEventListener('mouseenter', () => {
        const tl = gsap.timeline({ defaults: { duration: 0.15, ease: "linear" } });
        tl.to(tLine, { width: "100%" }).to(rLine, { height: "100%" }).to(bLine, { width: "100%" }).to(lLine, { height: "100%" });
    });
    primaryBtn.addEventListener('mousemove', (e) => {
        const rect = primaryBtn.getBoundingClientRect();
        const xX = e.clientX - rect.left; const yY = e.clientY - rect.top;
        gsap.to(revealLayer, { clipPath: `circle(150% at ${xX}px ${yY}px)`, duration: 0.5, ease: "power2.out" });
    });
    primaryBtn.addEventListener('mouseleave', () => {
        gsap.to([tLine, bLine], { width: "0%", duration: 0.3, ease: "power2.out" });
        gsap.to([rLine, lLine], { height: "0%", duration: 0.3, ease: "power2.out" });
        gsap.to(revealLayer, { clipPath: 'circle(0% at 50% 50%)', duration: 0.4, ease: "power3.out" });
    });
}

// 2.8 Holo-Parallax Geometric Tilt Modules
document.querySelectorAll('.tilt-card').forEach((card) => {
    const innerContent = card.querySelector('.card-content');
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect(); const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1; const yNorm = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        gsap.to(card, { rotationY: xNorm * 10, rotationX: -yNorm * 10, duration: 0.5, ease: "power2.out", transformPerspective: 1200, transformOrigin: "center" });
        if (innerContent) { gsap.to(innerContent, { x: -xNorm * 12, y: -yNorm * 12, z: 20, duration: 0.5, ease: "power2.out" }); }
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 1.2, ease: "power3.out" });
        if (innerContent) { gsap.to(innerContent, { x: 0, y: 0, z: 0, duration: 1.2, ease: "power3.out" }); }
    });
});

// 2.9 Velocity-Coupled Marquee Pipeline System
const marqueeTrack = document.querySelector('.marquee-track');
let isHoveringCard = false;
let marqueeTween;

if (marqueeTrack) {
    marqueeTween = gsap.to(marqueeTrack, { xPercent: -50, ease: "none", duration: 16, repeat: -1 });
    ScrollTrigger.create({
        trigger: "body", start: "top top", end: "bottom bottom",
        onUpdate: (self) => {
            currentScrollVelocity = Math.abs(self.getVelocity() * 0.007);
            if (!isHoveringCard) { gsap.to(marqueeTween, { timeScale: Math.min(1.0 + currentScrollVelocity, 6.0), duration: 0.4, ease: "power2.out" }); }
        }
    });

    document.querySelectorAll('.working-card').forEach(card => {
        card.addEventListener('mouseenter', () => { isHoveringCard = true; gsap.to(marqueeTween, { timeScale: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" }); });
        card.addEventListener('mouseleave', () => { isHoveringCard = false; gsap.to(marqueeTween, { timeScale: Math.min(1.0 + currentScrollVelocity, 6.0), duration: 0.6, ease: "power2.out", overwrite: "auto" }); });
    });
}

// ==========================================
// 2.10 STATE-OF-THE-ART TEXT SCRAMBLE ENGINE
// ==========================================
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_//";

function triggerScramble(el) {
    let iteration = 0;
    const originalValue = el.dataset.value;
    if (!originalValue) return;
    clearInterval(el.interval);

    el.interval = setInterval(() => {
        el.innerText = originalValue
            .split("")
            .map((letter, index) => {
                if(index < iteration) return originalValue[index];
                return letters[Math.floor(Math.random() * letters.length)];
            }).join("");

        if(iteration >= originalValue.length) {
            clearInterval(el.interval);
            el.innerText = originalValue;
        }
        iteration += 1 / 3;
    }, 25);
}

document.querySelectorAll('.scramble-text').forEach(el => {
    el.dataset.value = el.innerText;
    ScrollTrigger.create({
        trigger: el, start: "top bottom-=80px",
        onEnter: () => triggerScramble(el)
    });
    el.addEventListener('mouseenter', () => triggerScramble(el));
});

document.querySelectorAll('.scramble-brand').forEach(brandEl => {
    brandEl.dataset.value = brandEl.innerText;
    brandEl.addEventListener('mouseenter', () => triggerScramble(brandEl));
    setTimeout(() => { triggerScramble(brandEl); }, 600);
});