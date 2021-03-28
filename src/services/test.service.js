// This file is intended to be used in test files where dummy data is needed
// In most cases, when mocking a response from the API, everything should be wrapped in the 'data' attribute
// This allows the components to handle it the same way they would if they received data from an API

const mockAPI = {
  userInfo: {
    id: '12345',
    username: 'testUser',
    first_name: 'Test',
    last_name: 'User',
    email: 'testy@gmail.com',
    picture: '#0EDD12',
    phone: '1110002020',
    bio: 'I am a test user designed for test purposes!'
  },
  userInfoData: {
    data: {
      id: '12345',
      username: 'testUser',
      first_name: 'Test',
      last_name: 'User',
      email: 'testy@gmail.com',
      picture: '#0EDD12',
      phone: '1110002020',
      bio: 'I am a test user designed for test purposes!'
    }
  },
  userTeams: {
    data: [
      {
        id: 1,
        name: 'CS 150',
        members: [],
        managers: [],
        owners: []
      }
    ]
  },
  userContacts: {
    data: [
      {
        id: 100,
        first_name: 'Jeff',
        last_name: 'Goldblum',
        username: 'jgoldblum',
        email: 'goldblum@hotmail.com',
        phone: '09876'
      },
      {
        id: 101,
        first_name: 'Rip',
        last_name: 'Van Winkle',
        username: 'vanwinkle',
        email: 'rvw@yahoo.com',
        phone: '54321'
      }
    ]
  },
  userEvents: {
    data: [
      {
        id: 1,
        team: {
          name: 'CS 150'
        },
        name: 'Introduction to CS',
        details: 'Our first class meeting for CS 150',
        start: '2021-02-18T16:45:54Z',
        end: '2021-02-18T16:45:55Z'
      },
      {
        id: 2,
        team: {
          name: 'CS 150'
        },
        name: 'Lesson 2',
        details: 'Our second class meeting for CS 150',
        start: '2021-03-18T16:45:54Z',
        end: '2021-03-19T16:45:55Z'
      }
    ]
  },
  userAnnouncements: {
    data: [
      {
        id: 1,
        team: {
          name: 'CS 150'
        },
        creator: {
          first_name: 'Bob',
          last_name: 'Ross'
        },
        priority: 1,
        announcement: 'Hello World!',
        event: null,
        end: '2021-02-23T03:35:28.800000Z'
      }
    ]
  },
  contactTeams: {
    goldblum: {
      data: [
        {
          id: 1,
          name: 'CS 150'
        },
        {
          id: 2,
          name: 'Hollywood Stars'
        }
      ]
    },
    vanWinkle: {
      data: [
        {
          id: 1,
          name: 'CS 150'
        },
        {
          id: 3,
          name: 'Old People'
        }
      ]
    }
  },
  allTeams: {
    data: [
      {
        id: 1,
        name: 'CS 150',
        members: [],
        managers: [],
        owners: []
      },
      {
        id: 2,
        name: 'Hollywood Stars',
        members: [],
        managers: [],
        owners: []
      },
      {
        id: 3,
        name: 'Old People',
        members: [],
        managers: [],
        owners: []
      }
    ]
  },
  team1: {
    data: {
      id: 1,
      name: 'CS 150',
      members: [
        {
          id: '101',
          username: 'compsciStudent',
          first_name: 'Joe',
          last_name: 'Bob'
        }
      ],
      managers: [],
      owners: [
        {
          id: '12345',
          username: 'testUser',
          first_name: 'Test',
          last_name: 'User'
        }
      ],
      description: 'This is a test team'
    }
  },
  otherUser: {
    data: {
      id: 102,
      first_name: 'Ron',
      last_name: 'Weasley',
      username: 'ronweasley'
    }
  },
  allUsers: {
    data: [
      {
        id: '12345',
        username: 'testUser',
        first_name: 'Test',
        last_name: 'User'
      },
      {
        id: 102,
        first_name: 'Ron',
        last_name: 'Weasley',
        username: 'ronweasley'
      }
    ]
  },
  newTeam: {
    data: {
      id: 1,
      name: 'CS 150',
      members: [
        {
          id: '101',
          username: 'compsciStudent',
          first_name: 'Joe',
          last_name: 'Bob'
        },
        {
          id: 102,
          first_name: 'Ron',
          last_name: 'Weasley',
          username: 'ronweasley'
        }
      ],
      managers: [],
      owners: [
        {
          id: '12345',
          username: 'testUser',
          first_name: 'Test',
          last_name: 'User'
        }
      ],
      description: 'This is a test team'
    }
  }
};

export default mockAPI;
