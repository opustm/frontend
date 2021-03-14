// This file is intended to be used in test files where dummy data is needed
// In most cases, when mocking a response from the API, everything should be wrapped in the 'data' attribute
// This allows the components to handle it the same way they would if they received data from an API

const mockAPI = {
  userInfo : {
    id: "12345",
    username: "testUser",
    first_name: 'Test',
    last_name: 'User'
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
        phone: '09876',
      },
      {
        id: 101,
        first_name: 'Rip',
        last_name: 'Van Winkle',
        username: 'vanwinkle',
        email: 'rvw@yahoo.com',
        phone: '54321',
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
        end: "2021-02-23T03:35:28.800000Z"
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
        },
      ]
    }
  }
}

export default mockAPI;