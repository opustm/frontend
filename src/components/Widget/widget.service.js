import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';

export async function widgetDetails(widgetType, userTeams) {
  switch(widgetType){
    case 'announcements':
      return ({
        title: 'Announcements',
        description: 'Announcements description'
      });

    case 'calendar':
      return ({
        title: 'Calendar',
        description: 'Calendar description'
      });

    case 'contacts':
      return ({
        title: 'Contacts',
        description: 'Contacts description',
        data: await getContacts(userTeams)
      });

    case 'teams':
      return ({
        title: 'Teams',
        description: 'Teams description'
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
  console.log(contacts);
  let truncatedContacts = contacts.slice(0,3);
  let displayData = []
  truncatedContacts.forEach((contact) => {
    displayData.push(`${contact.first_name} ${contact.last_name}`);
  });
  console.log(displayData);
  return displayData;
}