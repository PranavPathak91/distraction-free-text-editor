import React from 'react';
import MenuBar from '../MenuBar/MenuBar';
import Editor from './Editor/Editor';
import AIPanel from '../AIPanel/AIPanel';
import './Layout.css';

function Layout() {
  return (
    <div className="app-layout">
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
