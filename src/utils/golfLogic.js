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
