import React from 'react';
import StandingsTable from '../components/StandingsTable';
import { teams, matches } from '../data/mockData';

export default function Standings() {
  const tuesdayTeams = teams.filter(t => t.day === 'Tuesday');
  const thursdayTeams = teams.filter(t => t.day === 'Thursday');

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">League Standings</h2>
        <p className="text-gray-400 mt-1">Current season rankings and playoff race</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
            Tuesday League
          </h3>
          <StandingsTable teams={tuesdayTeams} matches={matches} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Thursday League
          </h3>
          <StandingsTable teams={thursdayTeams} matches={matches} />
        </div>
      </div>
    </div>
  );
}
