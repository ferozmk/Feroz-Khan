import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';

const LanguageOption: React.FC<{ name: string; value: string; selected: string; onChange: (value: string) => void; }> = ({ name, value, selected, onChange }) => (
    <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${selected === value ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/30 dark:border-indigo-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
        <span className="font-medium text-gray-800 dark:text-gray-200">{name}</span>
        <input
            type="radio"
            name="language"
            value={value}
            checked={selected === value}
            onChange={() => onChange(value)}
            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
        />
    </label>
);


const LanguagePage: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('languagePreference');
        if (savedLanguage) {
            setSelectedLanguage(savedLanguage);
        }
    }, []);

    const languages = [
        { name: 'English', value: 'en' },
        { name: 'Urdu (اردو)', value: 'ur' },
    ];

    const handleSave = () => {
        localStorage.setItem('languagePreference', selectedLanguage);
        setSaveStatus('Saved!');
        setTimeout(() => setSaveStatus(''), 2000);
    };

  return (
    <PageWrapper title="Language">
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 mb-6">
            Choose your preferred language for the FerozAI interface.
        </p>
        <div className="space-y-4">
            {languages.map(lang => (
                <LanguageOption 
                    key={lang.value}
                    name={lang.name}
                    value={lang.value}
                    selected={selectedLanguage}
                    onChange={setSelectedLanguage}
                />
            ))}
        </div>
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
                onClick={handleSave}
                disabled={!!saveStatus}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
                {saveStatus || 'Save Preferences'}
            </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default LanguagePage;