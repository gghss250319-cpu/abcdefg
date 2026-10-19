export type GamePhase =
  | 'TITLE'
  | 'STORY'
  | 'TUTORIAL'
  | 'PLAYING'
  | 'NIGHT'
  | 'GAME_OVER'
  | 'VICTORY';

export type PlantStage = 1 | 2 | 3 | 4 | 5;

export interface ParticleItem {
  id: number;
  type: 'LIGHT' | 'WATER' | 'CO2' | 'OXYGEN' | 'GLUCOSE';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  value: number;
}

export type EnemyType = 'APHID' | 'RED_MITE' | 'CATERPILLAR' | 'DUST_SMOG' | 'HEAT_BOSS';

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  size: number;
  scoreValue: number;
  frozenTimer?: number;
}

export interface StomaPoint {
  id: number;
  leafIndex: number;
  x: number;
  y: number;
  clogged: boolean; // 미세먼지로 막혔는지 여부
  clogTimer: number;
}

export interface CloudItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  speed: number;
  dustLevel: number; // 0 = 일반구름, >0 = 미세먼지 먹구름
}

export interface OxygenProjectile {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  power: number;
}

export interface CoolingMistParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

export interface Upgrades {
  chloroplast: number;    // 엽록체 증설 (광합성 포도당 생산량 증가)
  rootDepth: number;       // 깊은 뿌리 (수분 자연 충전 & 최대치 증가)
  leafExpansion: number;   // 잎 면적 확장 (빛/CO2 자동 포집 반경)
  phytoncide: number;      // 피톤치드 산소포 (산소 공격력 및 반경)
  transpiration: number;   // 증산 쿨러 (냉각 속도 & 지속시간 향상)
  stomaWax: number;        // 기공 큐티클 왁스층 (오염 저항력)
}

export interface DayConfig {
  day: number;
  name: string;
  subtitle: string;
  targetGlucose: number;
  dayDurationSec: number;
  enemySpawnRate: number;
  heatwaveCount: number;
  dustCloudCount: number;
  learningPoint: string;
}

export interface EcoScoreReport {
  tempScore: number;       // 온도 유지율 점수 (35점 만점)
  glucoseScore: number;    // 포도당 생산량 점수 (35점 만점)
  stomaScore: number;      // 기공 정화 점수 (30점 만점)
  totalScore: number;      // 총점 (100점 만점)
  tempOptimalRatio: number;// 적정온도 유지 비율 (%)
  totalGlucoseProduced: number; // 총 생산 포도당
  stomaCleanCount: number; // 총 기공 정화 횟수
  pestsDefeated: number;   // 처치한 해충 수
  grade: 'S+' | 'S' | 'A' | 'B' | 'C';
  evaluationText: string;
  scienceTip: string;
}

export interface RankingRecord {
  id: string;
  nickname: string;
  totalScore: number;
  dayReached: number;
  clearTimeSec: number;
  grade: string;
  date: string;
  isPlayer?: boolean;
}
