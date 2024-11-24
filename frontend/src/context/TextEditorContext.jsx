import React, { createContext, useContext, useReducer, useEffect } from 'react';
import DocumentService from '../services/documentService';

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  currentDocument: null,
  documents: [],
  isLoading: true
};

// Action types
const ActionTypes = {
  LOAD_PROJECTS: 'LOAD_PROJECTS',
  CREATE_PROJECT: 'CREATE_PROJECT',
  SELECT_PROJECT: 'SELECT_PROJECT',
  CREATE_DOCUMENT: 'CREATE_DOCUMENT',
  UPDATE_DOCUMENT: 'UPDATE_DOCUMENT',
  SELECT_DOCUMENT: 'SELECT_DOCUMENT',
  DELETE_DOCUMENT: 'DELETE_DOCUMENT',
  UPDATE_PROJECT: 'UPDATE_PROJECT'
};

// Reducer
function textEditorReducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOAD_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        isLoading: false,
        currentProject: action.payload[0] || null
      };

    case ActionTypes.CREATE_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
        currentProject: action.payload
      };

    case ActionTypes.SELECT_PROJECT:
      return {
        ...state,
        currentProject: action.payload,
        documents: action.payload.documents || [],
        currentDocument: null
      };

    case ActionTypes.CREATE_DOCUMENT:
      if (!state.currentProject) return state;
      
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          documents: [
            ...(state.currentProject.documents || []),
            action.payload
          ]
        },
        documents: [
          ...(state.documents || []),
          action.payload
        ],
        currentDocument: action.payload
      };

    case ActionTypes.UPDATE_DOCUMENT:
      return {
        ...state,
        currentDocument: action.payload,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        )
      };

    case ActionTypes.SELECT_DOCUMENT:
      return {
        ...state,
        currentDocument: action.payload
      };

    case ActionTypes.DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        currentDocument: null
      };

    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        currentProject: action.payload,
        projects: state.projects.map(project => 
          project.id === action.payload.id ? action.payload : project
        )
      };

    default:
      return state;
  }
}

// Emoji Utility
const DEFAULT_EMOJIS = {
  project: ['🚀', '📚', '🌈', '💡', '🎨', '🌟', '📝', '🔮'],
  document: ['📄', '✍️', '📖', '🗒️', '📓', '📘', '🔖', '📋']
};

function getRandomEmoji(type = 'document') {
  const emojis = DEFAULT_EMOJIS[type];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Create context
const TextEditorContext = createContext();

// Provider component
export function TextEditorProvider({ children }) {
  const [state, dispatch] = useReducer(textEditorReducer, initialState);

  // Load projects on initial render
  useEffect(() => {
    const projects = DocumentService.listProjects();
    
    if (projects.length > 0) {
      dispatch({ 
        type: ActionTypes.LOAD_PROJECTS, 
        payload: projects 
      });
      
      // Select the first project and its first document (if exists)
      const firstProject = projects[0];
      if (firstProject.documents && firstProject.documents.length > 0) {
        dispatch({
          type: ActionTypes.SELECT_DOCUMENT,
          payload: firstProject.documents[0]
        });
      } else {
        // Only create a default chapter if no documents exist
        const defaultChapter = DocumentService.createDocument(
          firstProject.id, 
          'Chapter 1'
        );
        
        // Reload projects to reflect the new document
        const updatedProjects = DocumentService.listProjects();
        dispatch({ 
          type: ActionTypes.LOAD_PROJECTS, 
          payload: updatedProjects 
        });
        dispatch({
          type: ActionTypes.SELECT_DOCUMENT,
          payload: defaultChapter
        });
      }
    } else {
      // Create initial project with a default chapter
      const initialProject = DocumentService.createProject('New Project');
      const defaultChapter = DocumentService.createDocument(
        initialProject.id, 
        'Chapter 1'
      );
      
      dispatch({ 
        type: ActionTypes.CREATE_PROJECT, 
        payload: initialProject 
      });
      dispatch({
        type: ActionTypes.SELECT_DOCUMENT,
        payload: defaultChapter
      });
    }
  }, []);

  // Action creators
  const createProject = (projectName) => {
    const newProject = DocumentService.createProject(projectName);
    dispatch({ 
      type: ActionTypes.CREATE_PROJECT, 
      payload: newProject 
    });
    return newProject;
  };

  const selectProject = (project) => {
    dispatch({ 
      type: ActionTypes.SELECT_PROJECT, 
      payload: project 
    });
  };

  const updateProject = (projectUpdates) => {
    if (!state.currentProject) {
      console.error('No project selected');
      return;
    }

    const updatedProject = DocumentService.updateProject(
      state.currentProject.id, 
      projectUpdates
    );

    dispatch({ 
      type: ActionTypes.UPDATE_PROJECT, 
      payload: updatedProject 
    });

    return updatedProject;
  };

  const createDocument = (documentName) => {
    if (!state.currentProject) {
      console.error('No project selected');
      return null;
    }

    // If no document name provided, use 'Chapter'
    const finalDocumentName = documentName || 'Chapter';

    const newDocument = DocumentService.createDocument(
      state.currentProject.id, 
      finalDocumentName
    );

    dispatch({ 
      type: ActionTypes.CREATE_DOCUMENT, 
      payload: newDocument 
    });

    // Automatically select the newly created document
    dispatch({
      type: ActionTypes.SELECT_DOCUMENT,
      payload: newDocument
    });

    return newDocument;
  };

  const updateDocument = (documentId, updates) => {
    // Comprehensive logging and error handling
    console.group('TextEditorContext.updateDocument');
    console.log('Input documentId:', documentId);
    console.log('Input documentId type:', typeof documentId);
    console.log('Updates:', updates);

    try {
      // Validate inputs
      if (!documentId) {
        console.error('Cannot update document: Document ID is required');
        console.groupEnd();
        return null;
      }

      // Ensure documentId is a string
      const id = typeof documentId === 'object' 
        ? (documentId.id || documentId._id || documentId.documentId) 
        : documentId;

      if (!id || typeof id !== 'string') {
        console.error('Invalid document ID:', documentId);
        console.groupEnd();
        return null;
      }

      // Validate updates
      if (!updates || Object.keys(updates).length === 0) {
        console.error('No updates provided');
        console.groupEnd();
        return null;
      }

      // Perform document update
      const updatedDocument = DocumentService.updateDocument(id, updates);
      
      // Dispatch action to update both current document and project documents
      dispatch({ 
        type: ActionTypes.UPDATE_DOCUMENT, 
        payload: updatedDocument 
      });

      // Manually update the project's documents to ensure real-time update
      if (state.currentProject) {
        const updatedProjects = state.projects.map(project => {
          if (project.id === state.currentProject.id) {
            return {
              ...project,
              documents: project.documents.map(doc => 
                doc.id === id ? updatedDocument : doc
              )
            };
          }
          return project;
        });

        // Dispatch project update to force re-render
        dispatch({
          type: ActionTypes.LOAD_PROJECTS,
          payload: updatedProjects
        });
      }

      console.log('Document updated successfully:', updatedDocument);
      console.groupEnd();

      return updatedDocument;
    } catch (error) {
      console.error('Error updating document:', error);
      console.groupEnd();
      return null;
    }
  };

  const updateDocumentName = (documentId, newName) => {
    // Comprehensive logging
    console.group('TextEditorContext.updateDocumentName');
    console.log('Input documentId:', documentId);
    console.log('Input documentId type:', typeof documentId);
    console.log('Input documentId keys:', 
      documentId && typeof documentId === 'object' 
        ? Object.keys(documentId) 
        : 'N/A'
    );
    console.log('New Name:', newName);
    console.log('Current State:', JSON.stringify(state, null, 2));

    // Validate inputs
    if (!documentId) {
      console.error('Cannot update document: Document ID is required');
      console.groupEnd();
      return null;
    }

    if (!newName) {
      console.error('Cannot update document: New name is required');
      console.groupEnd();
      return null;
    }

    // Attempt to extract ID if it's an object
    const extractDocumentId = (input) => {
      // String ID
      if (typeof input === 'string') {
        console.log('Using string ID directly:', input);
        return input;
      }

      // Object ID extraction
      if (typeof input === 'object' && input !== null) {
        const idFields = ['id', '_id', 'documentId', 'uuid'];
        
        for (let field of idFields) {
          if (input[field] && typeof input[field] === 'string') {
            console.log(`ID extracted using ${field}:`, input[field]);
            return input[field];
          }
        }

        // Fallback to toString if no ID field found
        if (input.toString && typeof input.toString === 'function') {
          const stringId = input.toString();
          console.log('ID extracted using toString():', stringId);
          return stringId;
        }
      }

      console.error('Could not extract document ID', input);
      return null;
    };

    // Extract ID
    const id = extractDocumentId(documentId);

    // Validate extracted ID
    if (!id) {
      console.error('Cannot update document: Could not extract document ID', { documentId });
      console.groupEnd();
      return null;
    }

    // First, find the document to ensure it exists
    const documentInfo = DocumentService.findDocumentById(id);
    
    if (!documentInfo) {
      console.error(`Cannot update document: Document with ID ${id} not found`);
      console.error('Current state:', JSON.stringify(state, null, 2));
      console.groupEnd();
      return null;
    }

    const updatedDocument = DocumentService.updateDocument(id, { name: newName });
    
    dispatch({ 
      type: ActionTypes.UPDATE_DOCUMENT, 
      payload: updatedDocument 
    });

    console.log('Document name updated successfully:', updatedDocument);
    console.groupEnd();

    return updatedDocument;
  };

  const selectDocument = (document) => {
    dispatch({ 
      type: ActionTypes.SELECT_DOCUMENT, 
      payload: document 
    });
  };

  const deleteDocument = (documentToDelete) => {
    if (!state.currentProject) {
      console.error('No project selected');
      return;
    }

    // Delete the document from the project
    DocumentService.deleteDocument(state.currentProject.id, documentToDelete.id);

    // Get the updated project
    const updatedProjects = DocumentService.listProjects();
    const updatedProject = updatedProjects.find(p => p.id === state.currentProject.id);

    // Determine the new current document
    const newCurrentDocument = updatedProject.documents.length > 0 
      ? updatedProject.documents[0] 
      : null;

    // Dispatch actions to update state
    dispatch({ 
      type: ActionTypes.LOAD_PROJECTS, 
      payload: updatedProjects 
    });

    if (newCurrentDocument) {
      dispatch({ 
        type: ActionTypes.SELECT_DOCUMENT, 
        payload: newCurrentDocument 
      });
    }
  };

  // Context value
  const contextValue = {
    state,
    createProject,
    selectProject,
    updateProject,
    createDocument,
    updateDocument,
    updateDocumentName,
    selectDocument,
    deleteDocument
  };

  return (
    <TextEditorContext.Provider value={contextValue}>
      {children}
    </TextEditorContext.Provider>
  );
}

// Custom hook
export function useTextEditor() {
  const context = useContext(TextEditorContext);
  if (!context) {
    throw new Error('useTextEditor must be used within a TextEditorProvider');
  }
  return context;
}
