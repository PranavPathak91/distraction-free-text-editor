import React from 'react';
import ZenmodeToolbar from './ZenmodeToolbar';
import TextEditor from '../../../pages/TextEditor';
import './Editor.css';

function Editor() {
  return (
    <div className="editor-container">
      <ZenmodeToolbar />
      <div className="editor-content-wrapper">
        <TextEditor />
      </div>
    </div>
  );
}

export default Editor;
