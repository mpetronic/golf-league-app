import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, ChevronRight } from 'lucide-react';
import { matches, teams } from '../data/mockData';
import clsx from 'clsx';

export default function Schedule() {
  const [activeTab, setActiveTab] = useState('Tuesday');

  const getTeamName = (id) => teams.find(t => t.id === id)?.name || 'Unknown Team';

  const filteredMatches = matches.filter(m => {
    if (activeTab === 'Playoffs') return m.isPlayoff;
    return m.day === activeTab && !m.isPlayoff;
  });

  const tabs = ['Tuesday', 'Thursday', 'Playoffs'];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">League Schedule</h2>
        <p className="text-gray-400 mt-1">Upcoming matches and results</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-800 pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 py-2 font-medium text-sm transition-colors relative',
              activeTab === tab
                ? 'text-emerald-400'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Match List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-800 border-dashed">
            <Calendar className="mx-auto text-gray-600 mb-3" size={48} />
            <p className="text-gray-400">No matches scheduled for this league yet.</p>
          </div>
        ) : (
          filteredMatches.map(match => (
            <div key={match.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex items-center justify-between hover:border-emerald-500/30 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="text-center w-16">
                  <div className="text-xs text-gray-500 uppercase font-bold">{new Date(match.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  <div className="text-xl font-bold text-white">{new Date(match.date).getDate()}</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right w-48">
                    <div className="font-bold text-white">{getTeamName(match.team1Id)}</div>
                    <div className="text-xs text-gray-500">Home</div>
                  </div>
                  <div className="text-gray-600 font-bold text-sm">VS</div>
                  <div className="text-left w-48">
                    <div className="font-bold text-white">{getTeamName(match.team2Id)}</div>
                    <div className="text-xs text-gray-500">Away</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {match.completed ? (
                  <span className="px-3 py-1 bg-gray-900 text-gray-300 rounded-full text-xs font-medium border border-gray-700">
                    Final
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 rounded-full text-xs font-medium border border-emerald-900/50">
                    Scheduled
                  </span>
                )}
                <Link to="/match-entry" className="p-2 text-gray-500 hover:text-white transition-colors">
                  <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
