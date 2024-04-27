import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import MainView from 'page/main/mainView';
import Barrage from 'page/barrage/barrageView';

import './App.css';
import 'litten/dist/assets/button.css';
import 'litten/dist/assets/formLabel.css';
import 'litten/dist/assets/radio.css';
import 'litten/dist/assets/slider.css';
import 'litten/dist/assets/stackPanel.css';
import 'litten/dist/assets/switch.css';
import 'litten/dist/assets/textField.css';

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
