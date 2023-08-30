import { INftCollection } from './INftCollection';
import {
  NearConnection,
  SERIES_ID_HALO_SABER,
  SERIES_ID_LIGHT_SABER,
  haloSaberData,
  lightSaberData,
} from './NearConnection';
import { SwordDataType } from './SwordDataType';
import { loadScript } from './loadScript';

const NEAR_API = 'https://js13kgames.com/src/near-api-js.js';
export const PARAS_COLLECTION_API = 'https://js13kgames2023.netlify.app/.netlify/functions/collection';
// 'https://api-v2-mainnet.paras.id/token-series?collection_id=samurai-sam-by-johnedvardnear';
// https://paras.id/collection/samurai-sam-by-johnedvardnear

let nftTokensForOwner;
let nftCollections;
let nearConnection;

function updateNftOwnership(tokens: any[]) {
  tokens.forEach((token) => {
    if (token.token_id && token.token_id.split(':')[0]) {
      const tokenSeriesId = token.token_id.split(':')[0];
      switch (tokenSeriesId) {
        case SERIES_ID_HALO_SABER:
          haloSaberData.isOwned = true;
          break;
        case SERIES_ID_LIGHT_SABER:
          lightSaberData.isOwned = true;
          break;
      }
    }
  });
}

export async function initNear(): Promise<any> {
  return loadScript(NEAR_API).then(() => {
    nearConnection = new NearConnection();
    return nearConnection.initContract();
  });
}

export function getNftTokensForOwner() {
  return new Promise(async (resolve) => {
    if (!nftTokensForOwner) {
      nftTokensForOwner = await nearConnection.getNftTokensForOwner();
      updateNftOwnership(nftTokensForOwner);
    }

    resolve(nftTokensForOwner);
  });
}

export function getNftCollection(): Promise<INftCollection[]> {
  return new Promise(async (resolve) => {
    if (!nftCollections) nftCollections = await getParasNftCollection();
    resolve(nftCollections);
  });
}

export function isOwned(sword: SwordDataType) {
  return sword.isOwned;
}
export function buyNftSword(sword: SwordDataType) {
  nearConnection.nftBuy(sword);
}
export function login() {
  if (!nearConnection.isSignedIn()) return nearConnection.login();
}

export function isLoggedIn() {
  if (!nearConnection) return false;
  return nearConnection.isSignedIn();
}

function getParasNftCollection(): Promise<INftCollection[]> {
  let api = PARAS_COLLECTION_API;
  if (window.location.hostname.match('localhost')) api = '/api';
  return fetch(api)
    .then((res) => res.json())
    .then((res) => {
      return res.data.results.filter((data) => data.metadata.copies > 0 && !data.is_non_mintable);
    });
}