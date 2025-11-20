/**
 * REST API client for the golf league application.
 * Provides methods for all CRUD operations on courses, teams, players, and matches.
 */
import API_BASE_URL from './config';

class ApiClient {
  /**
   * Make a fetch request to the API
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Status and initialization
  async getStatus() {
    return this.request('/status');
  }

  async initializeData(data) {
    return this.request('/initialize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Course operations
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  // Team operations
  async getTeams() {
    return this.request('/teams');
  }

  async getTeam(id) {
    return this.request(`/teams/${id}`);
  }

  async createTeam(teamData) {
    return this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  async updateTeam(id, teamData) {
    return this.request(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    });
  }

  async deleteTeam(id) {
    return this.request(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // Player operations
  async getPlayers() {
    return this.request('/players');
  }

  async getPlayer(id) {
    return this.request(`/players/${id}`);
  }

  async createPlayer(playerData) {
    return this.request('/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  }

  async updatePlayer(id, playerData) {
    return this.request(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playerData),
    });
  }

  async deletePlayer(id) {
    return this.request(`/players/${id}`, {
      method: 'DELETE',
    });
  }

  // Match operations
  async getMatches() {
    return this.request('/matches');
  }

  async getMatch(id) {
    return this.request(`/matches/${id}`);
  }

  async createMatch(matchData) {
    return this.request('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  async updateMatch(id, matchData) {
    return this.request(`/matches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(matchData),
    });
  }

  async deleteMatch(id) {
    return this.request(`/matches/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
