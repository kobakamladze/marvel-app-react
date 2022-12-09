import React from 'react';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';

const ComicsPage = () => {
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

export default ComicsPage;
