import React from 'react';
import { useTextEditor } from '../../context/TextEditorContext';
import MenuBar from '../MenuBar/MenuBar';
import Editor from './Editor/Editor';
import AIPanel from '../AIPanel/AIPanel';
import './Layout.css';

function Layout() {
  const { state } = useTextEditor();
  const isQuietMode = state.isQuietMode;

  return (
    <div className={`app-layout ${isQuietMode ? 'quiet-mode' : ''}`}>
      <div className="menu-bar-container">
        <MenuBar />
      </div>
      <div className="main-content-container">
        <Editor />
      </div>
      <div className="ai-panel-container">
        <AIPanel />
      </div>
    </div>
  );
}

export default Layout;
