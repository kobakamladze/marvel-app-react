import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ComicsList from '../comicsList/ComicsList';
import AppBanner from '../appBanner/AppBanner';

import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

const App = () => {
  const [characterId, setCharacterId] = useState(null);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div className="app">
                <AppHeader />
                <main>
                  <RandomChar />
                  <div className="char__content">
                    <CharList onCharacterUpdate={id => setCharacterId(id)} />
                    <ErrorBoundary>
                      <CharInfo characterId={characterId} />
                    </ErrorBoundary>
                  </div>
                  <img
                    className="bg-decoration"
                    src={decoration}
                    alt="vision"
                  />
                </main>
              </div>
            }
          />
          <Route
            path="/comics"
            element={
              <>
                <AppBanner />
                <ComicsList />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
