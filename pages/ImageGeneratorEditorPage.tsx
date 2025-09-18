import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors ${
            active
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

const ImageGenerator: React.FC = () => (
    <div className="space-y-6">
        <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image Prompt
            </label>
            <textarea
                id="prompt"
                rows={3}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shadow-sm cursor-not-allowed p-2 resize-none"
                placeholder="e.g., A futuristic cityscape at sunset, with flying cars and neon lights."
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Describe the image you want to create in detail.</p>
        </div>
        <div className="flex justify-end">
            <button disabled className="px-6 py-2 bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
                Generate Image
            </button>
        </div>
        <div className="mt-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-80 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Your generated image will appear here.</p>
        </div>
    </div>
);

const ImageEditor: React.FC = () => (
    <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-not-allowed bg-gray-100 dark:bg-gray-700/50">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32 0V12a4 4 0 00-4-4H28m0 0l-4 4m4-4l4 4m-4-4v12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <p className="pl-1">Click to upload or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
        </div>
        <div>
            <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Edit Instruction
            </label>
            <textarea
                id="edit-prompt"
                rows={2}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 shadow-sm cursor-not-allowed p-2 resize-none"
                placeholder="e.g., Add sunglasses to the person in the image."
            />
        </div>
        <div className="flex justify-end">
            <button disabled className="px-6 py-2 bg-indigo-500 text-white rounded-lg cursor-not-allowed opacity-50">
                Apply Edit
            </button>
        </div>
    </div>
);

const ImageGeneratorEditorPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('generator');

    return (
        <PageWrapper title="Image Tools">
            <div className="mb-6">
                <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <TabButton active={activeTab === 'generator'} onClick={() => setActiveTab('generator')}>
                        Generator
                    </TabButton>
                    <TabButton active={activeTab === 'editor'} onClick={() => setActiveTab('editor')}>
                        Editor
                    </TabButton>
                </div>
            </div>

            <div>
                {activeTab === 'generator' && <ImageGenerator />}
                {activeTab === 'editor' && <ImageEditor />}
            </div>
        </PageWrapper>
    );
};

export default ImageGeneratorEditorPage;
