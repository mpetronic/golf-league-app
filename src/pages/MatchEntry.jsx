import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import { teams } from '../data/mockData';
import { pairPlayers } from '../utils/golfLogic';
import dataService from '../api/dataService';

export default function MatchEntry() {
  // In a real app, we'd fetch match ID from params. 
  // For demo, we'll setup a mock match state.
  const [matchState, setMatchState] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load courses and players from backend
      const [courses, players] = await Promise.all([
        dataService.getCourses(),
        dataService.getPlayers()
      ]);

      // Use first course
      setCourse(courses[0]);

      // Simulate fetching/initializing match data
      const team1 = teams[0]; // The Bogey Men
      const team2 = teams[1]; // Fairway to Heaven
      
      const t1Players = players.filter(p => p.teamId === team1.id);
      const t2Players = players.filter(p => p.teamId === team2.id);
      
      // If we don't have enough players in mock data, let's create some dummy ones for the demo
      if (t1Players.length < 2) {
          t1Players.push({ id: 'p_temp1', name: 'Mike T', teamId: team1.id, handicap: 15, scores: {} });
      }
      if (t2Players.length < 2) {
          t2Players.push({ id: 'p_temp2', name: 'Sarah J', teamId: team2.id, handicap: 16, scores: {} });
      }

      const pairings = pairPlayers(t1Players, t2Players);

      setMatchState({
        team1,
        team2,
        pairings: pairings.map(p => ({
          ...p,
          player1: { ...p.player1, scores: {} },
          player2: { ...p.player2, scores: {} }
        }))
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (playerId, holeNumber, value) => {
    setMatchState(prev => {
      const newPairings = prev.pairings.map(pair => {
        if (pair.player1.id === playerId) {
          return { ...pair, player1: { ...pair.player1, scores: { ...pair.player1.scores, [holeNumber]: value } } };
        }
        if (pair.player2.id === playerId) {
          return { ...pair, player2: { ...pair.player2, scores: { ...pair.player2.scores, [holeNumber]: value } } };
        }
        return pair;
      });
      return { ...prev, pairings: newPairings };
    });
  };

  if (!matchState) return <div className="text-white p-8">Loading Match...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Match Scoring</h2>
        <p className="text-gray-400">Enter scores for the current match</p>
      </div>

      <ScoreCard 
        course={course} 
        matchData={matchState} 
        onScoreChange={handleScoreChange} 
      />
    </div>
  );
}
