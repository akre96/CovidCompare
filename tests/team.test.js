import { render, screen } from '@testing-library/react';
import TeamPage from '../pages/team';

describe('Model Performance Page', () => {
  it('renders without crashing', () => {
    render(<TeamPage />);
    const header = screen.getByRole('heading', { name: 'The Team' });
    expect(header).toBeInTheDocument();
  });
});
