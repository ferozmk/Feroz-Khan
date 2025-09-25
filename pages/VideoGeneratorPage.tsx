import React, { useState, useEffect, useRef } from 'react';
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

const VideoGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [operation, setOperation] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [fullscreenMedia, setFullscreenMedia] = useState<{ type: 'video'; url: string } | null>(null);
    
    const pollingIntervalRef = useRef<number | null>(null);
    const messageIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
        };
    }, []);

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
                    const objectURL = URL.createObjectURL(blob);
                    setVideoUrl(objectURL);
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
            const initialOp = await generateVideo(prompt);
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
            <div className="space-y-6">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Video Prompt
                    </label>
                    <textarea
                        id="prompt"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm p-2 resize-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 dark:text-gray-200"
                        placeholder="e.g., A cinematic shot of a wolf howling at a full moon in a snowy forest."
                        disabled={isLoading}
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Describe the video you want to create. Be as descriptive as possible for the best results.</p>
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">{`Error: ${error}`}</p>}
                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isLoading}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Video'}
                    </button>
                </div>

                <div className="mt-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-4">
                    {isLoading ? (
                        <LoadingSpinner message={loadingMessage} />
                    ) : videoUrl ? (
                        <video src={videoUrl} controls className="max-h-full max-w-full rounded-md" />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Your generated video will appear here.</p>
                    )}
                </div>

                {videoUrl && !isLoading && (
                    <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            <DownloadIcon /> Download Video
                        </button>
                        <button
                            onClick={() => setFullscreenMedia({ type: 'video', url: videoUrl })}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            <FullscreenIcon /> Fullscreen
                        </button>
                    </div>
                )}
            </div>
             <FullscreenModal 
              isOpen={!!fullscreenMedia}
              onClose={() => setFullscreenMedia(null)}
              mediaUrl={fullscreenMedia?.url ?? null}
              mediaType={fullscreenMedia?.type ?? null}
            />
        </PageWrapper>
    );
};

export default VideoGeneratorPage;