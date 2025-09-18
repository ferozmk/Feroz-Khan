import React from 'react';
import PageWrapper from '../components/PageWrapper';

const AboutPage: React.FC = () => {
  return (
    <PageWrapper title="About FerozAI">
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <p>
          <strong>FerozAI</strong> is a sleek, modern chat application powered by Google's powerful Gemini API. Our mission is to provide an intelligent, intuitive, and conversational AI experience that is both helpful and engaging.
        </p>
        <p>
          Built with cutting-edge web technologies including React and Tailwind CSS, FerozAI is designed to be responsive, accessible, and a joy to use across all your devices.
        </p>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Created by Feroz</h2>
          <p>
            This application was designed and developed by Feroz, a passionate software engineer dedicated to building beautiful and functional user interfaces. The goal of FerozAI is to showcase the potential of large language models in a clean and user-friendly package.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Powered by Google Gemini</h2>
          <p>
            The intelligence behind your conversations is provided by Google's Gemini family of models. This ensures high-quality, informative, and context-aware responses to your prompts.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AboutPage;