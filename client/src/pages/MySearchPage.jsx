import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config/Base';

const MySearches = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const user = localStorage.getItem('User');
        if (!user) {
          navigate('/login'); // Redirect if not logged in
          return;
        }

        const parsedUser = JSON.parse(user);
        const email = parsedUser.email;

        const response = await axios.post(`${BASE_URL}/url/showurl`, { email });

        setSearches(response.data); // Set the received searches array
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch searches');
        setLoading(false);
      }
    };

    fetchSearches();
  }, [navigate]);

  if (loading) return <div>Loading your searches...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Searches</h2>
      {searches.length === 0 ? (
        <p>No searches found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searches.map((search) => (
            <div key={search._id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <p><span className="font-semibold">URL:</span> {search.url}</p>
              <p><span className="font-semibold">Result:</span> {search.result}</p>
              <p><span className="font-semibold">Confidence:</span> {search.confidence}</p>
              <p className="text-gray-500 text-sm">
                {new Date(search.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySearches;
