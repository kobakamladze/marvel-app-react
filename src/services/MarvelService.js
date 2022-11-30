import axios from 'axios';

// Max CharId = 1011500
// Min CharId = 1010801
// Generates random number in range of (1010801, 1011500) for character ID
function getRandomCharId() {
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
    const characterId = getRandomCharId();

    return this.fetchMarvelData(`v1/public/characters/${characterId}`).then(
      response => {
        if (response.status !== 'Ok') return Promise.resolve({ error: true });

        if (response.data.results.length) return response.data.results[0];
      }
    );
  };

  fetchPreciseCharacter = id => {
    console.log('CHARACTER ID TO FETCH === ' + id);
    return this.fetchMarvelData(`v1/public/characters/${id}`).then(response =>
      console.log(JSON.stringify(response))
    );
  };
}

export default MarvelService;
