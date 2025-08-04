import React, { useState } from 'react';
import { Download, RefreshCw, Palette, Sparkles } from 'lucide-react';

const CoverGenerator = ({ bookData, onCoverGenerated }) => {
  const [generating, setGenerating] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverStyle, setCoverStyle] = useState('modern');
  const [colorScheme, setColorScheme] = useState('blue');

  const styles = [
    { id: 'modern', name: 'Modern & Clean', description: 'Minimalist design with clean typography' },
    { id: 'vintage', name: 'Vintage', description: 'Classic book cover with retro elements' },
    { id: 'tech', name: 'Tech & Futuristic', description: 'High-tech design with digital elements' },
    { id: 'academic', name: 'Academic', description: 'Professional textbook style' },
    { id: 'creative', name: 'Creative & Artistic', description: 'Artistic and imaginative design' }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Blue', class: 'from-blue-500 to-blue-700' },
    { id: 'green', name: 'Green', class: 'from-green-500 to-green-700' },
    { id: 'purple', name: 'Purple', class: 'from-purple-500 to-purple-700' },
    { id: 'orange', name: 'Orange', class: 'from-orange-500 to-orange-700' },
    { id: 'red', name: 'Red', class: 'from-red-500 to-red-700' },
    { id: 'gray', name: 'Gray', class: 'from-gray-500 to-gray-700' }
  ];

  const generateCover = async () => {
    setGenerating(true);
    
    // Simulate AI cover generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a mock cover image (in real implementation, this would be AI-generated)
    const mockCover = {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${getColorForScheme(colorScheme)};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${getColorForScheme(colorScheme, true)};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="400" height="600" fill="url(#grad)"/>
          <text x="200" y="200" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">${bookData.title}</text>
          <text x="200" y="250" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white">by ${bookData.author}</text>
          <text x="200" y="350" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="white">${bookData.language}</text>
          <text x="200" y="370" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">${bookData.level} Level</text>
        </svg>
      `)}`,
      style: coverStyle,
      colorScheme: colorScheme
    };
    
    setCoverImage(mockCover);
    setGenerating(false);
    
    if (onCoverGenerated) {
      onCoverGenerated(mockCover);
    }
  };

  const getColorForScheme = (scheme, isEnd = false) => {
    const colors = {
      blue: isEnd ? '#1d4ed8' : '#3b82f6',
      green: isEnd ? '#15803d' : '#22c55e',
      purple: isEnd ? '#7c3aed' : '#a855f7',
      orange: isEnd ? '#ea580c' : '#f97316',
      red: isEnd ? '#dc2626' : '#ef4444',
      gray: isEnd ? '#374151' : '#6b7280'
    };
    return colors[scheme] || colors.blue;
  };

  const downloadCover = () => {
    if (!coverImage) return;
    
    const link = document.createElement('a');
    link.href = coverImage.url;
    link.download = `${bookData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Book Cover Generator</h3>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="text-sm text-gray-600">AI-Powered</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cover Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Style
            </label>
            <select
              value={coverStyle}
              onChange={(e) => setCoverStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {styles.map(style => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {styles.find(s => s.id === coverStyle)?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Scheme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorSchemes.map(scheme => (
                <button
                  key={scheme.id}
                  onClick={() => setColorScheme(scheme.id)}
                  className={`p-3 rounded-md border-2 transition-all ${
                    colorScheme === scheme.id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded bg-gradient-to-br ${scheme.class}`}></div>
                  <span className="text-xs text-gray-600 mt-1 block">{scheme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateCover}
            disabled={generating}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {generating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Generating Cover...</span>
              </>
            ) : (
              <>
                <Palette className="h-5 w-5" />
                <span>Generate Cover</span>
              </>
            )}
          </button>
        </div>

        {/* Cover Preview */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Cover Preview</h4>
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            {coverImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={coverImage.url}
                    alt="Book Cover"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={downloadCover}
                      className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                      title="Download Cover"
                    >
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Style: {styles.find(s => s.id === coverImage.style)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Colors: {colorSchemes.find(c => c.id === coverImage.colorScheme)?.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center text-gray-500">
                  <Palette className="h-12 w-12 mx-auto mb-2" />
                  <p>Click "Generate Cover" to create your book cover</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {coverImage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700">
              Cover generated successfully! You can download it or regenerate with different settings.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverGenerator; 