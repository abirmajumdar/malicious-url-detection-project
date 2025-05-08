import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config/Base';
import axios from 'axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [searches, setSearches] = useState([]);
  const [stats, setStats] = useState({ phishing: 0, legitimate: 0 });

  useEffect(() => {
    // Fetch user data and searches (this can be extended to fetch from your backend)
    const user = localStorage.getItem('User');
    if (!user) {
      navigate('/login');
    }

    // Assuming you have an API endpoint to fetch user searches
    axios.get(`${BASE_URL}/api/user/searches`)
      .then((response) => {
        setSearches(response.data.searches);
        // Calculate stats for phishing and legitimate URLs
        let phishingCount = 0;
        let legitimateCount = 0;
        response.data.searches.forEach(search => {
          if (search.result === 'Phishing') phishingCount++;
          if (search.result === 'Legitimate') legitimateCount++;
        });
        setStats({ phishing: phishingCount, legitimate: legitimateCount });
      })
      .catch((err) => {
        console.log("Error fetching searches", err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('User');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">URL Detection Stats</h2>
            <div className="text-lg text-gray-800 mb-3">Phishing URLs: {stats.phishing}</div>
            <div className="text-lg text-gray-800 mb-3">Legitimate URLs: {stats.legitimate}</div>
          </div>

          {/* Recent Searches Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Recent Searches</h2>
            {searches.length > 0 ? (
              <ul className="space-y-4">
                {searches.slice(0, 5).map((search, index) => (
                  <li key={index} className="border-b pb-3">
                    <div className="font-semibold">{search.url}</div>
                    <div className={`text-sm ${search.result === 'Phishing' ? 'text-red-600' : 'text-green-600'}`}>
                      {search.result} ({search.confidence}% confidence)
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No searches yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
