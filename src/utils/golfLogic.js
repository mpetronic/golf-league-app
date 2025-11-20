/**
 * Calculates a player's handicap based on the rolling average of their last 3 rounds.
 * @param {number[]} scores - Array of gross scores.
 * @returns {number} The calculated handicap.
 */
export function calculateHandicap(scores) {
  if (!scores || scores.length === 0) return 0;
  const recentScores = scores.slice(-3);
  const sum = recentScores.reduce((a, b) => a + b, 0);
  // Return average rounded to nearest integer
  return Math.round(sum / recentScores.length);
}

/**
 * Calculates the net score for a hole given the gross score and handicaps.
 * @param {number} grossScore - The player's gross score on the hole.
 * @param {number} playerHandicap - The player's course handicap.
 * @param {number} holeHandicap - The hole's handicap ranking (1-18).
 * @returns {number} The net score.
 */
export function calculateNetScore(grossScore, playerHandicap, holeHandicap) {
  let strokesGiven = 0;
  
  // Base strokes (e.g. handicap 20 gets 1 stroke on every hole)
  strokesGiven += Math.floor(playerHandicap / 18);
  
  // Remainder strokes (e.g. handicap 20 has remainder 2, gets extra stroke on holes with hcp 1 & 2)
  const remainder = playerHandicap % 18;
  if (holeHandicap <= remainder) {
    strokesGiven += 1;
  }

  return grossScore - strokesGiven;
}

/**
 * Determines the winner of a hole in match play.
 * @param {number} p1Net - Player 1's net score.
 * @param {number} p2Net - Player 2's net score.
 * @returns {string|null} 'p1', 'p2', or null for tie.
 */
export function getHoleWinner(p1Net, p2Net) {
  if (p1Net < p2Net) return 'p1';
  if (p2Net < p1Net) return 'p2';
  return null; // Halved
}

/**
 * Pairs players from two teams based on closest handicaps.
 * @param {Array} team1Players 
 * @param {Array} team2Players 
 * @returns {Array} Array of pairings { player1, player2 }
 */
export function pairPlayers(team1Players, team2Players) {
  // Simple greedy algorithm: sort both by handicap and pair up
  const t1Sorted = [...team1Players].sort((a, b) => a.handicap - b.handicap);
  const t2Sorted = [...team2Players].sort((a, b) => a.handicap - b.handicap);

  const pairings = [];
  const maxLen = Math.max(t1Sorted.length, t2Sorted.length);

  for (let i = 0; i < maxLen; i++) {
    if (t1Sorted[i] && t2Sorted[i]) {
      pairings.push({ player1: t1Sorted[i], player2: t2Sorted[i] });
    }
  }
  return pairings;
}

/**
 * Calculates strokes received on a specific hole based on handicap differential.
 * The player with the higher handicap receives strokes on the N hardest holes,
 * where N is the handicap difference.
 * @param {number} playerHandicap - The player's handicap
 * @param {number} opponentHandicap - The opponent's handicap
 * @param {number} holeHandicap - The hole's handicap ranking (1-18, where 1 is hardest)
 * @returns {number} Number of strokes received on this hole (0 or 1)
 */
export function calculateStrokesReceived(playerHandicap, opponentHandicap, holeHandicap) {
  const handicapDiff = playerHandicap - opponentHandicap;
  
  // If player has higher handicap, they receive strokes on the N hardest holes
  if (handicapDiff > 0) {
    // They get a stroke on the N hardest holes (holes with handicap rating 1 through N)
    return holeHandicap <= handicapDiff ? 1 : 0;
  }
  
  // If player has lower or equal handicap, they don't receive strokes
  return 0;
}

/**
 * Calculates points awarded for a hole in match play.
 * @param {number} player1Net - Player 1's net score
 * @param {number} player2Net - Player 2's net score
 * @returns {Object} Points for each player { player1Points, player2Points }
 */
export function calculateHolePoints(player1Net, player2Net) {
  if (player1Net === player2Net) {
    // Tie - both get 1 point
    return { player1Points: 1, player2Points: 1 };
  } else if (player1Net < player2Net) {
    // Player 1 wins - gets 2 points
    return { player1Points: 2, player2Points: 0 };
  } else {
    // Player 2 wins - gets 2 points
    return { player1Points: 0, player2Points: 2 };
  }
}
