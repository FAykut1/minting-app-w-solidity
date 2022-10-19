import { Card } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { fetchOwnedNFTs } from '../utils/util';
import Loading from './Loading';

const NFTPage = () => {
  const { isLoading, isError, isSuccess, data, error } = useQuery(
    'myNFTs',
    fetchOwnedNFTs,
    { staleTime: 1000 }
  );

  // const getNFTs = async () => {
  //   if (window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(contractAddress, abi.abi, signer);

  //     try {
  //       const response = await contract.getNFTs();

  //       const nftArray = response.map((v) => v.split(','));

  //       const data = await Promise.all(
  //         nftArray.map(async (v) => {
  //           const { metadata, src } = await getImage(v[1]);
  //           return {
  //             id: v[0],
  //             name: metadata.customMetadata.name,
  //             src,
  //           };
  //         })
  //       );
  //       setNFTs(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  if (data?.length === 0) {
    return (
      <div className="font-bold text-3xl text-center text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        If you cant see your NFT`s. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="text-white grid grid-rows-2 grid-cols-4 gap-2">
      {data?.map((v) => (
        <MCard key={v.id} data={v} />
      ))}

      <Loading isLoading={isLoading} />
    </div>
  );
};

const MCard = ({ data }) => (
  <Card className="w-56 hover:cursor-pointer hover:w-60 transition-all duration-75 ease-in">
    <Card.Img variant="top" src={data.src} />
    <Card.Body className="text-black">
      <Card.Title>{data.name}</Card.Title>
    </Card.Body>
  </Card>
);

export default NFTPage;
