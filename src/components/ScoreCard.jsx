import React from 'react';
import clsx from 'clsx';
import { calculateStrokesReceived, calculateHolePoints } from '../utils/golfLogic';

export default function ScoreCard({ course, matchData, onScoreChange }) {
  const { team1, team2, pairings } = matchData;

  // Helper to check if any scores are entered for a set of holes
  const hasScoresForHoles = (player1, player2, holes) => {
    return holes.some(hole => {
      const p1Score = player1.scores?.[hole.number];
      const p2Score = player2.scores?.[hole.number];
      return (p1Score && p1Score !== '') || (p2Score && p2Score !== '');
    });
  };

  // Helper to check if a hole is a handicap hole within a specific 9-hole set
  const isHandicapHole = (player1, player2, hole, holes) => {
    const handicapDiff = Math.abs(player1.handicap - player2.handicap);
    
    // Get the N hardest holes from this 9-hole set
    const sortedHoles = [...holes].sort((a, b) => a.handicap - b.handicap);
    const handicapHoles = sortedHoles.slice(0, Math.min(handicapDiff, holes.length));
    
    // Check if this hole is one of the handicap holes
    return handicapHoles.some(h => h.number === hole.number);
  };

  // Helper to calculate net score for a hole
  const calculateNet = (player, opponent, hole) => {
    const score = player.scores?.[hole.number];
    if (!score || score === '') return '';
    
    const strokesReceived = calculateStrokesReceived(
      player.handicap, 
      opponent.handicap, 
      hole.handicap
    );
    
    return parseInt(score) - strokesReceived;
  };

  // Helper to calculate points for a hole
  const getHolePoints = (player1, player2, hole) => {
    const p1Net = calculateNet(player1, player2, hole);
    const p2Net = calculateNet(player2, player1, hole);
    
    if (p1Net === '' || p2Net === '') {
      return { player1Points: '', player2Points: '' };
    }
    
    return calculateHolePoints(p1Net, p2Net);
  };

  // Helper to render a pairing (player1 + player2 with Net and Points rows)
  const renderPairing = (pair, index) => {
    const { player1, player2 } = pair;

    // Calculate totals for front 9, back 9, and total
    const calculateTotals = (player, opponent, holes, isPlayer1) => {
      let gross = 0;
      let net = 0;
      let points = 0;
      let hasAllScores = true;

      holes.forEach(hole => {
        const score = player.scores?.[hole.number];
        if (score && score !== '') {
          gross += parseInt(score);
          const netScore = calculateNet(player, opponent, hole);
          if (netScore !== '') {
            net += netScore;
          }
        } else {
          hasAllScores = false;
        }
      });

      // Calculate points for all holes - always use player1, player2 order from pairing
      holes.forEach(hole => {
        const holePoints = getHolePoints(player1, player2, hole);
        if (holePoints.player1Points !== '') {
          // If calculating for player1, use player1Points; otherwise use player2Points
          points += isPlayer1 ? holePoints.player1Points : holePoints.player2Points;
        }
      });

      return { gross, net, points, hasAllScores };
    };

    const front9 = course.holes.slice(0, 9);
    const back9 = course.holes.slice(9, 18);
    const allHoles = course.holes;

    const p1Front = calculateTotals(player1, player2, front9, true);
    const p1Back = calculateTotals(player1, player2, back9, true);
    const p1Total = calculateTotals(player1, player2, allHoles, true);

    const p2Front = calculateTotals(player2, player1, front9, false);
    const p2Back = calculateTotals(player2, player1, back9, false);
    const p2Total = calculateTotals(player2, player1, allHoles, false);

    return (
      <React.Fragment key={index}>
        {/* Match Header */}
        <tr className="bg-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
          <td colSpan={24} className="p-1 pl-4 border-b border-gray-300">
            Match {index + 1}
          </td>
        </tr>

        {/* Player 1 - Gross Score */}
        <tr className="border-b border-gray-300 bg-white">
          <td className="p-2 border-r border-gray-300 font-medium text-gray-900 text-left pl-4">
            {player1.name} <span className="text-xs text-gray-500">({player1.handicap})</span>
          </td>
          {front9.map((hole) => {
            const score = player1.scores?.[hole.number] || '';
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center">
                <input
                  type="number"
                  value={score}
                  onChange={(e) => onScoreChange(player1.id, hole.number, e.target.value)}
                  className="w-full h-full text-center bg-transparent focus:outline-none font-bold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 font-bold text-center bg-gray-100">
            {p1Front.gross || ''}
          </td>
          {back9.map((hole) => {
            const score = player1.scores?.[hole.number] || '';
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center">
                <input
                  type="number"
                  value={score}
                  onChange={(e) => onScoreChange(player1.id, hole.number, e.target.value)}
                  className="w-full h-full text-center bg-transparent focus:outline-none font-bold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 font-bold text-center bg-gray-100">
            {p1Back.gross || ''}
          </td>
          <td className="p-2 font-bold text-center bg-gray-200 text-gray-900">
            {p1Total.gross || ''}
          </td>
        </tr>

        {/* Player 1 - Net Score */}
        <tr className="border-b border-gray-300 bg-blue-50">
          <td className="p-2 border-r border-gray-300 text-sm italic text-gray-700 text-left pl-8">
            Net
          </td>
          {front9.map((hole) => {
            const net = calculateNet(player1, player2, hole);
            const hasScores = hasScoresForHoles(player1, player2, front9);
            const isHcpHole = hasScores && isHandicapHole(player1, player2, hole, front9);
            return (
              <td key={hole.number} className={clsx(
                "p-1 border-r border-gray-300 text-center text-sm font-semibold",
                isHcpHole ? "bg-yellow-200 text-gray-900" : "text-gray-700"
              )}>
                {net !== '' ? net : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-semibold text-center bg-blue-100">
            {p1Front.net || ''}
          </td>
          {back9.map((hole) => {
            const net = calculateNet(player1, player2, hole);
            const hasScores = hasScoresForHoles(player1, player2, back9);
            const isHcpHole = hasScores && isHandicapHole(player1, player2, hole, back9);
            return (
              <td key={hole.number} className={clsx(
                "p-1 border-r border-gray-300 text-center text-sm font-semibold",
                isHcpHole ? "bg-yellow-200 text-gray-900" : "text-gray-700"
              )}>
                {net !== '' ? net : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-semibold text-center bg-blue-100">
            {p1Back.net || ''}
          </td>
          <td className="p-2 text-sm font-semibold text-center bg-blue-200 text-gray-900">
            {p1Total.net || ''}
          </td>
        </tr>

        {/* Player 1 - Points */}
        <tr className="border-b-2 border-gray-400 bg-green-50">
          <td className="p-2 border-r border-gray-300 text-sm italic text-gray-700 text-left pl-8">
            Points
          </td>
          {front9.map((hole) => {
            const points = getHolePoints(player1, player2, hole);
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center text-sm font-bold text-green-700">
                {points.player1Points !== '' ? points.player1Points : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-bold text-center bg-green-100 text-green-800">
            {p1Front.points || ''}
          </td>
          {back9.map((hole) => {
            const points = getHolePoints(player1, player2, hole);
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center text-sm font-bold text-green-700">
                {points.player1Points !== '' ? points.player1Points : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-bold text-center bg-green-100 text-green-800">
            {p1Back.points || ''}
          </td>
          <td className="p-2 text-sm font-bold text-center bg-green-200 text-green-900">
            {p1Total.points || ''}
          </td>
        </tr>

        {/* Player 2 - Gross Score */}
        <tr className="border-b border-gray-300 bg-gray-50">
          <td className="p-2 border-r border-gray-300 font-medium text-gray-900 text-left pl-4">
            {player2.name} <span className="text-xs text-gray-500">({player2.handicap})</span>
          </td>
          {front9.map((hole) => {
            const score = player2.scores?.[hole.number] || '';
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center">
                <input
                  type="number"
                  value={score}
                  onChange={(e) => onScoreChange(player2.id, hole.number, e.target.value)}
                  className="w-full h-full text-center bg-transparent focus:outline-none font-bold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 font-bold text-center bg-gray-100">
            {p2Front.gross || ''}
          </td>
          {back9.map((hole) => {
            const score = player2.scores?.[hole.number] || '';
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center">
                <input
                  type="number"
                  value={score}
                  onChange={(e) => onScoreChange(player2.id, hole.number, e.target.value)}
                  className="w-full h-full text-center bg-transparent focus:outline-none font-bold text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 font-bold text-center bg-gray-100">
            {p2Back.gross || ''}
          </td>
          <td className="p-2 font-bold text-center bg-gray-200 text-gray-900">
            {p2Total.gross || ''}
          </td>
        </tr>

        {/* Player 2 - Net Score */}
        <tr className="border-b border-gray-300 bg-blue-50">
          <td className="p-2 border-r border-gray-300 text-sm italic text-gray-700 text-left pl-8">
            Net
          </td>
          {front9.map((hole) => {
            const net = calculateNet(player2, player1, hole);
            const hasScores = hasScoresForHoles(player1, player2, front9);
            const isHcpHole = hasScores && isHandicapHole(player1, player2, hole, front9);
            return (
              <td key={hole.number} className={clsx(
                "p-1 border-r border-gray-300 text-center text-sm font-semibold",
                isHcpHole ? "bg-yellow-200 text-gray-900" : "text-gray-700"
              )}>
                {net !== '' ? net : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-semibold text-center bg-blue-100">
            {p2Front.net || ''}
          </td>
          {back9.map((hole) => {
            const net = calculateNet(player2, player1, hole);
            const hasScores = hasScoresForHoles(player1, player2, back9);
            const isHcpHole = hasScores && isHandicapHole(player1, player2, hole, back9);
            return (
              <td key={hole.number} className={clsx(
                "p-1 border-r border-gray-300 text-center text-sm font-semibold",
                isHcpHole ? "bg-yellow-200 text-gray-900" : "text-gray-700"
              )}>
                {net !== '' ? net : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-semibold text-center bg-blue-100">
            {p2Back.net || ''}
          </td>
          <td className="p-2 text-sm font-semibold text-center bg-blue-200 text-gray-900">
            {p2Total.net || ''}
          </td>
        </tr>

        {/* Player 2 - Points */}
        <tr className="border-b-2 border-gray-400 bg-green-50">
          <td className="p-2 border-r border-gray-300 text-sm italic text-gray-700 text-left pl-8">
            Points
          </td>
          {front9.map((hole) => {
            const points = getHolePoints(player1, player2, hole);
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center text-sm font-bold text-green-700">
                {points.player2Points !== '' ? points.player2Points : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-bold text-center bg-green-100 text-green-800">
            {p2Front.points || ''}
          </td>
          {back9.map((hole) => {
            const points = getHolePoints(player1, player2, hole);
            return (
              <td key={hole.number} className="p-1 border-r border-gray-300 text-center text-sm font-bold text-green-700">
                {points.player2Points !== '' ? points.player2Points : '-'}
              </td>
            );
          })}
          <td className="p-2 border-r border-gray-300 text-sm font-bold text-center bg-green-100 text-green-800">
            {p2Back.points || ''}
          </td>
          <td className="p-2 text-sm font-bold text-center bg-green-200 text-green-900">
            {p2Total.points || ''}
          </td>
        </tr>
      </React.Fragment>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px] bg-[#fdfbf7] text-gray-900 rounded-lg shadow-xl border border-gray-300 font-mono text-sm">
        {/* Header Info */}
        <div className="p-4 border-b-2 border-gray-800 flex justify-between items-end bg-[#fffdf5]">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">{course.name}</h2>
            <div className="text-sm text-gray-600 mt-1">
              {new Date().toLocaleDateString()} • {team1.name} vs {team2.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase text-gray-500">Par</div>
            <div className="text-3xl font-bold text-gray-900">{course.holes.reduce((a, b) => a + b.par, 0)}</div>
          </div>
        </div>

        {/* Score Grid */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-emerald-800 text-white text-xs uppercase tracking-wider">
              <th className="p-2 border-r border-emerald-700 text-left pl-4 w-48">Hole</th>
              {course.holes.slice(0, 9).map(h => (
                <th key={h.number} className="p-2 border-r border-emerald-700 w-10">{h.number}</th>
              ))}
              <th className="p-2 border-r border-emerald-700 w-12 bg-emerald-900">Out</th>
              {course.holes.slice(9, 18).map(h => (
                <th key={h.number} className="p-2 border-r border-emerald-700 w-10">{h.number}</th>
              ))}
              <th className="p-2 border-r border-emerald-700 w-12 bg-emerald-900">In</th>
              <th className="p-2 w-16 bg-emerald-950">Tot</th>
            </tr>
            <tr className="bg-emerald-700 text-emerald-100 text-[10px] uppercase">
              <th className="p-1 border-r border-emerald-600 text-left pl-4">Par</th>
              {course.holes.slice(0, 9).map(h => (
                <th key={h.number} className="p-1 border-r border-emerald-600">{h.par}</th>
              ))}
              <th className="p-1 border-r border-emerald-600 bg-emerald-800">{course.holes.slice(0, 9).reduce((a,b)=>a+b.par,0)}</th>
              {course.holes.slice(9, 18).map(h => (
                <th key={h.number} className="p-1 border-r border-emerald-600">{h.par}</th>
              ))}
              <th className="p-1 border-r border-emerald-600 bg-emerald-800">{course.holes.slice(9, 18).reduce((a,b)=>a+b.par,0)}</th>
              <th className="p-1 bg-emerald-900">{course.holes.reduce((a,b)=>a+b.par,0)}</th>
            </tr>
            <tr className="bg-emerald-600 text-emerald-100 text-[10px] uppercase">
              <th className="p-1 border-r border-emerald-500 text-left pl-4">HCP</th>
              {course.holes.slice(0, 9).map(h => (
                <th key={h.number} className="p-1 border-r border-emerald-500">{h.handicap}</th>
              ))}
              <th className="p-1 border-r border-emerald-500 bg-emerald-700"></th>
              {course.holes.slice(9, 18).map(h => (
                <th key={h.number} className="p-1 border-r border-emerald-500">{h.handicap}</th>
              ))}
              <th className="p-1 border-r border-emerald-500 bg-emerald-700"></th>
              <th className="p-1 bg-emerald-800"></th>
            </tr>
          </thead>
          <tbody>
            {pairings.map((pair, index) => renderPairing(pair, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
