/**
 * Data service that manages data loading and initialization.
 * Uses API client for backend communication and falls back to mock data for initialization.
 */
import apiClient from './client';
import { courses as mockCourses, teams as mockTeams, players as mockPlayers, matches as mockMatches } from '../data/mockData';

class DataService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the application data.
   * Checks if backend has data, if not, initializes with mock data.
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const status = await apiClient.getStatus();
      
      if (!status.initialized) {
        console.log('Backend not initialized, populating with mock data...');
        await apiClient.initializeData({
          courses: mockCourses,
          teams: mockTeams,
          players: mockPlayers,
          matches: mockMatches,
        });
        console.log('Backend initialized successfully');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize data service:', error);
      throw error;
    }
  }

  // Course operations
  async getCourses() {
    await this.initialize();
    return apiClient.getCourses();
  }

  async getCourse(id) {
    await this.initialize();
    return apiClient.getCourse(id);
  }

  // Team operations
  async getTeams() {
    await this.initialize();
    return apiClient.getTeams();
  }

  async getTeam(id) {
    await this.initialize();
    return apiClient.getTeam(id);
  }

  async createTeam(teamData) {
    await this.initialize();
    return apiClient.createTeam(teamData);
  }

  async updateTeam(id, teamData) {
    await this.initialize();
    return apiClient.updateTeam(id, teamData);
  }

  async deleteTeam(id) {
    await this.initialize();
    return apiClient.deleteTeam(id);
  }

  // Player operations
  async getPlayers() {
    await this.initialize();
    return apiClient.getPlayers();
  }

  async getPlayer(id) {
    await this.initialize();
    return apiClient.getPlayer(id);
  }

  async createPlayer(playerData) {
    await this.initialize();
    return apiClient.createPlayer(playerData);
  }

  async updatePlayer(id, playerData) {
    await this.initialize();
    return apiClient.updatePlayer(id, playerData);
  }

  async deletePlayer(id) {
    await this.initialize();
    return apiClient.deletePlayer(id);
  }

  // Match operations
  async getMatches() {
    await this.initialize();
    return apiClient.getMatches();
  }

  async getMatch(id) {
    await this.initialize();
    return apiClient.getMatch(id);
  }

  async createMatch(matchData) {
    await this.initialize();
    return apiClient.createMatch(matchData);
  }

  async updateMatch(id, matchData) {
    await this.initialize();
    return apiClient.updateMatch(id, matchData);
  }

  async deleteMatch(id) {
    await this.initialize();
    return apiClient.deleteMatch(id);
  }
}

// Export a singleton instance
const dataService = new DataService();
export default dataService;
