import React from 'react';
import PageWrapper from '../components/PageWrapper';

const DashboardPage: React.FC = () => {
  return (
    <PageWrapper title="Dashboard">
      <p className="text-gray-700 dark:text-gray-300">
        Welcome to your dashboard. Here you will find an overview of your activity, stats, and more. This page is under construction.
      </p>
    </PageWrapper>
  );
};

export default DashboardPage;
