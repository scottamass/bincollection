"use client"
import { useState, useEffect } from "react";
//import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container,Row,Col } from "react-bootstrap";
import Infocard from "./components/Infocard";

// Example function to make API requests
const makeApiCall = async (postcode, address) => {
  try {
    // Make API call here, replace this with your actual API endpoint
    const response = await fetch(`/api/findaddress?pc=${postcode}&num=${address}`);
    const data = await response.json();
    console.log(data)
    return data.uprn; // Assuming the response contains urn
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};

export default function Home() {
  const [urn, setUrn] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    const storedUrn = localStorage.getItem('urn');
    const storedPc = localStorage.getItem('pc') 
    if (storedUrn) {
      setUrn(storedUrn);
      fetchCollectionData(storedUrn)
      setPostcode(storedPc)
    } else {
      setShowForm(true);
    }
  }, []);

  const fetchCollectionData = async (storedUrn) => {
    try {
      const response = await fetch(`/api/getCollection?urn=${storedUrn}`);
      const data = await response.json();
      console.log(data)
    //   setCollectionData(data);
    setCollectionData({
        ...data,
        collectionDate: formatDate(data.collectionDate) // Format the collection date
      });
    } catch (error) {
      console.error("Error fetching collection data:", error);
      setCollectionData(null); // Reset collectionData if an error occurs
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-GB', options);

    // Extract the day part from the formatted date string
    const day = date.getDate();
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
    
    // Replace the day part with the day + suffix
    const dayWithSuffix = `${day}${suffix}`;
    const formattedDateWithSuffix = formattedDate.replace(day.toString(), dayWithSuffix);

    return formattedDateWithSuffix;
};
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const urn = await makeApiCall(postcode, address);
    if (urn) {
      localStorage.setItem('urn', urn);
      localStorage.setItem('pc',postcode)
      setUrn(urn);
      setPostcode(postcode)
      setShowForm(false);
      fetchCollectionData(urn); // Fetch collection data after saving urn
    } else {
      console.error("API call failed or returned null");
      // Handle error or display a message to the user
    }
  };

  return (
    <div>
            <Container fluid>
      <Row className="d-flex justify-content-center pt-3 min-vh-100">
        <Col md={6}>
        <Card >
        <Card.Body>
      {urn && collectionData ? (
        <div className="center-text">
          {/* <p>URN found in local storage: {urn}</p> */}
          <h2>Your Next Collection: {collectionData.collectionDate}</h2>
          <h3>Collection Type: {collectionData.collectionType}</h3>
          <p>postcode found in local storage: {postcode}</p>
          <button onClick={() => setShowForm(true)}>Change Address</button>
        </div>
      ) : urn ? (
        <div>
          <p>URN found in local storage: {urn}</p>
          <button onClick={() => setShowForm(true)}>Change Address</button>
        </div>
      ) : null}

      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="postcode">Postcode:</label>
            <input
              type="text"
              id="postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <button type="submit">Save</button>
        </form>
      )}
      </Card.Body>
      </Card>
    {/* <Infocard></Infocard> */}
      </Col>
    </Row>
    </Container>
    </div>
  );
}
