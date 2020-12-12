import { render, screen } from '@testing-library/react';
import HistoricalForecastsPage from '../pages/historical_forecasts';

describe('Model Performance Page', () => {
  it('renders without crashing', () => {
    render(<HistoricalForecastsPage />);
    const header = screen.getByRole('heading', { name: 'Historical Forecasts' })
    expect(header).toBeInTheDocument();
  });
});
