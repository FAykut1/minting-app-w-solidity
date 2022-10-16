import { ethers } from 'ethers';
import { AbiCoder } from 'ethers/lib/utils';
import { useState } from 'react';
import { useEffect } from 'react';
import { abi, contractAddress } from '../abi';
import { storage } from '../utils/db';
import { getDownloadURL, ref } from 'firebase/storage';

const NFTPage = () => {
  const [NFTs, setNFTs] = useState([]);

  useEffect(() => {
    getNFTs();
  }, []);

  const getNFTs = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);

      try {
        const response = await contract.getNFTs();

        const nftArray = response.map((v) => v.split(','));

        const data = await Promise.all(
          nftArray.map(async (v) => {
            const src = await getImage(v[1]);
            return {
              id: v[0],
              src,
            };
          })
        );
        console.log(data);
        setNFTs(data);

        // if (response.length <= 0) return;
        // const res = ethers.utils.defaultAbiCoder.decode(
        //   ['string'],
        //   response[0]
        // );
        // console.log(res);
        console.log('Response ', response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getImage = async (imageUID) => {
    const imageRef = ref(storage, `images/${imageUID}`);
    return await getDownloadURL(imageRef);
  };

  return (
    <div>
      {NFTs.map((v) => (
        <div key={v.id} className="p-4 border w-36 h-36">
          <img src={v.src} alt="lol" />
        </div>
      ))}
    </div>
  );
};

export default NFTPage;
