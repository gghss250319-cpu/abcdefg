import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlantStage,
  ParticleItem,
  Enemy,
  StomaPoint,
  CloudItem,
  OxygenProjectile,
  CoolingMistParticle,
  Upgrades,
} from '../types/game';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  stage: PlantStage;
  temperature: number;
  health: number;
  maxHealth: number;
  water: number;
  maxWater: number;
  oxygen: number;
  dayTimeRemaining: number;
  dayDuration: number;
  isHeatwave: boolean;
  heatwaveTimeLeft: number;
  upgrades: Upgrades;
  onCollectParticle: (type: 'LIGHT' | 'WATER' | 'CO2') => void;
  onShootEnemy: (enemyId: number) => void;
  onCleanStoma: (stomaId: number) => void;
  onPestDefeated: () => void;
  onPlantDamaged: (amount: number) => void;
  isCoolingActive: boolean;
  sunlightIntensity: number; // 0.2 ~ 1.0 (먹구름 영향)
  setSunlightIntensity: React.Dispatch<React.SetStateAction<number>>;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  vy: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  stage,
  temperature,
  health,
  maxHealth,
  water,
  maxWater,
  oxygen,
  dayTimeRemaining,
  dayDuration,
  isHeatwave,
  heatwaveTimeLeft,
  upgrades,
  onCollectParticle,
  onShootEnemy,
  onCleanStoma,
  onPestDefeated,
  onPlantDamaged,
  isCoolingActive,
  sunlightIntensity,
  setSunlightIntensity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation Entities
  const particlesRef = useRef<ParticleItem[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const stomataRef = useRef<StomaPoint[]>([]);
  const cloudsRef = useRef<CloudItem[]>([]);
  const projectilesRef = useRef<OxygenProjectile[]>([]);
  const mistRef = useRef<CoolingMistParticle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const animFrameIdRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Initialize or update stomata points based on stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const plantCenter = { x: cw * 0.5, y: ch * 0.65 };

    // Generate leaf stomata relative to plant center
    const stomaCount = 2 + stage * 2;
    const newStomata: StomaPoint[] = [];

    for (let i = 0; i < stomaCount; i++) {
      const angle = (i / stomaCount) * Math.PI * 1.4 - Math.PI * 0.7;
      const dist = 40 + stage * 20 + (i % 2) * 15;
      newStomata.push({
        id: i + 1,
        leafIndex: i,
        x: plantCenter.x + Math.cos(angle) * dist,
        y: plantCenter.y - 40 + Math.sin(angle) * dist * 0.6,
        clogged: false,
        clogTimer: 0,
      });
    }
    stomataRef.current = newStomata;
  }, [stage]);

  // Initialize atmospheric clouds
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cw = canvas.width;

    const initialClouds: CloudItem[] = [
      {
        id: 1,
        x: cw * 0.1,
        y: 60,
        width: 140,
        height: 60,
        opacity: 0.85,
        speed: 0.35,
        dustLevel: 0,
      },
      {
        id: 2,
        x: cw * 0.65,
        y: 80,
        width: 170,
        height: 70,
        opacity: 0.8,
        speed: 0.25,
        dustLevel: stage >= 2 ? 1 : 0,
      },
    ];
    cloudsRef.current = initialClouds;
  }, [stage]);

  // Spawn cooling mist particles when cooling skill is active
  useEffect(() => {
    if (isCoolingActive) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const centerX = cw * 0.5;
      const centerY = ch * 0.65;

      const newMist: CoolingMistParticle[] = [];
      for (let i = 0; i < 45; i++) {
        newMist.push({
          id: nextIdRef.current++,
          x: centerX + (Math.random() - 0.5) * (80 + stage * 25),
          y: centerY - 20 + (Math.random() - 0.5) * (80 + stage * 25),
          vx: (Math.random() - 0.5) * 2.5,
          vy: -Math.random() * 3 - 1,
          alpha: 0.9,
          size: 5 + Math.random() * 8,
        });
      }
      mistRef.current = [...mistRef.current, ...newMist];
    }
  }, [isCoolingActive, stage]);

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    floatingTextsRef.current.push({
      id: nextIdRef.current++,
      text,
      x,
      y,
      color,
      alpha: 1,
      vy: -1.2,
    });
  };

  // Main Game Loop (Animation, updates, rendering)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let spawnTimer = 0;
    let enemySpawnTimer = 0;
    let dustSmogTimer = 0;

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const cw = canvas.width;
      const ch = canvas.height;
      const centerX = cw * 0.5;
      const plantBaseY = ch * 0.82;

      // 1. Weather & Atmosphere Background
      const dayProgress = 1 - dayTimeRemaining / dayDuration; // 0 -> 1

      // Sky gradient transitions from sunrise to midday to sunset
      let skyTop = '#60a5fa'; // Blue-400
      let skyBottom = '#dbeafe'; // Blue-100

      if (isHeatwave) {
        // Alarming Heatwave amber/orange sky
        skyTop = '#ea580c';
        skyBottom = '#fef08a';
      } else if (dayProgress < 0.25) {
        // Morning dawn
        skyTop = '#38bdf8';
        skyBottom = '#fed7aa';
      } else if (dayProgress > 0.75) {
        // Golden evening
        skyTop = '#f97316';
        skyBottom = '#fef08a';
      }

      // Draw Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(0.7, skyBottom);
      skyGrad.addColorStop(1, '#a7f3d0');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Sun position moves across sky
      const sunX = cw * 0.15 + dayProgress * (cw * 0.7);
      const sunY = 70 + Math.sin(dayProgress * Math.PI) * -35;
      const sunPulse = 1 + Math.sin(time * 0.005) * 0.08;

      // Sun rays
      ctx.save();
      ctx.beginPath();
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 65 * sunPulse);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.6)');
      sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGrad;
      ctx.arc(sunX, sunY, 65 * sunPulse, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.beginPath();
      ctx.fillStyle = isHeatwave ? '#ef4444' : '#f59e0b';
      ctx.arc(sunX, sunY, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Cloud simulation & Dust Smog
      let totalSunlightBlocked = 0;
      cloudsRef.current.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > cw + cloud.width) {
          cloud.x = -cloud.width;
          cloud.dustLevel = Math.random() < 0.4 + stage * 0.1 ? 1 : 0;
        }

        // Check if cloud blocks the sun
        const distToSun = Math.hypot(cloud.x + cloud.width / 2 - sunX, cloud.y + cloud.height / 2 - sunY);
        if (distToSun < 100) {
          totalSunlightBlocked += cloud.dustLevel > 0 ? 0.45 : 0.25;
        }

        // Draw cloud
        ctx.save();
        ctx.fillStyle =
          cloud.dustLevel > 0
            ? 'rgba(100, 116, 139, 0.88)' // 미세먼지 황사 먹구름
            : 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.height * 0.6, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.35, cloud.y - 12, cloud.height * 0.7, 0, Math.PI * 2);
        ctx.arc(cloud.x + cloud.width * 0.65, cloud.y + 4, cloud.height * 0.6, 0, Math.PI * 2);
        ctx.fill();

        if (cloud.dustLevel > 0) {
          // Warning indicator on dust cloud
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 12px Pretendard, sans-serif';
          ctx.fillText('황사/미세먼지 (클릭 시 흩어짐!)', cloud.x - 10, cloud.y - 20);
        }
        ctx.restore();
      });

      const effectiveSunlight = Math.max(0.3, 1.0 - totalSunlightBlocked);
      setSunlightIntensity(effectiveSunlight);

      // 3. Ground & Soil Cross-section
      const soilY = plantBaseY;
      ctx.fillStyle = '#451a03'; // Rich soil
      ctx.fillRect(0, soilY, cw, ch - soilY);

      // Lush grass top layer
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(centerX, soilY, cw * 0.6, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soil root branches (showing depth and water absorption)
      ctx.save();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3 + upgrades.rootDepth * 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, soilY);
      ctx.lineTo(centerX - 35 - upgrades.rootDepth * 12, soilY + 50);
      ctx.moveTo(centerX, soilY);
      ctx.lineTo(centerX + 35 + upgrades.rootDepth * 12, soilY + 45);
      ctx.moveTo(centerX, soilY);
      ctx.lineTo(centerX, soilY + 70 + upgrades.rootDepth * 15);
      ctx.stroke();

      // Water moisture sparkling particles in root
      if (Math.random() < 0.25) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(
          centerX + (Math.random() - 0.5) * 60,
          soilY + 20 + Math.random() * 40,
          2.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();

      // 4. Draw Plant (Sprout to World Tree Evolution)
      ctx.save();
      const plantCenterY = plantBaseY - (60 + stage * 28);
      const isOverheated = temperature > 30;
      const isOptimal = temperature >= 20 && temperature <= 28;

      // Stem (줄기)
      ctx.strokeStyle = stage >= 4 ? '#78350f' : '#22c55e';
      ctx.lineWidth = 8 + stage * 4 + upgrades.chloroplast * 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(centerX, soilY);
      const stemSway = Math.sin(time * 0.003) * (isOverheated ? 3 : 6);
      ctx.quadraticCurveTo(centerX + stemSway, (soilY + plantCenterY) / 2, centerX, plantCenterY);
      ctx.stroke();

      // Foliage / Leaves
      const leafColor = isOverheated ? '#ca8a04' : isOptimal ? '#16a34a' : '#22c55e';
      const leafCount = 2 + stage * 2;
      for (let i = 0; i < leafCount; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const leafY = plantCenterY + 25 - (i * 18);
        const leafLen = 35 + stage * 14 + upgrades.leafExpansion * 8;
        const leafWidth = 18 + stage * 6;

        ctx.save();
        ctx.translate(centerX, leafY);
        const angle = side * (0.35 + (i * 0.1)) + Math.sin(time * 0.004 + i) * 0.08;
        ctx.rotate(angle);

        ctx.fillStyle = leafColor;
        ctx.beginPath();
        ctx.ellipse(side * (leafLen / 2), 0, leafLen / 2, leafWidth / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Leaf vein
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(side * leafLen * 0.85, 0);
        ctx.stroke();

        ctx.restore();
      }

      // Photosynthesis aura (glowing halo when optimal & well-lit)
      if (isOptimal && effectiveSunlight > 0.5) {
        ctx.save();
        ctx.beginPath();
        const auraGrad = ctx.createRadialGradient(
          centerX,
          plantCenterY,
          20,
          centerX,
          plantCenterY,
          90 + stage * 20
        );
        auraGrad.addColorStop(0, 'rgba(74, 222, 128, 0.4)');
        auraGrad.addColorStop(1, 'rgba(74, 222, 128, 0)');
        ctx.fillStyle = auraGrad;
        ctx.arc(centerX, plantCenterY, 90 + stage * 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Sprout Face / Crown
      const faceY = plantCenterY - 10;
      ctx.fillStyle = '#bbf7d0';
      ctx.beginPath();
      ctx.arc(centerX, faceY, 20 + stage * 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#1e293b';
      const eyeOffset = 7 + stage;
      if (isOverheated) {
        // Sweating / exhausted eyes
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset, faceY - 2, 4, Math.PI, 0);
        ctx.arc(centerX + eyeOffset, faceY - 2, 4, Math.PI, 0);
        ctx.stroke();

        // Sweat drops
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(centerX + eyeOffset + 8, faceY - 6, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Happy twinkling eyes
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset, faceY - 2, 3.5, 0, Math.PI * 2);
        ctx.arc(centerX + eyeOffset, faceY - 2, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouth
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (isOverheated) {
        ctx.arc(centerX, faceY + 9, 5, 0, Math.PI); // Open panting mouth
      } else if (isOptimal) {
        ctx.arc(centerX, faceY + 5, 6, 0.2, Math.PI - 0.2); // Beaming smile
      } else {
        ctx.arc(centerX, faceY + 6, 4, 0.2, Math.PI - 0.2);
      }
      ctx.stroke();

      // Cheeks (blush)
      ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
      ctx.beginPath();
      ctx.arc(centerX - eyeOffset - 3, faceY + 4, 4, 0, Math.PI * 2);
      ctx.arc(centerX + eyeOffset + 3, faceY + 4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Crown bud / flower on stage 4 and 5
      if (stage >= 4) {
        ctx.fillStyle = stage === 5 ? '#eab308' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(centerX, faceY - (22 + stage * 3), 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. Stomata Points Rendering & Dust Clogging
      stomataRef.current.forEach((stoma) => {
        ctx.save();
        ctx.translate(stoma.x, stoma.y);

        if (stoma.clogged) {
          // Clogged stoma (covered in grey dust and alert icon)
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Red alert badge
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, -9, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px Pretendard, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('!', 0, -6);
        } else {
          // Healthy open stoma (green guard cells breathing)
          const stomaBreathe = Math.sin(time * 0.005 + stoma.id) * 1.5;
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, 7 + stomaBreathe, 4 + stomaBreathe * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Transpiration vapor tiny rising bubble
          if (Math.random() < 0.08) {
            ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
            ctx.beginPath();
            ctx.arc(0, -5, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      });

      // 6. Particle Spawning & Updates (Light, Water, CO2)
      spawnTimer += dt;
      if (spawnTimer > (0.45 - stage * 0.04)) {
        spawnTimer = 0;
        const types: ('LIGHT' | 'WATER' | 'CO2')[] = ['LIGHT', 'WATER', 'CO2'];
        // Bias based on time of day or heat
        let chosenType = types[Math.floor(Math.random() * types.length)];
        if (Math.random() < effectiveSunlight * 0.5) chosenType = 'LIGHT';

        const px = 40 + Math.random() * (cw - 80);
        const py = -20;
        const vx = (Math.random() - 0.5) * 1.2;
        const vy = 1.2 + Math.random() * 1.8;

        particlesRef.current.push({
          id: nextIdRef.current++,
          type: chosenType,
          x: px,
          y: py,
          vx,
          vy,
          size: chosenType === 'LIGHT' ? 14 : chosenType === 'WATER' ? 12 : 13,
          alpha: 1,
          life: 0,
          maxLife: 14,
          value: 1,
        });
      }

      // Update and Draw Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += dt;

        // Auto attraction if leaf expansion upgrade is high
        const distToCenter = Math.hypot(p.x - centerX, p.y - plantCenterY);
        const attractionRadius = 60 + upgrades.leafExpansion * 20;
        if (distToCenter < attractionRadius) {
          p.x += (centerX - p.x) * 0.08;
          p.y += (plantCenterY - p.y) * 0.08;
          if (distToCenter < 25) {
            onCollectParticle(p.type as 'LIGHT' | 'WATER' | 'CO2');
            addFloatingText(`+1 ${p.type === 'LIGHT' ? '빛' : p.type === 'WATER' ? '물' : 'CO₂'}`, p.x, p.y, '#f59e0b');
            return false;
          }
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.type === 'LIGHT') {
          // Glowing yellow solar photon
          const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, p.size * 1.4);
          glow.addColorStop(0, '#fef08a');
          glow.addColorStop(0.6, '#facc15');
          glow.addColorStop(1, 'rgba(234, 179, 8, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ca8a04';
          ctx.font = 'bold 10px Pretendard, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('빛', 0, 3);
        } else if (p.type === 'WATER') {
          // Shimmering cyan water drop
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size, -p.size * 0.2, p.size, p.size, 0, p.size);
          ctx.bezierCurveTo(-p.size, p.size, -p.size, -p.size * 0.2, 0, -p.size);
          ctx.fill();

          ctx.fillStyle = '#0369a1';
          ctx.font = 'bold 9px Pretendard, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('H₂O', 0, 3);
        } else if (p.type === 'CO2') {
          // Violet / Gray CO2 molecule
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#581c87';
          ctx.font = 'bold 9px Pretendard, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('CO₂', 0, 3);
        }
        ctx.restore();

        return p.y < ch && p.life < p.maxLife;
      });

      // 7. Enemy Simulation (Aphid, Red Mite, Caterpillar, Dust Smog, Heat Boss)
      enemySpawnTimer += dt;
      const spawnInterval = Math.max(1.8, 5.0 - stage * 0.6);
      if (enemySpawnTimer > spawnInterval) {
        enemySpawnTimer = 0;
        const enemyPool: Enemy['type'][] = ['APHID', 'RED_MITE', 'CATERPILLAR'];
        if (stage >= 2) enemyPool.push('DUST_SMOG');
        if (stage === 5 && Math.random() < 0.2) enemyPool.push('HEAT_BOSS');

        const eType = enemyPool[Math.floor(Math.random() * enemyPool.length)];
        const fromLeft = Math.random() < 0.5;
        const startX = fromLeft ? -30 : cw + 30;
        const startY = plantBaseY - 20 - Math.random() * 80;

        let hp = 1;
        let speed = 1.0;
        let damage = 5;
        let size = 16;
        let scoreValue = 10;

        if (eType === 'APHID') {
          hp = 1;
          speed = 1.2;
          damage = 4;
          size = 14;
          scoreValue = 8;
        } else if (eType === 'RED_MITE') {
          hp = 2;
          speed = 1.5;
          damage = 6;
          size = 15;
          scoreValue = 12;
        } else if (eType === 'CATERPILLAR') {
          hp = 4;
          speed = 0.7;
          damage = 12;
          size = 22;
          scoreValue = 20;
        } else if (eType === 'DUST_SMOG') {
          hp = 3;
          speed = 0.9;
          damage = 8;
          size = 24;
          scoreValue = 25;
        } else if (eType === 'HEAT_BOSS') {
          hp = 15;
          speed = 0.5;
          damage = 25;
          size = 36;
          scoreValue = 100;
        }

        enemiesRef.current.push({
          id: nextIdRef.current++,
          type: eType,
          x: startX,
          y: startY,
          targetX: centerX,
          targetY: plantCenterY + 20,
          hp,
          maxHp: hp,
          speed,
          damage,
          size,
          scoreValue,
        });
      }

      // Dust Smog randomly attacking open stomata
      dustSmogTimer += dt;
      if (dustSmogTimer > (6 - stage * 0.8)) {
        dustSmogTimer = 0;
        const openStomata = stomataRef.current.filter((s) => !s.clogged);
        if (openStomata.length > 0) {
          const target = openStomata[Math.floor(Math.random() * openStomata.length)];
          target.clogged = true;
          addFloatingText('기공 막힘! (클릭하여 정화)', target.x, target.y - 10, '#ef4444');
          sound.playAlert();
        }
      }

      // Update & Render Enemies
      enemiesRef.current = enemiesRef.current.filter((enemy) => {
        const dx = enemy.targetX - enemy.x;
        const dy = enemy.targetY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 20) {
          enemy.x += (dx / dist) * enemy.speed;
          enemy.y += (dy / dist) * enemy.speed;
        } else {
          // Reached plant -> attack!
          onPlantDamaged(enemy.damage);
          sound.playHit();
          addFloatingText(`-${enemy.damage} HP`, centerX, plantCenterY, '#ef4444');
          return false;
        }

        // Draw Enemy
        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        if (enemy.type === 'APHID') {
          // Tiny lime green aphid
          ctx.fillStyle = '#84cc16';
          ctx.beginPath();
          ctx.ellipse(0, 0, enemy.size, enemy.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(dx > 0 ? 6 : -6, -2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'RED_MITE') {
          // Red spider mite
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
          ctx.fill();

          // Legs
          ctx.strokeStyle = '#991b1b';
          ctx.lineWidth = 2;
          for (let l = -2; l <= 2; l++) {
            ctx.beginPath();
            ctx.moveTo(l * 4, -4);
            ctx.lineTo(l * 6, -10);
            ctx.moveTo(l * 4, 4);
            ctx.lineTo(l * 6, 10);
            ctx.stroke();
          }
        } else if (enemy.type === 'CATERPILLAR') {
          // Segmented caterpillar
          for (let s = -2; s <= 2; s++) {
            ctx.fillStyle = s % 2 === 0 ? '#15803d' : '#84cc16';
            ctx.beginPath();
            ctx.arc(s * 8, Math.sin(time * 0.01 + s) * 3, 7, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (enemy.type === 'DUST_SMOG') {
          // Smog cloud monster
          ctx.fillStyle = 'rgba(71, 85, 105, 0.9)';
          ctx.beginPath();
          ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
          ctx.arc(-8, -6, enemy.size * 0.7, 0, Math.PI * 2);
          ctx.arc(8, 4, enemy.size * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Angry glowing red eyes
          ctx.fillStyle = '#f87171';
          ctx.beginPath();
          ctx.arc(-5, -2, 3, 0, Math.PI * 2);
          ctx.arc(5, -2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'HEAT_BOSS') {
          // Giant Flaming Heat Boss Demon
          ctx.fillStyle = '#b91c1c';
          ctx.beginPath();
          ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
          ctx.fill();

          // Flame corona
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + time * 0.005;
            const fx = Math.cos(angle) * (enemy.size + 12);
            const fy = Math.sin(angle) * (enemy.size + 12);
            ctx.arc(fx, fy, 6, 0, Math.PI * 2);
          }
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px Pretendard, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('폭염보스', 0, 4);
        }

        // Enemy HP bar
        if (enemy.maxHp > 1) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(-15, -enemy.size - 8, 30, 4);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(-15, -enemy.size - 8, 30 * (enemy.hp / enemy.maxHp), 4);
        }

        ctx.restore();
        return true;
      });

      // 8. Projectiles (Oxygen Blast)
      projectilesRef.current = projectilesRef.current.filter((proj) => {
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Check collision with enemies
        for (let i = 0; i < enemiesRef.current.length; i++) {
          const e = enemiesRef.current[i];
          const dist = Math.hypot(e.x - proj.x, e.y - proj.y);
          if (dist < e.size + proj.radius) {
            e.hp -= proj.power;
            sound.playHit();
            addFloatingText(`-${proj.power}`, e.x, e.y - 10, '#38bdf8');

            if (e.hp <= 0) {
              onPestDefeated();
              addFloatingText(`퇴치! +${e.scoreValue}점`, e.x, e.y, '#22c55e');
              enemiesRef.current.splice(i, 1);
            }
            return false;
          }
        }

        // Draw Oxygen projectile
        ctx.save();
        ctx.beginPath();
        const blastGrad = ctx.createRadialGradient(proj.x, proj.y, 2, proj.x, proj.y, proj.radius);
        blastGrad.addColorStop(0, '#e0f2fe');
        blastGrad.addColorStop(0.6, '#38bdf8');
        blastGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = blastGrad;
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 10px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('O₂', proj.x, proj.y + 3);
        ctx.restore();

        return proj.x > 0 && proj.x < cw && proj.y > 0 && proj.y < ch;
      });

      // 9. Cooling Mist Particles (증산작용 기화열 효과)
      mistRef.current = mistRef.current.filter((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= 0.02;

        ctx.save();
        ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0, m.alpha)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return m.alpha > 0;
      });

      // 10. Floating Text Popups
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => {
        ft.y += ft.vy;
        ft.alpha -= 0.02;

        ctx.save();
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 13px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();

        return ft.alpha > 0;
      });

      // Request next animation frame
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [
    stage,
    temperature,
    health,
    maxHealth,
    water,
    maxWater,
    oxygen,
    dayTimeRemaining,
    dayDuration,
    isHeatwave,
    upgrades,
    onCollectParticle,
    onShootEnemy,
    onPestDefeated,
    onPlantDamaged,
    setSunlightIntensity,
  ]);

  // Click & interaction handling
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // 1. Check if clicked on a clogged stoma
    for (const stoma of stomataRef.current) {
      if (stoma.clogged) {
        const dist = Math.hypot(stoma.x - clickX, stoma.y - clickY);
        if (dist < 26) {
          stoma.clogged = false;
          onCleanStoma(stoma.id);
          sound.playStomaClean();
          addFloatingText('기공 정화 완료! (+CO₂ 흡수 회복)', stoma.x, stoma.y - 15, '#22c55e');
          return;
        }
      }
    }

    // 2. Check if clicked on a dust cloud (to blow it away with wind)
    for (const cloud of cloudsRef.current) {
      if (cloud.dustLevel > 0) {
        const dist = Math.hypot(cloud.x + cloud.width / 2 - clickX, cloud.y + cloud.height / 2 - clickY);
        if (dist < 60) {
          cloud.dustLevel = 0;
          sound.playWind();
          addFloatingText('황사/먼지구름 분산 성공! (+햇빛 투과)', clickX, clickY, '#38bdf8');
          return;
        }
      }
    }

    // 3. Check if clicked on a falling resource particle
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      const dist = Math.hypot(p.x - clickX, p.y - clickY);
      if (dist < p.size + 16) {
        onCollectParticle(p.type as 'LIGHT' | 'WATER' | 'CO2');
        sound.playCollect(p.type as 'LIGHT' | 'WATER' | 'CO2');
        addFloatingText(`+1 ${p.type === 'LIGHT' ? '빛' : p.type === 'WATER' ? '물' : 'CO₂'}`, p.x, p.y, '#f59e0b');
        particlesRef.current.splice(i, 1);
        return;
      }
    }

    // 4. Click to shoot Oxygen Projectile towards click target (consumes 1 Oxygen if available)
    if (oxygen >= 1) {
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.65;
      const dx = clickX - centerX;
      const dy = clickY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist > 10) {
        const speed = 7.5;
        projectilesRef.current.push({
          id: nextIdRef.current++,
          x: centerX,
          y: centerY,
          targetX: clickX,
          targetY: clickY,
          vx: (dx / dist) * speed,
          vy: (dy / dist) * speed,
          radius: 12 + upgrades.phytoncide * 3,
          power: 1 + upgrades.phytoncide * 1,
        });
        onShootEnemy(-1); // Decrease 1 oxygen
        sound.playOxygenBlast();
      }
    } else {
      addFloatingText('산소(O₂) 부족! 광합성으로 산소를 합성하세요', clickX, clickY, '#f87171');
    }
  };

  return (
    <div className="relative w-full aspect-[16/10] max-h-[640px] rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-600/30 bg-slate-900 select-none">
      <canvas
        ref={canvasRef}
        width={960}
        height={600}
        onClick={handleCanvasClick}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 960,
            y: ((e.clientY - rect.top) / rect.height) * 600,
          });
        }}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Dynamic Interactive Hint */}
      <div className="absolute top-3 left-4 pointer-events-none flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white/90">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>클릭: 자원 수집 | 산소포(O₂) 발사 | 오염 기공 정화 | 먹구름 흩뜨리기</span>
      </div>

      {/* Sun / Light obstruction notice */}
      {sunlightIntensity < 0.7 && (
        <div className="absolute top-12 left-4 pointer-events-none bg-amber-500/80 backdrop-blur-md text-amber-950 font-bold px-3 py-1 rounded-lg text-xs animate-pulse">
          구름으로 햇빛 차단 중! (햇빛 투과율 {Math.round(sunlightIntensity * 100)}%) 먹구름을 클릭해 날려보내세요!
        </div>
      )}
    </div>
  );
};
