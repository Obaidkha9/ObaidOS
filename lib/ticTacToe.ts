export type Cell = "X" | "O" | null;
export type Level = 1 | 2 | 3;
export type Status = "playing" | "wonLevel" | "lostLevel" | "draw" | "challengeComplete";
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
export const winLine = (b: Cell[]) => LINES.find(([a,c,d]) => b[a] && b[a] === b[c] && b[a] === b[d]);
const legal = (b: Cell[]) => b.flatMap((v,i) => v ? [] : [i]);
const after = (b: Cell[], i: number, p: Cell) => b.map((v,j) => i === j ? p : v);
const wins = (b: Cell[], p: Cell) => legal(b).filter(i => winLine(after(b,i,p)));
const forks = (b: Cell[], p: Cell) => legal(b).filter(i => wins(after(b,i,p),p).length > 1);
const pick = (items: number[], random: () => number) => items[Math.floor(random()*items.length)];
function score(b: Cell[], player: "X" | "O", depth = 0): number {
  const line = winLine(b);
  if (line) return b[line[0]] === "O" ? 10-depth : depth-10;
  const moves = legal(b);
  if (!moves.length) return 0;
  const scores = moves.map(i => score(after(b,i,player),player === "O" ? "X" : "O",depth+1));
  return player === "O" ? Math.max(...scores) : Math.min(...scores);
}
export function aiMove(b: Cell[], level: Level, random = Math.random, mercyActive = false): number {
  const moves = legal(b);
  if (!moves.length || winLine(b)) return -1;
  if (level === 1 && random() < .32) return pick(moves,random);
  const winning = wins(b,"O");
  if (winning.length) return pick(winning,random);
  const blocking = wins(b,"X");
  if (level === 3) {
    if (blocking.length && mercyActive) {
      const openings = moves.filter(i => !blocking.includes(i));
      if (openings.length) {
        const rankedOpenings = openings.map(i => ({i,s:score(after(b,i,"O"),"X")})).sort((a,c) => c.s-a.s);
        return pick(rankedOpenings.filter(m => m.s === rankedOpenings[0].s).map(m => m.i),random);
      }
    }
    if (blocking.length) return pick(blocking,random);
    const ranked = moves.map(i => ({i,s:score(after(b,i,"O"),"X")})).sort((a,c) => c.s-a.s);
    // Occasionally miss a deeper tactic, but never hand over an immediate win.
    const alternatives = ranked.filter(m => m.s < ranked[0].s && wins(after(b,m.i,"O"),"X").length === 0);
    if (alternatives.length && random() < .15) return pick(alternatives.filter(m => m.s === alternatives[0].s).map(m => m.i),random);
    return pick(ranked.filter(m => m.s === ranked[0].s).map(m => m.i),random);
  }
  if (level === 2 && random() < .18) return pick(moves,random);
  if (blocking.length) return pick(blocking,random);
  if (level === 2) {
    const ownForks = forks(b,"O");
    if (ownForks.length) return pick(ownForks,random);
    const enemyForks = forks(b,"X");
    if (enemyForks.length === 1) return enemyForks[0];
  }
  if (!b[4]) return 4;
  const corners = [0,2,6,8].filter(i => !b[i]);
  return pick(corners.length ? corners : moves,random);
}
export interface Game { currentLevel: Level; board: Cell[]; currentPlayer: "X" | "O"; winner: Cell; gameStatus: Status; round: number; expertDrawStreak: number; expertMercyAt: 6 | 7; expertMercyActive: boolean }
const mercyThreshold = (): 6 | 7 => Math.random() < .5 ? 6 : 7;
export const initialGame = (currentLevel: Level = 1, round = 0): Game => ({currentLevel,board:Array(9).fill(null),currentPlayer:"X",winner:null,gameStatus:"playing",round,expertDrawStreak:0,expertMercyAt:mercyThreshold(),expertMercyActive:false});
export type Action = {type:"move"; index:number; player:"X"|"O"; round:number} | {type:"reset"|"retry"|"next"};
export function gameReducer(g: Game, a: Action): Game {
  if (a.type === "reset") return initialGame(1,g.round+1);
  if (a.type === "retry" && ["draw","lostLevel"].includes(g.gameStatus)) {
    const next = initialGame(g.currentLevel,g.round+1);
    if (g.currentLevel !== 3 || (g.gameStatus === "lostLevel" && !g.expertMercyActive)) return next;
    return {...next,expertDrawStreak:g.expertDrawStreak,expertMercyAt:g.expertMercyAt,expertMercyActive:g.expertMercyActive || g.expertDrawStreak >= g.expertMercyAt};
  }
  if (a.type === "next") return g.gameStatus === "wonLevel" && g.currentLevel < 3 ? initialGame((g.currentLevel+1) as Level,g.round+1) : g;
  if (a.type !== "move" || a.round !== g.round || g.gameStatus !== "playing" || a.player !== g.currentPlayer || a.index < 0 || a.index > 8 || g.board[a.index]) return g;
  const board = after(g.board,a.index,a.player);
  const line = winLine(board);
  const winner = line ? board[line[0]] : null;
  const gameStatus: Status = winner === "X" ? (g.currentLevel === 3 ? "challengeComplete" : "wonLevel") : winner === "O" ? "lostLevel" : board.every(Boolean) ? "draw" : "playing";
  const expertDrawStreak = g.currentLevel === 3 && gameStatus === "draw" ? g.expertDrawStreak+1 : g.currentLevel === 3 && gameStatus !== "playing" && !g.expertMercyActive ? 0 : g.expertDrawStreak;
  const expertMercyActive = gameStatus === "challengeComplete" ? false : g.expertMercyActive;
  return {...g,board,winner,gameStatus,currentPlayer:a.player === "X" ? "O" : "X",expertDrawStreak,expertMercyActive};
}
