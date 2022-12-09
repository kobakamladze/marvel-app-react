import { useState } from 'react';

import RandomChar from '../randomChar/RandomChar';
import CharInfo from '../charInfo/CharInfo';
import CharList from '../charList/CharList';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

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
