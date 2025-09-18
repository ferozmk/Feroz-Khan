import React from 'react';
import PageWrapper from '../components/PageWrapper';

const AIToolsPage: React.FC = () => {
  return (
    <PageWrapper title="AI Tools">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Text-to-Image Generator</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Unleash your creativity by turning text prompts into stunning images. Describe anything you can imagine, and our AI will bring it to life. This feature is currently under development.
          </p>
          <button disabled className="px-4 py-2 bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
            Coming Soon
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Code Generator</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Accelerate your development workflow. Generate code snippets in various languages, debug existing code, or get help understanding complex algorithms.
          </p>
          <button disabled className="px-4 py-2 bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
            Coming Soon
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AIToolsPage;