"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  gameSounds, playVoice, preloadVoices, setActiveMinister, startMusic, stopMusic,
} from "@/game/utils/sounds";
import {
  T, LEVELS, ENEMY_STATS, COMBO_MULTIPLIERS, COMBO_TIMEOUT, COMBO_COLORS,
  SKILLS, SKILL_QUOTES, STEAL_QUOTES, CAUGHT_QUOTES, VOICE_QUOTES,
  GASPAR, parseTile,
  type LevelDef, type EnemyType, type TileType, type MinisterDef,
} from "@/game/data/gameConfig";

const PS = 26;
const PICKUP_R = 24;
const CATCH_R = 18;
const INVULN_MS = 2000;
const SKILL_COOLDOWN = 8;
const FREEZE_DUR = 4;
const IMMUNITY_DUR = 5;
const PARTICLE_LIFE = 1;
const PLAYER_SPEED = 200;
const DASH_SPEED = 450;
const DASH_DUR = 0.18;
const DASH_COOLDOWN = 1.5;
const ITEM_RESPAWN_FAST = 3;
const ITEM_RESPAWN_SLOW = 8;

interface Item { x: number; y: number; type: string; value: number; alive: boolean; respawnAt: number }
interface EnemyState {
  x: number; y: number; type: EnemyType;
  waypoints: { x: number; y: number }[]; wpIdx: number;
  chasing: boolean; alertCooldown: number; frozen: boolean;
}
interface FloatText { text: string; x: number; y: number; color: string; born: number; duration: number; size?: number }
interface Particle { x: number; y: number; vx: number; vy: number; color: string; born: number; size: number }
interface GasparAnim {
  active: boolean; x: number; y: number;
  targetX: number; targetY: number;
  phase: "walking" | "bribing" | "leaving" | "done";
  timer: number; moneyParticles: { x: number; y: number; vx: number; vy: number; born: number }[];
}

interface GameCanvasProps {
  minister: MinisterDef;
  levelId: number;
  onBack: () => void;
  onComplete: (score: number, stars: number, time: number) => void;
}

const calcStars = (score: number, target: number, wanted: number, catches: number): number => {
  if (score < target) return 0;
  let stars = 1;
  if (score >= target * 1.5 && catches <= 2) stars = 2;
  if (score >= target * 2 && catches === 0 && wanted < 5) stars = 3;
  return stars;
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ minister, levelId, onBack, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const levelRef = useRef<LevelDef>(LEVELS[0]);

  const playerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, facing: 0 });
  const enemiesRef = useRef<EnemyState[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const floatsRef = useRef<FloatText[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const scoreRef = useRef(0);
  const wantedRef = useRef(0);
  const invulnRef = useRef(0);
  const timeRef = useRef(0);
  const catchesRef = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef(false);
  const gasparImgRef = useRef<HTMLImageElement | null>(null);
  const gasparImgLoadedRef = useRef(false);
  const keysRef = useRef(new Set<string>());
  const joystickRef = useRef({ active: false, cx: 0, cy: 0, dx: 0, dy: 0 });
  const bobRef = useRef(0);

  const comboRef = useRef({ count: 0, lastPickup: 0 });
  const shakeRef = useRef({ x: 0, y: 0, intensity: 0 });

  const pausedRef = useRef(false);
  const completedRef = useRef(false);
  const skillCooldownRef = useRef(0);
  const skillIndexRef = useRef(0);
  const freezeTimerRef = useRef(0);
  const immunityTimerRef = useRef(0);
  const voiceTimerRef = useRef(8 + Math.random() * 5);
  const skillFlashRef = useRef({ active: false, text: "", color: "", born: 0 });
  const displayScoreRef = useRef(0);
  const gasparRef = useRef<GasparAnim>({ active: false, x: 0, y: 0, targetX: 0, targetY: 0, phase: "done", timer: 0, moneyParticles: [] });
  const dashRef = useRef({ active: false, timer: 0, cooldown: 0, dx: 0, dy: 0 });
  const trailRef = useRef<{ x: number; y: number; born: number }[]>([]);
  const screenFlashRef = useRef({ active: false, color: "", born: 0, duration: 0 });

  const [, forceRender] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => { imgRef.current = img; imgLoadedRef.current = true; };
    img.src = minister.photo;

    const gImg = new Image();
    gImg.crossOrigin = "anonymous";
    gImg.onload = () => { gasparImgRef.current = gImg; gasparImgLoadedRef.current = true; };
    gImg.src = GASPAR.photo;
  }, [minister.photo]);

  useEffect(() => {
    const lvl = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0];
    levelRef.current = lvl;
    setActiveMinister(minister.id);
    preloadVoices(minister.id);
    startMusic();

    itemsRef.current = lvl.items.map((d) => ({ ...d, alive: true, respawnAt: 0 }));
    enemiesRef.current = lvl.enemies.map((d) => ({
      x: d.waypoints[0].x, y: d.waypoints[0].y,
      type: d.type, waypoints: d.waypoints, wpIdx: 0, chasing: false, alertCooldown: 0, frozen: false,
    }));
    playerRef.current = { x: lvl.spawnX, y: lvl.spawnY, vx: 0, vy: 0, facing: 0 };
    scoreRef.current = 0; wantedRef.current = 0; invulnRef.current = 0;
    timeRef.current = 0; catchesRef.current = 0; displayScoreRef.current = 0;
    comboRef.current = { count: 0, lastPickup: 0 };
    floatsRef.current = []; particlesRef.current = [];
    completedRef.current = false; pausedRef.current = false;
    gasparRef.current = { active: false, x: 0, y: 0, targetX: 0, targetY: 0, phase: "done", timer: 0, moneyParticles: [] };
    dashRef.current = { active: false, timer: 0, cooldown: 0, dx: 0, dy: 0 };
    trailRef.current = [];

    return () => { stopMusic(); };
  }, [levelId]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getLevelMap = () => levelRef.current.map;
  const getLevelRows = () => getLevelMap().length;
  const getLevelCols = () => getLevelMap()[0].length;

  const tileAt = (col: number, row: number): TileType => {
    const map = getLevelMap();
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return "wall";
    return parseTile(map[row][col]);
  };

  const isSolid = (col: number, row: number) => {
    const t = tileAt(col, row);
    return t === "wall" || t === "table";
  };

  const collidesWithSolid = (x: number, y: number, size: number) => {
    const half = size / 2;
    return [[x - half, y - half], [x + half, y - half], [x - half, y + half], [x + half, y + half]]
      .some(([cx, cy]) => isSolid(Math.floor(cx / T), Math.floor(cy / T)));
  };

  const addFloat = (text: string, x: number, y: number, color: string, duration = 1.2, size?: number) => {
    floatsRef.current.push({ text, x, y, color, born: timeRef.current, duration, size });
  };

  const addParticles = (x: number, y: number, color: string, count: number, spread = 60) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * spread;
      particlesRef.current.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        color, born: timeRef.current, size: 2 + Math.random() * 3,
      });
    }
  };

  const shake = (intensity: number) => {
    shakeRef.current.intensity = Math.max(shakeRef.current.intensity, intensity);
  };

  const screenFlash = (color: string, duration = 0.3) => {
    screenFlashRef.current = { active: true, color, born: timeRef.current, duration };
  };

  const spawnGaspar = () => {
    const p = playerRef.current;
    const enemies = enemiesRef.current;
    let nearestDist = Infinity;
    let nearestE: EnemyState | null = null;
    for (const e of enemies) {
      if (e.type === "journalist") continue;
      const d = Math.sqrt((e.x - p.x) ** 2 + (e.y - p.y) ** 2);
      if (d < nearestDist) { nearestDist = d; nearestE = e; }
    }
    const tx = nearestE ? nearestE.x : p.x + 100;
    const ty = nearestE ? nearestE.y : p.y;
    gasparRef.current = {
      active: true, x: p.x - 40, y: p.y, targetX: tx, targetY: ty,
      phase: "walking", timer: 0, moneyParticles: [],
    };
  };

  const activateSkill = useCallback(() => {
    if (pausedRef.current || completedRef.current) return;
    if (skillCooldownRef.current > 0) return;
    const skill = SKILLS[skillIndexRef.current % SKILLS.length];
    if (scoreRef.current < skill.cost) {
      addFloat("Málo peňazí!", playerRef.current.x, playerRef.current.y - 30, "#ef4444", 1);
      return;
    }

    scoreRef.current -= skill.cost;
    skillCooldownRef.current = SKILL_COOLDOWN;
    skillFlashRef.current = { active: true, text: `${skill.icon} ${skill.name}!`, color: skill.color, born: timeRef.current };

    const quotes = SKILL_QUOTES[skill.id] ?? [skill.name];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    playVoice(0.8);
    addFloat(quote, playerRef.current.x, playerRef.current.y - 40, skill.color, 2);
    addFloat(`-${skill.cost} €`, playerRef.current.x + 20, playerRef.current.y - 15, "#ef4444", 1);
    addParticles(playerRef.current.x, playerRef.current.y, skill.color, 15);

    if (skill.id === "bribe") {
      gameSounds.bribe();
      spawnGaspar();
      screenFlash("#ffd70040", 0.4);
    } else if (skill.id === "freeze") {
      gameSounds.freeze();
      freezeTimerRef.current = FREEZE_DUR;
      for (const e of enemiesRef.current) e.frozen = true;
      screenFlash("#00bfff40", 0.3);
    } else if (skill.id === "immunity") {
      gameSounds.immunity();
      immunityTimerRef.current = IMMUNITY_DUR;
      invulnRef.current = IMMUNITY_DUR;
      screenFlash("#34d39940", 0.3);
    } else if (skill.id === "scatter") {
      gameSounds.alert();
      for (const e of enemiesRef.current) {
        e.x = e.waypoints[0].x; e.y = e.waypoints[0].y;
        e.wpIdx = 0; e.chasing = false; e.alertCooldown = 6; e.frozen = false;
      }
      wantedRef.current = Math.max(0, wantedRef.current - 3);
      shake(1.5);
      screenFlash("#ef444440", 0.3);
    }
    skillIndexRef.current = (skillIndexRef.current + 1) % SKILLS.length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (e.code === "Escape") pausedRef.current = !pausedRef.current;
      if (e.code === "Space" && !e.repeat) { e.preventDefault(); activateSkill(); }
      if (e.code === "Digit1") skillIndexRef.current = 0;
      if (e.code === "Digit2") skillIndexRef.current = 1;
      if (e.code === "Digit3") skillIndexRef.current = 2;
      if (e.code === "Digit4") skillIndexRef.current = 3;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        const d = dashRef.current;
        if (!d.active && d.cooldown <= 0) {
          d.active = true; d.timer = DASH_DUR;
          const p = playerRef.current;
          const mag = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (mag > 0) { d.dx = p.vx / mag; d.dy = p.vy / mag; }
          else { d.dx = Math.cos(p.facing); d.dy = Math.sin(p.facing); }
          gameSounds.coin();
          shake(0.3);
        }
      }
    };
    const up = (e: KeyboardEvent) => { keysRef.current.delete(e.code); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [activateSkill]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const rw = rect.width;
    const rh = rect.height;
    // Skill button: right side, upper-middle area
    if (x > rw * 0.65 && y > rh * 0.35 && y < rh * 0.6) { activateSkill(); return; }
    // Dash button: right side, just below skill
    if (x > rw * 0.65 && y > rh * 0.6 && y < rh * 0.8) {
      const d = dashRef.current;
      if (!d.active && d.cooldown <= 0) {
        d.active = true; d.timer = DASH_DUR;
        const p = playerRef.current;
        d.dx = Math.cos(p.facing); d.dy = Math.sin(p.facing);
        gameSounds.coin();
      }
      return;
    }
    if (x < rw * 0.6) {
      joystickRef.current = { active: true, cx: x, cy: y, dx: 0, dy: 0 };
    }
  }, [activateSkill]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!joystickRef.current.active) return;
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;
    const dx = touch.clientX - rect.left - joystickRef.current.cx;
    const dy = touch.clientY - rect.top - joystickRef.current.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      const clamp = Math.min(dist, 50) / 50;
      joystickRef.current.dx = (dx / dist) * clamp;
      joystickRef.current.dy = (dy / dist) * clamp;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    joystickRef.current = { active: false, cx: 0, cy: 0, dx: 0, dy: 0 };
  }, []);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      frameRef.current = requestAnimationFrame(loop);
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      if (pausedRef.current || completedRef.current) { renderFrame(); return; }

      timeRef.current += dt;
      if (skillCooldownRef.current > 0) skillCooldownRef.current = Math.max(0, skillCooldownRef.current - dt);

      // Freeze timer - unfreeze enemies when done
      if (freezeTimerRef.current > 0) {
        freezeTimerRef.current = Math.max(0, freezeTimerRef.current - dt);
        if (freezeTimerRef.current <= 0) {
          for (const e of enemiesRef.current) {
            e.frozen = false;
            e.alertCooldown = 0.5;
          }
        }
      }

      if (immunityTimerRef.current > 0) {
        immunityTimerRef.current = Math.max(0, immunityTimerRef.current - dt);
        invulnRef.current = Math.max(invulnRef.current, immunityTimerRef.current);
      }

      // Dash
      const dash = dashRef.current;
      if (dash.active) {
        dash.timer -= dt;
        if (dash.timer <= 0) { dash.active = false; dash.cooldown = DASH_COOLDOWN; }
      }
      if (dash.cooldown > 0) dash.cooldown -= dt;

      const diff = scoreRef.current - displayScoreRef.current;
      if (Math.abs(diff) > 1) {
        displayScoreRef.current += diff * Math.min(dt * 8, 1);
      } else {
        displayScoreRef.current = scoreRef.current;
      }

      if (shakeRef.current.intensity > 0) {
        shakeRef.current.intensity = Math.max(0, shakeRef.current.intensity - dt * 8);
        shakeRef.current.x = (Math.random() - 0.5) * shakeRef.current.intensity * 10;
        shakeRef.current.y = (Math.random() - 0.5) * shakeRef.current.intensity * 10;
      }

      if (comboRef.current.count > 0 && (performance.now() - comboRef.current.lastPickup) > COMBO_TIMEOUT) {
        comboRef.current.count = 0;
      }

      const lvl = levelRef.current;
      const remaining = lvl.timeLimit - timeRef.current;
      if (remaining > 0 && remaining < 10 && Math.floor(remaining) !== Math.floor(remaining + dt)) {
        gameSounds.tick();
      }

      if (scoreRef.current >= lvl.target && !completedRef.current) {
        completedRef.current = true;
        gameSounds.levelComplete();
        stopMusic();
        const stars = calcStars(scoreRef.current, lvl.target, wantedRef.current, catchesRef.current);
        addParticles(playerRef.current.x, playerRef.current.y, "#ffd700", 40, 100);
        screenFlash("#ffd70060", 0.8);
        setTimeout(() => onComplete(scoreRef.current, stars, timeRef.current), 2000);
        forceRender((n) => n + 1);
      }

      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        stopMusic();
        gameSounds.caught();
        setTimeout(() => onComplete(scoreRef.current, 0, timeRef.current), 2000);
        forceRender((n) => n + 1);
      }

      updateVoice(dt);
      updatePlayer(dt);
      updateEnemies(dt);
      updateItems();
      updateGaspar(dt);
      updateParticles(dt);
      updateFloats();
      trailRef.current = trailRef.current.filter(t => timeRef.current - t.born < 0.3);
      renderFrame();
    };

    const updateVoice = (dt: number) => {
      voiceTimerRef.current -= dt;
      if (voiceTimerRef.current <= 0) {
        voiceTimerRef.current = 6 + Math.random() * 8;
        playVoice(0.6);
        const quote = VOICE_QUOTES[Math.floor(Math.random() * VOICE_QUOTES.length)];
        addFloat(`"${quote.length > 35 ? quote.slice(0, 35) + "..." : quote}"`, playerRef.current.x, playerRef.current.y - 40, "#ffffff", 2.5);
      }
    };

    const updatePlayer = (dt: number) => {
      const p = playerRef.current;
      const keys = keysRef.current;
      const joy = joystickRef.current;
      const dash = dashRef.current;

      let dx = 0, dy = 0;
      if (keys.has("ArrowLeft") || keys.has("KeyA")) dx -= 1;
      if (keys.has("ArrowRight") || keys.has("KeyD")) dx += 1;
      if (keys.has("ArrowUp") || keys.has("KeyW")) dy -= 1;
      if (keys.has("ArrowDown") || keys.has("KeyS")) dy += 1;
      if (joy.active) { dx += joy.dx; dy += joy.dy; }

      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag > 0) {
        dx /= mag; dy /= mag;
        p.facing = Math.atan2(dy, dx);
        p.vx = dx; p.vy = dy;
        bobRef.current += dt * 14;
      }

      let speed = PLAYER_SPEED;
      if (dash.active) {
        dx = dash.dx; dy = dash.dy;
        speed = DASH_SPEED;
        trailRef.current.push({ x: p.x, y: p.y, born: timeRef.current });
      }

      const newX = p.x + dx * speed * dt;
      const newY = p.y + dy * speed * dt;
      if (!collidesWithSolid(newX, p.y, PS)) p.x = newX;
      if (!collidesWithSolid(p.x, newY, PS)) p.y = newY;

      const mapW = getLevelCols() * T;
      const mapH = getLevelRows() * T;
      p.x = Math.max(PS / 2, Math.min(mapW - PS / 2, p.x));
      p.y = Math.max(PS / 2, Math.min(mapH - PS / 2, p.y));

      if (mag > 0.3) gameSounds.step();
      if (invulnRef.current > 0) invulnRef.current -= dt;
    };

    const updateEnemies = (dt: number) => {
      const p = playerRef.current;
      const enemies = enemiesRef.current;
      const wanted = wantedRef.current;
      const speedMul = 1 + wanted * 0.1;

      for (const e of enemies) {
        // Frozen enemies don't move at all
        if (e.frozen) continue;

        if (e.alertCooldown > 0) {
          e.alertCooldown = Math.max(0, e.alertCooldown - dt);
          e.chasing = false;
        }

        const stats = ENEMY_STATS[e.type];
        const dxP = p.x - e.x;
        const dyP = p.y - e.y;
        const distP = Math.sqrt(dxP * dxP + dyP * dyP);
        const detectRange = stats.detectRange + wanted * 18;

        if (distP < detectRange && invulnRef.current <= 0 && e.alertCooldown <= 0) {
          if (!e.chasing) { e.chasing = true; gameSounds.alert(); }

          const spd = stats.chaseSpeed * speedMul * dt;
          if (distP > 0) {
            const nx = e.x + (dxP / distP) * spd;
            const ny = e.y + (dyP / distP) * spd;
            if (!collidesWithSolid(nx, e.y, 18)) e.x = nx;
            if (!collidesWithSolid(e.x, ny, 18)) e.y = ny;
          }

          if (e.type === "journalist") {
            if (distP < stats.detectRange * 0.5) {
              wantedRef.current = Math.min(10, wantedRef.current + dt * 0.8);
              if (Math.random() < dt * 0.3) {
                addFloat("📸", e.x, e.y - 25, "#a855f7", 0.8);
                addParticles(e.x, e.y, "#a855f7", 3, 20);
              }
            }
            continue;
          }

          if (distP < CATCH_R && invulnRef.current <= 0) {
            const penalty = Math.floor(scoreRef.current * 0.15);
            scoreRef.current = Math.max(0, scoreRef.current - penalty);
            invulnRef.current = INVULN_MS / 1000;
            catchesRef.current++;
            comboRef.current.count = 0;
            shake(1.5);
            screenFlash("#ef444460", 0.3);
            addFloat(`-${penalty} €`, p.x, p.y - 20, "#ef4444", 1, 18);
            addParticles(p.x, p.y, "#ef4444", 15, 80);
            gameSounds.caught();
            playVoice(0.9);
            addFloat(`"${CAUGHT_QUOTES[Math.floor(Math.random() * CAUGHT_QUOTES.length)]}"`, p.x, p.y - 45, "#fca5a5", 2);
            e.chasing = false;
            e.alertCooldown = 2;
          }
        } else {
          e.chasing = false;
          const wp = e.waypoints[e.wpIdx];
          const dxW = wp.x - e.x;
          const dyW = wp.y - e.y;
          const distW = Math.sqrt(dxW * dxW + dyW * dyW);
          if (distW < 4) {
            e.wpIdx = (e.wpIdx + 1) % e.waypoints.length;
          } else {
            const spd = stats.speed * speedMul * dt;
            const nx = e.x + (dxW / distW) * spd;
            const ny = e.y + (dyW / distW) * spd;
            if (!collidesWithSolid(nx, e.y, 18)) e.x = nx;
            if (!collidesWithSolid(e.x, ny, 18)) e.y = ny;
          }
        }
      }
    };

    const updateGaspar = (dt: number) => {
      const g = gasparRef.current;
      if (!g.active) return;

      g.timer += dt;
      const spd = 220;

      if (g.phase === "walking") {
        const dxG = g.targetX - g.x;
        const dyG = g.targetY - g.y;
        const dist = Math.sqrt(dxG * dxG + dyG * dyG);
        if (dist < 20 || g.timer > 2.5) {
          g.phase = "bribing";
          g.timer = 0;
          gameSounds.bribe();
          // Actually bribe enemies now
          for (const e of enemiesRef.current) {
            if (e.type !== "journalist") {
              e.chasing = false;
              e.alertCooldown = 6;
            }
          }
          wantedRef.current = Math.max(0, wantedRef.current - 3);
          shake(0.5);
          // Spawn money particles
          for (let i = 0; i < 12; i++) {
            const a = Math.random() * Math.PI * 2;
            g.moneyParticles.push({
              x: g.x, y: g.y - 10,
              vx: Math.cos(a) * (40 + Math.random() * 60),
              vy: -30 - Math.random() * 80,
              born: timeRef.current,
            });
          }
          addFloat("💰 ÚPLATOK!", g.x, g.y - 50, "#ffd700", 2, 20);
          addFloat("Gaspar: Vybavené, šéfe!", g.x, g.y - 70, "#22c55e", 2.5, 12);
        } else {
          g.x += (dxG / dist) * spd * dt;
          g.y += (dyG / dist) * spd * dt;
        }
      } else if (g.phase === "bribing") {
        // Update money particles
        for (const mp of g.moneyParticles) {
          mp.vy += 120 * dt;
          mp.x += mp.vx * dt;
          mp.y += mp.vy * dt;
          mp.vx *= 0.98;
        }
        if (g.timer > 1.8) {
          g.phase = "leaving";
          g.timer = 0;
        }
      } else if (g.phase === "leaving") {
        g.x -= spd * 0.8 * dt;
        g.y += spd * 0.3 * dt;
        if (g.timer > 1.5) {
          g.active = false;
          g.phase = "done";
        }
      }
    };

    const updateItems = () => {
      const p = playerRef.current;
      const items = itemsRef.current;
      const now = timeRef.current;

      for (const item of items) {
        if (!item.alive && item.respawnAt > 0 && now >= item.respawnAt) item.alive = true;
        if (!item.alive) continue;

        const dx = p.x - item.x;
        const dy = p.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < PICKUP_R) {
          item.alive = false;
          item.respawnAt = now + (item.type === "gold" ? ITEM_RESPAWN_SLOW : item.type === "doc" ? ITEM_RESPAWN_SLOW : ITEM_RESPAWN_FAST);

          const nowMs = performance.now();
          if (nowMs - comboRef.current.lastPickup < COMBO_TIMEOUT) {
            comboRef.current.count = Math.min(comboRef.current.count + 1, COMBO_MULTIPLIERS.length - 1);
          } else {
            comboRef.current.count = 0;
          }
          comboRef.current.lastPickup = nowMs;

          const multiplier = COMBO_MULTIPLIERS[Math.min(comboRef.current.count, COMBO_MULTIPLIERS.length - 1)];
          const finalValue = Math.floor(item.value * multiplier);
          scoreRef.current += finalValue;
          wantedRef.current = Math.min(10, wantedRef.current + (item.value / 2500));

          const comboIdx = comboRef.current.count;
          const comboColor = COMBO_COLORS[Math.min(comboIdx, COMBO_COLORS.length - 1)];
          const fontSize = 14 + comboIdx * 2;
          addFloat(`+${finalValue} €`, item.x, item.y - 10, comboColor, 1.2, fontSize);

          if (comboIdx > 0) {
            addFloat(`x${COMBO_MULTIPLIERS[comboIdx]}`, item.x + 25, item.y, comboColor, 1, 10 + comboIdx);
            gameSounds.combo(comboIdx);
            if (comboIdx >= 3) {
              addParticles(item.x, item.y, comboColor, 12, 40);
              shake(0.2 + comboIdx * 0.1);
            }
            if (comboIdx >= 5) screenFlash("#ffd70030", 0.2);
          }

          if (Math.random() < 0.3) {
            addFloat(STEAL_QUOTES[Math.floor(Math.random() * STEAL_QUOTES.length)], p.x, p.y - 30, "#ffffff", 1.8);
          }

          addParticles(item.x, item.y, "#ffd700", 6, 30);
          if (item.type === "gold") { gameSounds.gold(); shake(0.15); }
          else if (item.type === "bag" || item.type === "doc") gameSounds.money();
          else gameSounds.coin();
        }
      }
    };

    const updateParticles = (dt: number) => {
      const now = timeRef.current;
      for (const part of particlesRef.current) {
        part.x += part.vx * dt;
        part.y += part.vy * dt;
        part.vx *= 0.95; part.vy *= 0.95;
      }
      particlesRef.current = particlesRef.current.filter((p) => now - p.born < PARTICLE_LIFE);
    };

    const updateFloats = () => {
      floatsRef.current = floatsRef.current.filter((f) => timeRef.current - f.born < f.duration);
    };

    const renderFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const c = canvas.getContext("2d");
      if (!c) return;
      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;

      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, cw, ch);

      const lvl = levelRef.current;
      const cols = getLevelCols();
      const rows = getLevelRows();
      const mapW = cols * T;
      const mapH = rows * T;
      const p = playerRef.current;
      const shk = shakeRef.current;
      const now = timeRef.current;

      const camX = Math.max(0, Math.min(mapW - cw, p.x - cw / 2)) + shk.x;
      const camY = Math.max(0, Math.min(mapH - ch, p.y - ch / 2)) + shk.y;

      c.save();
      c.translate(-camX, -camY);

      const startCol = Math.max(0, Math.floor(camX / T));
      const endCol = Math.min(cols, Math.ceil((camX + cw) / T));
      const startRow = Math.max(0, Math.floor(camY / T));
      const endRow = Math.min(rows, Math.ceil((camY + ch) / T));

      for (let r = startRow; r < endRow; r++) {
        for (let col = startCol; col < endCol; col++) {
          const tile = tileAt(col, r);
          const x = col * T;
          const y = r * T;
          if (tile === "wall") {
            c.fillStyle = lvl.wallColor;
            c.fillRect(x, y, T, T);
            c.fillStyle = lvl.wallAccent;
            c.fillRect(x + 1, y + 1, T - 2, T - 2);
          } else if (tile === "door") {
            c.fillStyle = "#1a1a1a";
            c.fillRect(x, y, T, T);
            c.fillStyle = "#5a3a1a";
            c.fillRect(x + T * 0.15, y + T * 0.1, T * 0.7, T * 0.8);
          } else if (tile === "table") {
            c.fillStyle = lvl.floorColor;
            c.fillRect(x, y, T, T);
            c.fillStyle = "#4a3520";
            c.fillRect(x + 4, y + 4, T - 8, T - 8);
            c.fillStyle = "#5a4530";
            c.fillRect(x + 6, y + 6, T - 12, T - 12);
          } else {
            c.fillStyle = lvl.floorColor;
            c.fillRect(x, y, T, T);
            c.strokeStyle = `${lvl.floorColor}33`;
            c.strokeRect(x, y, T, T);
          }
        }
      }

      c.font = "10px sans-serif";
      c.fillStyle = "rgba(255,255,255,0.06)";
      c.textAlign = "center";
      for (const label of lvl.rooms) c.fillText(label.name, label.x, label.y);

      // Items with glow
      for (const item of itemsRef.current) {
        if (!item.alive) continue;
        const ix = item.x;
        const iy = item.y;
        const pulse = 1 + Math.sin(now * 4 + ix) * 0.15;

        if (item.type === "coin") {
          c.shadowColor = "rgba(255,215,0,0.4)";
          c.shadowBlur = 6;
          c.beginPath();
          c.arc(ix, iy, 7 * pulse, 0, Math.PI * 2);
          c.fillStyle = "#ffd700";
          c.fill();
          c.shadowBlur = 0;
          c.fillStyle = "#b8860b";
          c.font = "bold 9px sans-serif";
          c.textAlign = "center";
          c.fillText("€", ix, iy + 3);
        } else if (item.type === "bag") {
          c.shadowColor = "rgba(255,215,0,0.5)";
          c.shadowBlur = 8;
          c.fillStyle = "#8b6914";
          c.beginPath();
          c.arc(ix, iy, 10 * pulse, 0, Math.PI * 2);
          c.fill();
          c.shadowBlur = 0;
          c.fillStyle = "#ffd700";
          c.font = "bold 11px sans-serif";
          c.textAlign = "center";
          c.fillText("€€", ix, iy + 4);
        } else if (item.type === "gold") {
          c.shadowColor = "rgba(255,215,0,0.7)";
          c.shadowBlur = 14;
          c.fillStyle = "#ffd700";
          const s = 9 * pulse;
          c.fillRect(ix - s, iy - s * 0.6, s * 2, s * 1.2);
          c.shadowBlur = 0;
          c.fillStyle = "#b8860b";
          c.font = "bold 9px sans-serif";
          c.textAlign = "center";
          c.fillText("Au", ix, iy + 3);
        } else {
          c.shadowColor = "rgba(200,200,200,0.4)";
          c.shadowBlur = 6;
          c.fillStyle = "#e8e8e0";
          const s = 8 * pulse;
          c.fillRect(ix - s * 0.7, iy - s, s * 1.4, s * 2);
          c.shadowBlur = 0;
          c.fillStyle = "#666";
          c.font = "7px sans-serif";
          c.textAlign = "center";
          c.fillText("DOC", ix, iy + 2);
        }
      }

      // Dash trail
      for (const tr of trailRef.current) {
        const age = now - tr.born;
        const alpha = Math.max(0, 1 - age / 0.3);
        c.globalAlpha = alpha * 0.3;
        c.fillStyle = "#ffd700";
        c.beginPath();
        c.arc(tr.x, tr.y, PS * 0.4 * (1 - age), 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;

      // Particles
      for (const part of particlesRef.current) {
        const age = now - part.born;
        const alpha = Math.max(0, 1 - age / PARTICLE_LIFE);
        c.globalAlpha = alpha;
        c.fillStyle = part.color;
        c.beginPath();
        c.arc(part.x, part.y, part.size * (1 - age / PARTICLE_LIFE * 0.5), 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;

      // Enemies with siren effect
      for (const e of enemiesRef.current) {
        const stats = ENEMY_STATS[e.type];
        const confused = e.alertCooldown > 0;

        if (e.chasing) {
          c.beginPath();
          c.arc(e.x, e.y, stats.detectRange, 0, Math.PI * 2);
          c.strokeStyle = "rgba(220,38,38,0.12)";
          c.lineWidth = 1;
          c.stroke();
          // Siren pulse
          const sirenPulse = Math.sin(now * 10) * 0.5 + 0.5;
          c.beginPath();
          c.arc(e.x, e.y - 18, 4, 0, Math.PI * 2);
          c.fillStyle = sirenPulse > 0.5 ? "#ef4444" : "#3b82f6";
          c.fill();
        }

        c.globalAlpha = e.frozen ? 0.4 : 1;
        c.fillStyle = e.frozen ? "#6b99cc" : confused ? "#d97706" : e.chasing ? stats.chaseColor : stats.color;
        c.fillRect(e.x - 10, e.y - 10, 20, 24);

        c.beginPath();
        c.arc(e.x, e.y - 14, 10, 0, Math.PI * 2);
        c.fillStyle = e.frozen ? "#88bbee" : confused ? "#f59e0b" : e.chasing ? stats.chaseColor : stats.color;
        c.fill();

        if (e.frozen) {
          c.fillStyle = "#aaddff";
          c.font = "14px sans-serif";
          c.textAlign = "center";
          c.fillText("❄️", e.x, e.y - 28);
          // Ice crystals around frozen enemy
          for (let i = 0; i < 4; i++) {
            const a = now * 2 + i * Math.PI / 2;
            const cr = 16 + Math.sin(now * 3 + i) * 3;
            c.fillStyle = "rgba(136,187,238,0.5)";
            c.beginPath();
            c.arc(e.x + Math.cos(a) * cr, e.y + Math.sin(a) * cr, 2, 0, Math.PI * 2);
            c.fill();
          }
        } else {
          c.fillStyle = confused ? "#fbbf24" : e.chasing ? "#fca5a5" : "#93c5fd";
          c.font = "bold 9px sans-serif";
          c.textAlign = "center";
          c.fillText(confused ? "💫" : e.chasing ? "!" : stats.label, e.x, e.y - 28);
        }
        c.globalAlpha = 1;
      }

      // Gaspar
      const g = gasparRef.current;
      if (g.active && g.phase !== "done") {
        const gAlpha = g.phase === "leaving" ? Math.max(0, 1 - g.timer / 1.5) : 1;
        c.globalAlpha = gAlpha;

        // Gaspar body
        c.fillStyle = "#1a1a2e";
        c.fillRect(g.x - 11, g.y - 4, 22, 22);
        c.fillStyle = "#2d2d4e";
        c.fillRect(g.x - 9, g.y - 2, 18, 18);

        // Gaspar head with photo
        c.save();
        c.beginPath();
        c.arc(g.x, g.y - 14, 14, 0, Math.PI * 2);
        c.clip();
        if (gasparImgLoadedRef.current && gasparImgRef.current) {
          c.drawImage(gasparImgRef.current, g.x - 14, g.y - 28, 28, 28);
        } else {
          c.fillStyle = "#666";
          c.fill();
        }
        c.restore();

        c.beginPath();
        c.arc(g.x, g.y - 14, 14, 0, Math.PI * 2);
        c.strokeStyle = "#ffd700";
        c.lineWidth = 2;
        c.stroke();

        // Name tag
        c.fillStyle = "rgba(0,0,0,0.7)";
        c.fillRect(g.x - 32, g.y + 20, 64, 14);
        c.fillStyle = "#ffd700";
        c.font = "bold 9px sans-serif";
        c.textAlign = "center";
        c.fillText("Tibor Gašpar", g.x, g.y + 30);

        // Money particles during bribe
        if (g.phase === "bribing") {
          for (const mp of g.moneyParticles) {
            const mpAge = now - mp.born;
            if (mpAge > 2) continue;
            c.globalAlpha = Math.max(0, 1 - mpAge / 2) * gAlpha;
            c.fillStyle = "#22c55e";
            c.font = "bold 12px sans-serif";
            c.fillText("€", mp.x, mp.y);
            c.fillStyle = "#ffd700";
            c.font = "10px sans-serif";
            c.fillText("💶", mp.x + 8, mp.y + 5);
          }
        }

        // Walking indicator
        if (g.phase === "walking") {
          c.fillStyle = "rgba(255,215,0,0.3)";
          c.font = "16px sans-serif";
          c.fillText("🏃", g.x + 15, g.y - 5);
        }

        c.globalAlpha = 1;
      }

      // Player
      const px = p.x;
      const py = p.y;
      const isInvuln = invulnRef.current > 0;
      const bobY = Math.sin(bobRef.current) * 2;
      const isDashing = dashRef.current.active;

      if (isInvuln && Math.floor(now * 8) % 2 === 0) {
        // blink
      } else {
        if (isDashing) {
          c.shadowColor = "#ffd700";
          c.shadowBlur = 20;
        }

        c.fillStyle = "#1a1a2e";
        const bx = px - 11;
        const by = py - 4 + bobY;
        c.beginPath();
        c.roundRect(bx, by, 22, 22, 4);
        c.fill();
        c.fillStyle = "#8b0000";
        c.fillRect(bx + 9, by + 2, 4, 14);

        c.shadowBlur = 0;

        c.save();
        c.beginPath();
        c.arc(px, py - 12 + bobY, 13, 0, Math.PI * 2);
        c.clip();
        if (imgLoadedRef.current && imgRef.current) {
          c.drawImage(imgRef.current, px - 13, py - 25 + bobY, 26, 26);
        } else {
          c.fillStyle = "#fbbf24";
          c.fill();
          c.fillStyle = "#000";
          c.font = "bold 10px sans-serif";
          c.textAlign = "center";
          c.fillText(minister.name.charAt(0), px, py - 9 + bobY);
        }
        c.restore();

        c.beginPath();
        c.arc(px, py - 12 + bobY, 13, 0, Math.PI * 2);
        const hasImmunity = immunityTimerRef.current > 0;
        c.strokeStyle = isDashing ? "#ffd700" : hasImmunity ? "#34d399" : isInvuln ? "#ef4444" : "#ffd700";
        c.lineWidth = isDashing ? 3 : hasImmunity ? 3 : 2;
        c.stroke();

        if (hasImmunity) {
          c.beginPath();
          c.arc(px, py - 2 + bobY, 22, 0, Math.PI * 2);
          c.strokeStyle = `rgba(52,211,153,${0.2 + Math.sin(now * 6) * 0.15})`;
          c.lineWidth = 2;
          c.stroke();
        }

        c.fillStyle = "rgba(0,0,0,0.6)";
        const nameW = c.measureText(minister.name).width + 8;
        c.fillRect(px - nameW / 2, py + 18 + bobY, nameW, 14);
        c.fillStyle = "#ffd700";
        c.font = "bold 9px sans-serif";
        c.textAlign = "center";
        c.fillText(minister.name, px, py + 28 + bobY);
      }

      // Float texts
      for (const f of floatsRef.current) {
        const age = now - f.born;
        const alpha = Math.max(0, 1 - age / f.duration);
        const rise = age * 35;
        c.globalAlpha = alpha;
        c.fillStyle = "#00000080";
        const tw = c.measureText(f.text).width;
        c.fillRect(f.x - tw / 2 - 3, f.y - rise - 10, tw + 6, 16);
        c.fillStyle = f.color;
        c.font = f.size ? `bold ${f.size}px sans-serif` : (f.color === "#ffffff" ? "italic 11px sans-serif" : "bold 13px sans-serif");
        c.textAlign = "center";
        c.fillText(f.text, f.x, f.y - rise);
      }
      c.globalAlpha = 1;

      c.restore();

      // Screen effects
      const wanted = wantedRef.current;
      if (wanted > 3) {
        const intensity = Math.min((wanted - 3) / 7, 1) * 0.4;
        const grad = c.createRadialGradient(cw / 2, ch / 2, cw * 0.3, cw / 2, ch / 2, cw * 0.7);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, `rgba(220,38,38,${intensity})`);
        c.fillStyle = grad;
        c.fillRect(0, 0, cw, ch);
      }

      if (wanted > 6 && Math.sin(now * 4) > 0.7) {
        c.fillStyle = `rgba(220,38,38,${0.03 + (wanted - 6) * 0.01})`;
        c.fillRect(0, 0, cw, ch);
      }

      const comboCount = comboRef.current.count;
      if (comboCount >= 3) {
        const glowIntensity = Math.min((comboCount - 2) / 5, 1) * 0.15;
        const grad2 = c.createRadialGradient(cw / 2, ch / 2, cw * 0.4, cw / 2, ch / 2, cw * 0.7);
        grad2.addColorStop(0, "rgba(0,0,0,0)");
        grad2.addColorStop(1, `rgba(255,215,0,${glowIntensity})`);
        c.fillStyle = grad2;
        c.fillRect(0, 0, cw, ch);
      }

      // Screen flash
      const sf = screenFlashRef.current;
      if (sf.active) {
        const sfAge = now - sf.born;
        if (sfAge < sf.duration) {
          c.fillStyle = sf.color;
          c.globalAlpha = Math.max(0, 1 - sfAge / sf.duration);
          c.fillRect(0, 0, cw, ch);
          c.globalAlpha = 1;
        } else {
          sf.active = false;
        }
      }

      // HUD
      c.fillStyle = "rgba(0,0,0,0.85)";
      c.fillRect(0, 0, cw, 56);
      c.fillStyle = "rgba(255,255,255,0.05)";
      c.fillRect(0, 55, cw, 1);

      c.fillStyle = "#ffd700";
      c.font = "bold 24px sans-serif";
      c.textAlign = "left";
      c.fillText(`${Math.floor(displayScoreRef.current).toLocaleString("sk-SK")} €`, 12, 28);

      const targetPct = Math.min(scoreRef.current / lvl.target, 1);
      c.fillStyle = "#222";
      c.fillRect(12, 36, 150, 8);
      const progGrad = c.createLinearGradient(12, 0, 162, 0);
      progGrad.addColorStop(0, "#fbbf24");
      progGrad.addColorStop(1, targetPct >= 1 ? "#22c55e" : "#f59e0b");
      c.fillStyle = progGrad;
      c.fillRect(12, 36, 150 * targetPct, 8);
      c.fillStyle = "rgba(255,255,255,0.4)";
      c.font = "9px sans-serif";
      c.textAlign = "left";
      c.fillText(`Cieľ: ${lvl.target.toLocaleString("sk-SK")} €`, 12, 54);

      if (comboCount > 0) {
        const cc = COMBO_COLORS[Math.min(comboCount, COMBO_COLORS.length - 1)];
        c.fillStyle = cc;
        c.font = `bold ${18 + comboCount * 2}px sans-serif`;
        c.textAlign = "center";
        c.fillText(`x${COMBO_MULTIPLIERS[Math.min(comboCount, COMBO_MULTIPLIERS.length - 1)]}`, cw / 2, 28);
        c.fillStyle = "rgba(255,255,255,0.3)";
        c.font = "9px sans-serif";
        c.fillText("COMBO", cw / 2, 42);
      }

      c.fillStyle = wanted > 5 ? "#ef4444" : wanted > 2 ? "#f59e0b" : "#22c55e";
      c.font = "bold 11px sans-serif";
      c.textAlign = "right";
      c.fillText("PÁTRANÝ", cw - 12, 18);
      c.fillStyle = "#222";
      c.fillRect(cw - 148, 24, 136, 8);
      c.fillStyle = wanted > 5 ? "#dc2626" : wanted > 2 ? "#f59e0b" : "#22c55e";
      c.fillRect(cw - 148, 24, Math.min(136, (wanted / 10) * 136), 8);

      const rem = Math.max(0, lvl.timeLimit - timeRef.current);
      c.fillStyle = rem < 15 ? "#ef4444" : rem < 30 ? "#f59e0b" : "rgba(255,255,255,0.5)";
      c.font = rem < 15 ? "bold 13px sans-serif" : "12px sans-serif";
      c.textAlign = "right";
      const mins = Math.floor(rem / 60);
      const secs = Math.floor(rem % 60);
      c.fillText(`${mins}:${secs.toString().padStart(2, "0")}`, cw - 12, 48);

      if (catchesRef.current > 0) {
        c.fillStyle = "rgba(239,68,68,0.5)";
        c.font = "10px sans-serif";
        c.textAlign = "right";
        c.fillText(`Chytený: ${catchesRef.current}x`, cw - 12, 54);
      }

      // Dash indicator
      const dashCd = dashRef.current;
      if (dashCd.cooldown > 0) {
        c.fillStyle = "rgba(255,255,255,0.15)";
        c.font = "9px sans-serif";
        c.textAlign = "center";
        c.fillText(`DASH: ${dashCd.cooldown.toFixed(1)}s`, cw / 2, 54);
      } else if (!dashCd.active) {
        c.fillStyle = "rgba(255,215,0,0.3)";
        c.font = "9px sans-serif";
        c.textAlign = "center";
        c.fillText("SHIFT = DASH", cw / 2, 54);
      }

      // Skill HUD
      const currentSkill = SKILLS[skillIndexRef.current % SKILLS.length];
      const cdLeft = skillCooldownRef.current;
      const cdPct = cdLeft / SKILL_COOLDOWN;
      const skillReady = cdLeft <= 0 && scoreRef.current >= currentSkill.cost;
      const skillW = 220;
      const skillX = (cw - skillW) / 2;
      const skillY = ch - 60;

      c.fillStyle = "rgba(0,0,0,0.8)";
      c.beginPath();
      c.roundRect(skillX, skillY, skillW, 48, 10);
      c.fill();
      if (skillReady) {
        c.strokeStyle = `${currentSkill.color}80`;
        c.lineWidth = 2;
        c.stroke();
      }

      c.fillStyle = "#222";
      c.fillRect(skillX + 44, skillY + 32, skillW - 54, 6);
      if (cdLeft > 0) {
        c.fillStyle = "#555";
        c.fillRect(skillX + 44, skillY + 32, (skillW - 54) * (1 - cdPct), 6);
      } else {
        c.fillStyle = currentSkill.color;
        c.fillRect(skillX + 44, skillY + 32, skillW - 54, 6);
      }

      c.font = "18px sans-serif";
      c.textAlign = "left";
      c.fillText(currentSkill.icon, skillX + 10, skillY + 26);
      c.font = skillReady ? "bold 12px sans-serif" : "12px sans-serif";
      c.fillStyle = skillReady ? currentSkill.color : "rgba(255,255,255,0.3)";
      c.fillText(currentSkill.name, skillX + 34, skillY + 18);

      c.font = "9px sans-serif";
      c.fillStyle = "rgba(255,255,255,0.3)";
      c.textAlign = "left";
      c.fillText(cdLeft > 0 ? `${Math.ceil(cdLeft)}s` : `${currentSkill.cost} €`, skillX + 34, skillY + 28);

      for (let i = 0; i < 4; i++) {
        const sk = SKILLS[i];
        const isActive = i === skillIndexRef.current % SKILLS.length;
        const sx = skillX + skillW + 6 + i * 28;
        const sy = skillY + 10;
        c.fillStyle = isActive ? `${sk.color}30` : "rgba(255,255,255,0.05)";
        c.beginPath();
        c.roundRect(sx, sy, 24, 28, 4);
        c.fill();
        if (isActive) {
          c.strokeStyle = sk.color;
          c.lineWidth = 1;
          c.stroke();
        }
        c.font = "12px sans-serif";
        c.textAlign = "center";
        c.fillText(sk.icon, sx + 12, sy + 16);
        c.fillStyle = "rgba(255,255,255,0.2)";
        c.font = "8px sans-serif";
        c.fillText(`${i + 1}`, sx + 12, sy + 26);
      }

      c.font = "bold 9px sans-serif";
      c.textAlign = "right";
      c.fillStyle = skillReady ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)";
      c.fillText("SPACE", skillX + skillW - 8, skillY + 18);

      const skf = skillFlashRef.current;
      if (skf.active) {
        const sfAge2 = now - skf.born;
        if (sfAge2 < 1.5) {
          c.globalAlpha = Math.max(0, 1 - sfAge2 / 1.5);
          c.fillStyle = skf.color;
          c.font = `bold ${22 + sfAge2 * 12}px sans-serif`;
          c.textAlign = "center";
          c.fillText(skf.text, cw / 2, ch / 2 - 30);
          c.globalAlpha = 1;
        } else {
          skillFlashRef.current.active = false;
        }
      }

      // Minimap
      const mmW = 100;
      const mmH = Math.floor(mmW * (rows / cols));
      const mmX = cw - mmW - 8;
      const mmY = ch - mmH - 68;
      const mmScale = mmW / (cols * T);

      c.fillStyle = "rgba(0,0,0,0.7)";
      c.beginPath();
      c.roundRect(mmX - 2, mmY - 2, mmW + 4, mmH + 4, 4);
      c.fill();

      const mmTileW = mmW / cols;
      const mmTileH = mmH / rows;
      for (let r = 0; r < rows; r++) {
        for (let col2 = 0; col2 < cols; col2++) {
          if (tileAt(col2, r) === "wall") {
            c.fillStyle = "rgba(255,255,255,0.15)";
            c.fillRect(mmX + col2 * mmTileW, mmY + r * mmTileH, mmTileW, mmTileH);
          }
        }
      }

      for (const item of itemsRef.current) {
        if (!item.alive) continue;
        c.fillStyle = "rgba(255,215,0,0.4)";
        c.fillRect(mmX + item.x * mmScale - 1, mmY + item.y * mmScale - 1, 2, 2);
      }

      for (const e of enemiesRef.current) {
        c.fillStyle = e.chasing ? "#ef4444" : e.frozen ? "#88bbee" : "#3b82f6";
        c.fillRect(mmX + e.x * mmScale - 2, mmY + e.y * mmScale - 2, 4, 4);
      }

      if (gasparRef.current.active) {
        c.fillStyle = "#ffd700";
        c.fillRect(mmX + gasparRef.current.x * mmScale - 2, mmY + gasparRef.current.y * mmScale - 2, 4, 4);
      }

      c.fillStyle = "#ffd700";
      c.beginPath();
      c.arc(mmX + p.x * mmScale, mmY + p.y * mmScale, 3, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = "rgba(255,255,255,0.12)";
      c.font = "10px sans-serif";
      c.textAlign = "center";
      c.fillText("WASD = pohyb  |  SHIFT = dash  |  SPACE = skill  |  1-4 = zmeniť", cw / 2, ch - 6);

      if ("ontouchstart" in window) {
        // Skill button - right side, vertically centered
        const btnX = cw - 60;
        const btnY = ch * 0.42;
        c.beginPath();
        c.arc(btnX, btnY, 36, 0, Math.PI * 2);
        c.fillStyle = skillReady ? "rgba(255,215,0,0.25)" : "rgba(100,100,100,0.15)";
        c.fill();
        c.strokeStyle = skillReady ? "rgba(255,215,0,0.6)" : "rgba(100,100,100,0.25)";
        c.lineWidth = 2;
        c.stroke();
        c.font = "26px sans-serif";
        c.textAlign = "center";
        c.fillText(currentSkill.icon, btnX, btnY + 8);
        c.fillStyle = skillReady ? "rgba(255,215,0,0.8)" : "rgba(255,255,255,0.3)";
        c.font = "bold 9px sans-serif";
        c.fillText(currentSkill.name, btnX, btnY + 28);

        // Dash button - below skill button
        const dashBtnY = ch * 0.62;
        c.beginPath();
        c.arc(btnX, dashBtnY, 28, 0, Math.PI * 2);
        c.fillStyle = dashCd.cooldown <= 0 ? "rgba(255,215,0,0.2)" : "rgba(100,100,100,0.1)";
        c.fill();
        c.strokeStyle = dashCd.cooldown <= 0 ? "rgba(255,215,0,0.4)" : "rgba(100,100,100,0.15)";
        c.lineWidth = 1.5;
        c.stroke();
        c.font = "bold 12px sans-serif";
        c.fillStyle = dashCd.cooldown <= 0 ? "rgba(255,215,0,0.7)" : "rgba(255,255,255,0.3)";
        c.fillText("DASH", btnX, dashBtnY + 5);
      }

      const joy = joystickRef.current;
      if (joy.active) {
        c.beginPath();
        c.arc(joy.cx, joy.cy, 50, 0, Math.PI * 2);
        c.fillStyle = "rgba(255,255,255,0.05)";
        c.fill();
        c.strokeStyle = "rgba(255,255,255,0.15)";
        c.lineWidth = 2;
        c.stroke();
        c.beginPath();
        c.arc(joy.cx + joy.dx * 40, joy.cy + joy.dy * 40, 18, 0, Math.PI * 2);
        c.fillStyle = "rgba(255,215,0,0.3)";
        c.fill();
      }

      if (pausedRef.current) {
        c.fillStyle = "rgba(0,0,0,0.8)";
        c.fillRect(0, 0, cw, ch);
        c.fillStyle = "#ffd700";
        c.font = "bold 40px sans-serif";
        c.textAlign = "center";
        c.fillText("PAUZA", cw / 2, ch / 2 - 30);
        c.fillStyle = "rgba(255,255,255,0.5)";
        c.font = "14px sans-serif";
        c.fillText("ESC pre pokračovanie", cw / 2, ch / 2 + 10);
        c.fillStyle = "rgba(255,255,255,0.3)";
        c.font = "12px sans-serif";
        c.fillText(`Level ${lvl.id}: ${lvl.name}`, cw / 2, ch / 2 + 40);
      }

      if (completedRef.current) {
        c.fillStyle = "rgba(0,0,0,0.85)";
        c.fillRect(0, 0, cw, ch);

        const success = scoreRef.current >= lvl.target;
        const stars = success ? calcStars(scoreRef.current, lvl.target, wantedRef.current, catchesRef.current) : 0;

        c.fillStyle = success ? "#ffd700" : "#ef4444";
        c.font = "bold 36px sans-serif";
        c.textAlign = "center";
        c.fillText(success ? "LEVEL HOTOVÝ!" : "ČAS VYPRŠAL!", cw / 2, ch / 2 - 60);

        if (success) {
          c.font = "40px sans-serif";
          c.fillText("⭐".repeat(stars) + "☆".repeat(3 - stars), cw / 2, ch / 2 - 15);
        }

        c.fillStyle = "#ffd700";
        c.font = "bold 22px sans-serif";
        c.fillText(`${scoreRef.current.toLocaleString("sk-SK")} €`, cw / 2, ch / 2 + 25);

        c.fillStyle = "rgba(255,255,255,0.5)";
        c.font = "13px sans-serif";
        c.fillText(`Chytený: ${catchesRef.current}x  |  Čas: ${Math.floor(timeRef.current)}s`, cw / 2, ch / 2 + 55);
      }
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minister.name, levelId, onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-none select-none overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="block" />
      <button
        onClick={onBack}
        className="absolute left-3 top-14 z-10 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
      >
        ← Späť
      </button>
    </div>
  );
};

export default GameCanvas;
