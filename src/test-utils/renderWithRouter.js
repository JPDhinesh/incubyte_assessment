import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

export const renderAppWithRouter = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  );
