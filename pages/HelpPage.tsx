import React from 'react';
import PageWrapper from '../components/PageWrapper';

const HelpPage: React.FC = () => {
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
            Can't find the answer you're looking for? Reach out to our support team. This functionality is not yet active.
          </p>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
                <input type="email" name="email" id="email" disabled className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shadow-sm cursor-not-allowed" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea name="message" id="message" rows={4} disabled className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shadow-sm cursor-not-allowed" placeholder="Your message..."></textarea>
              </div>
              <button type="submit" onClick={e => e.preventDefault()} disabled className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
                Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default HelpPage;
