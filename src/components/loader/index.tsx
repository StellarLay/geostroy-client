import { Circles } from 'react-loader-spinner';

const Loader = () => {
  return (
    <Circles
      height='80'
      width='80'
      color='#af1337'
      ariaLabel='triangle-loading'
      wrapperStyle={{}}
      wrapperClass='loader'
      visible={true}
    />
  );
};

export default Loader;
