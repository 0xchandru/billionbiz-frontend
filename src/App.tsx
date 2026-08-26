import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Pages from './pages/Pages';
import ThemeStyles from './pages/ThemeStyles';
import EditorLayout from './pages/editor/EditorLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pages" element={<Pages />} />
          <Route path="theme" element={<ThemeStyles />} />
          <Route path="*" element={<div>Placeholder Page</div>} />
        </Route>
        <Route path="/editor" element={<EditorLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
