import React, { useState, useEffect } from 'react';
import { useWeapon } from './WeaponContext';
import styled from 'styled-components';

const BuilderContainer = styled.div`
  background-color: #191923;
  color: #FBFEF9;
  padding: 15px;
  border-radius: 8px;
  font-family: 'PT Sans', sans-serif;
  border: 1px solid #0E79B2;
`;

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  margin-bottom: 15px;
  font-size: 1.2em;
`;

const BuildInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const AttachmentCount = styled.p`
  font-weight: bold;
  margin: 0;
`;

const BuildNameInput = styled.input`
  padding: 5px;
  border: 2px solid #0E79B2;
  border-radius: 4px;
  background-color: #FBFEF9;
  color: #191923;
  font-family: 'PT Sans', sans-serif;
  width: 150px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(14, 121, 178, 0.5);
  }
`;

const SaveButton = styled.button`
  padding: 5px 10px;
  background-color: #0E79B2;
  color: #FBFEF9;
  border: none;
  border-radius: 4px;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0A5A8A;
  }

  &:disabled {
    background-color: #6C757D;
    cursor: not-allowed;
  }
`;

const AttachmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
`;

const AttachmentSlot = styled.div`
  display: flex;
  flex-direction: column;
`;

const SlotTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  margin: 0 0 5px 0;
  font-size: 0.9em;
`;

const AttachmentSelect = styled.select`
  padding: 5px;
  border: 2px solid #0E79B2;
  border-radius: 4px;
  background-color: #FBFEF9;
  color: #191923;
  font-family: 'PT Sans', sans-serif;
  font-size: 0.9em;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(14, 121, 178, 0.5);
  }

  &:disabled {
    background-color: #6C757D;
    cursor: not-allowed;
  }
`;

const WeaponBuilder = () => {
  const { selectedWeapon, addAttachment, removeAttachment } = useWeapon();
  const [availableAttachments, setAvailableAttachments] = useState({});
  const [selectedAttachments, setSelectedAttachments] = useState({});
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [buildName, setBuildName] = useState('');

  useEffect(() => {
    if (selectedWeapon && selectedWeapon.attachments) {
      fetchAttachments(selectedWeapon.attachments);
    }
  }, [selectedWeapon]);

  const fetchAttachments = async (attachmentIds) => {
    try {
      const queryParams = new URLSearchParams({ attachmentIds: JSON.stringify(attachmentIds) });
      const response = await fetch(`/api/attachments?${queryParams}`);
      const data = await response.json();
      
      if (data.status === 200) {
        setAvailableAttachments(data.groupedAttachments);
        setSelectedAttachments({});
        setAttachmentCount(0);
      } else {
        console.error('Error fetching attachments:', data.message);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  };

  const handleAttachmentChange = (slot, attachmentId) => {
    if (selectedAttachments[slot]) {
      removeAttachment(selectedAttachments[slot]._id);
      setAttachmentCount(prevCount => prevCount - 1);
    }

    if (attachmentId) {
      if (attachmentCount >= 5) {
        alert('You can only select up to 5 attachments.');
        return;
      }
      const newAttachment = availableAttachments[slot].find(a => a._id === attachmentId);
      addAttachment(newAttachment);
      setSelectedAttachments(prev => ({ ...prev, [slot]: newAttachment }));
      setAttachmentCount(prevCount => prevCount + 1);
    } else {
      setSelectedAttachments(prev => {
        const newState = { ...prev };
        delete newState[slot];
        return newState;
      });
    }
  };

  const handleSaveBuild = async () => {
    if (!buildName.trim()) {
      alert('Please enter a name for your build.');
      return;
    }

    const buildData = {
      name: buildName,
      weaponName: selectedWeapon.name,
      weaponClass: selectedWeapon.type,
      weaponId: selectedWeapon._id,
      attachments: Object.values(selectedAttachments).map(a => a._id),
    };

    try {
      const response = await fetch('/api/saveBuild', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildData),
      });

      const data = await response.json();

      if (data.status === 200) {
        alert('Build saved successfully!');
        setBuildName('');
      } else {
        alert(`Error saving build: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving build:', error);
      alert('An error occurred while saving the build. Please try again.');
    }
  };

  if (!selectedWeapon) {
    return <BuilderContainer>Select a weapon to view attachments</BuilderContainer>;
  }

  return (
    <BuilderContainer>
      <Title>Customize {selectedWeapon.name}</Title>
      <BuildInfo>
        <AttachmentCount>Selected: {attachmentCount}/5</AttachmentCount>
        <BuildNameInput
          type="text"
          value={buildName}
          onChange={(e) => setBuildName(e.target.value)}
          placeholder="Build name"
        />
        <SaveButton onClick={handleSaveBuild} disabled={attachmentCount === 0 || !buildName.trim()}>
          Save Build
        </SaveButton>
      </BuildInfo>
      <AttachmentGrid>
        {Object.entries(availableAttachments).map(([slot, attachments]) => (
          <AttachmentSlot key={slot}>
            <SlotTitle>{slot}</SlotTitle>
            <AttachmentSelect
              value={selectedAttachments[slot]?._id || ''}
              onChange={(e) => handleAttachmentChange(slot, e.target.value)}
              disabled={attachmentCount >= 5 && !selectedAttachments[slot]}
            >
              <option value="">None</option>
              {attachments.map(attachment => (
                <option key={attachment._id} value={attachment._id}>
                  {attachment.name}
                </option>
              ))}
            </AttachmentSelect>
          </AttachmentSlot>
        ))}
      </AttachmentGrid>
    </BuilderContainer>
  );
};

export default WeaponBuilder;