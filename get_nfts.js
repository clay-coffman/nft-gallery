require("dotenv").config();
const axios = require("axios");

const etherscan_api_url = process.env.ETHERSCAN_API_URL;
const etherscan_api_key = process.env.ETHERSCAN_API_KEY;
const account_address = process.env.ETH_WALLET_ADDRESS;

// need a fn to getERC721Txs for wallet address
async function getERC721Transactions(account_address) {
  let tokens = [];
  let request_url = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${account_address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscan_api_key}`;
  try {
    let response = await axios.get(request_url);
    // for each token, create token object and add to tokens arr
    for (token of response.data.result) {
      let token_data = {
        contractAddress: token.contractAddress,
        tokenID: token.tokenID,
      };
      tokens.push(token_data);
    }
  } catch (error) {
    console.error(error);
  }
  return tokens;
}

// need a fn to get TokenImages from OpenSea
// using the contractAddress and tokenId from getERC721Transactions
async function getTokenImages(token_array) {
  let image_urls = [];
  // for each token in token_array, construct url and request image
  // then append to image_urls, return this array
  for (token of token_array) {
    let request_url = `https://api.opensea.io/api/v1/asset/${token.contractAddress}/${token.tokenID}`;

    try {
      let response = await axios.get(request_url);
      image_urls.push(response.data.image_url);
    } catch (error) {
      console.error(error);
    }
  }
  return image_urls;
}

async function getGalleryImages(account_address) {
  try {
    // should return an array of image_urls
    // need to add at least some simple error handling...
    let token_data = await getERC721Transactions(account_address);
    // if (!token_data.ok) {
    //   throw new Error(
    //     `HTTP error in getERC721Transactions! status: ${token_data.status}`
    //   );
    // }
    // ^^ this doesn't work

    let image_urls = await getTokenImages(token_data);
    // if (!image_urls.ok) {
    //   throw new Error(
    //     `HTTP error in getTokenImages! status: ${image_urls.status}`
    //   );
    // }

    console.log(image_urls);
    return image_urls;
  } catch (error) {
    console.error(error);
  }
}

getGalleryImages(account_address);
