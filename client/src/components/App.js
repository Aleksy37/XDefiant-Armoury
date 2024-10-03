import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WeaponProvider } from './WeaponContext';
import WeaponBuilderLayout from './WeaponBuilderLayout';
import BuildsPage from './BuildsPage';
import EditBuildPage from './EditBuildPage';
import styled from 'styled-components';

const AppContainer = styled.div`
  background-color: #191923;
  min-height: 100vh;
  color: #FBFEF9;
  font-family: 'PT Sans', sans-serif;
`;

const Nav = styled.nav`
  background-color: #0E79B2;
  padding: 10px 0;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0 15px;
`;

const NavLink = styled(Link)`
  color: #FBFEF9;
  text-decoration: none;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Navigation = () => (
  <Nav>
    <NavList>
      <NavItem><NavLink to="/">Home</NavLink></NavItem>
      <NavItem><NavLink to="/builds">Builds</NavLink></NavItem>
    </NavList>
  </Nav>
);

const App = () => {
  return (
    <Router>
      <WeaponProvider>
        <AppContainer>
          <Navigation />
          <Routes>
            <Route path="/" element={<WeaponBuilderLayout />} />
            <Route path="/builds" element={<BuildsPage />} />
            <Route path="/weapon-builder" element={<WeaponBuilderLayout />} />
            <Route path='/edit-build/:id' element={<EditBuildPage />} />
          </Routes>
        </AppContainer>
      </WeaponProvider>
    </Router>
  );
};

export default App;