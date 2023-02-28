import React from 'react';
import './home.scss';

// Components
import Header from './header';
import Footer from './footer';
import Main from './main';

const Home = (props: any) => {
  return (
    <div className='home-block'>
      <Header />
      <Main
        getSensorIdModal={props.getSensorIdModal}
        isSuccessAddData={props.isSuccessAddData}
      />
      <Footer />
    </div>
  );
};

export default Home;
