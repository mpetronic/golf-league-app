import React from 'react';
import clsx from 'clsx';
import { Trophy } from 'lucide-react';

export default function StandingsTable({ teams, matches }) {
  // Calculate standings
  const standings = teams.map(team => {
    const teamMatches = matches.filter(m => m.completed && (m.team1Id === team.id || m.team2Id === team.id));
    const wins = teamMatches.filter(m => m.winnerId === team.id).length;
    const losses = teamMatches.filter(m => m.winnerId && m.winnerId !== team.id).length;
    // Assuming ties if completed but no winnerId, or we can just count ties. 
    // For simplicity, let's just use wins/losses for now.
    const ties = teamMatches.length - wins - losses;
    
    const points = (wins * 2) + (ties * 1); // Standard 2pts for win, 1 for tie

    return {
      ...team,
      played: teamMatches.length,
      wins,
      losses,
      ties,
      points
    };
  }).sort((a, b) => b.points - a.points || b.wins - a.wins); // Sort by points, then wins

  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-900 text-gray-400 uppercase tracking-wider font-medium">
          <tr>
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Team</th>
            <th className="px-6 py-4 text-center">GP</th>
            <th className="px-6 py-4 text-center">W</th>
            <th className="px-6 py-4 text-center">L</th>
            <th className="px-6 py-4 text-center">T</th>
            <th className="px-6 py-4 text-center font-bold text-white">PTS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {standings.map((team, index) => (
            <tr 
              key={team.id} 
              className={clsx(
                "transition-colors hover:bg-gray-700/50",
                index < 4 ? "bg-emerald-900/10" : ""
              )}
            >
              <td className="px-6 py-4 font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  {index + 1}
                  {index < 4 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Playoff Spot" />}
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                {index === 0 && <Trophy size={16} className="text-yellow-500" />}
                {team.name}
              </td>
              <td className="px-6 py-4 text-center text-gray-300">{team.played}</td>
              <td className="px-6 py-4 text-center text-emerald-400">{team.wins}</td>
              <td className="px-6 py-4 text-center text-red-400">{team.losses}</td>
              <td className="px-6 py-4 text-center text-gray-400">{team.ties}</td>
              <td className="px-6 py-4 text-center font-bold text-white text-lg">{team.points}</td>
            </tr>
          ))}
          {standings.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                No standings data available yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
