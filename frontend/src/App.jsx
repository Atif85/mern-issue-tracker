import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import IssueDetailPage from './pages/IssueDetailPage';

const App = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-200">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/issue/:id" element={<IssueDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
