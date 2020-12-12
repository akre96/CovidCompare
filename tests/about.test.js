import { render, screen } from '@testing-library/react';
import AboutPage from '../pages/about';

describe('About Page', () => {
  it('renders without crashing', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: 'About covidcompare' })).toBeInTheDocument();
  });
});
