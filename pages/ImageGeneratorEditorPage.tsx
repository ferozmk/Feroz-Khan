import React, { useState, useRef, ChangeEvent } from 'react';
import PageWrapper from '../components/PageWrapper';
import { generateImages, generateContent } from '../services/geminiService';
import { Modality } from '@google/genai';
import { LogoIcon } from '../components/icons/LogoIcon';
import FullscreenModal from '../components/FullscreenModal';
import { FullscreenIcon } from '../components/icons/FullscreenIcon';

const PaperclipIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

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
    <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="absolute w-full h-full animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="image-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 0 }} />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#image-spinner-gradient)" strokeWidth="8" strokeLinecap="round" />
        </svg>
        <LogoIcon className="w-12 h-12" />
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


interface PromptInputWithUploadProps {
    prompt: string;
    setPrompt: (value: string) => void;
    uploadedImage: string | null;
    setUploadedImage: (value: string | null) => void;
    isLoading: boolean;
    label: string;
    placeholder: string;
    onImageUpload?: () => void;
}

const PromptInputWithUpload: React.FC<PromptInputWithUploadProps> = ({
    prompt,
    setPrompt,
    uploadedImage,
    setUploadedImage,
    isLoading,
    label,
    placeholder,
    onImageUpload
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload?.();
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUploadClick = () => fileInputRef.current?.click();
    const handleRemoveImage = () => setUploadedImage(null);

    return (
        <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="mt-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
                {uploadedImage && (
                    <div className="p-3">
                        <div className="relative w-24 h-24">
                            <img src={uploadedImage} alt="Upload preview" className="h-full w-full object-cover rounded-md" />
                            <button 
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-0.5 leading-none hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Remove image"
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex items-start p-1">
                    <button
                        type="button"
                        onClick={handleUploadClick}
                        className="m-2 p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Attach an image"
                        disabled={isLoading}
                    >
                        <PaperclipIcon className="w-6 h-6" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="hidden" disabled={isLoading} />
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="block w-full bg-transparent border-0 resize-none focus:ring-0 text-gray-800 dark:text-gray-200 p-2 text-base placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder={placeholder}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};


interface GeneratorProps {
    setFullscreenMedia: (media: { type: 'image'; url: string }) => void;
}

const ImageGenerator: React.FC<GeneratorProps> = ({ setFullscreenMedia }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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
            if (uploadedImage) {
                 // Use editing/image-to-image logic
                const base64ImageData = uploadedImage.split(',')[1];
                const mimeType = uploadedImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
                const response = await generateContent({
                    model: 'gemini-2.5-flash-image-preview',
                    contents: { parts: [{ inlineData: { data: base64ImageData, mimeType: mimeType } }, { text: prompt }] },
                    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
                });
                const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
                if (imagePart?.inlineData?.data && imagePart.inlineData.mimeType) {
                    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                    setGeneratedImage(imageUrl);
                } else {
                    throw new Error("The AI did not return a valid image. It might have refused the request or the response was malformed.");
                }
            } else {
                // Use text-to-image generation logic
                const response = await generateImages(prompt);
                if (response.generatedImages?.[0]?.image?.imageBytes) {
                    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                    setGeneratedImage(imageUrl);
                } else {
                    throw new Error("Image generation failed. The response did not contain a valid image. This might be due to safety policies or other issues.");
                }
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PromptInputWithUpload
                label="Prompt"
                prompt={prompt}
                setPrompt={setPrompt}
                uploadedImage={uploadedImage}
                setUploadedImage={setUploadedImage}
                isLoading={isLoading}
                placeholder="e.g., A futuristic cityscape at sunset..."
            />
             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {uploadedImage ? "Describe the changes you want to make or what you'd like to generate from this image." : "Describe the image you want to create in detail. You can also upload an image to edit or use as inspiration."}
            </p>
            {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">{`Error: ${error}`}</p>}
            <div className="flex justify-end">
                <button onClick={handleGenerate} disabled={!prompt.trim() || isLoading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>
            <div className="mt-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-4">
                {isLoading ? <LoadingSpinner /> : generatedImage ? <img src={generatedImage} alt="Generated content" className="max-h-full max-w-full object-contain rounded-md" /> : <p className="text-gray-500 dark:text-gray-400">Your generated image will appear here.</p>}
            </div>
             {generatedImage && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button onClick={() => handleDownload(generatedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        <DownloadIcon /> Download
                    </button>
                     <button onClick={() => setFullscreenMedia({ type: 'image', url: generatedImage })} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        <FullscreenIcon /> Fullscreen
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

interface EditorProps {
    setFullscreenMedia: (media: { type: 'image'; url: string }) => void;
}

const ImageEditor: React.FC<EditorProps> = ({ setFullscreenMedia }) => {
    const [prompt, setPrompt] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState('Copy Link');

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
                await navigator.share({ title: 'Edited Image from FerozAI', text: `Edited with instruction: ${prompt}`, files: [file] });
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
        if (!uploadedImage || !prompt.trim()) return;
        setIsLoading(true);
        setError(null);

        try {
            const base64ImageData = uploadedImage.split(',')[1];
            const mimeType = uploadedImage.match(/:(.*?);/)?.[1] || 'image/jpeg';

            const response = await generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: [{ inlineData: { data: base64ImageData, mimeType: mimeType } }, { text: prompt }] },
                config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
            });
            
            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
            if (imagePart?.inlineData?.data && imagePart.inlineData.mimeType) {
                const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                setEditedImage(imageUrl);
            } else {
                 throw new Error("The AI did not return a valid image. It might have refused the request or the response was malformed.");
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while editing the image.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
             <PromptInputWithUpload
                label="Upload Image & Add Instruction"
                prompt={prompt}
                setPrompt={setPrompt}
                uploadedImage={uploadedImage}
                setUploadedImage={setUploadedImage}
                isLoading={isLoading}
                placeholder="e.g., Add sunglasses to the person..."
                onImageUpload={() => setEditedImage(null)}
            />
            {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">{`Error: ${error}`}</p>}
            <div className="flex justify-end">
                <button onClick={handleApplyEdit} disabled={!uploadedImage || !prompt.trim() || isLoading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Applying...' : 'Apply Edit'}
                </button>
            </div>
             <div className="mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-4 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md z-10">
                        <LoadingSpinner />
                    </div>
                )}
                {editedImage ? (
                    <img src={editedImage} alt="Edited content" className="max-h-full max-w-full object-contain rounded-md" />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                        {uploadedImage 
                            ? "Your edited image will appear here." 
                            : "Upload an image using the attachment button above to get started."}
                    </p>
                )}
            </div>

            {editedImage && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={() => handleDownload(editedImage)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        <DownloadIcon /> Download
                    </button>
                    <button onClick={() => setFullscreenMedia({ type: 'image', url: editedImage })} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        <FullscreenIcon /> Fullscreen
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
    const [fullscreenMedia, setFullscreenMedia] = useState<{ type: 'image'; url: string } | null>(null);

    return (
        <PageWrapper title="Image Tools">
            <div className="mb-6">
                <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <TabButton active={activeTab === 'generator'} onClick={() => setActiveTab('generator')}>Generator</TabButton>
                    <TabButton active={activeTab === 'editor'} onClick={() => setActiveTab('editor')}>Editor</TabButton>
                </div>
            </div>

            <div>
                {activeTab === 'generator' && <ImageGenerator setFullscreenMedia={setFullscreenMedia} />}
                {activeTab === 'editor' && <ImageEditor setFullscreenMedia={setFullscreenMedia} />}
            </div>

            <FullscreenModal 
              isOpen={!!fullscreenMedia}
              onClose={() => setFullscreenMedia(null)}
              mediaUrl={fullscreenMedia?.url ?? null}
              mediaType="image"
            />
        </PageWrapper>
    );
};

export default ImageGeneratorEditorPage;