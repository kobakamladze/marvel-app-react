import { useState } from 'react';

import RandomChar from '../components/randomChar/RandomChar';
import CharInfo from '../components/charInfo/CharInfo';
import CharList from '../components/charList/CharList';
import ErrorBoundary from '../components/errorBoundary/ErrorBoundary';

import decoration from '../resources/img/vision.png';

const MainPage = ({ id }) => {
  const [characterId, setCharacterId] = useState(null);

  return (
    <>
      <RandomChar />
      <div className="char__content">
        <CharList onCharacterUpdate={id => setCharacterId(id)} />
        <ErrorBoundary>
          <CharInfo characterId={characterId} />
        </ErrorBoundary>
      </div>
      <img className="bg-decoration" src={decoration} alt="vision" />
    </>
  );
};

export default MainPage;
