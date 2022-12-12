import { Suspense } from 'react-is';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import { NoMatch, MainPage, ComicsPage, SingleComic } from '../../pages';
import Spinner from '../spinner/spinner';

const App = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Router>
        <div className="app">
          <AppHeader />
          <main>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/comics" element={<ComicsPage />} />
              <Route path="/comic/:comicId" element={<SingleComic />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Suspense>
  );
};

export default App;
