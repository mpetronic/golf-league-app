export const courses = [
  {
    id: 'c1',
    name: 'Pine Valley',
    holes: [
      { number: 1, par: 4, handicap: 7 },
      { number: 2, par: 5, handicap: 1 },
      { number: 3, par: 3, handicap: 13 },
      { number: 4, par: 4, handicap: 5 },
      { number: 5, par: 4, handicap: 11 },
      { number: 6, par: 3, handicap: 17 },
      { number: 7, par: 5, handicap: 3 },
      { number: 8, par: 4, handicap: 9 },
      { number: 9, par: 4, handicap: 15 },
      { number: 10, par: 4, handicap: 8 },
      { number: 11, par: 3, handicap: 14 },
      { number: 12, par: 5, handicap: 2 },
      { number: 13, par: 4, handicap: 6 },
      { number: 14, par: 4, handicap: 12 },
      { number: 15, par: 3, handicap: 18 },
      { number: 16, par: 5, handicap: 4 },
      { number: 17, par: 4, handicap: 10 },
      { number: 18, par: 4, handicap: 16 },
    ],
  },
];

export const teams = [
  { id: 't1', name: 'The Bogey Men', day: 'Tuesday' },
  { id: 't2', name: 'Fairway to Heaven', day: 'Tuesday' },
  { id: 't3', name: 'Putt Pirates', day: 'Tuesday' },
  { id: 't4', name: 'Birdie Juice', day: 'Tuesday' },
  { id: 't5', name: 'Iron Maidens', day: 'Thursday' },
  { id: 't6', name: 'Grip It & Sip It', day: 'Thursday' },
  { id: 't7', name: 'Weapons of Grass Destruction', day: 'Thursday' },
  { id: 't8', name: 'Tee Party', day: 'Thursday' },
];

export const players = [
  { 
    id: 'p1', 
    name: 'John Doe', 
    teamId: 't1', 
    handicap: 13, 
    history: [
      { date: '2024-05-07', score: 85, handicapAfter: 13 },
      { date: '2024-04-30', score: 82, handicapAfter: 13 },
      { date: '2024-04-23', score: 88, handicapAfter: 13 }
    ] 
  },
  { 
    id: 'p2', 
    name: 'Jane Smith', 
    teamId: 't1', 
    handicap: 8, 
    history: [
      { date: '2024-05-07', score: 92, handicapAfter: 8 },
      { date: '2024-04-30', score: 90, handicapAfter: 8 },
      { date: '2024-04-23', score: 95, handicapAfter: 8 }
    ] 
  },
  { 
    id: 'p3', 
    name: 'Bob Johnson', 
    teamId: 't2', 
    handicap: 8, 
    history: [
      { date: '2024-05-07', score: 78, handicapAfter: 8 },
      { date: '2024-04-30', score: 80, handicapAfter: 9 },
      { date: '2024-04-23', score: 79, handicapAfter: 8 }
    ] 
  },
  { 
    id: 'p4', 
    name: 'Alice Brown', 
    teamId: 't2', 
    handicap: 6, 
    history: [
      { date: '2024-05-07', score: 98, handicapAfter: 6 },
      { date: '2024-04-30', score: 100, handicapAfter: 6 },
      { date: '2024-04-23', score: 95, handicapAfter: 6 }
    ] 
  },
];

export const matches = [
  {
    id: 'm1',
    date: '2024-05-14',
    day: 'Tuesday',
    team1Id: 't1',
    team2Id: 't2',
    completed: false,
    scores: [], 
  },
  {
    id: 'm2',
    date: '2024-05-07',
    day: 'Tuesday',
    team1Id: 't3',
    team2Id: 't4',
    completed: true,
    winnerId: 't3',
    score: '10.5 - 7.5'
  },
  {
    id: 'm3',
    date: '2024-05-07',
    day: 'Tuesday',
    team1Id: 't1',
    team2Id: 't2',
    completed: true,
    winnerId: 't2',
    score: '11 - 7'
  },
  {
    id: 'm4',
    date: '2024-05-07',
    day: 'Thursday',
    team1Id: 't5',
    team2Id: 't6',
    completed: true,
    winnerId: 't5',
    score: '12 - 6'
  },
  {
    id: 'm5',
    date: '2024-05-07',
    day: 'Thursday',
    team1Id: 't7',
    team2Id: 't8',
    completed: true,
    winnerId: 't8',
    score: '9.5 - 8.5'
  },
];
