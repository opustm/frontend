import { Axios as api, API_ENDPOINTS as urls } from './api.service';

// This whole file is unnecessary now that we can get the contacts at /users/<username>/contacts/
export async function getContacts(userInfo) {
  let contacts = [];
  let seen = new Set();
  for (let id of userInfo.cliques) {
      let memberResponse = await api.get(urls.teams.fetchMembersById(id));
      contacts = contacts.concat(memberResponse.data);
  }

  let filtered = contacts.filter((contact) => {
      let duplicate = seen.has(contact.id);
      seen.add(contact.id);
      return !(duplicate || contact.id === userInfo.id);
  });
  return filtered;
}