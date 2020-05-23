import styled from 'styled-components';
import React from 'react';

const StyledHeader = styled.div`
  background-color: black;
  display: flex;
  color: white;
`;

const Header = () => {
  return (
    <StyledHeader>
      <h1>polyrytm</h1>
    </StyledHeader>
  );
};

export default Header;
