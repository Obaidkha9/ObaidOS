"use client";

import { useEffect, useReducer, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { aiMove, gameReducer, initialGame, winLine } from "@/lib/ticTacToe";
import { asset } from "@/lib/asset";
import styles from "./TicTacToeApp.module.css";

export default function TicTacToeApp() {
  const [game, dispatch] = useReducer(gameReducer, undefined, () => initialGame());
  const [revealedRound, setRevealedRound] = useState(-1);
  const reduced = useReducedMotion();
  const {board,currentLevel,currentPlayer,gameStatus,round,expertMercyActive} = game;
  const ended = gameStatus !== "playing";
  const revealed = ended && revealedRound === round;
  const complete = gameStatus === "challengeComplete";
  const celebrating = gameStatus === "wonLevel" || complete;
  const line = winLine(board);
  useEffect(() => {
    if (ended || currentPlayer !== "O") return;
    const timer = setTimeout(() => dispatch({type:"move",index:aiMove(board,currentLevel,Math.random,expertMercyActive),player:"O",round}),430);
    return () => clearTimeout(timer);
  },[board,currentLevel,currentPlayer,ended,expertMercyActive,round]);
  useEffect(() => {
    if (!ended) return;
    const timer = setTimeout(() => setRevealedRound(round),650);
    return () => clearTimeout(timer);
  },[ended,round]);
  const title = complete ? "Respect" : gameStatus === "wonLevel" ? `Level ${currentLevel} Cleared` : gameStatus === "lostLevel" ? "AI Wins" : "Draw";
  const image = complete ? "complete" : gameStatus === "wonLevel" ? (currentLevel === 2 ? "cleared-level-2" : "cleared") : gameStatus === "lostLevel" ? "loss" : "draw";
  return (
    <div className={styles.game} style={{fontFamily:"var(--font-sans)"}}>
      <div className={styles.header}>
        <div><h1 className="text-lg font-bold leading-tight">Tic-Tac-Toe</h1><p className="text-xs text-white/45">Vs AI Challenge • Level {currentLevel}</p></div>
        <div className={styles.progress} aria-label={`Level ${currentLevel} of 3`}>
          {[1,2,3].map(level => <span key={level} className={level <= currentLevel ? styles.progressActive : ""} />)}
        </div>
      </div>
      <div className={styles.stage}>
        {revealed ? <motion.div key={`result-${round}`} className={styles.result} initial={reduced ? false : {opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.25}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(`/tictactoe/${image}.webp`)} alt={complete ? "Mission Passed — Respect+" : gameStatus === "wonLevel" ? (currentLevel === 2 ? "Nah, homie. We ain’t done yet" : "You are not going anywhere Homie") : gameStatus === "lostLevel" ? "Noob" : "Really Homie"} className={styles.resultImage} />
          <h2 className="text-center text-base font-bold">{title}</h2>
          {gameStatus === "wonLevel" && <p className={`${styles.resultSubtext} text-sm text-white/60`}>{currentLevel === 2 ? "Nah, homie. We ain’t done yet" : "You are not going anywhere Homie"}</p>}
          {complete ? <p className={`${styles.resultSubtext} text-sm text-white/60`}>All 3 levels cleared.</p> : !celebrating && <p className={`${styles.resultSubtext} text-sm text-white/60`}>{gameStatus === "lostLevel" ? "I'm seeing your face, Noob" : "Ahhh, Sh*t here we go again"}</p>}
          {celebrating && !reduced && <div className={styles.confetti} aria-hidden="true">{Array.from({length:complete ? 32 : 18},(_,i) => <motion.span key={i} style={{left:i%2 ? "85%" : "15%",top:"65%",background:["#ff9f0a","#fff","#a1a1aa"][i%3]}} initial={{opacity:1,x:0,y:0,rotate:0}} animate={{opacity:[1,1,0],x:(i%2 ? -1 : 1)*(25+(i*37)%160),y:[0,-50-(i*19)%120,80],rotate:180+(i*47)%360}} transition={{duration:complete ? 1.8 : 1.25,ease:"easeOut"}} />)}</div>}
        </motion.div> : <motion.div key={`board-${round}`} className={styles.board} initial={reduced ? false : {opacity:0}} animate={{opacity:1}} transition={{duration:.25}}>
          {board.map((cell,i) => <button key={i} onClick={() => dispatch({type:"move",index:i,player:"X",round})} disabled={!!cell || ended || currentPlayer !== "X"} aria-label={`Row ${Math.floor(i/3)+1}, column ${i%3+1}: ${cell || "empty"}`} className={`${styles.cell} ${line?.includes(i) ? styles.winning : ""}`}>
            {cell && <motion.span initial={reduced ? false : {opacity:0,scale:.88}} animate={{opacity:1,scale:1}} transition={{duration:.18}} style={{color:cell === "X" ? "#7c8cff" : "#ff9f0a"}}>{cell}</motion.span>}
          </button>)}
        </motion.div>}
      </div>
      <p className={styles.status} role="status" aria-live="polite">{ended ? (revealed ? "" : title) : currentPlayer === "X" ? "Your move" : "AI thinking…"}</p>
      <div className={styles.buttons}>
        {!(complete && revealed) && <button className={styles.secondary} onClick={() => dispatch({type:"reset"})}>Reset</button>}
        {revealed && <>{gameStatus === "wonLevel" && <button className={styles.primary} onClick={() => dispatch({type:"next"})}>Next Level</button>}{(gameStatus === "draw" || gameStatus === "lostLevel") && <button className={styles.primary} onClick={() => dispatch({type:"retry"})}>Try Again</button>}{complete && <button className={styles.primary} onClick={() => dispatch({type:"reset"})}>Play Again</button>}</>}
      </div>
    </div>
  );
}
