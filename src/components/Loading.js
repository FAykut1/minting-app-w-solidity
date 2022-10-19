const Loading = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-black opacity-50 absolute left-0 top-0 bottom-0 right-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin bg-white w-12 h-12 " />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Loading;
