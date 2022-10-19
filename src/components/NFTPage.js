import { Card } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { fetchOwnedNFTs } from '../utils/util';
import Loading from './Loading';
import Notify from './Notify';

const NFTPage = () => {
  const { isLoading, isError, data, error } = useQuery(
    'myNFTs',
    fetchOwnedNFTs,
    { staleTime: 1000 }
  );

  if (data?.length === 0) {
    return (
      <div className="font-bold text-3xl text-center text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        If you cant see your NFT`s. Please refresh the page.
      </div>
    );
  }

  if (isError) return <Notify isFailed={isError} failMessage={error} />;

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
