// This file encapsulates the logic for Google reCAPTCHA v3.

// TODO: Replace 'YOUR_RECAPTCHA_SITE_KEY' with your actual reCAPTCHA v3 Site Key
const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY';

// Enhance the window object with the grecaptcha type for TypeScript.
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Verifies the user with reCAPTCHA v3 and sends the token to the backend.
 * @param action - A string representing the user action (e.g., 'login', 'signup').
 * @returns A promise that resolves with the backend's verification result.
 */
export const verifyRecaptcha = (action: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    // Check if the reCAPTCHA script has loaded.
    if (typeof window.grecaptcha === 'undefined' || typeof window.grecaptcha.ready === 'undefined') {
      return reject(new Error('reCAPTCHA script not loaded or blocked by an ad blocker.'));
    }

    if (RECAPTCHA_SITE_KEY === 'YOUR_RECAPTCHA_SITE_KEY') {
        console.warn("reCAPTCHA is not configured. Using simulated success response. Please set a valid Site Key.");
        return resolve({ success: true, message: 'reCAPTCHA verified (simulated).' });
    }

    // Wait for the reCAPTCHA library to be ready.
    window.grecaptcha.ready(() => {
      // Execute reCAPTCHA to get a token for the specified action.
      window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
        .then(async (token) => {
          try {
            // TODO: Replace this URL with your deployed Firebase Function URL.
            const verifyUrl = 'YOUR_FIREBASE_FUNCTION_URL/verifyRecaptcha';
            
            // --- REAL BACKEND CALL (Commented out until function is deployed) ---
            /*
            const response = await fetch(verifyUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.message || 'Failed to verify reCAPTCHA token.');
            }
            resolve(data);
            */
            // --------------------------------------------------------------------

            // --- SIMULATED BACKEND RESPONSE (For development without a deployed function) ---
            console.log(`This is a simulated backend call to ${verifyUrl}. To enable, deploy the provided Firebase Function and uncomment the 'fetch' logic above.`);
            if (token) {
                resolve({ success: true, message: 'reCAPTCHA verified (simulated).' });
            } else {
                reject(new Error('reCAPTCHA verification failed (simulated).'));
            }
            // --- END SIMULATED RESPONSE ---

          } catch (error) {
            reject(error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};