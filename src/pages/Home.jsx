import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, ArrowRight, Activity } from 'lucide-react';
import { matches, teams } from '../data/mockData';

export default function Home() {
  // Get next upcoming match
  const nextMatch = matches.find(m => !m.completed);
  const getTeamName = (id) => teams.find(t => t.id === id)?.name || 'Unknown';

  // Get top team from each league
  const getTopTeam = (day) => {
    const dayTeams = teams.filter(t => t.day === day);
    // Simple logic: team with most wins in completed matches
    return dayTeams.sort((a, b) => {
        const winsA = matches.filter(m => m.completed && m.winnerId === a.id).length;
        const winsB = matches.filter(m => m.completed && m.winnerId === b.id).length;
        return winsB - winsA;
    })[0];
  };

  const topTuesday = getTopTeam('Tuesday');
  const topThursday = getTopTeam('Thursday');

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/golf-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gray-900/80"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-300 mt-1">Welcome to the Hughes Golf League</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Next Match Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={100} />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar size={16} /> Next Match
          </h3>
          {nextMatch ? (
            <div>
              <p className="text-2xl font-bold text-white mb-1">
                {new Date(nextMatch.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-emerald-400 font-medium">
                {getTeamName(nextMatch.team1Id)} vs {getTeamName(nextMatch.team2Id)}
              </p>
              <Link to="/schedule" className="inline-flex items-center gap-2 text-sm text-gray-400 mt-4 hover:text-white transition-colors">
                View Schedule <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming matches.</p>
          )}
        </div>

        {/* Standings Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={100} />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy size={16} /> League Leaders
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Tuesday</p>
              <p className="text-xl font-bold text-white">{topTuesday?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Thursday</p>
              <p className="text-xl font-bold text-white">{topThursday?.name || 'N/A'}</p>
            </div>
          </div>
          <Link to="/standings" className="inline-flex items-center gap-2 text-sm text-gray-400 mt-4 hover:text-white transition-colors">
            View Standings <ArrowRight size={14} />
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={100} />
          </div>
          <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity size={16} /> Quick Actions
          </h3>
          <div className="space-y-2">
            <Link to="/match-entry" className="block w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center font-medium transition-colors">
              Enter Scores
            </Link>
            <Link to="/courses" className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center font-medium transition-colors">
              Manage Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
