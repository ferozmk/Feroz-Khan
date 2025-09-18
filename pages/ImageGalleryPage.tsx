import React from 'react';
import PageWrapper from '../components/PageWrapper';

const ImageGalleryPage: React.FC = () => {
  return (
    <PageWrapper title="Image Gallery">
      <p className="text-gray-700 dark:text-gray-300">
        This is the image gallery page. Functionality to view, manage, and edit images will be available here in the future.
      </p>
    </PageWrapper>
  );
};

export default ImageGalleryPage;