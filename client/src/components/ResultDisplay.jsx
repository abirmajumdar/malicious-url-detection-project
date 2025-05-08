import React, { useEffect, useState, useRef } from 'react';
import { ShieldCheck, AlertTriangle, Info, Clock, Flame, Shield } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const formatConfidence = (confidence) => {
    if (confidence === null || confidence === undefined) return "Not Available";
    if (typeof confidence === 'string' && confidence.includes('%')) return confidence;
    if (typeof confidence === 'number') return `${(confidence * 100).toFixed(2)}%`;
    return "Invalid Score";
};

const getConfidencePercentage = (confidence) => {
    if (!confidence) return 0;
    if (typeof confidence === 'number') return (confidence * 100);
    return parseFloat(confidence.replace('%', '')) || 0;
};

const extractKeywords = (explanation) => {
    if (!explanation || typeof explanation !== 'string') return [];
    const keywords = [];
    if (explanation.toLowerCase().includes('ip address')) keywords.push('IP Address Found');
    if (explanation.toLowerCase().includes('shortened url')) keywords.push('Shortened URL Detected');
    if (explanation.toLowerCase().includes('suspicious word')) keywords.push('Suspicious Words');
    if (explanation.toLowerCase().includes('https')) keywords.push('HTTPS Present');
    if (explanation.toLowerCase().includes('punycode')) keywords.push('Punycode Detected');
    if (explanation.toLowerCase().includes('port')) keywords.push('Unusual Port');
    if (explanation.toLowerCase().includes('tld')) keywords.push('Suspicious TLD');
    if (explanation.toLowerCase().includes('redirection')) keywords.push('Multiple Redirections');
    return keywords;
};

function ResultDisplay({ result }) {
    const [timestamp, setTimestamp] = useState('');
    const reportRef = useRef(null);
    const navigate = useNavigate();
    const [screenshotUrl, setScreenshotUrl] = useState('');

    useEffect(() => {
        if (result) {
            const now = new Date();
            setTimestamp(now.toLocaleString());

            // Optional: Example to get website screenshot (You should replace this with your real screenshot API call)
            if (result.url) {
                setScreenshotUrl(`https://image.thum.io/get/width/800/crop/800/${result.url}`);
            }
        }
    }, [result]);

    if (!result) return null;

    const {
        model, result_str, confidence_rf, confidence_svm,
        prediction_rf, prediction_svm, prediction_lr, prediction_gb, prediction_xgb,
        confidence_lr, confidence_gb, confidence_xgb,
        explanation, google_results, risk_level,
    } = result;

    const selectedPrediction =
        model === 'Random Forest' ? prediction_rf :
        model === 'SVM' ? prediction_svm :
        model === 'Logistic Regression' ? prediction_lr :
        model === 'XGBoost' ? prediction_xgb :
        model === 'Gradient Boosting' ? prediction_gb :
        'Unknown Prediction';

    const selectedConfidence =
        model === 'Random Forest' ? confidence_rf :
        model === 'SVM' ? confidence_svm :
        model === 'Logistic Regression' ? confidence_lr :
        model === 'XGBoost' ? confidence_xgb :
        model === 'Gradient Boosting' ? confidence_gb :
        null;

    const confidencePercent = getConfidencePercentage(selectedConfidence);
    const isPhishing = selectedPrediction.toLowerCase().includes('phish');
    const cardBgColor = isPhishing ? 'bg-red-50' : 'bg-green-50';
    const cardBorderColor = isPhishing ? 'border-red-400' : 'border-green-400';
    const iconColor = isPhishing ? 'text-red-500' : 'text-green-500';
    const textColorConfidence = isPhishing ? 'text-red-600' : 'text-green-600';

    const importantKeywords = extractKeywords(explanation);

    const riskIcon = risk_level === 'High' ? <Flame size={24} className="text-red-600" /> :
                     risk_level === 'Medium' ? <AlertTriangle size={24} className="text-yellow-500" /> :
                     <Shield size={24} className="text-green-600" />;

    const downloadPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: 0.5,
            filename: `Phishing_Report_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-6 shadow-xl rounded-3xl space-y-6 transition-all border-2 ${cardBgColor} ${cardBorderColor}`}
        >
            <div ref={reportRef}>
                {/* Title */}
                <div className="flex items-center space-x-3">
                    {isPhishing ? (
                        <AlertTriangle size={32} className={iconColor} />
                    ) : (
                        <ShieldCheck size={32} className={iconColor} />
                    )}
                    <h2 className="text-3xl font-bold text-gray-900">Prediction Report</h2>
                </div>

                {/* Time */}
                <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock size={16} className="mr-2" />
                    <span>Predicted on: {timestamp}</span>
                </div>

                {/* Screenshot */}
                {screenshotUrl && (
                    <div className="mt-6">
                        <img src={screenshotUrl} alt="Website Preview" className="rounded-xl shadow-lg w-full max-h-96 object-cover" />
                    </div>
                )}

                {/* Model & Prediction */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-700 font-semibold">🔹 Model Used: <span className="text-blue-600">{model}</span></p>
                        <p className="text-gray-700 font-semibold">🔹 Prediction: <span className="text-indigo-600">{selectedPrediction}</span></p>
                        <p className="flex items-center text-gray-700 font-semibold">
                            🔹 Risk Level: {riskIcon}
                            <span className="ml-2">{risk_level}</span>
                        </p>
                    </div>

                    {/* Confidence Bar */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-700">Confidence Score:</h3>
                        <p className={`${textColorConfidence} font-bold text-xl`}>{formatConfidence(selectedConfidence)}</p>
                        <div className="w-full bg-gray-300 rounded-full h-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${confidencePercent}%` }}
                                transition={{ duration: 0.8 }}
                                className={`h-4 rounded-full ${confidencePercent >= 80 ? 'bg-green-500' : confidencePercent >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Explanation */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-700">Why classified as <span className="text-indigo-600">{selectedPrediction}</span>?</h3>
                    <p className="text-gray-700 mt-2">{explanation || "No specific explanation provided."}</p>

                    {/* Important Keywords */}
                    {importantKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {importantKeywords.map((keyword, idx) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                                    <Info size={16} className="mr-1" /> {keyword}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Google Results */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-700">Related Google Search Results:</h3>
                    {google_results && google_results.length > 0 ? (
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            {google_results.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-2">No related Google search results found.</p>
                    )}
                </div>
            </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
            <button
                onClick={downloadPDF}
                className="bg-indigo-600 hover:bg-indigo-700 transition-all px-6 py-3 rounded-xl text-white font-semibold text-lg shadow-lg"
            >
                📄 Download Report
            </button>

            <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-3 rounded-xl text-white font-semibold text-lg shadow-lg"
            >
                🔙 Back to Dashboard
            </button>
        </div>
        </>
    );
}

export default ResultDisplay;
