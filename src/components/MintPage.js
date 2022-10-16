import { BigNumber, ethers } from 'ethers';
import { ref, uploadString } from 'firebase/storage';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { abi, contractAddress } from '../abi';
import { storage } from '../utils/db';

const MintPage = () => {
  const [mintAmount, setMintAmounts] = useState(1);

  const [currentImgSrc, setCurrentImgSrc] = useState();
  const [currentImgName, setCurrentImgName] = useState();

  const previewImageRef = useRef(null);

  const handleMint = async () => {
    if (window.ethereum) {
      const imageUID = uploadFile();

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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const uploadFile = async () => {
    if (currentImgSrc) {
      const imageUID = uuidv4();

      const imageRef = ref(storage, `images/${imageUID}`);

      const metadata = {
        customMetadata: {
          name: currentImgName,
        },
      };

      const snapshot = await uploadString(
        imageRef,
        currentImgSrc,
        'data_url',
        metadata
      );
      console.log('Uploaded', snapshot);

      return imageUID;
    }
  };

  const handleImageChange = (imgEvent) => {
    const file = imgEvent.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      setCurrentImgSrc(e.target.result);
    });

    reader.readAsDataURL(file);
  };

  return (
    <div className="text-white">
      <section className="general-info p-4 border rounded">
        <h1 className="text-3xl font-bold pb-4">General Info</h1>
        <div className="flex">
          <div className="flex flex-col justify-evenly items-start">
            <div className="">
              <label>Name</label>
              <span className="p-2"></span>
              <input
                className="text-black"
                type="text"
                onChange={(e) => setCurrentImgName(e.target.value)}
              />
            </div>
            <input onChange={handleImageChange} type="file" />
          </div>
          <div className="">
            {currentImgSrc ? (
              <img
                className="h-24"
                ref={previewImageRef}
                src={currentImgSrc}
                alt="image not loaded"
              />
            ) : (
              <div className="w-24 h-24 bg-black"></div>
            )}
          </div>
        </div>
      </section>

      <div className="p-2"></div>

      <section className="mint-amount p-4 border rounded">
        <span>Amount</span>
        <input
          className="text-black"
          type="number"
          onChange={(e) => setMintAmounts(e.target.value)}
        />
      </section>

      <div className="text-xl text-right p-2 hover:text-slate-400">
        <button onClick={handleMint}>Mint</button>
      </div>
    </div>
  );
};

export default MintPage;
