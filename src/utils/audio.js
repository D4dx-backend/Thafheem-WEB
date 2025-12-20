// Audio utilities for ayah-wise playback

import { fetchUrduTranslationAudio, fetchUrduInterpretationAudio } from '../api/apifunction';
import audioManager from './audioManager';

const QARI_INITIALS = {
	"al-ghamidi": "G",
	"al-afasy": "A",
	"al-hudaify": "H",
};

export async function buildAyahAudioUrl({ ayahNumber, surahNumber, audioType = "qirath", qariName = "al-afasy", translationLanguage = null }) {
	const surahPadded = String(surahNumber).padStart(3, "0");
	const ayahPadded = String(ayahNumber).padStart(3, "0");

	if (audioType === "translation") {
		// Only support translation audio for Urdu and Malayalam
		if (translationLanguage !== 'ur' && translationLanguage !== 'mal') {
			return { primary: null, fallback: null };
		}
		// For Urdu, fetch from API (language code is 'ur')
		if (translationLanguage === 'ur') {
			const audioUrl = await fetchUrduTranslationAudio(surahNumber, ayahNumber);
			if (audioUrl) return { primary: audioUrl, fallback: null };
			// If API fails, return null instead of falling back to Malayalam pattern
			return { primary: null, fallback: null };
		}
		// For Malayalam, use default pattern
		const primaryUrl = `https://thafheem.net/audio/translation/T${surahPadded}_${ayahPadded}.ogg`;
		// Generate fallback URL with previous ayah (only if ayahNumber > 1)
		// Format: T{surah}_{previousAyah},{currentAyah}.ogg (previous, current order)
		let fallbackUrl = null;
		if (translationLanguage === 'mal' && ayahNumber > 1) {
			const previousAyahPadded = String(ayahNumber - 1).padStart(3, "0");
			fallbackUrl = `https://thafheem.net/audio/translation/T${surahPadded}_${previousAyahPadded},${ayahPadded}.ogg`;
		}
		return { primary: primaryUrl, fallback: fallbackUrl };
	}

	if (audioType === "interpretation") {
		// For Urdu, fetch from API (language code is 'ur')
		if (translationLanguage === 'ur') {
			const audioUrl = await fetchUrduInterpretationAudio(surahNumber, ayahNumber);
			if (audioUrl) return { primary: audioUrl, fallback: null };
			// If API fails, return null instead of falling back to Malayalam pattern
			return { primary: null, fallback: null };
		}
		// For Malayalam, use default pattern
		return { primary: `https://thafheem.net/audio/interpretation/I${surahPadded}_${ayahPadded}.ogg`, fallback: null };
	}

	// Default to qirath/quran
	const qariInitial = QARI_INITIALS[qariName] || "A"; // default Afasy
	const prefix = `Q${qariInitial}`;
	return { primary: `https://thafheem.net/audio/qirath/${qariName}/${prefix}${surahPadded}_${ayahPadded}.ogg`, fallback: null };
}

// Plays given ayah and updates callbacks for state
export async function playAyahAudio({ ayahNumber, surahNumber, audioType = "qirath", qariName = "al-afasy", playbackSpeed = 1.0, translationLanguage = null, onStart, onEnd, onError }) {
	const urls = await buildAyahAudioUrl({ ayahNumber, surahNumber, audioType, qariName, translationLanguage });
	
	// If URL is null, handle based on audio type and language
	if (!urls || !urls.primary) {
		// For Urdu translation/interpretation audio, 404s are expected for ayahs that are not
		// the last in their range. Skip silently without triggering error callback.
		if (audioType === "translation" && translationLanguage === 'ur') {
			// Silently skip - this is expected behavior for Urdu translation audio ranges
			return null;
		}
		if (audioType === "interpretation" && translationLanguage === 'ur') {
			// Silently skip - this is expected behavior for Urdu interpretation audio ranges
			return null;
		}
		// For other cases, trigger error callback
		if (typeof onError === "function") {
			onError(new Error(`Audio URL not available for ${audioType}`));
		}
		return null;
	}
	
	// Track if we're already trying fallback to prevent duplicate attempts
	let isTryingFallback = false;
	
	// Helper function to try loading audio with fallback support
	const tryLoadAudio = (urlToTry, isFallback = false) => {
		// Check if audio should be stopped (language changed)
		if (audioManager.getShouldStop()) {
			return null;
		}
		
		// Reset fallback flag when starting a new primary audio load
		if (!isFallback) {
			isTryingFallback = false;
		}
		
		const audio = new Audio(urlToTry);
		audio.preload = "none";
		audio.playbackRate = playbackSpeed;
		
		// Register audio with global manager
		audioManager.register(audio);

		// Ensure playback speed is applied after audio metadata loads
		const handleLoadedMetadata = () => {
			if (audio) {
				audio.playbackRate = playbackSpeed;
			}
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
		};
		audio.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
		
		const handleCanPlay = () => {
			if (audio) {
				audio.playbackRate = playbackSpeed;
			}
			audio.removeEventListener('canplay', handleCanPlay);
		};
		audio.addEventListener('canplay', handleCanPlay, { once: true });

		// Track if error has been handled to prevent duplicate callbacks
		let errorHandled = false;
		const handleError = (e) => {
			if (errorHandled) return;
			errorHandled = true;
			
			// Check if we should try fallback for Malayalam translation
			// Guard against multiple handlers triggering fallback simultaneously
			if (!isFallback && !isTryingFallback && audioType === "translation" && translationLanguage === 'mal' && urls.fallback) {
				// Mark that we're trying fallback to prevent duplicate attempts
				isTryingFallback = true;
				console.log('[audio.js] Primary Malayalam translation audio failed, trying fallback:', urls.fallback);
				// Try fallback URL - return the new audio object
				return tryLoadAudio(urls.fallback, true);
			}
			
			// If fallback attempt was already triggered by another handler, just return
			if (!isFallback && isTryingFallback) {
				if (import.meta?.env?.DEV) {
					console.log('[audio.js] onerror handler aborted - fallback already being attempted');
				}
				return;
			}
			
			// For interpretation audio, missing files are expected for some ayahs
			// Only log errors for unexpected failures or non-interpretation audio
			if (audioType !== "interpretation") {
				console.error(`Audio error for ${audioType}:`, e);
			} else {
				// For interpretation, only log in dev mode to reduce console noise
				if (import.meta?.env?.DEV) {
					console.warn(`Interpretation audio not available for ayah ${ayahNumber} in surah ${surahNumber}`);
				}
			}
			if (typeof onError === "function") onError(e);
		};

		// Set up event handlers before playing
		audio.onplay = () => {
			if (typeof onStart === "function") onStart();
		};
		if (typeof onEnd === "function") audio.onended = onEnd;
		if (typeof onError === "function") {
			audio.onerror = handleError;
		}

		// Check again before playing (language might have changed during async operations)
		if (audioManager.getShouldStop()) {
			audio.pause();
			return null;
		}
		
		// Start loading and playing
		audio.play().catch((e) => {
			// Don't handle errors if language changed
			if (audioManager.getShouldStop()) {
				return null;
			}
			// Check if we should try fallback for Malayalam translation
			// Guard against multiple handlers triggering fallback simultaneously
			if (!isFallback && !isTryingFallback && audioType === "translation" && translationLanguage === 'mal' && urls.fallback) {
				// Mark that we're trying fallback to prevent duplicate attempts
				isTryingFallback = true;
				console.log('[audio.js] Primary Malayalam translation audio play failed, trying fallback:', urls.fallback);
				// Try fallback URL - return the new audio object
				return tryLoadAudio(urls.fallback, true);
			}
			
			// If fallback attempt was already triggered by another handler, just return
			if (!isFallback && isTryingFallback) {
				if (import.meta?.env?.DEV) {
					console.log('[audio.js] play().catch() handler aborted - fallback already being attempted');
				}
				return;
			}
			
			// Check if it's a NotSupportedError or network error (expected for missing files)
			const isExpectedError = e.name === 'NotSupportedError' || 
			                         e.name === 'NotAllowedError' ||
			                         (audioType === "interpretation" && e.message?.includes('no supported source'));
			
			// For interpretation audio, missing files are expected for some ayahs
			if (audioType !== "interpretation" || !isExpectedError) {
				console.error(`Error playing audio for ${audioType}:`, e);
			} else {
				// For interpretation, only log in dev mode to reduce console noise
				if (import.meta?.env?.DEV) {
					console.warn(`Interpretation audio not available for ayah ${ayahNumber} in surah ${surahNumber}`);
				}
			}
			handleError(e);
		});

		return audio;
	};
	
	// Start loading with primary URL
	return tryLoadAudio(urls.primary, false);
}

export function getQariInitial(qariName) {
	return QARI_INITIALS[qariName] || "A";
}


