"use client";

import { useState, useEffect } from "react";

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
    if (storedUrn) {
      setUrn(storedUrn);
      fetchCollectionData(storedUrn)

    } else {
      setShowForm(true);
      
    }
  }, []);

  const fetchCollectionData = async (storedUrn) => {
    const response = await fetch(`/api/getCollection?urn=${storedUrn}`);
    const data = await response.json()
    console.log(data)
    setCollectionData(data)
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Make API call
    const urn = await makeApiCall(postcode, address);
    if (urn) {
      // Save the urn to local storage
      localStorage.setItem('urn', urn); 
      setUrn(urn);
      setShowForm(false);
    } else {
      console.error("API call failed or returned null");
      // Handle error or display a message to the user
    }
  };

  return (
    <div>
      {urn ? (
        <div>
          <p>URN found in local storage: {urn}</p> {/* Changed variable name to 'url' */}
          <p>Collection Type: {collectionData.collectionType}</p>
          <p>Collection Date: {collectionData.collectionDate}</p>
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
    </div>
  );
}
