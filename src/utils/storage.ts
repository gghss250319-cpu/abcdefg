import { RankingRecord } from '../types/game';

const STORAGE_KEY = 'green_savior_sprout_rankings_v1';

const DEFAULT_RIVAL_RANKINGS: RankingRecord[] = [
  {
    id: 'rival-1',
    nickname: '과학부장_민우',
    totalScore: 98,
    dayReached: 5,
    clearTimeSec: 285,
    grade: 'S+',
    date: '2026.10.18',
  },
  {
    id: 'rival-2',
    nickname: '광합성마스터_지호',
    totalScore: 94,
    dayReached: 5,
    clearTimeSec: 298,
    grade: 'S',
    date: '2026.10.17',
  },
  {
    id: 'rival-3',
    nickname: '새싹지킴이_서연',
    totalScore: 89,
    dayReached: 5,
    clearTimeSec: 320,
    grade: 'A',
    date: '2026.10.16',
  },
  {
    id: 'rival-4',
    nickname: '기공수호대_하은',
    totalScore: 82,
    dayReached: 4,
    clearTimeSec: 240,
    grade: 'B',
    date: '2026.10.15',
  },
  {
    id: 'rival-5',
    nickname: '식물탐구_준혁',
    totalScore: 75,
    dayReached: 3,
    clearTimeSec: 180,
    grade: 'C',
    date: '2026.10.14',
  },
];

export function getRankings(): RankingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RIVAL_RANKINGS));
      return DEFAULT_RIVAL_RANKINGS;
    }
    const parsed = JSON.parse(raw) as RankingRecord[];
    return sortRankings(parsed);
  } catch {
    return DEFAULT_RIVAL_RANKINGS;
  }
}

export function saveRankingRecord(newRecord: Omit<RankingRecord, 'id' | 'date'>): {
  record: RankingRecord;
  rank: number;
} {
  const current = getRankings();
  const dateStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const fullRecord: RankingRecord = {
    ...newRecord,
    id: 'record-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    date: dateStr,
    isPlayer: true,
  };

  const updated = [...current, fullRecord];
  const sorted = sortRankings(updated);

  // Keep top 20
  const top20 = sorted.slice(0, 20);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top20));
  } catch (e) {
    console.error('Failed to save ranking to localStorage', e);
  }

  const rank = top20.findIndex((r) => r.id === fullRecord.id) + 1;
  return { record: fullRecord, rank: rank > 0 ? rank : top20.length };
}

function sortRankings(list: RankingRecord[]): RankingRecord[] {
  return [...list].sort((a, b) => {
    // 1. 점수 높은 순
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    // 2. 도달한 Day 높은 순
    if (b.dayReached !== a.dayReached) {
      return b.dayReached - a.dayReached;
    }
    // 3. 최단 클리어 시간 순
    return a.clearTimeSec - b.clearTimeSec;
  });
}
