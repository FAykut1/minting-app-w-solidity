import { useState } from 'react';

import { Button, Form, Image } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { mint } from '../utils/util';
import Loading from './Loading';
import Notify from './Notify';

const MintPage = () => {
  const [mintAmount, setMintAmounts] = useState(1);
  const [currentImgSrc, setCurrentImgSrc] = useState();
  const [currentImgName, setCurrentImgName] = useState();

  const { refetch, isLoading, isSuccess, isError, data, error } = useQuery(
    ['mintNFT', mintAmount, currentImgSrc, currentImgName],
    () => mint(mintAmount, currentImgName, currentImgSrc),
    {
      enabled: false,
    }
  );

  const handleMint = async () => {
    await refetch();
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
      <Notify
        isFailed={isError}
        isSuccess={isSuccess}
        successMessage={data}
        failMessage={error}
      />
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

          <Image className="max-h-64" src={currentImgSrc} />
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

      <Loading isLoading={isLoading} />
    </div>
  );
};

export default MintPage;
