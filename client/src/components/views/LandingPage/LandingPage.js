import React,{useEffect} from 'react';
import axios from 'axios';
// import { withRouter } from 'react-router-dom';

function LandingPage(props) {

  const onClickHandler = () => {
    axios.get('api/users/logout')
    .then(response => {
      if(response.data.success)
        props.history.push('/login');
      else
        console.log('로그아웃 하는데 실패했습니다.');
    })
  }

  axios.get('api/hello')
  .then(console.log);
  
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'
    , width: '100%', height: '100vh'
    }}>
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  )
}

export default LandingPage
