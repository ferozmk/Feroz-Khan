import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import PageWrapper from '../components/PageWrapper';
import { generateVideo, getVideosOperation } from '../services/geminiService';
import { LogoIcon } from '../components/icons/LogoIcon';
import FullscreenModal from '../components/FullscreenModal';
import { FullscreenIcon } from '../components/icons/FullscreenIcon';

const loadingMessages = [
    "Warming up the digital film crew...",
    "Rendering the first few frames...",
    "Adjusting the lighting and camera angles...",
    "This can take a few minutes, please be patient.",
    "Compositing the scenes together...",
    "Adding special effects and sound...",
    "Finalizing the director's cut...",
    "Almost there, the premiere is about to start!"
];

const PaperclipIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
            <svg className="absolute w-full h-full animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="video-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#video-spinner-gradient)" strokeWidth="8" strokeLinecap="round" />
            </svg>
            <LogoIcon className="w-12 h-12" />
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
    </div>
);

// Helper to format seconds into MM:SS
const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const extractFrameFromVideo = (videoUrl: string, timeInSeconds: number = 0): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.currentTime = timeInSeconds;
        video.muted = true;
        video.crossOrigin = 'anonymous'; 

        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg'));
            } else {
                reject(new Error('Could not get canvas context.'));
            }
        };

        video.onerror = (e) => reject(new Error('Failed to load video for frame extraction.'));
    });
};

interface UploadedFile {
    id: string;
    file: File;
    previewUrl: string;
    type: 'image' | 'video';
    progress: number;
    duration?: number;
    dimensions?: { width: number; height: number };
}

const MediaPreviewItem: React.FC<{
    fileData: UploadedFile;
    onRemove: (id: string) => void;
    isLoading: boolean;
}> = ({ fileData, onRemove, isLoading }) => (
    <div className="relative aspect-square group animate-fade-in">
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
            {fileData.progress < 100 ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${fileData.progress}%` }}></div>
                    </div>
                </div>
            ) : fileData.type === 'image' ? (
                <img src={fileData.previewUrl} alt={fileData.file.name} className="h-full w-full object-cover" />
            ) : (
                <video src={fileData.previewUrl} muted playsInline className="h-full w-full object-cover" />
            )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none space-y-0.5">
            <p className="font-semibold truncate leading-tight">{fileData.file.name}</p>
            {fileData.type === 'video' && fileData.duration && <p className="leading-tight">Duration: {formatDuration(fileData.duration)}</p>}
            {fileData.type === 'image' && fileData.dimensions && <p className="leading-tight">Res: {fileData.dimensions.width}x{fileData.dimensions.height}</p>}
            <p className="leading-tight uppercase">{fileData.file.type.split('/')[1]}</p>
        </div>
        {fileData.progress === 100 && (
            <button onClick={() => onRemove(fileData.id)} disabled={isLoading} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-0.5 leading-none hover:bg-red-500 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        )}
    </div>
);


const VideoGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [operation, setOperation] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [fullscreenMedia, setFullscreenMedia] = useState<{ type: 'video'; url: string } | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    
    const pollingIntervalRef = useRef<number | null>(null);
    const messageIntervalRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
            uploadedFiles.forEach(file => URL.revokeObjectURL(file.previewUrl));
        };
    }, [uploadedFiles]);

    useEffect(() => {
        if (isLoading) {
            let messageIndex = 0;
            messageIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[messageIndex]);
            }, 4000);
        } else {
            if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
        }
    }, [isLoading]);

    const processFile = (file: File) => {
        const id = `${file.name}-${file.lastModified}-${Math.random()}`;
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) return;

        const newFile: UploadedFile = { id, file, previewUrl: '', type: isImage ? 'image' : 'video', progress: 0 };
        setUploadedFiles(prev => [...prev, newFile]);

        const reader = new FileReader();
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentLoaded = Math.round((event.loaded / event.total) * 100);
                setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, progress: percentLoaded } : f));
            }
        };
        reader.onloadend = () => {
            const resultUrl = reader.result as string;
            if (isImage) {
                const img = new Image();
                img.src = resultUrl;
                img.onload = () => setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, previewUrl: resultUrl, progress: 100, dimensions: { width: img.naturalWidth, height: img.naturalHeight } } : f));
            } else {
                const videoEl = document.createElement('video');
                videoEl.src = resultUrl;
                videoEl.onloadedmetadata = () => setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, previewUrl: resultUrl, progress: 100, duration: videoEl.duration } : f));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) Array.from(event.target.files).forEach(processFile);
        event.target.value = '';
    };

    const handleRemoveFile = (idToRemove: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== idToRemove));
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); if (!isLoading) setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && !isLoading) Array.from(e.dataTransfer.files).forEach(processFile);
    };

    const pollOperationStatus = async (op: any) => {
        try {
            const updatedOp = await getVideosOperation(op);
            setOperation(updatedOp);
            if (updatedOp.done) {
                if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                setIsLoading(false);
                const downloadLink = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                if (downloadLink) {
                    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                    const blob = await response.blob();
                    setVideoUrl(URL.createObjectURL(blob));
                } else {
                    setError("Video generation finished, but no video URL was found. The request may have been blocked by safety policies.");
                }
            }
        } catch (err) {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            setIsLoading(false);
            setError(err instanceof Error ? err.message : "An unknown error occurred during polling.");
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setOperation(null);
        setLoadingMessage(loadingMessages[0]);
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        
        try {
            let imagePayload: { imageBytes: string; mimeType: string } | undefined = undefined;
            const firstFile = uploadedFiles[0];

            if (firstFile) {
                if (firstFile.type === 'video') {
                    const frameDataURL = await extractFrameFromVideo(firstFile.previewUrl);
                    imagePayload = { imageBytes: frameDataURL.split(',')[1], mimeType: 'image/jpeg' };
                } else {
                    imagePayload = { imageBytes: firstFile.previewUrl.split(',')[1], mimeType: firstFile.file.type };
                }
            }
            const initialOp = await generateVideo(prompt, imagePayload);
            setOperation(initialOp);
            pollingIntervalRef.current = window.setInterval(() => pollOperationStatus(initialOp), 10000);
        } catch (err) {
            setIsLoading(false);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };
    
    const handleDownload = () => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `ferozai-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <PageWrapper title="Video Generator">
            <div className={`space-y-6 transition-all duration-300 ${isDragging ? 'outline-2 outline-dashed outline-indigo-500 outline-offset-8 rounded-lg' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video Prompt</label>
                    <div className="mt-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                        <div className="flex items-start p-1">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="m-2 p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Attach an image or video" disabled={isLoading}>
                                <PaperclipIcon className="w-6 h-6" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFilesSelected} accept="video/mp4,video/webm,video/mov,image/jpeg,image/png,image/webp" multiple className="hidden" disabled={isLoading} />
                            <textarea id="prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="block w-full bg-transparent border-0 resize-none focus:ring-0 text-gray-800 dark:text-gray-200 p-2 text-base placeholder-gray-500 dark:placeholder-gray-400" placeholder="e.g., A cinematic shot of a wolf howling at a full moon in a snowy forest." disabled={isLoading} />
                        </div>
                    </div>
                    {uploadedFiles.length > 0 ? (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {uploadedFiles.map((fileData) => (
                                <MediaPreviewItem key={fileData.id} fileData={fileData} onRemove={handleRemoveFile} isLoading={isLoading} />
                            ))}
                        </div>
                    ) : isDragging ? (
                        <div className="mt-4 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center pointer-events-none">
                            <p className="text-gray-500 dark:text-gray-400">Drop files here to upload</p>
                        </div>
                    ) : null}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {uploadedFiles.length > 0 ? "The first uploaded file will be used as a visual reference for generation." : "Describe the video you want to create. You can also drag & drop or upload images/videos to use as a starting point."}
                    </p>
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">{`Error: ${error}`}</p>}
                <div className="flex justify-end">
                    <button onClick={handleGenerate} disabled={!prompt.trim() || isLoading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Generating...' : 'Generate Video'}
                    </button>
                </div>
                <div className="mt-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-4">
                    {isLoading ? <LoadingSpinner message={loadingMessage} /> : videoUrl ? <video src={videoUrl} controls className="max-h-full max-w-full rounded-md" /> : <p className="text-gray-500 dark:text-gray-400">Your generated video will appear here.</p>}
                </div>
                {videoUrl && !isLoading && (
                    <div className="flex items-center justify-center gap-3 pt-4">
                        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                            <DownloadIcon /> Download Video
                        </button>
                        <button onClick={() => setFullscreenMedia({ type: 'video', url: videoUrl })} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                            <FullscreenIcon /> Fullscreen
                        </button>
                    </div>
                )}
            </div>
            <FullscreenModal isOpen={!!fullscreenMedia} onClose={() => setFullscreenMedia(null)} mediaUrl={fullscreenMedia?.url ?? null} mediaType={fullscreenMedia?.type ?? null} />
        </PageWrapper>
    );
};

export default VideoGeneratorPage;
