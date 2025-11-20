import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import PlayerEditor from '../components/PlayerEditor';
import { players as initialPlayers, teams } from '../data/mockData';

export default function Admin() {
  const [players, setPlayers] = useState(initialPlayers);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    setCurrentPlayer(null);
    setIsEditing(true);
  };

  const handleEdit = (player) => {
    setCurrentPlayer(player);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this player?')) {
      setPlayers(players.filter(p => p.id !== id));
    }
  };

  const handleSave = (playerData) => {
    if (playerData.id) {
      setPlayers(players.map(p => p.id === playerData.id ? playerData : p));
    } else {
      setPlayers([...players, { ...playerData, id: `p${Date.now()}` }]);
    }
    setIsEditing(false);
  };

  const getTeamName = (teamId) => teams.find(t => t.id === teamId)?.name || 'Unassigned';
  const getTeamDay = (teamId) => teams.find(t => t.id === teamId)?.day || '-';

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTeamName(p.teamId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditing) {
    return (
      <PlayerEditor
        player={currentPlayer}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-gray-400 mt-1">Manage players, teams, and league settings</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Player
        </button>
      </div>

      {/* Player Management Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-emerald-400" />
            Player Roster
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900 text-gray-400 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Team</th>
              <th className="px-6 py-4">League Day</th>
              <th className="px-6 py-4 text-center">Handicap</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredPlayers.map(player => (
              <tr key={player.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{player.name}</td>
                <td className="px-6 py-4 text-gray-300">{getTeamName(player.teamId)}</td>
                <td className="px-6 py-4 text-gray-400">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTeamDay(player.teamId) === 'Tuesday' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-blue-900/30 text-blue-400'}`}>
                    {getTeamDay(player.teamId)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-mono text-white">{player.handicap}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                      title="Edit Player"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded transition-colors"
                      title="Delete Player"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPlayers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No players found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
