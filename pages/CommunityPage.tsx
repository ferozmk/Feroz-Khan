import React from 'react';
import PageWrapper from '../components/PageWrapper';

const CommunityPage: React.FC = () => {
  return (
    <PageWrapper title="Community Hub">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Frequently Asked Questions (FAQ)</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Find answers to common questions about FerozAI, its features, and your account. We're constantly updating this section based on your feedback.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Tips & Tricks</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Learn how to get the most out of FerozAI. Discover advanced prompting techniques, creative use cases, and helpful shortcuts from the community and our team.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Feedback Form</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Have a suggestion, a feature request, or found a bug? We'd love to hear from you! Your feedback is crucial in helping us improve FerozAI.
          </p>
          <form className="space-y-4">
            <div>
              <label htmlFor="feedback-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Feedback Type</label>
              <select id="feedback-type" name="feedback-type" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>General Feedback</option>
              </select>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Feedback</label>
              <div className="mt-1">
                <textarea rows={4} name="comment" id="comment" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md" placeholder="Tell us what you think..."></textarea>
              </div>
            </div>
            <button type="submit" onClick={(e) => e.preventDefault()} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CommunityPage;