// Audio utilities for ayah-wise playback

const QARI_INITIALS = {
	"al-ghamidi": "G",
	"al-afasy": "A",
	"al-hudaify": "H",
};

export function buildAyahAudioUrl({ ayahNumber, surahNumber, audioType = "qirath", qariName = "al-afasy" }) {
	const surahPadded = String(surahNumber).padStart(3, "0");
	const ayahPadded = String(ayahNumber).padStart(3, "0");

	if (audioType === "translation") {
		if (import.meta?.env?.DEV) {
			return `/api/audio/translation/T${surahPadded}_${ayahPadded}.ogg`;
		}
		return `https://old.thafheem.net/audio/translation/T${surahPadded}_${ayahPadded}.ogg`;
	}

	if (audioType === "interpretation") {
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
export function playAyahAudio({ ayahNumber, surahNumber, audioType = "qirath", qariName = "al-afasy", playbackSpeed = 1.0, onStart, onEnd, onError }) {
	const url = buildAyahAudioUrl({ ayahNumber, surahNumber, audioType, qariName });
	const audio = new Audio(url);
	audio.preload = "none";
	audio.playbackRate = playbackSpeed;

	audio.onplay = () => {
		if (typeof onStart === "function") onStart();
	};
	if (typeof onEnd === "function") audio.onended = onEnd;
	if (typeof onError === "function") audio.onerror = onError;

	audio.play().catch((e) => {
		if (typeof onError === "function") onError(e);
	});

	return audio;
}

export function getQariInitial(qariName) {
	return QARI_INITIALS[qariName] || "A";
}


