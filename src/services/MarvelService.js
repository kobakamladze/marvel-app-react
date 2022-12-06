import axios from 'axios';

// Max CharId = 1011500
// Min CharId = 1010801
// Generates random number in range of (1010801, 1011500) for character ID
function generateRandomCharId() {
  const min = 1010801;
  const max = 1011500;
  return Math.floor(Math.random() * (max - min) + min);
}

class MarvelService {
  _domain = 'https://gateway.marvel.com:443';
  _apkikey = 'apikey=f3efb51bf799f47e431a63c43ee818ae';

  fetchMarvelData = (url, limit, offset = 0) => {
    let extraParams = '';
    if (limit) {
      extraParams = `&offset=${offset}&limit=${limit}`;
    }

    return axios
      .get(`${this._domain}/${url}?${this._apkikey}${extraParams}`)
      .then(({ data: response }) => response)
      .catch(e => e)
      .finally();
  };

  fetchCharacters = ({ limit = 9, offset }) =>
    this.fetchMarvelData(`v1/public/characters`, limit, offset).then(
      response => {
        const responseWithFilteredProps = response.data.results.map(
          ({
            name,
            id,
            description,
            thumbnail: { path, extension },
            urls: [{ url: charHomePage }, { url: charWikiPage }],
          }) => ({
            name,
            id,
            description,
            thumbnail: { path, extension },
            urls: [{ url: charHomePage }, { url: charWikiPage }],
            condition: { selected: false },
          })
        );

        return responseWithFilteredProps;
      }
    );

  fetchRandomCharacter = () => {
    const randomCharacterId = generateRandomCharId();

    return this.fetchMarvelData(`v1/public/characters/${randomCharacterId}`)
      .then(response => {
        // if (response.status !== 'Ok') return Promise.reject({ error: true });

        if (response.data.results.length) {
          const {
            name,
            description,
            thumbnail: { path, extension },
            urls: [{ url: charHomePage }, { url: charWikiPage }],
          } = response.data.results[0];

          return {
            name,
            description,
            thumbnail: `${path}.${extension}`,
            homePageUrl: charHomePage,
            wikiUrl: charWikiPage,
          };
        }
      })
      .catch(() => Promise.reject({ error: true }));
  };

  fetchPreciseCharacter = (id = generateRandomCharId()) => {
    return this.fetchMarvelData(`v1/public/characters/${id}`).then(response => {
      const {
        name,
        id,
        description,
        thumbnail: { path, extension },
        urls: [{ url: charHomePage }, { url: charWikiPage }],
        comics: { items: comics },
      } = response.data.results[0];

      return {
        name,
        id,
        description,
        thumbnail: `${path}.${extension}`,
        urls: { charHomePage, charWikiPage },
        comics,
      };
    });
  };
}

export default MarvelService;
