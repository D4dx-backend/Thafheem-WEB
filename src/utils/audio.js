// Audio utilities for ayah-wise playback

import { fetchUrduTranslationAudio, fetchUrduInterpretationAudio } from '../api/apifunction';

const QARI_INITIALS = {
	"al-ghamidi": "G",
	"al-afasy": "A",
	"al-hudaify": "H",
};

export async function buildAyahAudioUrl({ ayahNumber, surahNumber, audioType = "qirath", qariName = "al-afasy", translationLanguage = null }) {
	const surahPadded = String(surahNumber).padStart(3, "0");
	const ayahPadded = String(ayahNumber).padStart(3, "0");

	if (audioType === "translation") {
		// For Urdu, fetch from API (language code is 'ur')
		if (translationLanguage === 'ur') {
			const audioUrl = await fetchUrduTranslationAudio(surahNumber, ayahNumber);
			if (audioUrl) return audioUrl;
			// If API fails, return null instead of falling back to Malayalam pattern
			return null;
		}
		// For Malayalam, use default pattern
		if (import.meta?.env?.DEV) {
			return `/api/audio/translation/T${surahPadded}_${ayahPadded}.ogg`;
		}
		return `https://old.thafheem.net/audio/translation/T${surahPadded}_${ayahPadded}.ogg`;
	}

	if (audioType === "interpretation") {
		// For Urdu, fetch from API (language code is 'ur')
		if (translationLanguage === 'ur') {
			const audioUrl = await fetchUrduInterpretationAudio(surahNumber, ayahNumber);
			if (audioUrl) return audioUrl;
			// If API fails, return null instead of falling back to Malayalam pattern
			return null;
		}
		// For Malayalam, use default pattern
		if (import.meta?.env?.DEV) {
			return `/api/audio/interpretation/I${surahPadded}_${ayahPadded}.ogg`;
		}
		return `https://old.thafheem.net/audio/interpretation/I${surahPadded}_${ayahPadded}.ogg`;
	}

	// Default to qirath/quran
	const qariInitial = QARI_INITIALS[qariName] || "A"; // default Afasy
	const prefix = `Q${qariInitial}`;
	if (import.meta?.env?.DEV) {
		return `/api/audio/qirath/${qariName}/${prefix}${surahPadded}_${ayahPadded}.ogg`;
	}
	return `https://old.thafheem.net/audio/qirath/${qariName}/${prefix}${surahPadded}_${ayahPadded}.ogg`;
}

// Plays given ayah and updates callbacks for state
export async function playAyahAudio({ ayahNumber, surahNumber, audioType = "qirath", qariName = "al-afasy", playbackSpeed = 1.0, translationLanguage = null, onStart, onEnd, onError }) {
	const url = await buildAyahAudioUrl({ ayahNumber, surahNumber, audioType, qariName, translationLanguage });
	
	// If URL is null (e.g., API failed for Urdu), trigger error callback
	if (!url) {
		if (typeof onError === "function") {
			onError(new Error(`Audio URL not available for ${audioType}`));
		}
		return null;
	}
	
	const audio = new Audio(url);
	audio.preload = "none";
	audio.playbackRate = playbackSpeed;

	// Set up event handlers before playing
	audio.onplay = () => {
		if (typeof onStart === "function") onStart();
	};
	if (typeof onEnd === "function") audio.onended = onEnd;
	if (typeof onError === "function") {
		audio.onerror = (e) => {
			console.error(`Audio error for ${audioType}:`, e);
			if (typeof onError === "function") onError(e);
		};
	}

	// Start loading and playing
	audio.play().catch((e) => {
		console.error(`Error playing audio for ${audioType}:`, e);
		if (typeof onError === "function") onError(e);
	});

	return audio;
}

export function getQariInitial(qariName) {
	return QARI_INITIALS[qariName] || "A";
}


