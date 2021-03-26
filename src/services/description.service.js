// This is the descriptions service. The descriptions.service exists to standardize text data input, temp image input and hyperlinking within
// the website so that many text fields can be easily accessed from all parts of the application, when applicable IFF it helps
// make the application more dynamic and modular.
//
// The DESCRIPTIONS object will serve as a index for all the non-code text in the application
//
// Some objects and attributes within the DESCRIPTIONS object may be:
//  title: Title text
//  body: Body Text
//  link: Hyperlink to be inserted into an anchor
//  image: path to an image file

import * as Icon from 'react-icons/fi';

export const descriptions = {
  pages: {
    About: {
      heading: '',
      body: `Opus was designed by Swopnil Shrestha, Josh Van Sant, and David Will to satisfy the requirements for the Luther College Computer Science Senior Project (CS 490/491). 
            We designed Opus as a lightweight, versatile workforce management platform for small teams, in order to include features from other platforms that we liked,
            while eliminating those that we felt were unnecessary.
            Once you create an account, you'll be able to do all of the following, and more.`,
      featureList: [
        'Join an existing team, or create your own',
        'Invite new users to your team',
        'Divide your team into subgroups for quicker access to the people you work with frequently',
        'Create announcements and events for any of your teams, visible only to users within that team',
        "View contacts and information across all teams that you're a part of",
        "Customize settings, profiles, and permissions to fit your team's needs"
      ],
      developers: [
        [
          'Swopnil Shrestha',
          'Founder, Engineer',
          'https://www.linkedin.com/in/swopnilnep/',
          'https://github.com/swopnilnep'
        ],

        [
          'Josh Van Sant',
          'Founder, Engineer',
          'https://www.linkedin.com/in/joshua-van-sant-14a403149/',
          'https://github.com/jvansant'
        ],
        [
          'David Will',
          'Founder, Engineer',
          'https://www.linkedin.com/in/davidwill523/',
          'https://github.com/willda07'
        ]
      ]
    },
    Home: {
      title: 'OpusTM',
      body: '',
      joinMessage:
        "Hi there! We noticed you aren't a member of any teams yet. Head over to the Teams page to get started!"
    },
    Login: {
      iconMessages: [
        [
          'Create Teams',
          <Icon.FiTarget
            size={30}
            style={{ marginTop: '2px', marginRight: '10px' }}
          />
        ],
        [
          'Send Announcements',
          <Icon.FiRss
            size={30}
            style={{ marginTop: '2px', marginRight: '10px' }}
          />
        ],
        [
          'Meet with Colleagues',
          <Icon.FiCalendar
            size={30}
            style={{ marginTop: '2px', marginRight: '10px' }}
          />
        ],
        [
          'View your Contacts',
          <Icon.FiBook
            size={30}
            style={{ marginTop: '2px', marginRight: '10px' }}
          />
        ],
        [
          'Customize your Profile',
          <Icon.FiUser
            size={30}
            style={{ marginTop: '2px', marginRight: '10px' }}
          />
        ]
      ]
    }
  },
  apps: ''
};
