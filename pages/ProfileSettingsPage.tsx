import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../hooks/useAuth';
import { db, storage } from '../services/firebase';
import { LogoIcon } from '../components/icons/LogoIcon';

const ProfileSettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch user data from Realtime Database on component mount
    useEffect(() => {
        if (user) {
            // Set initial values from auth object for faster perceived load
            setFullName(user.displayName || '');
            setPhotoURL(user.photoURL || null);

            const userRef = db.ref(`users/${user.uid}`);
            const listener = userRef.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setFullName(data.displayName || user.displayName || '');
                    setUsername(data.username || '');
                    setBio(data.bio || '');
                    setPhotoURL(data.photoURL || user.photoURL || null);
                }
            });

            // Cleanup listener on unmount
            return () => userRef.off('value', listener);
        }
    }, [user]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // Refactored with async/await for more robust error handling and clearer flow.
    // This prevents the infinite loading spinner issue.
    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        setStatusMessage({ type: '', text: '' });

        try {
            // 1. Define the storage reference for the user's avatar.
            const storageRef = storage.ref(`avatars/${user.uid}`);
            
            // 2. Upload the file and wait for it to complete.
            const uploadTaskSnapshot = await storageRef.put(file);
            
            // 3. Get the public download URL for the uploaded file.
            const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
            
            // 4. Update the user's profile in both Firebase Auth and Realtime Database.
            await user.updateProfile({ photoURL: downloadURL });
            await db.ref(`users/${user.uid}`).update({ photoURL: downloadURL });

            // 5. Update the local state to reflect the change instantly.
            setPhotoURL(downloadURL);
            setStatusMessage({ type: 'success', text: 'Avatar updated successfully!' });
        } catch (error) {
            console.error("Error uploading avatar:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setStatusMessage({ type: 'error', text: `Upload failed: ${errorMessage}` });
        } finally {
            // 6. Ensure the loading state is always turned off, even if errors occur.
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!fullName.trim()) {
            setStatusMessage({ type: 'error', text: 'Full Name cannot be empty.' });
            return;
        }

        setIsLoading(true);
        setStatusMessage({ type: '', text: '' });

        const updates = {
            displayName: fullName,
            username,
            bio,
        };

        try {
            // Update both Firebase Auth profile and Realtime Database
            await user.updateProfile({ displayName: fullName });
            await db.ref(`users/${user.uid}`).update(updates);
            
            setStatusMessage({ type: 'success', text: 'Profile saved successfully!' });
        } catch (error) {
            console.error("Error saving profile:", error);
            setStatusMessage({ type: 'error', text: 'Failed to save profile.' });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <PageWrapper title="Profile Settings">
      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                {photoURL ? (
                    <img src={photoURL} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
            {isUploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <div className="relative w-16 h-16">
                        <svg className="absolute w-full h-full animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="avatar-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: "rgb(165, 180, 252)", stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: "rgb(99, 102, 241)", stopOpacity: 0.1 }} />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#avatar-spinner-gradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                        </svg>
                        <LogoIcon className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Profile Picture</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload a new avatar.</p>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/png, image/jpeg" className="hidden" />
            <button 
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="mt-2 px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Change Avatar'}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
           <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself."
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 shadow-sm p-2 resize-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end items-center gap-4">
                {statusMessage.text && (
                    <p className={`text-sm ${statusMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {statusMessage.text}
                    </p>
                )}
                 <button type="submit" disabled={isLoading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default ProfileSettingsPage;