import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { teams } from '../data/mockData';

export default function PlayerEditor({ player, onSave, onCancel }) {
  const [name, setName] = useState(player?.name || '');
  const [handicap, setHandicap] = useState(player?.handicap || 0);
  const [teamId, setTeamId] = useState(player?.teamId || '');
  const [history, setHistory] = useState(player?.history || []);

  // Filter teams by day if needed, or just show all
  // For now, we show all teams grouped by day
  const tuesdayTeams = teams.filter(t => t.day === 'Tuesday');
  const thursdayTeams = teams.filter(t => t.day === 'Thursday');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...player,
      name,
      handicap: parseInt(handicap),
      teamId,
      history
    });
  };

  const handleAddHistory = () => {
    setHistory([{ date: new Date().toISOString().split('T')[0], score: 0, handicapAfter: handicap }, ...history]);
  };

  const handleHistoryChange = (index, field, value) => {
    const newHistory = [...history];
    newHistory[index] = { ...newHistory[index], [field]: value };
    setHistory(newHistory);
  };

  const handleDeleteHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{player ? 'Edit Player' : 'Add New Player'}</h2>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Player Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Current Handicap</label>
          <input
            type="number"
            step="1"
            value={handicap}
            onChange={(e) => setHandicap(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">Team Assignment</label>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
            required
          >
            <option value="">Select a Team</option>
            <optgroup label="Tuesday League">
              {tuesdayTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </optgroup>
            <optgroup label="Thursday League">
              {thursdayTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-bold text-white mb-4">Performance History</h3>
        
        {history.length > 0 ? (
          <div className="h-64 w-full mb-6 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...history].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                <YAxis yAxisId="left" stroke="#10B981" fontSize={12} domain={['auto', 'auto']} />
                <YAxis yAxisId="right" orientation="right" stroke="#60A5FA" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="score" stroke="#10B981" name="Score" strokeWidth={2} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="handicapAfter" stroke="#60A5FA" name="Handicap" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
            <div className="h-32 w-full mb-6 bg-gray-900/50 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500">
                No history data to display chart.
            </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">History Log</h3>
          <button
            type="button"
            onClick={handleAddHistory}
            className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1"
          >
            <Plus size={14} /> Add Entry
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-950 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">HCP After</th>
                <th className="px-4 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.map((entry, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handleHistoryChange(index, 'date', e.target.value)}
                      className="bg-transparent text-white focus:outline-none w-full"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={entry.score}
                      onChange={(e) => handleHistoryChange(index, 'score', parseInt(e.target.value))}
                      className="bg-transparent text-white focus:outline-none w-20"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="1"
                      value={entry.handicapAfter}
                      onChange={(e) => handleHistoryChange(index, 'handicapAfter', parseInt(e.target.value))}
                      className="bg-transparent text-white focus:outline-none w-20"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteHistory(index)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                    No history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Save size={18} />
          Save Player
        </button>
      </div>
    </form>
  );
}
