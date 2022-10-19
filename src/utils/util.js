import { BigNumber, ethers } from 'ethers';
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadString,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { abi, contractAddress } from '../abi';
import { storage } from './db';

export const hideAccountId = (accountId) => {
  return (
    accountId.substring(0, 4) +
    '...' +
    accountId.substring(accountId.length - 4, accountId.length)
  );
};

export const fetchOwnedNFTs = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    const response = await contract.getNFTs();
    const nftArray = response.map((v) => v.split(','));

    const data = await Promise.all(
      nftArray.map(async (v) => {
        const { metadata, src } = await getNFTImage(v[1]);
        return {
          id: v[0],
          name: metadata.customMetadata.name,
          src,
        };
      })
    );

    return data;
  }

  throw new Error('Metamask not installed');
};

const getNFTImage = async (imageUID) => {
  const imageRef = ref(storage, `images/${imageUID}`);
  const metadata = await getMetadata(imageRef);
  const src = await getDownloadURL(imageRef);
  return {
    metadata,
    src,
  };
};

export const uploadNFTImage = async (imageName, imageSource) => {
  const imageUID = uuidv4();
  const imageRef = ref(storage, `images/${imageUID}`);
  const metadata = {
    customMetadata: {
      name: imageName,
    },
  };

  await uploadString(imageRef, imageSource, 'data_url', metadata);

  return imageUID;
};

export const mint = async (mintAmount, nftImageName, nftImageSource) => {
  if (window.ethereum) {
    const imageUID = await uploadNFTImage(nftImageName, nftImageSource);

    if (!imageUID) return alert('No image found');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);

    try {
      const response = await contract.mint(
        BigNumber.from(mintAmount),
        imageUID,
        {
          value: ethers.utils.parseEther((0.001 * mintAmount).toString()),
        }
      );
      console.log('Response ', response);
      return 'Minting successfull';
    } catch (error) {
      console.error(error);
      alert(error.message);
      throw error;
    }
  }
};
