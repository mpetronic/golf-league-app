import React from 'react';
import clsx from 'clsx';
import { calculateNetScore } from '../utils/golfLogic';

export default function ScoreCard({ course, matchData, onScoreChange }) {
  const { team1, team2, pairings } = matchData;

  // Helper to render a row of scores
  const renderScoreRow = (player, isTeam1) => (
    <tr key={player.id} className={clsx("border-b border-gray-300", isTeam1 ? "bg-white" : "bg-gray-50")}>
      <td className="p-2 border-r border-gray-300 font-medium text-gray-900 text-left pl-4">
        {player.name} <span className="text-xs text-gray-500">({player.handicap})</span>
      </td>
      {course.holes.slice(0, 9).map((hole) => {
        const score = player.scores?.[hole.number] || '';
        const netScore = score ? calculateNetScore(parseInt(score), player.handicap, hole.handicap) : '-';
        return (
          <td key={hole.number} className="p-1 border-r border-gray-300 text-center relative group">
            <input
              type="number"
              value={score}
              onChange={(e) => onScoreChange(player.id, hole.number, e.target.value)}
              className="w-full h-full text-center bg-transparent focus:outline-none font-bold text-gray-800"
            />
            {score && (
              <span className="absolute top-0 right-0 text-[10px] text-gray-400 pr-0.5">
                {netScore}
              </span>
            )}
          </td>
        );
      })}
      <td className="p-2 border-r border-gray-300 font-bold text-center bg-gray-100">
        {course.holes.slice(0, 9).reduce((sum, h) => sum + (parseInt(player.scores?.[h.number]) || 0), 0)}
      </td>
      {course.holes.slice(9, 18).map((hole) => {
        const score = player.scores?.[hole.number] || '';
        const netScore = score ? calculateNetScore(parseInt(score), player.handicap, hole.handicap) : '-';
        return (
          <td key={hole.number} className="p-1 border-r border-gray-300 text-center relative">
             <input
              type="number"
              value={score}
              onChange={(e) => onScoreChange(player.id, hole.number, e.target.value)}
              className="w-full h-full text-center bg-transparent focus:outline-none font-bold text-gray-800"
            />
             {score && (
              <span className="absolute top-0 right-0 text-[10px] text-gray-400 pr-0.5">
                {netScore}
              </span>
            )}
          </td>
        );
      })}
      <td className="p-2 border-r border-gray-300 font-bold text-center bg-gray-100">
        {course.holes.slice(9, 18).reduce((sum, h) => sum + (parseInt(player.scores?.[h.number]) || 0), 0)}
      </td>
      <td className="p-2 font-bold text-center bg-gray-200 text-gray-900">
        {course.holes.reduce((sum, h) => sum + (parseInt(player.scores?.[h.number]) || 0), 0)}
      </td>
    </tr>
  );

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
            {pairings.map((pair, index) => (
              <React.Fragment key={index}>
                {/* Separator for Match Groups */}
                <tr className="bg-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                  <td colSpan={24} className="p-1 pl-4 border-b border-gray-300">
                    Match {index + 1}
                  </td>
                </tr>
                {renderScoreRow(pair.player1, true)}
                {renderScoreRow(pair.player2, false)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
