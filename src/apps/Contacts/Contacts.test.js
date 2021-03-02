import '@testing-library/jest-dom';
import * as axios from 'axios';
import { render, screen } from '@testing-library/react';
import Contacts from './Contacts';

jest.mock('axios');
test('Renders Contacts component', async () => {
  const userInfo = {
    id: "8687a8ac-7dac-4229-9275-ece5dff77150",
    username: "Test1"
  }
  render(<Contacts userInfo={userInfo}/>);

  // const returnedData = {
  //   data: [
  //     {
  //       id: '0',
  //       username: 'JacobMarley',
  //       first_name: 'Jacob',
  //       last_name: 'Marley',
  //       email: 'marley@gmail.com',
  //       phone: '18009999999'
  //     }
  //   ]
  // }
  // axios.get.mockImplementation((url) => {
  //   console.log(url);
  //   return Promise.resolve({data: returnedData});
  // })
  expect(screen.getByText('Contacts')).toBeInTheDocument();
  expect(screen.getByText('Get In Touch!')).toBeInTheDocument();
  // screen.debug();
  // Displays the HTML output of the component

  // TODO
  // Verify records are displayed
})
