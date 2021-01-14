import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';

export async function widgetDetails(widgetType, userTeams) {
  switch(widgetType){
    case 'announcements':
      let announcementData = await getAnnouncements(userTeams);
      return ({
        title: 'Announcements',
        description: 'View your announcements',
        data: announcementData
      });

    case 'calendar':
      let calendarData = await getEvents(userTeams);
      return ({
        title: 'Calendar',
        description: 'View your upcoming events',
        data: calendarData
      });

    case 'contacts':
      let contactData = await getContacts(userTeams);
      return ({
        title: 'Contacts',
        description: 'View your contacts',
        data: contactData
      });

    case 'teams':
      let teamData = await getTeams(userTeams);
      return ({
        title: 'Teams',
        description: 'View your teams',
        data: teamData
      });

    default:
      return '';
  }
}

async function getContacts(userTeams) {
  let contacts = [];
  for (let teamId of userTeams) {
    let request = await api.get(urls.teams.fetchMembersById(teamId));
    contacts = contacts.concat(request.data);
  }
  let truncatedContacts = contacts.slice(0,3);
  let displayData = []
  truncatedContacts.forEach((contact) => {
    displayData.push(`${contact.first_name} ${contact.last_name}`);
  });
  return displayData;
}

async function getAnnouncements(userTeams) {
  let announcements = [];
  for (let teamId of userTeams) {
    let teamNameRequest = await api.get(urls.teams.fetchById(teamId));
    let teamName = teamNameRequest.data.name;
    let request = await api.get(urls.announcement.fetchByTeam(teamName));
    announcements = announcements.concat(request.data);
  }
  console.log(announcements);
  let truncatedAnnouncements = announcements.slice(0,3);
  let displayData = [];
  truncatedAnnouncements.forEach((announcement) => {
    displayData.push(`From user ${announcement.creator}: ${announcement.announcement}`);
  })
  return displayData;
}

async function getEvents(userTeams) {
  let events = [];
  for (let teamId of userTeams) {
    let teamNameRequest = await api.get(urls.teams.fetchById(teamId));
    let teamName = teamNameRequest.data.name;
    let request = await api.get(urls.event.fetchTeamEvents(teamName));
    events = events.concat(request.data);
  }
  
  let truncatedEvents = events.slice(0,3);
  let displayData = [];
  truncatedEvents.forEach((event) => {
    displayData.push(`${event.details} happening on ${event.start}`);
  })
  return displayData;
}

async function getTeams(userTeams) {
  let teams = [];
  for (let teamId of userTeams) {
    let request = await api.get(urls.teams.fetchById(teamId));
    teams = teams.concat(request.data);
  }

  let truncatedTeams = teams.slice(0,3);
  let displayData = [];
  truncatedTeams.forEach((team) => {
    displayData.push(`${team.name}`);
  })
  return displayData;
}