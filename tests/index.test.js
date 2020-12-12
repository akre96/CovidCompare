import { render, screen } from '@testing-library/react';
import IndexPage from '../pages/index';

describe('Index Page', () => {
  it('renders without crashing', () => {
    render(<IndexPage />);
    expect(screen.getByRole('heading', { name: 'Current COVID-19 Forecasts' })).toBeInTheDocument();
  });
});
