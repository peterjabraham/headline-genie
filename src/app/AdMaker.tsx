"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react"
import AdInput from './AdInput';
import LoginButton from './LoginButton';

interface FormData {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string;
  additionalRules: string;
}

interface AdData {
  headline: string;
  primaryText: string;
  liked: boolean;
}

interface LikedHeadline {
  headline: string;
  primaryText: string;
  timestamp: string;
}

const AdMaker: React.FC = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    brandName: '',
    product: '',
    userBenefit: '',
    promotion: '',
    audience: '',
    goal: '',
    keywords: '',
    additionalRules: '',
  });
  const [adPreviews, setAdPreviews] = useState<AdData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [likedHeadlines, setLikedHeadlines] = useState<LikedHeadline[]>([]);
  const [showLikedHeadlines, setShowLikedHeadlines] = useState(false);
  const [useLikedHeadlines, setUseLikedHeadlines] = useState(false);

  useEffect(() => {
    const isValid = Object.values(formData).some(value => value.trim() !== '') || csvData !== '';
    setIsFormValid(isValid);
  }, [formData, csvData]);

  useEffect(() => {
    fetchLikedHeadlines();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cleanCsvData = (data: string): string => {
    // Remove any non-printable characters and unusual symbols
    return data.replace(/[^\x20-\x7E\n]/g, '')
      // Replace multiple spaces with a single space
      .replace(/\s+/g, ' ')
      // Trim whitespace from the beginning and end of each line
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      // Remove empty lines
      .replace(/^\s*[\r\n]/gm, '');
  };

  const handleCsvUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = event.target?.result as string;
        const cleanedData = cleanCsvData(rawData);
        
        // Check if the cleaned data is empty
        if (cleanedData.trim() === '') {
          throw new Error('The CSV file is empty or contains only invalid characters.');
        }

        setCsvData(cleanedData);
        setCsvFileName(file.name);
        setCsvError(null);
      } catch (error) {
        console.error('Error processing CSV:', error);
        setCsvError(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setCsvData('');
        setCsvFileName(null);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setCsvError(`Error reading file: ${error}`);
      setCsvData('');
      setCsvFileName(null);
    };
    reader.readAsText(file);
  };

  const handleWriteAds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData, 
          csvData,
          useLikedHeadlines,
          likedHeadlines: useLikedHeadlines ? likedHeadlines : []
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ads');
      }

      const data = await response.json();
      setAdPreviews(data.ads.map((ad: AdData) => ({ ...ad, liked: false })));
    } catch (error) {
      console.error('Error generating ads:', error);
      setError('Failed to generate ads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikedHeadlines = async () => {
    try {
      const response = await fetch('/api/liked-headlines');
      if (response.ok) {
        const data = await response.json();
        setLikedHeadlines(data);
      }
    } catch (error) {
      console.error('Error fetching liked headlines:', error);
    }
  };

  const saveLikedHeadline = async (headline: string, primaryText: string) => {
    try {
      const response = await fetch('/api/liked-headlines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headline, primaryText }),
      });
      if (response.ok) {
        fetchLikedHeadlines();
      }
    } catch (error) {
      console.error('Error saving liked headline:', error);
    }
  };

  const toggleLike = async (index: number) => {
    setAdPreviews(prevAds => 
      prevAds.map((ad, i) => {
        if (i === index) {
          const newLikedState = !ad.liked;
          if (newLikedState) {
            saveLikedHeadline(ad.headline, ad.primaryText);
          }
          return { ...ad, liked: newLikedState };
        }
        return ad;
      })
    );
  };

  const handleDownload = () => {
    const selectedAds = adPreviews.filter(ad => ad.liked);
    if (selectedAds.length === 0) {
      alert('Please select at least one headline to download.');
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    let content = `Generated on: ${formattedDate} at ${formattedTime}\n\n`;
    content += "Input Summary:\n";
    Object.entries(formData).forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      content += `${formattedKey}: ${value || 'Not provided'}\n`;
    });
    if (csvFileName) {
      content += `CSV file uploaded: ${csvFileName}\n`;
    } else {
      content += `CSV file: Not uploaded\n`;
    }
    content += "\nSelected Ads:\n\n";

    content += selectedAds.map((ad, index) => 
      `Ad ${index + 1}:\nHeadline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_headlines_${formattedDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleUseLikedHeadlines = useCallback(() => {
    setUseLikedHeadlines(prev => !prev);
  }, []);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-2">Welcome to The Ad Headline Lab</h1>
        <p className="text-lg mb-4">Creative headlines that deliver results!</p>
        <p className="mb-4">Please sign in to use the application.</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">The Ad Headline Lab</h1>
            <p className="text-sm text-gray-600">Creative headlines that deliver results!</p>
          </div>
          <LoginButton />
        </div>
      </header>
      <main className="flex-grow bg-gray-100 p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome to The Ad Headline Lab</h1>
            <p className="text-lg mb-4">Creative headlines that deliver results!</p>
            <p className="text-sm text-gray-600 mb-4">
              The more info you give me the better your headlines will be, and upload a .csv of high performing examples in one column file please.
            </p>
            <AdInput
              adData={formData}
              onInputChange={handleInputChange}
              onGenerateAds={handleWriteAds}
              onCsvUpload={handleCsvUpload}
              isLoading={isLoading}
              isFormValid={isFormValid}
              csvFileName={csvFileName}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {csvError && <p className="text-red-500 mt-2">{csvError}</p>}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowLikedHeadlines(!showLikedHeadlines)}
                className="p-2 bg-gray-500 text-white rounded hover:bg-green-500 transition-colors duration-200"
              >
                {showLikedHeadlines ? 'Hide Liked Headlines' : 'Show Liked Headlines'}
              </button>
              <button
                onClick={toggleUseLikedHeadlines}
                className={`p-2 text-white rounded transition-colors duration-200 ${
                  useLikedHeadlines ? 'bg-green-500' : 'bg-gray-500 hover:bg-green-500'
                }`}
              >
                {useLikedHeadlines ? 'Using Liked Headlines' : 'Use Liked Headlines'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              You can use these liked headlines as a basis for style. 
              {useLikedHeadlines && " (Currently being used as reference)"}
            </p>
            {showLikedHeadlines && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Liked Headlines</h3>
                <ul className="list-disc pl-5">
                  {likedHeadlines.map((headline, index) => (
                    <li key={index} className="mt-2">
                      <p><strong>Headline:</strong> {headline.headline}</p>
                      <p><strong>Primary Text:</strong> {headline.primaryText}</p>
                      <p><small>Liked on: {new Date(headline.timestamp).toLocaleString()}</small></p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Ad Previews</h2>
            <p>Number of previews: {adPreviews.length}</p>
            <div className="space-y-4">
              {adPreviews.map((ad, index) => (
                <div key={index} className="border p-4 rounded relative">
                  <button
                    onClick={() => toggleLike(index)}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    {ad.liked ? '❤️' : '🤍'}
                  </button>
                  <h3 className="font-semibold">Ad {index + 1}</h3>
                  <p><strong>Headline:</strong> {ad.headline}</p>
                  <p><strong>Primary Text:</strong> {ad.primaryText}</p>
                </div>
              ))}
            </div>
            {adPreviews.length > 0 && (
              <button
                onClick={handleDownload}
                className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-green-500 transition-colors duration-200"
              >
                Download Selected Headlines
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdMaker;
