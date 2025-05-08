import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import BASE_URL from '../config/Base';

function URLInputForm({ setResult, setLoading }) {
  const [url, setUrl] = useState('');
  const [model, setModel] = useState('Random Forest');
  const [submitting, setSubmitting] = useState(false);
  const [urlValid, setUrlValid] = useState(true);
  const [predictionConfidence, setPredictionConfidence] = useState(80);
  const [lengthWarning, setLengthWarning] = useState('');
  const [isDomainPhishing, setIsDomainPhishing] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate URL format
    if (!url) {
      setUrlValid(false);
      return;
    } else {
      setUrlValid(true);
    }

    setSubmitting(true);
    setLoading(true);

    try {
      // Call the prediction API
      const res = await axios.post('https://malecious-url-detection.onrender.com/predict', { url });
    
      // Assuming the response contains prediction data and confidence
      setResult({ ...res.data, model });
    
      // Get the logged-in user's data from localStorage
      const loggedUserData = localStorage.getItem("User");
    
      if (loggedUserData) {
        // Parse user data
        const parsedUser = JSON.parse(loggedUserData);
        const email = parsedUser.email;
        console.log(email + " testing");
    
        // Send the user data and prediction results to the backend
        const response = await axios.post(`${BASE_URL}/auth/saveuser`, {
          email,
          url,
          prediction_rf: res.data.prediction_rf,
          confidence_rf: res.data.confidence_rf
        });
    
        if (response.status === 200) {
          console.log("User search saved successfully");
        }
      }
    
      // Redirect to the result page
      navigate('/result');
    } catch (error) {
      console.error(error);
      alert("Error predicting URL!");
    }

    setSubmitting(false);
    setLoading(false);
  };

  // Helper to check URL validity
  const isValidUrl = (url) => {
    const pattern = /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/[\w\-\.~!*'()]*\?[^\s]*)?$/i;
    return pattern.test(url);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    // Show warning for long URLs
    if (newUrl.length > 100) {
      setLengthWarning('Warning: URL length is quite long and could be suspicious.');
    } else {
      setLengthWarning('');
    }

    // Check if the domain is flagged as phishing (dummy example)
    const domain = newUrl.split('/')[2]; // Get domain from the URL
    const phishingDomains = ['example.com', 'phishingsite.com']; // Example list of flagged domains
    setIsDomainPhishing(phishingDomains.includes(domain));
  };

  return (
    <form onSubmit={handleSubmit} className="md:mt-10 w-full max-w-2xl mx-auto space-y-6 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">🔗 URL Phishing Detection</h2>

      {/* URL Input Section */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="url" className="font-semibold text-gray-700">Enter URL:</label>
        <input
          id="url"
          type="text"
          placeholder="e.g., https://example.com"
          value={url}
          onChange={handleUrlChange}
          className={`border ${urlValid ? 'border-gray-300' : 'border-red-500'} rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none`}
          required
        />
        {!urlValid && <p className="text-red-500 text-sm">Please enter a valid URL.</p>}
        {lengthWarning && <p className="text-yellow-500 text-sm">{lengthWarning}</p>}
        {isDomainPhishing && <p className="text-red-500 text-sm">This domain is flagged as suspicious.</p>}
      </div>

      {/* Prediction Model Section */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="model" className="font-semibold text-gray-700">Select Model:</label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option>Random Forest</option>
          <option>SVM</option>
          <option>Logistic Regression</option>
          <option>Gradient Boosting</option>
          <option>XGBoost</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-8 py-3 rounded-lg w-full disabled:opacity-70"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Predicting...
            </>
          ) : (
            'Predict'
          )}
        </button>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => {
            setUrl('');
            setModel('Random Forest');
            setPredictionConfidence(80);
            setLengthWarning('');
            setIsDomainPhishing(false);
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          Reset Form
        </button>
      </div>

      {/* Back to Login as a Paragraph Link */}
      <div className="flex justify-center mt-4">
        <p
          onClick={() => navigate('/')}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </div>
    </form>
  );
}

export default URLInputForm;
