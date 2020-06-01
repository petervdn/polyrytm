import React from 'react';
import styled from 'styled-components';
import { paths } from '../../data/paths';
import { Link } from 'react-router-dom';

const Menu = styled.div`
  background-color: bisque;
  display: flex;
`;

const MenuItem = styled.div`
  margin-right: 10px;
`;

const ProfileMenu = () => {
  const items = [
    { label: 'user details', path: paths.userDetails },
    { label: 'samples', path: paths.samples },
  ];
  return (
    <Menu>
      {items.map((item) => (
        <MenuItem key={item.label}>
          <Link to={item.path}>{item.label}</Link>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ProfileMenu;
