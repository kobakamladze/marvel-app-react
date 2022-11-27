import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import './style/style.scss';

import MarvelService from './services/MarvelService';

const marvelService = new MarvelService();
marvelService.fetchCharacters();

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App marvelService={marvelService} />
  </React.StrictMode>
);
