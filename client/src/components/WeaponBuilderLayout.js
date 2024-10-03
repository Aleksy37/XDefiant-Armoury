import React from 'react'
import styled from 'styled-components'
import { WeaponSelector } from './WeaponSelector'
import WeaponBuilder from './WeaponBuilder'
import WeaponStats from './WeaponStats'

const LayoutContainer = styled.div`
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    gap: 20px;
    background-color: #191923;
    color: #fbfef9;
    min-height: 100vh;
`;

const LeftColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const RightColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const WeaponBuilderLayout = () => {
  return (
    <LayoutContainer>
        <LeftColumn>
            <WeaponSelector />
            <WeaponStats />
        </LeftColumn>
        <RightColumn>
            <WeaponBuilder />
        </RightColumn>
    </LayoutContainer>
  )
}

export default WeaponBuilderLayout;