import React, { useState, useRef, useEffect } from 'react';
import { useTextEditor } from '../../context/TextEditorContext';
import './MenuBar.css';

const MENU_STRUCTURE = [
  {
    type: 'project',
    name: 'Chapters',
    children: []
  },
  { 
    name: 'Characters', 
    type: 'section' 
  },
  { 
    name: 'World Building', 
    type: 'section' 
  },
  { 
    name: 'Notes', 
    type: 'section' 
  },
  { 
    name: 'Timeline', 
    type: 'section' 
  }
];

function MenuBar() {
  const { 
    state, 
    createProject,
    selectProject,
    updateProject,
    createDocument,
    selectDocument,
    deleteDocument,
    updateDocumentName
  } = useTextEditor();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(() => {
    // Initialize with Chapters expanded by default
    return {
      'Chapters': true
    };
  });
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState('');
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [editedDocumentName, setEditedDocumentName] = useState('');
  const projectNameInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProjectDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isEditingProjectName && projectNameInputRef.current) {
      projectNameInputRef.current.focus();
      projectNameInputRef.current.select();
    }
  }, [isEditingProjectName]);

  const toggleSection = (sectionName) => {
    console.log('Toggling section:', sectionName);
    setExpandedSections(prev => {
      const newState = {
        ...prev,
        [sectionName]: !prev[sectionName]
      };
      console.log('New expanded sections state:', newState);
      return newState;
    });
  };

  const handleProjectNameEdit = () => {
    if (!state.currentProject) return;
    
    setIsEditingProjectName(true);
    setEditedProjectName(state.currentProject.name);
  };

  const handleProjectNameChange = (e) => {
    // Directly update the edited project name
    setEditedProjectName(e.target.value);
  };

  const handleProjectNameSubmit = () => {
    if (!state.currentProject) return;

    // Trim the project name and prevent empty names
    const trimmedName = editedProjectName.trim();
    if (trimmedName) {
      updateProject({
        name: trimmedName
      });
    } else {
      // If name is empty, revert to the original name
      setEditedProjectName(state.currentProject.name);
    }
    
    setIsEditingProjectName(false);
  };

  const handleProjectNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleProjectNameSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingProjectName(false);
    }
  };

  const handleCreateChapter = () => {
    if (!state.currentProject) {
      console.error('No project selected');
      return;
    }

    const newChapter = createDocument(); // Use default 'Chapter' naming

    if (newChapter) {
      console.log('New chapter created:', newChapter);
      
      // Ensure the Chapters section is expanded
      setExpandedSections(prev => ({
        ...prev,
        'Chapters': true
      }));
    }
  };

  const handleDocumentNameEdit = (document) => {
    // Ensure we're setting the document ID, not the entire object
    const documentId = typeof document === 'object' 
      ? document.id 
      : document;

    setEditingDocumentId(documentId);
    setEditedDocumentName(
      typeof document === 'object' 
        ? document.name 
        : state.currentDocument?.name || ''
    );
  };

  const handleDocumentNameChange = (e) => {
    setEditedDocumentName(e.target.value);
  };

  const handleDocumentNameSave = () => {
    if (editingDocumentId && editedDocumentName) {
      try {
        console.group('Document Name Save Attempt');
        console.log('Raw editingDocumentId:', editingDocumentId);
        console.log('editingDocumentId type:', typeof editingDocumentId);
        console.log('editingDocumentId keys:', 
          editingDocumentId ? Object.keys(editingDocumentId) : 'N/A'
        );
        console.log('editedDocumentName:', editedDocumentName);
        console.log('Current State:', JSON.stringify(state, null, 2));
        console.log('Current Document:', state.currentDocument);

        const extractDocumentId = (input) => {
          if (typeof input === 'string') return input;

          if (typeof input === 'object' && input !== null) {
            const idFields = ['id', '_id', 'documentId', 'uuid'];
            for (let field of idFields) {
              if (input[field] && typeof input[field] === 'string') {
                console.log(`ID extracted using ${field}:`, input[field]);
                return input[field];
              }
            }

            if (input.toString && typeof input.toString === 'function') {
              const stringId = input.toString();
              console.log('ID extracted using toString():', stringId);
              return stringId;
            }
          }

          console.error('Could not extract document ID', input);
          return null;
        };

        const documentId = extractDocumentId(editingDocumentId);

        if (!documentId) {
          console.error('Invalid document ID extraction');
          console.groupEnd();
          return;
        }

        console.log('Extracted Document ID:', documentId);

        const updatedDocument = updateDocumentName(documentId, editedDocumentName);
        
        if (updatedDocument) {
          setEditingDocumentId(null);
        } else {
          setEditedDocumentName(state.currentDocument?.name || '');
          console.error('Failed to update document name');
        }

        console.groupEnd();
      } catch (error) {
        console.error('Unexpected error in handleDocumentNameSave:', error);
        setEditedDocumentName(state.currentDocument?.name || '');
      }
    }
  };

  const handleDocumentNameBlur = () => {
    handleDocumentNameSave();
  };

  const handleDocumentNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDocumentNameSave();
    } else if (e.key === 'Escape') {
      setEditingDocumentId(null);
    }
  };

  const renderMenuItems = () => {
    return MENU_STRUCTURE.map((item, index) => {
      let chapterChildren = [];
      
      if (item.name === 'Chapters' && state.currentProject) {
        chapterChildren = (state.currentProject.documents || []).map(doc => ({
          name: doc.name || 'Untitled Chapter',
          emoji: doc.emoji || '📄',  // Ensure a default emoji
          type: 'chapter',
          id: doc.id
        }));
      }

      return (
        <div 
          key={index} 
          className={`menu-item ${item.type === 'project' ? 'menu-item-project' : 'menu-item-section'}`}
        >
          <div className="menu-item-header">
            {state.currentProject && item.name === 'Chapters' && (
              <span className="menu-item-emoji">
                {state.currentProject.emoji || '📚'}
              </span>
            )}
            
            <span className="menu-item-name">{item.name}</span>
            
            {item.name === 'Chapters' && state.currentProject && (
              <div 
                className="project-icon project-icon-new-chapter"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateChapter();
                }}
              >
                ➕
              </div>
            )}
          </div>
          
          {chapterChildren.length > 0 && (
            <div className="menu-item-children">
              {chapterChildren.map((child) => (
                <div 
                  key={child.id} 
                  className="menu-item-child"
                  onClick={() => {
                    const fullDocument = state.currentProject.documents.find(
                      doc => doc.id === child.id
                    );
                    if (fullDocument) {
                      selectDocument(fullDocument);
                    }
                  }}
                >
                  {editingDocumentId === child.id ? (
                    <input 
                      type="text"
                      value={editedDocumentName}
                      onChange={handleDocumentNameChange}
                      onBlur={handleDocumentNameBlur}
                      onKeyDown={handleDocumentNameKeyDown}
                      autoFocus
                      className="document-name-input"
                    />
                  ) : (
                    <>
                      <span className="menu-item-child-emoji">{child.emoji || '📄'}</span>
                      <span 
                        className="document-name"
                        onDoubleClick={() => handleDocumentNameEdit(child)}
                      >
                        {child.name}
                      </span>
                      <div 
                        className="project-icon project-icon-delete-chapter"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent click
                          const fullDocument = state.currentProject.documents.find(
                            doc => doc.id === child.id
                          );
                          if (fullDocument) {
                            deleteDocument(fullDocument);
                          }
                        }}
                      >
                        🗑️
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="menu-bar">
      <div className="menu-bar-header" ref={dropdownRef}>
        <div className="project-selector">
          <div 
            className="project-name"
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
          >
            {isEditingProjectName ? (
              <input 
                ref={projectNameInputRef}
                className="project-name-edit-input"
                value={editedProjectName}
                onChange={handleProjectNameChange}
                onBlur={handleProjectNameSubmit}
                onKeyDown={handleProjectNameKeyDown}
                autoFocus
                placeholder="Enter project name"
              />
            ) : (
              <span 
                className="project-name-display"
                onDoubleClick={handleProjectNameEdit}
              >
                {state.currentProject?.name || 'Select a Project'}
                <span 
                  className="project-name-edit-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click events
                    handleProjectNameEdit();
                  }}
                >✏️</span>
              </span>
            )}
          </div>
          {state.currentProject && (
            <div className="project-icons">
              <div 
                className="project-icon-dropdown"
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              >
                🔽
              </div>
            </div>
          )}
        </div>
        {isProjectDropdownOpen && (
          <div className="project-name-dropdown">
            {state.projects.map((project) => (
              <div 
                key={project.id} 
                className="project-name-dropdown-item"
                onClick={() => {
                  selectProject(project);
                  setIsProjectDropdownOpen(false);
                }}
              >
                {project.emoji || '📁'} {project.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="menu-items">
        {renderMenuItems()}
      </div>
    </div>
  );
}

export default MenuBar;
