import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BuyerHomePage from './page';
// import OtherPage from '/OtherPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BuyerHomePage />} />
      </Routes>
    </BrowserRouter>
  );
}