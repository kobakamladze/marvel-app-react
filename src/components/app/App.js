import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import AppBanner from '../appBanner/AppBanner';
import ComicsList from '../comicsList/ComicsList';

import decoration from '../../resources/img/vision.png';

const App = ({ id }) => {
  const [characterId, setCharacterId] = useState(null);

  // updateSelectedCharacter = id => this.setCharacterId(id);

  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
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
                </>
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
        </main>
      </div>
    </Router>
  );
};

export default App;
