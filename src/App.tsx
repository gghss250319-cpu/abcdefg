/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GamePhase, PlantStage, Upgrades, EcoScoreReport, RankingRecord } from './types/game';
import { DAYS_DATA, calculateEcoScore } from './data/scienceData';
import { sound } from './utils/audio';
import { getRankings, saveRankingRecord } from './utils/storage';
import { TitleScreen } from './components/TitleScreen';
import { HeaderHUD } from './components/HeaderHUD';
import { GameCanvas } from './components/GameCanvas';
import { ReactionBoard } from './components/ReactionBoard';
import { DefenseSkills } from './components/DefenseSkills';
import { NightPhaseModal } from './components/NightPhaseModal';
import { ScienceEncyclopediaModal } from './components/ScienceEncyclopediaModal';
import { ScoreReportModal } from './components/ScoreReportModal';
import { RankingModal } from './components/RankingModal';

export default function App() {
  // Navigation & Modal states
  const [phase, setPhase] = useState<GamePhase>('TITLE');
  const [nickname, setNickname] = useState('새싹구호자');
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [dayIntroNotice, setDayIntroNotice] = useState<string | null>(null);

  // Stage & Vital stats
  const [day, setDay] = useState(1);
  const currentDayData = DAYS_DATA[day - 1] || DAYS_DATA[0];

  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [water, setWater] = useState(70);
  const [maxWater, setMaxWater] = useState(100);
  const [temperature, setTemperature] = useState(24.0);

  // Photosynthesis Inventories
  const [lightCount, setLightCount] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [co2Count, setCo2Count] = useState(0);
  const [glucose, setGlucose] = useState(0);
  const [oxygen, setOxygen] = useState(6);

  // Day Timer & Weather
  const [dayTimeRemaining, setDayTimeRemaining] = useState(currentDayData.dayDurationSec);
  const [isHeatwave, setIsHeatwave] = useState(false);
  const [heatwaveTimeLeft, setHeatwaveTimeLeft] = useState(0);
  const [isCoolingActive, setIsCoolingActive] = useState(false);
  const [coolingCooldown, setCoolingCooldown] = useState(0);
  const [sunlightIntensity, setSunlightIntensity] = useState(1.0);

  // Upgrades
  const [upgrades, setUpgrades] = useState<Upgrades>({
    chloroplast: 0,
    leafExpansion: 0,
    rootDepth: 0,
    transpiration: 0,
    phytoncide: 0,
    stomaWax: 0,
  });

  // Score tracking statistics
  const [totalPlaySeconds, setTotalPlaySeconds] = useState(0);
  const [optimalTempSeconds, setOptimalTempSeconds] = useState(0);
  const [totalGlucoseProduced, setTotalGlucoseProduced] = useState(0);
  const [stomaCleanCount, setStomaCleanCount] = useState(0);
  const [pestsDefeated, setPestsDefeated] = useState(0);

  // Final Reports & Leaderboard
  const [rankings, setRankings] = useState<RankingRecord[]>([]);
  const [playerRank, setPlayerRank] = useState(0);
  const [ecoReport, setEcoReport] = useState<EcoScoreReport | null>(null);

  // Load rankings on startup
  useEffect(() => {
    setRankings(getRankings());
  }, []);

  // Update max water based on rootDepth upgrade
  useEffect(() => {
    setMaxWater(100 + upgrades.rootDepth * 25);
  }, [upgrades.rootDepth]);

  // Start new game
  const handleStartGame = () => {
    setDay(1);
    setHealth(100);
    setWater(70);
    setTemperature(24.0);
    setGlucose(0);
    setOxygen(6);
    setLightCount(0);
    setWaterCount(0);
    setCo2Count(0);
    setDayTimeRemaining(DAYS_DATA[0].dayDurationSec);
    setIsHeatwave(false);
    setHeatwaveTimeLeft(0);
    setIsCoolingActive(false);
    setCoolingCooldown(0);
    setUpgrades({
      chloroplast: 0,
      leafExpansion: 0,
      rootDepth: 0,
      transpiration: 0,
      phytoncide: 0,
      stomaWax: 0,
    });
    setTotalPlaySeconds(0);
    setOptimalTempSeconds(0);
    setTotalGlucoseProduced(0);
    setStomaCleanCount(0);
    setPestsDefeated(0);
    setEcoReport(null);

    setPhase('PLAYING');
    showDayNotice(DAYS_DATA[0].name, DAYS_DATA[0].subtitle);
  };

  const showDayNotice = (title: string, subtitle: string) => {
    setDayIntroNotice(`${title} - ${subtitle}`);
    setTimeout(() => {
      setDayIntroNotice(null);
    }, 4500);
  };

  // Automatic Photosynthesis Synthesis Check
  // 1 Light + 1 Water + 1 CO2 -> Glucose & Oxygen
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    if (lightCount >= 1 && waterCount >= 1 && co2Count >= 1) {
      // Consume 1 of each
      setLightCount((l) => l - 1);
      setWaterCount((w) => w - 1);
      setCo2Count((c) => c - 1);

      // Photosynthesis calculation
      const isOptimal = temperature >= 20 && temperature <= 28;
      const isOverheated = temperature > 30;

      let glucoseYield = 1 + upgrades.chloroplast * 0.3;
      if (isOverheated) glucoseYield *= 0.5; // High temp penalty
      if (sunlightIntensity < 0.6) glucoseYield *= 0.7; // Cloud penalty

      const roundedGlucose = Math.max(1, Math.round(glucoseYield));
      setGlucose((g) => g + roundedGlucose);
      setTotalGlucoseProduced((tg) => tg + roundedGlucose);
      setOxygen((o) => o + 1);

      sound.playPhotosynthesis();
    }
  }, [lightCount, waterCount, co2Count, phase, temperature, upgrades.chloroplast, sunlightIntensity]);

  // Main Playing Game Loop (Tick every 200ms)
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    const interval = setInterval(() => {
      const dt = 0.2;

      // 1. Time progression
      setDayTimeRemaining((prev) => {
        const next = prev - dt;
        if (next <= 0) {
          handleDayEnd();
          return 0;
        }
        return next;
      });

      setTotalPlaySeconds((t) => t + dt);

      // 2. Temperature Dynamics
      setTemperature((currTemp) => {
        let delta = 0;
        // Natural heat creep during midday
        delta += 0.04;

        if (isHeatwave) {
          // Surge rapidly during heatwave
          delta += 0.45;
        } else if (isCoolingActive) {
          // Rapidly cool down during transpiration cooling
          delta -= 0.8;
        } else if (currTemp > 24) {
          // Gentle ambient equilibrium
          delta -= 0.02;
        }

        const newTemp = Math.max(16, Math.min(42, currTemp + delta));

        // Track optimal temperature time (20~28°C)
        if (newTemp >= 20 && newTemp <= 28) {
          setOptimalTempSeconds((s) => s + dt);
        }

        // Damage plant if severely overheated (>34°C)
        if (newTemp > 34) {
          setHealth((h) => {
            const nextHp = h - 0.4;
            if (nextHp <= 0) {
              handleGameOver();
              return 0;
            }
            return nextHp;
          });
        }

        return newTemp;
      });

      // 3. Heatwave countdown handling
      if (isHeatwave) {
        setHeatwaveTimeLeft((prev) => {
          const next = prev - dt;
          if (next <= 0) {
            // Failed to cool down in time! Take severe heat damage
            setHealth((h) => {
              const damaged = h - 20;
              if (damaged <= 0) {
                handleGameOver();
                return 0;
              }
              return damaged;
            });
            sound.playHit();
            setIsHeatwave(false);
            return 0;
          }
          return next;
        });
      } else {
        // Random heatwave trigger check based on Day config
        const heatwaveChance = 0.005 * currentDayData.heatwaveCount;
        if (Math.random() < heatwaveChance) {
          triggerHeatwave();
        }
      }

      // 4. Natural root water absorption from soil
      setWater((w) => {
        const recharge = 0.15 + upgrades.rootDepth * 0.1;
        return Math.min(maxWater, w + recharge);
      });

      // 5. Cooldown decay
      setCoolingCooldown((cd) => Math.max(0, cd - dt * 0.25));
    }, 200);

    return () => clearInterval(interval);
  }, [
    phase,
    isHeatwave,
    isCoolingActive,
    currentDayData,
    maxWater,
    upgrades.rootDepth,
  ]);

  // Trigger a Heatwave warning event
  const triggerHeatwave = () => {
    setIsHeatwave(true);
    setHeatwaveTimeLeft(8.0); // 8-second countdown alert
    sound.playAlert();
  };

  // Cooling Skill (Transpiration: 증산 작용 기화열 냉각)
  const activateCooling = useCallback(() => {
    if (water < 12 || coolingCooldown > 0) return;

    setWater((w) => Math.max(0, w - 12));
    setCoolingCooldown(1.0);
    setIsCoolingActive(true);
    sound.playCooling();

    // Drop temperature instantly by 7°C (or 10°C if upgraded)
    const dropAmount = 7 + upgrades.transpiration * 1.5;
    setTemperature((t) => Math.max(19, t - dropAmount));

    // Cancel active heatwave penalty!
    if (isHeatwave) {
      setIsHeatwave(false);
      setHeatwaveTimeLeft(0);
    }

    setTimeout(() => {
      setIsCoolingActive(false);
    }, 1800);
  }, [water, coolingCooldown, upgrades.transpiration, isHeatwave]);

  // Oxygen Blast (Defense against pests)
  const activateOxygenBlast = useCallback(() => {
    if (oxygen < 1) return;
    setOxygen((o) => o - 1);
    sound.playOxygenBlast();
  }, [oxygen]);

  // Clean all stomata
  const cleanAllStomata = useCallback(() => {
    if (water < 10) return;
    setWater((w) => Math.max(0, w - 10));
    setStomaCleanCount((prev) => prev + 2);
    sound.playStomaClean();
  }, [water]);

  // Clear clouds / blow wind
  const clearClouds = useCallback(() => {
    setSunlightIntensity(1.0);
    sound.playWind();
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        activateCooling();
      } else if (e.code === 'KeyQ') {
        e.preventDefault();
        activateOxygenBlast();
      } else if (e.code === 'KeyE') {
        e.preventDefault();
        cleanAllStomata();
      } else if (e.code === 'KeyW') {
        e.preventDefault();
        clearClouds();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, activateCooling, activateOxygenBlast, cleanAllStomata, clearClouds]);

  // Resource collect handler
  const handleCollectParticle = (type: 'LIGHT' | 'WATER' | 'CO2') => {
    if (type === 'LIGHT') setLightCount((l) => l + 1);
    else if (type === 'WATER') {
      setWaterCount((w) => w + 1);
      setWater((prev) => Math.min(maxWater, prev + 2));
    } else if (type === 'CO2') setCo2Count((c) => c + 1);
  };

  // Stoma cleaned
  const handleCleanStoma = () => {
    setStomaCleanCount((c) => c + 1);
  };

  // Pest defeated
  const handlePestDefeated = () => {
    setPestsDefeated((p) => p + 1);
  };

  // Plant damage
  const handlePlantDamaged = (amount: number) => {
    setHealth((h) => {
      const nextHp = h - amount;
      if (nextHp <= 0) {
        handleGameOver();
        return 0;
      }
      return nextHp;
    });
  };

  // Day End check: Move to Night or Final Victory
  const handleDayEnd = () => {
    if (day >= 5) {
      // 5th day survived! Victory!
      handleVictory();
    } else {
      // Move to Night Phase
      setPhase('NIGHT');
      sound.playPhotosynthesis();
    }
  };

  // Transition from Night to Next Day
  const handleNextDay = () => {
    const nextDay = day + 1;
    setDay(nextDay);
    // Fully restore health during night
    setHealth(100);
    setWater(maxWater);
    setTemperature(22.0);
    setIsHeatwave(false);
    setHeatwaveTimeLeft(0);
    setDayTimeRemaining(DAYS_DATA[nextDay - 1].dayDurationSec);
    setLightCount(0);
    setWaterCount(0);
    setCo2Count(0);

    setPhase('PLAYING');
    showDayNotice(DAYS_DATA[nextDay - 1].name, DAYS_DATA[nextDay - 1].subtitle);
  };

  // Upgrade Purchase in Night Phase
  const handleUpgrade = (key: keyof Upgrades, cost: number) => {
    setGlucose((g) => Math.max(0, g - cost));
    setUpgrades((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  // Game Over
  const handleGameOver = () => {
    sound.playGameOver();
    const finalReport = calculateEcoScore({
      optimalTempSeconds,
      totalPlaySeconds,
      totalGlucoseProduced,
      targetGlucoseTotal: currentDayData.targetGlucose,
      stomaCleanCount,
      pestsDefeated,
      remainingHp: 0,
      maxHp: 100,
    });
    setEcoReport(finalReport);

    const { rank } = saveRankingRecord({
      nickname: nickname || '학생 구호자',
      totalScore: finalReport.totalScore,
      dayReached: day,
      clearTimeSec: Math.round(totalPlaySeconds),
      grade: finalReport.grade,
    });
    setPlayerRank(rank);
    setRankings(getRankings());
    setPhase('GAME_OVER');
  };

  // Victory Ending
  const handleVictory = () => {
    sound.playVictory();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#38bdf8', '#fbbf24', '#34d399', '#f472b6'],
    });

    const finalReport = calculateEcoScore({
      optimalTempSeconds,
      totalPlaySeconds,
      totalGlucoseProduced,
      targetGlucoseTotal: 300,
      stomaCleanCount,
      pestsDefeated,
      remainingHp: health,
      maxHp: 100,
    });
    setEcoReport(finalReport);

    const { rank } = saveRankingRecord({
      nickname: nickname || '학생 구호자',
      totalScore: finalReport.totalScore,
      dayReached: 5,
      clearTimeSec: Math.round(totalPlaySeconds),
      grade: finalReport.grade,
    });
    setPlayerRank(rank);
    setRankings(getRankings());
    setPhase('VICTORY');
  };

  // Science Quiz Reward bonus
  const handleRewardBonus = () => {
    setWater((w) => Math.min(maxWater, w + 30));
    setOxygen((o) => o + 5);
    sound.playPhotosynthesis();
  };

  const plantStage = Math.min(5, day) as PlantStage;

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between select-none">
      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto p-3 sm:p-5 flex flex-col gap-3">
        {/* Title Screen View */}
        {phase === 'TITLE' && (
          <TitleScreen
            nickname={nickname}
            setNickname={setNickname}
            onStartGame={handleStartGame}
            onOpenEncyclopedia={() => setShowEncyclopedia(true)}
            onOpenRanking={() => setShowRanking(true)}
          />
        )}

        {/* Active Gameplay View */}
        {(phase === 'PLAYING' || phase === 'NIGHT' || phase === 'GAME_OVER' || phase === 'VICTORY') && (
          <div className="flex flex-col gap-3">
            {/* Header HUD */}
            <HeaderHUD
              day={day}
              dayDuration={currentDayData.dayDurationSec}
              dayTimeRemaining={dayTimeRemaining}
              health={health}
              maxHealth={maxHealth}
              water={water}
              maxWater={maxWater}
              temperature={temperature}
              isHeatwave={isHeatwave}
              heatwaveTimeLeft={heatwaveTimeLeft}
              nickname={nickname}
              onOpenEncyclopedia={() => setShowEncyclopedia(true)}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />

            {/* Day Briefing Announcement Banner */}
            {dayIntroNotice && (
              <div className="w-full bg-emerald-600/90 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-emerald-400 shadow-xl flex items-center justify-between animate-fadeIn">
                <span>🌱 {dayIntroNotice}</span>
                <span className="text-[11px] font-normal text-emerald-200">
                  {currentDayData.learningPoint}
                </span>
              </div>
            )}

            {/* Interactive Canvas */}
            <GameCanvas
              stage={plantStage}
              temperature={temperature}
              health={health}
              maxHealth={maxHealth}
              water={water}
              maxWater={maxWater}
              oxygen={oxygen}
              dayTimeRemaining={dayTimeRemaining}
              dayDuration={currentDayData.dayDurationSec}
              isHeatwave={isHeatwave}
              heatwaveTimeLeft={heatwaveTimeLeft}
              upgrades={upgrades}
              onCollectParticle={handleCollectParticle}
              onShootEnemy={() => setOxygen((o) => Math.max(0, o - 1))}
              onCleanStoma={handleCleanStoma}
              onPestDefeated={handlePestDefeated}
              onPlantDamaged={handlePlantDamaged}
              isCoolingActive={isCoolingActive}
              sunlightIntensity={sunlightIntensity}
              setSunlightIntensity={setSunlightIntensity}
            />

            {/* Photosynthesis Reaction Formula Board */}
            <ReactionBoard
              lightCount={lightCount}
              waterCount={waterCount}
              co2Count={co2Count}
              glucose={glucose}
              targetGlucose={currentDayData.targetGlucose}
              oxygen={oxygen}
              temperature={temperature}
              canPhotosynthesize={lightCount >= 1 && waterCount >= 1 && co2Count >= 1}
              efficiency={
                temperature > 30
                  ? 0.5
                  : temperature >= 20 && temperature <= 28
                  ? 1.0 + upgrades.chloroplast * 0.2
                  : 0.75
              }
            />

            {/* Defense Skills and Action Controller */}
            <DefenseSkills
              water={water}
              oxygen={oxygen}
              temperature={temperature}
              isCoolingActive={isCoolingActive}
              coolingCooldown={coolingCooldown}
              onActivateCooling={activateCooling}
              onActivateOxygenBlast={activateOxygenBlast}
              onCleanAllStomata={cleanAllStomata}
              onClearClouds={clearClouds}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {/* 1. Night Phase Modal */}
      {phase === 'NIGHT' && (
        <NightPhaseModal
          day={day}
          glucose={glucose}
          oxygen={oxygen}
          stage={plantStage}
          upgrades={upgrades}
          onUpgrade={handleUpgrade}
          onNextDay={handleNextDay}
        />
      )}

      {/* 2. Score Report & Evaluation Modal (Game Over or Victory) */}
      {(phase === 'GAME_OVER' || phase === 'VICTORY') && ecoReport && (
        <ScoreReportModal
          isVictory={phase === 'VICTORY'}
          nickname={nickname}
          report={ecoReport}
          rank={playerRank}
          totalParticipants={rankings.length}
          clearTimeSec={Math.round(totalPlaySeconds)}
          onOpenRanking={() => setShowRanking(true)}
          onRestart={handleStartGame}
        />
      )}

      {/* 3. Middle School Science Encyclopedia Modal */}
      {showEncyclopedia && (
        <ScienceEncyclopediaModal
          onClose={() => setShowEncyclopedia(false)}
          onRewardBonus={handleRewardBonus}
        />
      )}

      {/* 4. Full Leaderboard Ranking Modal */}
      {showRanking && (
        <RankingModal
          rankings={rankings}
          currentNickname={nickname}
          onClose={() => setShowRanking(false)}
        />
      )}

      {/* Footer credits */}
      <footer className="w-full py-3 text-center text-[11px] text-slate-500 border-t border-slate-900 bg-slate-950/80">
        <p>
          《녹색 구호자: 새싹 디펜스!》 | 중학교 1·2학년 과학 교육용 게임 (광합성 · 호흡 · 증산작용 · 생태계 보전)
        </p>
      </footer>
    </div>
  );
}
