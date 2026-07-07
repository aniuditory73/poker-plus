'use client';

import { useCallback, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  GameSetup,
  HandParams,
  HandHistory,
  Recommendation,
  calculateEquity,
  calculatePotOdds,
  calculateSPR,
  getRecommendation,
  clearEquityCache,
} from '@/lib/poker';
import { generateScenario, TrainerScenario } from '@/lib/poker/trainer';

const DEFAULT_SETUP: GameSetup = {
  buyIn: 1000,
  playersCount: 6,
  smallBlind: 5,
  bigBlind: 10,
  ante: 0,
  currentStack: 1000,
};

export function usePokerGame() {
  const [setup, setSetup] = useLocalStorage<GameSetup>('poker-setup', DEFAULT_SETUP);
  const [history, setHistory] = useLocalStorage<HandHistory[]>('poker-history', []);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [lastHandId, setLastHandId] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);

  const [trainerMode, setTrainerMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<TrainerScenario | null>(null);
  const [trainerScore, setTrainerScore] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [trainerState, setTrainerState] = useState<'idle' | 'playing' | 'answered'>('idle');
  const [trainerCorrect, setTrainerCorrect] = useState<boolean | null>(null);

  const updateSetup = useCallback((newSetup: Partial<GameSetup>) => {
    setSetup(prev => ({ ...prev, ...newSetup }));
  }, [setSetup]);

  const calculate = useCallback(async (params: HandParams) => {
    if (!params.holeCards || !params.position) return;

    setCalculating(true);

    const numOpponents = params.remainingPlayers - 1;

    const equity = calculateEquity(
      params.holeCards,
      params.boardCards,
      params.street,
      numOpponents,
      params.opponentAction
    );

    const { percent } = calculatePotOdds(params.potSize, params.betToCall, setup.currentStack);
    const spr = calculateSPR(params.potSize, setup.currentStack);

    const rec = getRecommendation(
      equity,
      percent,
      params.position,
      setup.playersCount,
      spr,
      params.street,
      params.opponentAggression,
      setup.currentStack,
      params.betToCall,
      params.potSize,
      params.holeCards || undefined,
      params.boardCards,
      params.opponentAction
    );

    setRecommendation(rec);

    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setLastHandId(id);

    const entry: HandHistory = {
      id,
      timestamp: Date.now(),
      holeCards: params.holeCards,
      position: params.position,
      street: params.street,
      boardCards: params.boardCards,
      potSize: params.potSize,
      betToCall: params.betToCall,
      recommendation: rec,
    };

    setHistory(prev => [entry, ...prev].slice(0, 100));
    setCalculating(false);
  }, [setup, setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const newHand = useCallback(() => {
    setRecommendation(null);
    setLastHandId(null);
  }, []);

  const recordHandResult = useCallback((handId: string, stackChange: number) => {
    setSetup(prev => ({ ...prev, currentStack: prev.currentStack + stackChange }));
    setHistory(prev =>
      prev.map(h => h.id === handId ? { ...h, stackChange } : h)
    );
  }, [setSetup, setHistory]);

  const resetSession = useCallback(() => {
    setSetup(DEFAULT_SETUP);
    setHistory([]);
    setRecommendation(null);
    setLastHandId(null);
    clearEquityCache();
  }, [setSetup, setHistory]);

  const startTrainerRound = useCallback(() => {
    const scenario = generateScenario();
    setCurrentScenario(scenario);
    setTrainerState('playing');
    setTrainerCorrect(null);
  }, []);

  const submitTrainerAnswer = useCallback((action: 'fold' | 'call' | 'raise') => {
    if (!currentScenario) return;
    const correct = action === currentScenario.correctAction;
    setTrainerCorrect(correct);
    setTrainerScore(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (correct ? 1 : 0),
      streak: correct ? prev.streak + 1 : 0,
      bestStreak: Math.max(prev.bestStreak, correct ? prev.streak + 1 : prev.bestStreak),
    }));
    setTrainerState('answered');
  }, [currentScenario]);

  const skipTrainer = useCallback(() => {
    if (!currentScenario) return;
    setTrainerCorrect(null);
    setTrainerState('answered');
  }, [currentScenario]);

  return {
    setup,
    updateSetup,
    history,
    clearHistory,
    recommendation,
    calculating,
    calculate,
    newHand,
    recordHandResult,
    lastHandId,
    resetSession,
    trainerMode,
    setTrainerMode,
    currentScenario,
    trainerScore,
    trainerState,
    trainerCorrect,
    startTrainerRound,
    submitTrainerAnswer,
    skipTrainer,
  };
}
