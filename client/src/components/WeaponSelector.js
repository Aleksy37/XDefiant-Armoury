import React, { useEffect, useState } from 'react';
import { useWeapon } from './WeaponContext';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  background-color: #191923;
  color: #FBFEF9;
  padding: 15px;
  border-radius: 8px;
  font-family: 'PT Sans', sans-serif;
  border: 1px solid #0e79b2;
`;

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  margin-bottom: 15px;
  font-size: 1.2em;
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  background-color: #FBFEF9;
  color: #191923;
  border: 2px solid #0E79B2;
  border-radius: 4px;
  font-family: 'PT Sans', sans-serif;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0E79B2;
    color: #FBFEF9;
  }

  &:hover .icon {
    color: #FBFEF9;
  }
`;

const Icon = styled.span`
  font-family: 'Material Symbols Outlined';
  font-size: 24px;
  color: #0E79B2;
  transition: color 0.3s ease;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #FBFEF9;
  border: 2px solid #0E79B2;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.div`
  padding: 10px 16px;
  font-family: 'PT Sans', sans-serif;
  color: #191923;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0E79B2;
    color: #FBFEF9;
  }
`;

const WeaponType = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  color: #0E79B2;
  padding: 8px 16px;
  background-color: #191923;
`;

const LoadingMessage = styled.div`
  font-family: 'PT Sans', sans-serif;
  color: #0E79B2;
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  font-family: 'PT Sans', sans-serif;
  color: #FF4136;
  text-align: center;
  padding: 20px;
`;

const WeaponSelector = () => {
    const [weapons, setWeapons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedWeapon, setSelectedWeapon } = useWeapon();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchWeapons = async () => {
            try {
                setLoading(true);
                const response = await fetch("api/weapons");

                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 200 && Array.isArray(data.allWeapons)) {
                    setWeapons(data.allWeapons);
                } else {
                    throw new Error('Invalid data structure from server')
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        };
        fetchWeapons();
    }, []);

    const weaponTypes = [...new Set(weapons.map(weapon => weapon.type))];

    const handleWeaponSelect = (weapon) => {
        setSelectedWeapon(weapon);
        setIsOpen(false);
        console.log('Selected weapon:', weapon);
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    if (loading) return <LoadingMessage>Loading Arsenal...</LoadingMessage>
    if (error) return <ErrorMessage>Error: {error}</ErrorMessage>

    return (
        <SelectorContainer>
            <Title>Select Your Weapon</Title>
            <DropdownContainer>
                <DropdownHeader onClick={toggleDropdown}>
                    {selectedWeapon ? selectedWeapon.name : 'Choose a weapon'}
                    <Icon className="icon">keyboard_arrow_down</Icon>
                </DropdownHeader>
                <DropdownList isOpen={isOpen}>
                    {weaponTypes.map(type => (
                        <React.Fragment key={type}>
                            <WeaponType>{type}</WeaponType>
                            {weapons
                                .filter(weapon => weapon.type === type)
                                .map(weapon => (
                                    <DropdownItem
                                        key={weapon.name}
                                        onClick={() => handleWeaponSelect(weapon)}
                                    >
                                        {weapon.name}
                                    </DropdownItem>
                                ))}
                        </React.Fragment>
                    ))}
                </DropdownList>
            </DropdownContainer>
        </SelectorContainer>
    )
}

export { WeaponSelector };