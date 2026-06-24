import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';
import toast from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <button
        onClick={() => toast.success('Done')}
        className="text-red-50 p-4 bg-blue-300"
      >
        Test Toast
      </button>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
