import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';  // Global styles
import './styles/TextEditor.css';  // Existing styles
import App from './App';
import { TextEditorProvider } from './context/TextEditorContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TextEditorProvider>
      <App />
    </TextEditorProvider>
  </React.StrictMode>
);

reportWebVitals();
