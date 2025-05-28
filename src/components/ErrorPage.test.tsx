import { render, screen } from '@testing-library/react';
import { ErrorPage } from './ErrorPage';
import { useTranslations } from '@/i18n/useTranslations';

// Mock the useTranslations hook
jest.mock('@/i18n/useTranslations', () => ({
  useTranslations: jest.fn(),
}));

describe('ErrorPage', () => {
  it('should display the translated error title and default message', () => {
    // Setup the mock return value for this specific test
    (useTranslations as jest.Mock).mockReturnValue({
      standardWords: {
        error: 'Error', // English translation
        anErrorOccurred: 'An error occurred.',
      },
      // Add other keys if ErrorPage starts using them
    });

    // Render the component with a mock error prop
    render(<ErrorPage error={new Error('Test error')} />);

    // Check if the translated title "Error" is present
    expect(screen.getByText('Error')).toBeInTheDocument();
    // Check for the default message when error.message is not used directly for the fallback
    expect(screen.getByText('An error occurred.')).toBeInTheDocument();
  });

  it('should display the error message from the error prop if available', () => {
    (useTranslations as jest.Mock).mockReturnValue({
      standardWords: {
        error: 'Error',
        anErrorOccurred: 'An error occurred.',
      },
    });

    const errorMessage = 'Specific error from prop';
    render(<ErrorPage error={new Error(errorMessage)} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    // Check if the specific error message from the prop is present
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
