let nftTokensForOwner;
let nftCollections;

export function setNftTokens(tokensForOwner, collections) {
  nftTokensForOwner = tokensForOwner;
  nftCollections = collections;
}

export function getNftTokensForOwner() {
  return nftTokensForOwner;
}

export function getNftCollections() {
  return nftCollections;
}
