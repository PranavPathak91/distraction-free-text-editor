import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MenuBar from '../MenuBar';
import { TextEditorProvider } from '../../../context/TextEditorContext';

// Mock context to control test scenarios
const createMockContext = (initialState = {}) => {
  return {
    state: {
      projects: [
        { id: '1', name: 'Project Alpha' },
        { id: '2', name: 'Project Beta' }
      ],
      currentProject: null,
      documents: [],
      ...initialState
    },
    createProject: jest.fn(),
    selectProject: jest.fn(),
    createDocument: jest.fn(),
    selectDocument: jest.fn()
  };
};

describe('MenuBar Component', () => {
  // Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <TextEditorProvider>
          <MenuBar />
        </TextEditorProvider>
      );
      expect(screen.getByText(/Select a Project/i)).toBeInTheDocument();
    });

    it('displays project name when project is selected', () => {
      const mockContext = createMockContext({
        currentProject: { id: '1', name: 'Project Alpha' }
      });

      render(
        <TextEditorProvider value={mockContext}>
          <MenuBar />
        </TextEditorProvider>
      );

      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    });
  });

  // Interaction Tests
  describe('Interactions', () => {
    it('opens project dropdown when clicking project name', () => {
      const mockContext = createMockContext();

      render(
        <TextEditorProvider value={mockContext}>
          <MenuBar />
        </TextEditorProvider>
      );

      // Open dropdown
      fireEvent.click(screen.getByText(/Select a Project/i));

      // Check dropdown items
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.getByText('Project Beta')).toBeInTheDocument();
    });

    it('selects project when dropdown item is clicked', () => {
      const mockContext = createMockContext();

      render(
        <TextEditorProvider value={mockContext}>
          <MenuBar />
        </TextEditorProvider>
      );

      // Open dropdown
      fireEvent.click(screen.getByText(/Select a Project/i));

      // Select a project
      fireEvent.click(screen.getByText('Project Alpha'));

      // Verify selectProject was called
      expect(mockContext.selectProject).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', name: 'Project Alpha' })
      );
    });

    it('creates new project when + icon is clicked', () => {
      const mockContext = createMockContext();

      render(
        <TextEditorProvider value={mockContext}>
          <MenuBar />
        </TextEditorProvider>
      );

      // Click new project icon
      const newProjectButton = screen.getAllByText('+')[0];
      fireEvent.click(newProjectButton);

      // Verify createProject was called
      expect(mockContext.createProject).toHaveBeenCalledWith('New Project');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('closes dropdown when clicking outside', async () => {
      const mockContext = createMockContext();

      render(
        <TextEditorProvider value={mockContext}>
          <MenuBar />
          <div data-testid="outside-element">Outside</div>
        </TextEditorProvider>
      );

      // Open dropdown
      fireEvent.click(screen.getByText(/Select a Project/i));

      // Verify dropdown is open
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside-element'));

      // Wait for potential state update
      await waitFor(() => {
        expect(screen.queryByText('Project Alpha')).not.toBeInTheDocument();
      });
    });
  });

  // Error Handling Tests
  describe('Error Scenarios', () => {
    it('handles empty projects state gracefully', () => {
      const mockContext = createMockContext({ projects: [] });

      render(
        <TextEditorProvider value={mockContext}>
          <MenuBar />
        </TextEditorProvider>
      );

      // Verify no errors and default state
      expect(screen.getByText(/Select a Project/i)).toBeInTheDocument();
    });
  });
});
