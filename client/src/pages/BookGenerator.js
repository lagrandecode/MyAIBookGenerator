import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Loader2, BookOpen } from 'lucide-react';
import CoverGenerator from '../components/CoverGenerator';

const BookGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedCover, setGeneratedCover] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: user?.username || '',
    language: '',
    level: 'Beginner',
    style: 'Practical & Tutorial-based',
    goals: '',
    topics: [''],
    examplesPerTopic: 3,
    numberOfPages: 50,
    includeTableOfContents: true,
    includeExercises: true,
    codeExplanation: true,
    tone: 'Friendly',
    format: 'PDF'
  });

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const styles = [
    'Practical & Tutorial-based',
    'Theoretical & Academic',
    'Project-based',
    'Reference Manual',
    'Story-based Learning'
  ];
  const tones = ['Friendly', 'Professional', 'Academic', 'Casual', 'Formal'];
  const formats = ['PDF', 'DOCX'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData(prev => ({
      ...prev,
      topics: newTopics
    }));
  };

  const addTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, '']
    }));
  };

  const removeTopic = (index) => {
    if (formData.topics.length > 1) {
      const newTopics = formData.topics.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        topics: newTopics
      }));
    }
  };

  const handleCoverGenerated = (cover) => {
    setGeneratedCover(cover);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Book title is required');
      setLoading(false);
      return;
    }

    if (!formData.author.trim()) {
      setError('Author name is required');
      setLoading(false);
      return;
    }

    if (!formData.language.trim()) {
      setError('Programming language is required');
      setLoading(false);
      return;
    }

    if (!formData.goals.trim()) {
      setError('Learning goals are required');
      setLoading(false);
      return;
    }

    const validTopics = formData.topics.filter(topic => topic.trim());
    if (validTopics.length === 0) {
      setError('At least one topic is required');
      setLoading(false);
      return;
    }

    try {
      // Prepare book data for API
      const bookData = {
        ...formData,
        topics: validTopics
      };

      console.log('Generating book with data:', bookData);
      
      // Call the real API to generate the book
      const response = await fetch('/api/generation/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Book generated successfully! Redirecting to your library...');
        
        // Store the generated book data
        localStorage.setItem('generatedBook', JSON.stringify(result));
        
        // Redirect to library after a delay
        setTimeout(() => {
          navigate('/library');
        }, 2000);
      } else {
        setError(result.error || 'Failed to generate book. Please try again.');
      }
      
    } catch (err) {
      console.error('Book generation error:', err);
      setError('Failed to generate book. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generate Your Book</h1>
            <p className="text-gray-600">Create a complete book with AI assistance</p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Book Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                  placeholder="e.g., Mastering Python for Beginners"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            {/* Programming Language and Level */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Programming Language *
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                  placeholder="e.g., Python 3, JavaScript, Java"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Difficulty Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Style and Tone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Writing Style
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {tones.map(tone => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Learning Goals */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Learning Goals *
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                placeholder="Describe what readers will learn from this book..."
                required
              />
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Book Topics *
              </label>
              <div className="space-y-3">
                {formData.topics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-600"
                      placeholder={`Topic ${index + 1} (e.g., Introduction to Python)`}
                    />
                    {formData.topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTopic}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Topic</span>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Examples per Topic
                </label>
                <input
                  type="number"
                  name="examplesPerTopic"
                  value={formData.examplesPerTopic}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Number of Pages
                </label>
                <input
                  type="number"
                  name="numberOfPages"
                  value={formData.numberOfPages}
                  onChange={handleChange}
                  min="10"
                  max="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Output Format
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {formats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Book Features</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="includeTableOfContents"
                    checked={formData.includeTableOfContents}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Table of Contents</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="includeExercises"
                    checked={formData.includeExercises}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Practice Exercises</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="codeExplanation"
                    checked={formData.codeExplanation}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Code Explanations</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link to="/dashboard" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating Book...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5" />
                    <span>Generate Book</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Cover Generator */}
        <div className="card p-8">
          <CoverGenerator 
            bookData={formData}
            onCoverGenerated={handleCoverGenerated}
          />
        </div>
      </div>
    </div>
  );
};

export default BookGenerator; 