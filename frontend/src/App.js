import React from 'react';
import { TextEditorProvider } from './context/TextEditorContext';
import Layout from './components/Layout/Layout';
import TextEditor from './pages/TextEditor';
import './App.css';

function App() {
  return (
    <TextEditorProvider>
      <Layout>
        <TextEditor />
      </Layout>
    </TextEditorProvider>
  );
}

export default App;
