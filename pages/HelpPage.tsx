import React, { useState, FormEvent } from 'react';
import PageWrapper from '../components/PageWrapper';

const HelpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    // Simulate a network request
    setTimeout(() => {
      // In a real application, you would send the data to a backend here.
      console.log('Form Submitted', { email, message });
      setStatus('success');
      setEmail('');
      setMessage('');
      // Optionally reset the form status after a while
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const getButtonText = () => {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'success':
        return 'Sent!';
      default:
        return 'Send Message';
    }
  };


  return (
    <PageWrapper title="Help & Support">
      <div className="space-y-10">
        
        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">How do I start a new chat?</h3>
              <p className="text-gray-600 dark:text-gray-400">Click the "New Chat" button at the top of the sidebar to clear the current conversation and start fresh.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Can I view my past conversations?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes, the "User History" page will contain all your previous chats once the feature is implemented.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">How do I change the theme?</h3>
              <p className="text-gray-600 dark:text-gray-400">You can toggle between light and dark mode using the theme switcher at the bottom of the sidebar.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Contact Support</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find the answer you're looking for? Reach out to our support team below.
          </p>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-4">
               {status === 'success' && (
                <div className="p-3 text-center text-sm text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/30 rounded-lg animate-fade-in">
                  ✅ Your message has been sent! Our support team will contact you soon.
                </div>
              )}
              {status === 'error' && error && (
                 <div className="p-3 text-center text-sm text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/30 rounded-lg animate-fade-in">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="you@example.com"
                  disabled={status === 'sending'}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 shadow-sm p-2 resize-none focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="Your message..."
                  disabled={status === 'sending'}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'sending' || status === 'success'}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getButtonText()}
              </button>
            </form>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default HelpPage;