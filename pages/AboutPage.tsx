import React from 'react';
import PageWrapper from '../components/PageWrapper';

const AboutPage: React.FC = () => {
    return (
        <PageWrapper title="About FerozAI">
            <div className="space-y-5">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    FerozAi is a modern AI innovation platform proudly created by Feroz Khan.
                    It’s built to empower creators, developers, and businesses to bring their ideas to life using intelligent and easy-to-use AI tools.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    With a strong passion for technology and innovation, Feroz Khan has designed FerozAi to simplify complex digital processes — making advanced AI accessible to everyone.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    His vision is to create a smarter digital world where creativity and artificial intelligence work hand in hand to help people achieve more with less effort.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    FerozAi continues to grow as a trusted, forward-thinking platform — built with dedication, purpose, and a desire to make technology simple and powerful for all.
                </p>
            </div>
        </PageWrapper>
    );
};

export default AboutPage;