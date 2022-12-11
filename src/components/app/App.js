import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';

import { MainPage, ComicsPage } from '../pages/index';

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/comics" element={<ComicsPage />} />
            {/* <Route path="*" element={<NoMatch />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
