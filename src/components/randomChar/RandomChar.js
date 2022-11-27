import { Component } from 'react';

import './randomChar.scss';
import thor from '../../resources/img/thor.jpeg';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  constructor(props) {
    super(props);

    this.marvelService = this.props.marvelService;

    this.state = {
      character: {
        name: '',
        description: '',
        thumbnail: { path: '', extension: '' },
        urls: { charHomePage: '', charWikiPage: '' },
      },
    };
  }

  getRandomChar = () => {
    this.marvelService
      .fetchRandomCharacter()
      .then(
        ({
          name,
          description,
          thumbnail: { path, extension },
          urls: [charHomePage, charWikiPage],
        }) => {
          console.log('NAME === ' + name);
          console.log('DESC === ' + description);
          console.log('THUMBNAIL === ' + { path, extension });
          console.log('URLS === ' + { charHomePage, charWikiPage });

          return this.setState({
            character: {
              name,
              description,
              thumbnail: { path, extension },
              urls: {
                charHomePage: charHomePage.url,
                charWikiPage: charWikiPage.url,
              },
            },
          });
        }
      );
  };

  componentDidMount = () => this.getRandomChar();

  render() {
    const {
      character: {
        name,
        description,
        thumbnail: { path, extension },
        urls: { charHomePage, charWikiPage },
      },
    } = this.state;

    return (
      <div className="randomchar">
        <div className="randomchar__block">
          <img
            src={`${path}.${extension}`}
            alt="Random character"
            className="randomchar__img"
          />
          <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">{description}</p>
            <div className="randomchar__btns">
              <a href={charHomePage} className="button button__main">
                <div className="inner">homepage</div>
              </a>
              <a href={charWikiPage} className="button button__secondary">
                <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button className="button button__main" onClick={this.getRandomChar}>
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

export default RandomChar;
