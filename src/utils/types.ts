export interface LocalStorageType {
  states: State[];
}

interface State {
  puzzleId: string;
  data: Data;
  schemaVersion: string;
  timestamp: number;
  printDate: string;
}

interface Data {
  boardState: string[];
  currentRowIndex: number;
  status: string;
  hardMode: boolean;
  isPlayingArchive: boolean;
  setLegacyStats: SetLegacyStats;
}

interface SetLegacyStats {
  gamesPlayed: number;
  gamesWon: number;
  guesses: Guesses;
  currentStreak: number;
  maxStreak: number;
  lastWonDayOffset: number;
  hasPlayed: boolean;
  timestamp: number;
}

interface Guesses {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "6": number;
  fail: number;
}

export type EvaluationType = "present" | "absent" | "correct";

export type Attempt = LetterEvaluation[];

export interface LetterEvaluation {
  letter: string;
  position: number;
  evaluation: EvaluationType;
}

export interface LetterPossibility {
  letter: string;
  possiblePositions: number[];
}

export interface BitCalculated {
  word: string;
  bits: number;
}
