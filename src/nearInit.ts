import { SERIES_ID_LIGHT_SABER, NearConnection, SERIES_ID_HALO_SABER, haloSaberData } from './NearConnection';
import { loadScript } from './loadScript';
import { setNftTokens } from './store';

const NEAR_API = 'https://js13kgames.com/src/near-api-js.js';

export async function initNear(): Promise<any> {
  return loadScript(NEAR_API).then(() => {
    const nearConnection = new NearConnection();
    return nearConnection.initContract().then(async () => {
      if (!nearConnection.isSignedIn()) return nearConnection.login();
      // const res = await nearConnection.getNftTokensForOwner(nearConnection.accountId);
      // const res = await nearConnection.getNftCollections();
      // return res;
      const promises = [
        nearConnection.getNftTokensForOwner(nearConnection.accountId),
        nearConnection.getNftCollections(),
      ];

      Promise.all(promises).then(([tokensForOwner, collections]) => {
        console.log(tokensForOwner, collections);
        setNftTokens(tokensForOwner, collections);
        return [tokensForOwner, collections];
      });
    });
  });
}
