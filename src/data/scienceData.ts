import { DayConfig, EcoScoreReport } from '../types/game';

export const DAYS_DATA: DayConfig[] = [
  {
    day: 1,
    name: 'Day 1: 씨앗의 발아와 첫 광합성',
    subtitle: '빛에너지, 물, 이산화탄소를 모아 첫 포도당과 산소를 만드세요!',
    targetGlucose: 35,
    dayDurationSec: 50,
    enemySpawnRate: 0.015,
    heatwaveCount: 1,
    dustCloudCount: 1,
    learningPoint: '광합성은 식물이 빛, 물(H2O), 이산화탄소(CO2)를 이용해 유기 양분(포도당)과 산소(O2)를 만드는 과정입니다.',
  },
  {
    day: 2,
    name: 'Day 2: 기공의 열림과 미세먼지의 습격',
    subtitle: '잎의 기공을 막는 미세먼지를 닦아내고 증산작용으로 열을 식히세요!',
    targetGlucose: 55,
    dayDurationSec: 55,
    enemySpawnRate: 0.025,
    heatwaveCount: 1,
    dustCloudCount: 2,
    learningPoint: '잎 뒷면의 기공(공변세포)은 이산화탄소를 흡수하고 수증기를 내뿜는(증산작용) 통로입니다. 먼지로 막히면 숨을 쉴 수 없어요!',
  },
  {
    day: 3,
    name: 'Day 3: 먹구름 차단과 해충의 급증',
    subtitle: '먹구름을 흩뜨려 햇빛을 되찾고, 진딧물과 붉은응애를 산소포로 물리치세요!',
    targetGlucose: 75,
    dayDurationSec: 60,
    enemySpawnRate: 0.035,
    heatwaveCount: 2,
    dustCloudCount: 3,
    learningPoint: '빛의 세기가 줄어들면 광합성 속도가 급격히 떨어집니다. 또한 해충이 잎을 갉아먹으면 양분 생성 능력이 훼손됩니다.',
  },
  {
    day: 4,
    name: 'Day 4: 지구온난화와 극한 폭염 경보',
    subtitle: '30°C를 넘으면 광합성 효율이 급락합니다! 쿨링 스킬로 적정 온도를 사수하세요.',
    targetGlucose: 90,
    dayDurationSec: 65,
    enemySpawnRate: 0.045,
    heatwaveCount: 3,
    dustCloudCount: 3,
    learningPoint: '식물 내 광합성 효소는 20~28°C에서 가장 활발합니다. 지나친 고온(폭염)은 단백질을 변성시켜 식물을 시들게 만듭니다.',
  },
  {
    day: 5,
    name: 'Day 5 [최종 결전]: 슈퍼 폭염 & 해충 군단 대공습',
    subtitle: '생태계의 위기를 이겨내고 거대한 수호목(World Tree)으로 각성하여 숲을 정화하세요!',
    targetGlucose: 120,
    dayDurationSec: 75,
    enemySpawnRate: 0.065,
    heatwaveCount: 4,
    dustCloudCount: 4,
    learningPoint: '식물이 건강하게 거목으로 자라나면 대기 중 이산화탄소를 흡수하고 산소를 공급해 생태계 전체의 평형을 회복시킵니다.',
  },
];

export interface ScienceCard {
  id: string;
  category: string;
  title: string;
  formula?: string;
  summary: string;
  details: string[];
  middleSchoolTip: string;
}

export const SCIENCE_CARDS: ScienceCard[] = [
  {
    id: 'photosynthesis',
    category: '광합성 (Photosynthesis)',
    title: '식물의 에너지 공장, 광합성',
    formula: '6CO₂ + 6H₂O + 빛에너지 → C₆H₁₂O₆(포도당) + 6O₂',
    summary: '식물 잎 속의 엽록체에서 빛을 흡수하여 물과 이산화탄소를 포도당과 산소로 합성하는 핵심 생명 작용입니다.',
    details: [
      '필요 요소: 뿌리에서 흡수한 물(H₂O), 기공으로 들어온 이산화탄소(CO₂), 태양 빛에너지.',
      '생성 물질: 식물의 성장과 활동에 쓰이는 유기 양분인 포도당(녹말로 저장)과 생명체가 숨쉬는 데 필요한 산소(O₂).',
      '영향 요인: 빛의 세기, 이산화탄소 농도, 그리고 적정 온도(20~28°C)가 알맞아야 광합성이 가장 왕성합니다.',
    ],
    middleSchoolTip: '시험 핵심! 빛의 세기와 CO₂ 농도가 증가할수록 광합성량은 증가하다가 일정해지며, 온도는 일정 한계(약 35~40°C)를 넘으면 급격히 감소합니다!',
  },
  {
    id: 'transpiration',
    category: '증산 작용 (Transpiration)',
    title: '식물의 땀과 냉각 시스템, 기공과 증산',
    summary: '잎의 기공을 통해 물이 수증기 형태로 공기 중에 방출되는 현상으로, 식물의 체온을 낮추고 물을 끌어올립니다.',
    details: [
      '기공과 공변세포: 2개의 공변세포가 팽창하면 기공이 열리고, 수분을 잃으면 기공이 닫힙니다.',
      '기화열 냉각: 물이 증발하면서 열을 빼앗아 가므로 한여름 뙤약볕에서도 식물의 체온이 25°C 안팎으로 유지됩니다.',
      '물 상승 원동력: 잎에서 증산작용이 일어나면서 생긴 음압으로 뿌리에서 흡수한 물이 줄기 끝까지 상승합니다.',
    ],
    middleSchoolTip: '게임 속 쿨링 스킬의 비밀! 증산작용이 활발할수록 식물 체온이 내려가 폭염에도 광합성 효소가 파괴되지 않습니다.',
  },
  {
    id: 'respiration',
    category: '호흡과 기체교환 (Respiration)',
    title: '밤의 생명 유지, 세포 호흡',
    formula: '포도당(C₆H₁₂O₆) + 산소(6O₂) → 에너지(ATP) + 물(6H₂O) + 이산화탄소(6CO₂)',
    summary: '낮 동안 모아둔 포도당을 산소로 분해하여 줄기와 잎, 뿌리를 성장시키고 손상된 세포를 복구하는 에너지(ATP)를 만듭니다.',
    details: [
      '낮의 기체 교환: 광합성량 > 호흡량 (이산화탄소 흡수, 산소 방출).',
      '밤의 기체 교환: 빛이 없어 광합성 중단, 호흡만 진행 (산소 흡수, 이산화탄소 방출).',
      '균형의 중요성: 낮에 충분한 포도당을 만들지 못하면 밤에 호흡을 통해 생장하지 못하고 굶주리게 됩니다.',
    ],
    middleSchoolTip: '낮에는 식물이 산소를 뿜어내는 것처럼 보이지만, 실은 식물도 24시간 내내 산소로 호흡하고 있답니다!',
  },
  {
    id: 'climate_crisis',
    category: '생태계 보전 (Ecosystem)',
    title: '지구온난화와 미세먼지가 식물에 미치는 위협',
    summary: '대기 오염과 이상 고온 현상은 식물의 자가 치유 능력을 무너뜨리고 숲의 생물 다양성을 파괴합니다.',
    details: [
      '미세먼지와 황사: 잎 표면의 기공을 막아 이산화탄소 흡수를 가로막고 햇빛 투과율을 떨어뜨립니다.',
      '온난화와 폭염: 적정 온도를 초과한 열파는 식물의 수분을 말리고 효소 활동을 정지시켜 말라죽게 합니다.',
      '해충 급증: 따뜻해진 겨울과 기후 불균형으로 외래 해충이 이상 증식하여 숲의 면역력을 떨어뜨립니다.',
    ],
    middleSchoolTip: '한 그루의 건강한 거목은 연간 약 35.7kg의 미세먼지를 흡수하고 성인 7명이 1년간 마실 산소를 만듭니다!',
  },
];

/**
 * 2. 생태계 평형 점수 (100점 만점 산출 공식)
 * - 온도 유지율 (35점): 적정 온도(20~28°C) 유지 시간 비율
 * - 포도당 생산량 (35점): 목표 포도당 달성도 및 초과량
 * - 기공 정화 횟수 (30점): 오염 물질을 성공적으로 막아낸 횟수
 */
export function calculateEcoScore(params: {
  optimalTempSeconds: number;
  totalPlaySeconds: number;
  totalGlucoseProduced: number;
  targetGlucoseTotal: number;
  stomaCleanCount: number;
  pestsDefeated: number;
  remainingHp: number;
  maxHp: number;
}): EcoScoreReport {
  const {
    optimalTempSeconds,
    totalPlaySeconds,
    totalGlucoseProduced,
    targetGlucoseTotal,
    stomaCleanCount,
    pestsDefeated,
    remainingHp,
    maxHp,
  } = params;

  // 1. 온도 유지율 점수 (35점 만점)
  const tempRatio = totalPlaySeconds > 0 ? Math.min(1, optimalTempSeconds / totalPlaySeconds) : 1;
  const tempScore = Math.round(tempRatio * 35);

  // 2. 포도당 생산량 점수 (35점 만점)
  const glucoseRatio = targetGlucoseTotal > 0 ? Math.min(1.2, totalGlucoseProduced / targetGlucoseTotal) : 1;
  const glucoseScore = Math.min(35, Math.round((glucoseRatio / 1.0) * 35));

  // 3. 기공 정화 및 오염 차단 점수 (30점 만점)
  // 기공 청소 1회당 점수 부여 + 해충 격퇴 보너스 반영 (최대 30점)
  const stomaBase = Math.min(22, stomaCleanCount * 3.5);
  const hpBonus = Math.min(8, Math.round((remainingHp / maxHp) * 8));
  const stomaScore = Math.min(30, Math.round(stomaBase + hpBonus));

  const totalScore = Math.min(100, Math.max(10, tempScore + glucoseScore + stomaScore));

  let grade: 'S+' | 'S' | 'A' | 'B' | 'C' = 'C';
  let evaluationText = '';
  let scienceTip = '';

  if (totalScore >= 95) {
    grade = 'S+';
    evaluationText = '경이로운 생태계 수호신! 완벽한 온도 제어와 광합성 효율로 숲 전체를 정화했습니다.';
    scienceTip = '광합성 반응과 증산작용의 원리를 완벽하게 통달했습니다. 중학교 과학 수행평가 100점 수준의 생태 마스터!';
  } else if (totalScore >= 88) {
    grade = 'S';
    evaluationText = '뛰어난 녹색 구호자! 폭염과 미세먼지 속에서도 기공을 청결히 유지하고 양분을 풍부히 생산했습니다.';
    scienceTip = '기공을 통한 증산작용으로 식물 체온을 20~28°C로 안정되게 지켜 광합성 효소 활성을 극대화했습니다.';
  } else if (totalScore >= 78) {
    grade = 'A';
    evaluationText = '성공적인 숲의 보호자! 해충과 오염의 위협 속에서 거목으로의 성장을 훌륭히 이뤄냈습니다.';
    scienceTip = '햇빛이 강해지거나 무더위 경보가 울릴 때 증산 쿨링 스킬을 더 신속히 쓰면 만점에 도전할 수 있습니다.';
  } else if (totalScore >= 65) {
    grade = 'B';
    evaluationText = '새싹 지킴이 수료! 여러 차례의 기후 위기를 넘기며 소중한 생명력을 지켜냈습니다.';
    scienceTip = '미세먼지로 잎의 기공이 막히면 CO2 공급이 끊겨 포도당 합성이 정체됩니다. 기공을 자주 청소해 주세요!';
  } else {
    grade = 'C';
    evaluationText = '새싹 구호 훈련생! 거친 환경 속에서도 포기하지 않고 생명의 끈을 이어갔습니다.';
    scienceTip = '온도가 30°C를 초과하면 효소가 파괴되어 식물 체력이 깎입니다. 물을 아끼지 말고 쿨링 스킬을 가동하세요!';
  }

  return {
    tempScore,
    glucoseScore,
    stomaScore,
    totalScore,
    tempOptimalRatio: Math.round(tempRatio * 100),
    totalGlucoseProduced: Math.round(totalGlucoseProduced),
    stomaCleanCount,
    pestsDefeated,
    grade,
    evaluationText,
    scienceTip,
  };
}
