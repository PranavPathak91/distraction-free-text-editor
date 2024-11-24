import React, { useEffect, useRef } from 'react';
import { useTextEditor } from '../context/TextEditorContext';
import '../styles/TextEditor.css';

function TextEditor() {
  const { 
    state, 
    updateDocument,
    createDocument
  } = useTextEditor();

  const nameInputRef = useRef(null);
  const contentTextareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const adjustHeight = (element) => {
      if (element) {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
      }
    };

    if (contentTextareaRef.current) {
      adjustHeight(contentTextareaRef.current);
    }
  }, [state.currentDocument?.content]);

  // Create initial document if no document exists
  useEffect(() => {
    if (!state.currentDocument && state.currentProject) {
      createDocument('Untitled Document');
    }
  }, [state.currentProject]);

  if (!state.currentProject) {
    return <div className="text-editor-loading">Loading project...</div>;
  }

  if (!state.currentDocument) {
    return <div className="text-editor-loading">Create a new document</div>;
  }

  const handleContentChange = (e) => {
    const documentId = state.currentDocument?.id;
    if (documentId) {
      updateDocument(documentId, { content: e.target.value });
    }
  };

  const handleNameChange = (e) => {
    // Use the current document's ID when updating the name
    const documentId = state.currentDocument?.id;
    const newName = e.target.value;
    
    if (documentId) {
      // Only update if there's actual text, don't force 'Untitled Document'
      if (newName.trim() !== '') {
        updateDocument(documentId, { name: newName });
      } else {
        // If empty, just update with empty string
        updateDocument(documentId, { name: '' });
      }
    } else {
      console.error('No current document to update');
    }
  };

  return (
    <div className="text-editor">
      <div className="text-editor-header">
        <input 
          ref={nameInputRef}
          type="text" 
          value={state.currentDocument.name || ''}
          onChange={handleNameChange}
          className="document-name-input"
          placeholder="Untitled Document"
        />
      </div>
      <div className="text-editor-body">
        <textarea 
          ref={contentTextareaRef}
          value={state.currentDocument.content || ''}
          onChange={handleContentChange}
          className="document-content-textarea"
          placeholder="Start typing your document..."
          autoFocus
        />
      </div>
    </div>
  );
}

export default TextEditor;