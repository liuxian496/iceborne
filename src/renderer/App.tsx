import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import MainView from 'page/main/mainView';
import Barrage from 'page/barrage/barrageView';

import './App.css';
import 'litten/build/index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="danmu" element={<Barrage />} />
      </Routes>
    </Router>
  );
}
