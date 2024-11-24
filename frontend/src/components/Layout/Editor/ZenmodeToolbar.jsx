import React, { useState, useEffect } from 'react';
import { useTextEditor } from '../../../context/TextEditorContext';
import './ZenmodeToolbar.css';
import './QuietMode.css';

// Inline SVG icons
const BoldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
  </svg>
);

const ItalicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4"></line>
    <line x1="14" y1="20" x2="5" y2="20"></line>
    <path d="M15 4L9 20"></path>
  </svg>
);

const UnderlineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4v6a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4"></path>
    <line x1="4" y1="20" x2="20" y2="20"></line>
  </svg>
);

const AlignLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="10" x2="3" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="17" y1="18" x2="3" y2="18"></line>
  </svg>
);

const AlignCenterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="10" x2="6" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="18" y1="18" x2="6" y2="18"></line>
  </svg>
);

const AlignRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="10" x2="7" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="21" y1="18" x2="7" y2="18"></line>
  </svg>
);

function ZenmodeToolbar() {
  const { state } = useTextEditor();
  const [isQuietMode, setIsQuietMode] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  const toggleQuietMode = () => {
    const newQuietModeState = !isQuietMode;
    setIsQuietMode(newQuietModeState);
    
    // Toggle quiet mode class on body
    if (newQuietModeState) {
      document.body.classList.add('quiet-mode');
    } else {
      document.body.classList.remove('quiet-mode');
    }
  };

  // Calculate word count and read time
  useEffect(() => {
    if (state.currentDocument?.content) {
      const words = state.currentDocument.content.trim().split(/\s+/).length;
      setWordCount(words);
      
      // Estimate read time (assuming 200 words per minute)
      const estimatedReadTime = Math.ceil(words / 200);
      setReadTime(estimatedReadTime);
    } else {
      setWordCount(0);
      setReadTime(0);
    }
  }, [state.currentDocument?.content]);

  const toggleBold = () => setIsBold(!isBold);
  const toggleItalic = () => setIsItalic(!isItalic);
  const toggleUnderline = () => setIsUnderline(!isUnderline);

  const changeTextAlign = (alignment) => setTextAlign(alignment);

  return (
    <div className={`zenmode-toolbar ${isQuietMode ? 'quiet-mode' : ''}`}>
      <div className="toolbar-left">
        <button 
          className="quiet-mode-toggle" 
          onClick={toggleQuietMode}
        >
          {isQuietMode ? '🧘‍♀️' : '🤫'}
        </button>

        <button 
          className="emoji-button" 
          onClick={() => console.log('Open Chapter Notes')}
        >
          📝
        </button>
        <button 
          className="emoji-button"
          onClick={() => console.log('Open Document Outline')}
        >
          🧭
        </button>
      </div>

      <div className="toolbar-center">
        <div className="text-style-buttons">
          <button 
            className={`formatting-button ${isBold ? 'active' : ''}`} 
            onClick={toggleBold}
          >
            <BoldIcon />
          </button>
          <button 
            className={`formatting-button ${isItalic ? 'active' : ''}`} 
            onClick={toggleItalic}
          >
            <ItalicIcon />
          </button>
          <button 
            className={`formatting-button ${isUnderline ? 'active' : ''}`} 
            onClick={toggleUnderline}
          >
            <UnderlineIcon />
          </button>
        </div>

        <div className="text-alignment-buttons">
          <button 
            className={`formatting-button ${textAlign === 'left' ? 'active' : ''}`} 
            onClick={() => changeTextAlign('left')}
          >
            <AlignLeftIcon />
          </button>
          <button 
            className={`formatting-button ${textAlign === 'center' ? 'active' : ''}`} 
            onClick={() => changeTextAlign('center')}
          >
            <AlignCenterIcon />
          </button>
          <button 
            className={`formatting-button ${textAlign === 'right' ? 'active' : ''}`} 
            onClick={() => changeTextAlign('right')}
          >
            <AlignRightIcon />
          </button>
        </div>
      </div>

      <div className="toolbar-right">
        <div className="toolbar-section">
          <div className="toolbar-stat">
            <span className="stat-label">Words</span>
            <span className="stat-value">{wordCount}</span>
          </div>
          <div className="toolbar-stat">
            <span className="stat-label">Read Time</span>
            <span className="stat-value">{readTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZenmodeToolbar;
