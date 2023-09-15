import { createRoot } from 'react-dom/client';
import Barrage from 'page/barrage/barrageView';

const container = document.getElementById('root')!;
const root = createRoot(container);
document.title = '弹幕视图';

// @ts-ignore
root.render(<Barrage />);
