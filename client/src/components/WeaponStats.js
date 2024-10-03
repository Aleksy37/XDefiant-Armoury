import React, { useState, useMemo } from 'react';
import { useWeapon } from './WeaponContext';
import styled from 'styled-components';

const StatsContainer = styled.div`
  background-color: #191923;
  color: #FBFEF9;
  padding: 15px;
  border-radius: 8px;
  font-family: 'PT Sans', sans-serif;
  border: 1px solid #0E79B2;
  overflow-y: auto;
  max-height: calc(100vh - 300px); // Adjust based on your needs
`;

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  margin-bottom: 15px;
  font-size: 1.2em;
`;

const StatSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  margin-bottom: 10px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const StatItem = styled.p`
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const StatLabel = styled.span`
  font-weight: bold;
`;

const StatValue = styled.span`
  color: #0E79B2;
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
`;

const RadioLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  font-family: 'PT Sans', sans-serif;
`;

const RadioInput = styled.input`
  display: none;
`;

const IconWrapper = styled.span`
  font-family: 'Material Symbols Outlined';
  font-size: 36px;
  color: ${props => props.checked ? '#0E79B2' : '#FBFEF9'};
  background-color: ${props => props.checked ? '#FBFEF9' : '#0E79B2'};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  transition: all 0.3s ease;
`;

const ZoneText = styled.span`
  color: ${props => props.checked ? '#0E79B2' : '#FBFEF9'};
  font-weight: ${props => props.checked ? 'bold' : 'normal'};
  transition: all 0.3s ease;
`;

const DamageRangeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
`;

const DamageRangeItem = styled.div`
  background-color: #0E79B2;
  color: #FBFEF9;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
`;

const WeaponStats = () => {
  const { getCurrentWeapon } = useWeapon();
  const [selectedZone, setSelectedZone] = useState('chest');

  const currentStats = useMemo(() => {
    const weapon = getCurrentWeapon();
    if (!weapon) return null;

    return {
      ...weapon,
      zoneMultipliers: {
        stomach: weapon.multipliers?.stomach || 1,
        chest: weapon.multipliers?.chest || 1,
        head: weapon.multipliers?.head || 1
      }
    };
  }, [getCurrentWeapon]);

  if (!currentStats) {
    return <StatsContainer>Choose a weapon to view stats</StatsContainer>;
  }

  const handleZoneChange = (event) => {
    setSelectedZone(event.target.value);
  };

  const calculateDamage = (baseDamage) => {
    let damage = baseDamage * currentStats.zoneMultipliers[selectedZone];
    if (currentStats.type.toLowerCase() === 'shotgun' && currentStats.pellets) {
      damage *= currentStats.pellets;
    }
    return Math.round(damage);
  };

  const zoneIcons = {
    head: 'skull',
    chest: 'rib_cage',
    stomach: 'accessibility'
  };

  return (
    <StatsContainer>
      <Title>{currentStats.name} Stats</Title>
      
      <StatSection>
        <StatGrid>
          <StatItem><StatLabel>Type:</StatLabel> <StatValue>{currentStats.type}</StatValue></StatItem>
          <StatItem><StatLabel>Rate of Fire:</StatLabel> <StatValue>{Math.round(currentStats.rateOfFire)} RPM</StatValue></StatItem>
          <StatItem><StatLabel>ADS Time:</StatLabel> <StatValue>{Math.round(currentStats.adsTime)} ms</StatValue></StatItem>
          <StatItem><StatLabel>Sprint to Fire Time:</StatLabel> <StatValue>{Math.round(currentStats.sprintToFire)} ms</StatValue></StatItem>
          <StatItem><StatLabel>Move Speed:</StatLabel> <StatValue>{currentStats.moveSpeed.toFixed(2)}</StatValue></StatItem>
          <StatItem><StatLabel>ADS Move Speed:</StatLabel> <StatValue>{currentStats.adsMoveSpeed.toFixed(2)}</StatValue></StatItem>
          <StatItem><StatLabel>Magazine Size:</StatLabel> <StatValue>{currentStats.magSize}</StatValue></StatItem>
          <StatItem><StatLabel>Reload Time:</StatLabel> <StatValue>{Math.round(currentStats.reloadTime)} ms</StatValue></StatItem>
        </StatGrid>
      </StatSection>
      
      <StatSection>
        <SectionTitle>Recoil</SectionTitle>
        <StatGrid>
          <StatItem><StatLabel>Vertical:</StatLabel> <StatValue>{currentStats.recoil.vertical.toFixed(2)}</StatValue></StatItem>
          <StatItem><StatLabel>Horizontal:</StatLabel> <StatValue>{currentStats.recoil.horizontal.toFixed(2)}</StatValue></StatItem>
          <StatItem><StatLabel>Recovery:</StatLabel> <StatValue>{currentStats.recoil.recovery.toFixed(2)}</StatValue></StatItem>
        </StatGrid>
      </StatSection>
      
      <StatSection>
        <StatGrid>
          <StatItem><StatLabel>Aim Stability:</StatLabel> <StatValue>{currentStats.aimStability.toFixed(2)}</StatValue></StatItem>
          <StatItem><StatLabel>Hip Fire Accuracy:</StatLabel> <StatValue>{currentStats.hipfire.toFixed(2)}</StatValue></StatItem>
          <StatItem><StatLabel>Minimap Visibility:</StatLabel> <StatValue>{currentStats.minimapVisibilityDuration.toFixed(2)} s</StatValue></StatItem>
          <StatItem><StatLabel>Penetration:</StatLabel> <StatValue>{currentStats.penetration}</StatValue></StatItem>
        </StatGrid>
      </StatSection>
      
      <StatSection>
        <SectionTitle>Damage Zones</SectionTitle>
        <RadioGroup>
          {Object.entries(currentStats.zoneMultipliers).map(([zone, multiplier]) => (
            <RadioLabel key={zone}>
              <RadioInput
                type="radio"
                value={zone}
                checked={selectedZone === zone}
                onChange={handleZoneChange}
              />
              <IconWrapper checked={selectedZone === zone}>
                {zoneIcons[zone]}
              </IconWrapper>
              <ZoneText checked={selectedZone === zone}>
                {zone.charAt(0).toUpperCase() + zone.slice(1)}
              </ZoneText>
              <ZoneText checked={selectedZone === zone}>
                x{multiplier.toFixed(2)}
              </ZoneText>
            </RadioLabel>
          ))}
        </RadioGroup>
      </StatSection>
      
      <StatSection>
        <SectionTitle>Damage Ranges</SectionTitle>
        <DamageRangeGrid>
          {currentStats.damageRanges.map((range, index) => (
            <DamageRangeItem key={index}>
              <div>{range.range}m</div>
              <div>{calculateDamage(range.damage)} damage</div>
            </DamageRangeItem>
          ))}
        </DamageRangeGrid>
      </StatSection>
    </StatsContainer>
  );
};

export default WeaponStats;