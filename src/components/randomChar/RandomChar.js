import { Component } from 'react';

import './randomChar.scss';
import errorIamge from '../../resources/img/error.png';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorMessage from '../errorMessage/errorMessage';
import Spinner from '../spinner/spinner';

import MarvelService from '../../services/MarvelService';

function characterStateRender(state) {
  const {
    character: {
      name,
      description,
      thumbnail: { path, extension },
      urls: { charHomePage, charWikiPage },
    },
    loading,
    error,
  } = state;

  return !error && !loading ? (
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
  ) : loading && !error ? (
    <Spinner />
  ) : (
    <ErrorMessage errorIamge={errorIamge} />
  );
}

class RandomChar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      character: {
        name: '',
        description: '',
        thumbnail: { path: '', extension: '' },
        urls: { charHomePage: '', charWikiPage: '' },
      },
      error: false,
      loading: true,
    };
  }

  marvelService = new MarvelService();

  updateRandomChar = () => {
    this.setState({ error: false, loading: true });

    return this.marvelService
      .fetchRandomCharacter()
      .then(response => {
        // if (response.error) {
        //   return this.setState({
        //     error: !this.state.error,
        //     loading: false,
        //   });
        // }

        const {
          name,
          description,
          thumbnail: { path, extension },
          urls: [charHomePage, charWikiPage],
        } = response;

        return this.setState(() => ({
          character: {
            name,
            description: description
              ? description
              : 'No description for this character...',
            thumbnail: { path, extension },
            urls: {
              charHomePage: charHomePage.url,
              charWikiPage: charWikiPage.url,
            },
          },
          error: false,
          loading: false,
        }));
      })
      .catch(() =>
        this.setState({
          error: true,
          loading: false,
        })
      );
  };

  componentDidMount = () => this.updateRandomChar();

  render() {
    return (
      <div className="randomchar">
        {characterStateRender(this.state)}

        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>
          <button
            className="button button__main"
            onClick={this.updateRandomChar}
          >
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

export default RandomChar;
