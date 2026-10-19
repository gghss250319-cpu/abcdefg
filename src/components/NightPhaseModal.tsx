import React, { useState } from 'react';
import { Moon, Sparkles, Heart, Zap, ArrowRight, ShieldCheck, Leaf, Compass } from 'lucide-react';
import { Upgrades, PlantStage } from '../types/game';
import { sound } from '../utils/audio';

interface NightPhaseModalProps {
  day: number;
  glucose: number;
  oxygen: number;
  stage: PlantStage;
  upgrades: Upgrades;
  onUpgrade: (key: keyof Upgrades, cost: number) => void;
  onNextDay: () => void;
}

export const NightPhaseModal: React.FC<NightPhaseModalProps> = ({
  day,
  glucose,
  oxygen,
  stage,
  upgrades,
  onUpgrade,
  onNextDay,
}) => {
  const [availableGlucose, setAvailableGlucose] = useState(glucose);

  const upgradeList: {
    key: keyof Upgrades;
    name: string;
    description: string;
    currentLevel: number;
    cost: number;
    icon: string;
  }[] = [
    {
      key: 'chloroplast',
      name: '엽록체 증설 (광합성 강화)',
      description: '빛과 CO2를 포도당으로 바꾸는 효율 +25% 증가',
      currentLevel: upgrades.chloroplast,
      cost: 15 + upgrades.chloroplast * 10,
      icon: '🌿',
    },
    {
      key: 'leafExpansion',
      name: '잎 면적 확장 (자원 집광)',
      description: '빛과 이산화탄소 분자를 자동으로 끌어당기는 범위 확대',
      currentLevel: upgrades.leafExpansion,
      cost: 12 + upgrades.leafExpansion * 10,
      icon: '🍃',
    },
    {
      key: 'rootDepth',
      name: '깊은 뿌리 발달 (수분 흡수)',
      description: '식물 최대 수분량 증가 및 지하수 자가 충전 속도 향상',
      currentLevel: upgrades.rootDepth,
      cost: 12 + upgrades.rootDepth * 8,
      icon: '🌱',
    },
    {
      key: 'transpiration',
      name: '증산 쿨러 강화 (체온 조절)',
      description: '쿨링 스킬 냉각력 강화 (-10°C) 및 쿨다운 단축',
      currentLevel: upgrades.transpiration,
      cost: 15 + upgrades.transpiration * 10,
      icon: '❄️',
    },
    {
      key: 'phytoncide',
      name: '피톤치드 산소포 (해충 방어)',
      description: '산소 방출 공격력 +1 및 폭발 범위 확대',
      currentLevel: upgrades.phytoncide,
      cost: 14 + upgrades.phytoncide * 10,
      icon: '🫧',
    },
    {
      key: 'stomaWax',
      name: '기공 큐티클 왁스층 (오염 방패)',
      description: '미세먼지와 황사가 기공에 들러붙는 속도를 40% 지연',
      currentLevel: upgrades.stomaWax,
      cost: 10 + upgrades.stomaWax * 8,
      icon: '🛡️',
    },
  ];

  const handleBuy = (key: keyof Upgrades, cost: number) => {
    if (availableGlucose >= cost) {
      setAvailableGlucose((prev) => prev - cost);
      onUpgrade(key, cost);
      sound.playUpgrade();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-500/40 p-6 text-white shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header: Moonlight and Cellular Respiration Concept */}
        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-amber-300">
              <Moon className="w-7 h-7 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                  DAY {day} 밤 (달밤의 세포 호흡)
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                  체력 100% 완전 회복!
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                포도당 분해와 식물 성장 투자
              </h2>
            </div>
          </div>

          <div className="bg-amber-950/60 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl flex flex-col items-end">
            <span className="text-[11px] text-amber-300 font-medium">사용 가능한 포도당</span>
            <span className="text-lg font-black font-mono text-amber-200">
              {availableGlucose} <span className="text-xs text-amber-400">포인트</span>
            </span>
          </div>
        </div>

        {/* Science Concept Explainer Box */}
        <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-3.5 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            중학교 과학 개념: 밤에는 왜 세포 호흡(Respiration)만 일어날까요?
          </div>
          <p className="text-slate-300 leading-relaxed">
            밤에는 태양 빛이 없어 광합성이 멈춥니다. 대신 낮 동안 합성한{' '}
            <strong className="text-amber-300">포도당</strong>과{' '}
            <strong className="text-cyan-300">산소</strong>를 소모하여 생명 활동에 필요한 에너지(ATP)를
            만들어 줄기를 굵게 하고 새로운 잎을 틔웁니다!
          </p>
          <div className="bg-slate-950/60 p-2 rounded-lg font-mono text-indigo-200 text-[11px] text-center border border-indigo-900/50">
            C₆H₁₂O₆ (포도당) + 6O₂ (산소) → 생장 에너지(ATP) + 6H₂O + 6CO₂
          </div>
        </div>

        {/* Upgrade Selection Grid */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-black text-slate-200 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            새싹 생장 투자 (포도당을 소모하여 다음 날을 대비하세요)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {upgradeList.map((item) => {
              const canAfford = availableGlucose >= item.cost;
              return (
                <div
                  key={item.key}
                  className="bg-slate-900/80 border border-slate-700/70 p-3 rounded-2xl flex items-center justify-between gap-2.5 hover:border-indigo-400/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{item.name}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                          Lv.{item.currentLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(item.key, item.cost)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition active:scale-95 cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    포도당 {item.cost}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Day Button */}
        <div className="pt-2 border-t border-indigo-900/40 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            남은 포도당은 다음 날 생태계 평형 점수에 가산됩니다.
          </div>
          <button
            onClick={onNextDay}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer text-sm"
          >
            <span>다음 아침 맞이하기 (DAY {day + 1})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
