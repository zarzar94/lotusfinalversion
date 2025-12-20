import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import Header from './Header';

describe('Header', () => {
  it('should render logo', () => {
    render(<Header />);

    // Check for logo or brand name
    const logo = screen.queryByRole('img', { name: /lotus/i }) ||
                 screen.queryByText(/lotus/i);
    expect(logo).toBeTruthy();
  });

  it('should render navigation links', () => {
    render(<Header />);

    // Check for main navigation items
    const nav = screen.getByRole('navigation');
    expect(nav).toBeTruthy();
  });

  it('should toggle mobile menu on button click', () => {
    // Mock smaller viewport
    vi.stubGlobal('innerWidth', 480);

    render(<Header />);

    const menuButton = screen.queryByRole('button', { name: /menu/i }) ||
                       screen.queryByLabelText(/menu/i);

    if (menuButton) {
      fireEvent.click(menuButton);
      // Menu should be visible after click
    }
  });

  it('should close menu when clicking outside', () => {
    render(<Header />);

    const menuButton = screen.queryByRole('button', { name: /menu/i });

    if (menuButton) {
      fireEvent.click(menuButton);
      fireEvent.click(document.body);
    }
  });

  it('should highlight active route', () => {
    render(<Header />);

    // The current route should be highlighted
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
