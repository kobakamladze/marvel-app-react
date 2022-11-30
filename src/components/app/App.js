import { Component } from 'react';

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';

import decoration from '../../resources/img/vision.png';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      charInfoSelectedCharacter: {
        id: null,
      },
    };
  }

  updateSelectedCharacter = id =>
    this.setState({ charInfoSelectedCharacter: { id } });

  render() {
    const {
      charInfoSelectedCharacter: { id },
    } = this.state;

    return (
      <div className="app">
        <AppHeader />
        <main>
          <RandomChar />
          <div className="char__content">
            <CharList onCharacterUpdate={this.updateSelectedCharacter} />
            <CharInfo characterId={id} />
          </div>
          <img className="bg-decoration" src={decoration} alt="vision" />
        </main>
      </div>
    );
  }
}

export default App;
