/**
 * Root application component. 
 * Defines the main routing structure using React Router and wraps the application 
 * in the StoreProvider for global state access.
 */
import React from 'react';
/* Updated import to react-router to resolve missing exported member errors */
import { HashRouter as Router, Routes, Route } from 'react-router';
import { StoreProvider } from './StoreContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { JobBoard } from './pages/JobBoard';
import { MessagesPage } from './pages/MessagesPage';
import { AuthPage } from './pages/AuthPage';
import { GeminiAssistant } from './components/GeminiAssistant';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
          <GeminiAssistant />
        </Layout>
      </Router>
    </StoreProvider>
  );
};

export default App;