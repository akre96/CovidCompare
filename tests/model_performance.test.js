import { render, screen } from '@testing-library/react';
import ModelPerfomancePage from '../pages/model_performance';

describe('Model Performance Page', () => {
  it('renders without crashing', () => {
    render(<ModelPerfomancePage />);
    expect(
      screen.getByRole('heading', { name: 'How have the models performed?' }),
    ).toBeInTheDocument();
  });
});
