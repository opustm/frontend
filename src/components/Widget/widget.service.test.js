import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { widgetDetails, getData } from './widget.service';

jest.mock('../../services/api.service');

test('Check error condition in widgetDetails', async () => {
  Axios.get.mockResolvedValue({ data: [] });
  let response = await widgetDetails('none', {}, 1);
  expect(response.length).toEqual(0);
});

test('Check error condition in getData', async () => {
  Axios.get.mockResolvedValue({ data: [] });
  let response = await getData({ id: 1 }, 'error', '');
  expect(response.length).toEqual(0);
});
