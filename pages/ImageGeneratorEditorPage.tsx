import React, { useState, useRef, ChangeEvent } from 'react';
import PageWrapper from '../components/PageWrapper';
import { GoogleGenAI, Modality } from '@google/genai';

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

// --- New Components & Icons ---
const DownloadIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" />
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.4s]"></div>
    </div>
);

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

// --- Updated Components ---

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState('Copy Link');

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'ferozai-generated-image.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async (imageUrl: string) => {
        const file = dataURLtoFile(imageUrl, 'ferozai-generated-image.jpeg');
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Image from FerozAI',
                    text: `Generated with prompt: ${prompt}`,
                    files: [file],
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            alert('Web Share API is not supported in your browser or cannot share files.');
        }
    };

    const handleCopyLink = (imageUrl: string) => {
        navigator.clipboard.writeText(imageUrl).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy Link'), 2000);
        }).catch(err => console.error('Failed to copy:', err));
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                },
            });

            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setGeneratedImage(imageUrl);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image Prompt
                </label>
                <textarea
                    id="prompt"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm p-2 resize-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
                    placeholder="e.g., A futuristic cityscape at sunset, with flying cars and neon lights."
                    disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Describe the image you want to create in detail.</p>
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">{`Error: ${error}`}</p>}
            <div className="flex justify-end">
                <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>
            <div className="mt-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-4">
                {isLoading ? <LoadingSpinner /> :
                 generatedImage ? (
                    <img src={generatedImage} alt="Generated content" className="max-h-full max-w-full object-contain rounded-md" />
                 ) : (
                    <p className="text-gray-500 dark:text-gray-400">Your generated image will appear here.</p>
                 )
                }
            </div>
             {generatedImage && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button onClick={() => handleDownload(generatedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        <DownloadIcon /> Download
                    </button>
                    {navigator.share && (
                        <button onClick={() => handleShare(generatedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                           <ShareIcon /> Share
                        </button>
                    )}
                    <button onClick={() => handleCopyLink(generatedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 min-w-[120px] justify-center">
                        <CopyIcon /> {copyStatus}
                    </button>
                </div>
            )}
        </div>
    );
};

const ImageEditor: React.FC = () => {
    const [editPrompt, setEditPrompt] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState('Copy Link');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEditedImage(null); // Clear previous edit result
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'ferozai-edited-image.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async (imageUrl: string) => {
        const file = dataURLtoFile(imageUrl, 'ferozai-edited-image.jpeg');
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Edited Image from FerozAI',
                    text: `Edited with instruction: ${editPrompt}`,
                    files: [file],
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            alert('Web Share API is not supported in your browser or cannot share files.');
        }
    };

    const handleCopyLink = (imageUrl: string) => {
        navigator.clipboard.writeText(imageUrl).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy Link'), 2000);
        }).catch(err => console.error('Failed to copy:', err));
    };

    const handleApplyEdit = async () => {
        if (!uploadedImage || !editPrompt.trim()) return;
        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64ImageData = uploadedImage.split(',')[1];
            const mimeType = uploadedImage.match(/:(.*?);/)?.[1] || 'image/jpeg';

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64ImageData, mimeType: mimeType } },
                        { text: editPrompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
            
            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData) {
                const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                setEditedImage(imageUrl);
            } else {
                 throw new Error("The AI did not return an image. It might have refused the request.");
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while editing the image.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const displayImage = editedImage || uploadedImage;

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Image
                </label>
                <div
                    onClick={!displayImage ? handleUploadClick : undefined}
                    className={`relative mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md bg-gray-50 dark:bg-gray-800/50 transition-colors h-64 ${!displayImage ? 'cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400' : ''}`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                            <LoadingSpinner />
                        </div>
                    )}
                    {displayImage ? (
                        <img src={displayImage} alt="Upload preview" className="max-h-full max-w-full object-contain rounded-md" />
                    ) : (
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32 0V12a4 4 0 00-4-4H28m0 0l-4 4m4-4l4 4m-4-4v12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <p className="pl-1">Click to upload</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}
                </div>
                 {uploadedImage && (
                    <button onClick={handleUploadClick} disabled={isLoading} className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Change image
                    </button>
                 )}
            </div>
            <div>
                <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Edit Instruction
                </label>
                <textarea
                    id="edit-prompt"
                    rows={2}
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm p-2 resize-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
                    placeholder="e.g., Add sunglasses to the person in the image."
                    disabled={isLoading || !uploadedImage}
                />
            </div>
             {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">{`Error: ${error}`}</p>}
            <div className="flex justify-end">
                <button
                    onClick={handleApplyEdit}
                    disabled={!uploadedImage || !editPrompt.trim() || isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Applying...' : 'Apply Edit'}
                </button>
            </div>
            {editedImage && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={() => handleDownload(editedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        <DownloadIcon /> Download
                    </button>
                    {navigator.share && (
                        <button onClick={() => handleShare(editedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                           <ShareIcon /> Share
                        </button>
                    )}
                    <button onClick={() => handleCopyLink(editedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 min-w-[120px] justify-center">
                        <CopyIcon /> {copyStatus}
                    </button>
                </div>
            )}
        </div>
    );
};

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