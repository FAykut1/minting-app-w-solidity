import { BigNumber, ethers } from 'ethers';
import { ref, uploadString } from 'firebase/storage';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { abi, contractAddress } from '../abi';
import { storage } from '../utils/db';

import { Form, Button, Image } from 'react-bootstrap';

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
    <div className="">
      <div className="border-2 rounded-md p-2 text-white">
        <div className="text-xl font-bold text-center">General Info</div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={(e) => setCurrentImgName(e.target.value)}
              type="text"
              placeholder="Enter NFT name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control onChange={handleImageChange} type="file" />
          </Form.Group>

          <Image
            className="max-h-64"
            ref={previewImageRef}
            src={currentImgSrc}
          />
        </Form>
      </div>
      <div className="p-2"></div>
      <div className="border-2 rounded-md p-2 text-white">
        <div className="text-xl font-bold text-center">Mint</div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter an amount"
              onChange={(e) => setMintAmounts(e.target.value)}
            />
          </Form.Group>

          <Button
            onClick={handleMint}
            className="mt-2"
            variant="primary"
            type="button"
          >
            Mint
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default MintPage;
