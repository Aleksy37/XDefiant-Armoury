import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: #191923;
  color: #FBFEF9;
  padding: 20px;
  font-family: 'PT Sans', sans-serif;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  text-align: center;
  margin-bottom: 20px;
`;

const WeaponClassSection = styled.div`
  margin-bottom: 20px;
`;

const WeaponClassTitle = styled.h2`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const WeaponSection = styled.div`
  margin-left: 20px;
  margin-bottom: 10px;
`;

const WeaponTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  color: #FBFEF9;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BuildsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-left: 20px;
`;

const BuildItem = styled.div`
  background-color: #2a2a35;
  border-radius: 5px;
  padding: 10px;
  width: 250px;
  height: 300px;
  overflow-y: auto;
`;

const BuildName = styled.h4`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  margin-bottom: 5px;
`;

const AttachmentsList = styled.ul`
  list-style-type: none;
  padding-left: 10px;
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-family: 'PT Sans', sans-serif;
  transition: background-color 0.3s ease;
`;

const EditButton = styled(Button)`
  background-color: #0E79B2;
  color: #FBFEF9;
  
  &:hover {
    background-color: #0A5A8A;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #B21E0E;
  color: #FBFEF9;
  
  &:hover {
    background-color: #8A180A;
  }
`;

const BuildsPage = () => {
  const [groupedBuilds, setGroupedBuilds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [expandedWeapons, setExpandedWeapons] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      const response = await fetch('/api/builds');
      if (!response.ok) {
        throw new Error('Failed to fetch builds');
      }
      const data = await response.json();
      
      const grouped = data.builds.reduce((acc, build) => {
        const { weaponClass, weapon } = build;
        if (!acc[weaponClass]) {
          acc[weaponClass] = {};
        }
        if (!acc[weaponClass][weapon.name]) {
          acc[weaponClass][weapon.name] = [];
        }
        acc[weaponClass][weapon.name].push(build);
        return acc;
      }, {});

      setGroupedBuilds(grouped);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEdit = (buildId) => {
    navigate(`/edit-build/${buildId}`);
  };

  const handleDelete = async (buildId) => {
    if (window.confirm('Are you sure you want to delete this build?')) {
      try {
        const response = await fetch(`/api/builds/${buildId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete build');
        }
        fetchBuilds();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const toggleWeaponClass = (weaponClass) => {
    setExpandedClasses(prev => ({
      ...prev,
      [weaponClass]: !prev[weaponClass]
    }));
  };

  const toggleWeapon = (weaponClass, weaponName) => {
    setExpandedWeapons(prev => ({
      ...prev,
      [`${weaponClass}-${weaponName}`]: !prev[`${weaponClass}-${weaponName}`]
    }));
  };

  if (loading) return <PageContainer>Loading builds...</PageContainer>;
  if (error) return <PageContainer>Error: {error}</PageContainer>;

  return (
    <PageContainer>
      <Title>Weapon Builds</Title>
      {Object.keys(groupedBuilds).length === 0 ? (
        <p>No builds found. Create your first build!</p>
      ) : (
        Object.entries(groupedBuilds).map(([weaponClass, weapons]) => (
          <WeaponClassSection key={weaponClass}>
            <WeaponClassTitle onClick={() => toggleWeaponClass(weaponClass)}>
              {expandedClasses[weaponClass] ? '▼' : '▶'} {weaponClass}
            </WeaponClassTitle>
            {expandedClasses[weaponClass] && Object.entries(weapons).map(([weaponName, builds]) => (
              <WeaponSection key={weaponName}>
                <WeaponTitle onClick={() => toggleWeapon(weaponClass, weaponName)}>
                  {expandedWeapons[`${weaponClass}-${weaponName}`] ? '▼' : '▶'} {weaponName}
                </WeaponTitle>
                {expandedWeapons[`${weaponClass}-${weaponName}`] && (
                  <BuildsList>
                    {builds.map((build) => (
                      <BuildItem key={build._id}>
                        <BuildName>{build.name}</BuildName>
                        <h5>Attachments:</h5>
                        <AttachmentsList>
                          {Array.isArray(build.attachments) && build.attachments.map((attachment, index) => (
                            <li key={index}>
                              {typeof attachment === 'object' && attachment !== null
                                ? `${attachment.slot || 'Unknown Slot'}: ${attachment.name || 'Unknown Name'}`
                                : `Attachment ID: ${attachment}`
                              }
                            </li>
                          ))}
                        </AttachmentsList>
                        <ButtonGroup>
                          <EditButton onClick={() => handleEdit(build._id)}>Edit</EditButton>
                          <DeleteButton onClick={() => handleDelete(build._id)}>Delete</DeleteButton>
                        </ButtonGroup>
                      </BuildItem>
                    ))}
                  </BuildsList>
                )}
              </WeaponSection>
            ))}
          </WeaponClassSection>
        ))
      )}
    </PageContainer>
  );
};

export default BuildsPage;