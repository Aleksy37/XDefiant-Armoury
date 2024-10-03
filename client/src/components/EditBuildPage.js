import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: #191923;
  color: #FBFEF9;
  padding: 20px;
  min-height: 100vh;
  font-family: 'PT Sans', sans-serif;
`;

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  color: #0E79B2;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background-color: #2a2a35;
  padding: 20px;
  border-radius: 8px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #0E79B2;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 2px solid #0E79B2;
  border-radius: 4px;
  background-color: #191923;
  color: #FBFEF9;
  font-family: 'PT Sans', sans-serif;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(14, 121, 178, 0.5);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 2px solid #0E79B2;
  border-radius: 4px;
  background-color: #191923;
  color: #FBFEF9;
  font-family: 'PT Sans', sans-serif;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(14, 121, 178, 0.5);
  }
`;

const Button = styled.button`
  background-color: #0E79B2;
  color: #FBFEF9;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0A5A8A;
  }
`;

const ErrorMessage = styled.div`
  color: #FF4136;
  margin-bottom: 15px;
  text-align: center;
`;

const EditBuildPage = () => {
  const [build, setBuild] = useState(null);
  const [name, setName] = useState('');
  const [attachments, setAttachments] = useState({});
  const [availableAttachments, setAvailableAttachments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchBuildDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/builds/${id}/edit`);
      if (!response.ok) {
        throw new Error('Failed to fetch build details');
      }
      const { data } = await response.json();
      setBuild(data.build);
      setName(data.build.name);
      
      const currentAttachments = data.build.attachments.reduce((acc, att) => {
        acc[att.slot] = att._id;
        return acc;
      }, {});
      setAttachments(currentAttachments);
      
      setAvailableAttachments(data.availableAttachments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBuildDetails();
  }, [fetchBuildDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/builds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attachments: Object.values(attachments) }),
      });
      if (!response.ok) throw new Error('Failed to update build');
      navigate('/builds');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (!build) return <PageContainer>Build not found</PageContainer>;

  return (
    <PageContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Edit Build: {build.weapon.name}</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <InputGroup>
          <Label htmlFor="buildName">Build Name</Label>
          <Input
            id="buildName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter build name"
            required
          />
        </InputGroup>
        {Object.entries(availableAttachments).map(([slot, options]) => (
          <InputGroup key={slot}>
            <Label htmlFor={slot}>{slot}</Label>
            <Select
              id={slot}
              value={attachments[slot] || ''}
              onChange={(e) => setAttachments(prev => ({ ...prev, [slot]: e.target.value }))}
            >
              <option value="">None</option>
              {options.map(att => (
                <option key={att._id} value={att._id}>{att.name}</option>
              ))}
            </Select>
          </InputGroup>
        ))}
        <Button type="submit">Save Changes</Button>
      </Form>
    </PageContainer>
  );
};

export default EditBuildPage;