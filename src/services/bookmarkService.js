const THAFHEEM_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://thafheem.net/thafheem-api';

class BookmarkService {
  // Provide a persistent guest id for unauthenticated users
  static getGuestUserId() {
    try {
      const key = 'thafheem_guest_user_id';
      let guestId = localStorage.getItem(key);
      if (!guestId) {
        guestId = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
        localStorage.setItem(key, guestId);
      }
      return guestId;
    } catch (_) {
      // In environments without localStorage, fallback to a constant id
      return 'guest_user';
    }
  }

  static getEffectiveUserId(user) {
    return user?.uid || this.getGuestUserId();
  }
  // Fallback to localStorage if API is not available
  static getLocalStorageKey(userId) {
    return `bookmarks_${userId}`;
  }

  static getLocalBookmarks(userId) {
    try {
      const stored = localStorage.getItem(this.getLocalStorageKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local bookmarks:', error);
      return [];
    }
  }

  static saveLocalBookmarks(userId, bookmarks) {
    try {
      localStorage.setItem(this.getLocalStorageKey(userId), JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving local bookmarks:', error);
    }
  }

  // Get user bookmarks
  static async getBookmarks(userId, bookmarkType = 'translation') {
    try {
      const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks?userId=${userId}&bkType=${bookmarkType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Fallback to localStorage if API fails
        console.log('API failed, using localStorage fallback');
        // Filter local bookmarks by type when using fallback
        const all = this.getLocalBookmarks(userId);
        return Array.isArray(all)
          ? all.filter(b => (bookmarkType ? b.bookmarkType === bookmarkType : true))
          : [];
      }

      const data = await response.json();
      
      // Handle different response formats
      if (Array.isArray(data)) {
        return data;
      } else if (data.bookmarks && Array.isArray(data.bookmarks)) {
        return data.bookmarks;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching bookmarks, using localStorage fallback:', error);
      // Fallback to localStorage (filtered by type)
      const all = this.getLocalBookmarks(userId);
      return Array.isArray(all)
        ? all.filter(b => (bookmarkType ? b.bookmarkType === bookmarkType : true))
        : [];
    }
  }

  // Add bookmark
  static async addBookmark(userId, surahId, verseId, bookmarkType = 'translation', surahName = '', verseText = '') {
    const bookmarkData = {
      id: `${userId}_${surahId}_${verseId}_${Date.now()}`,
      userId: userId,
      surahId: parseInt(surahId),
      verseId: parseInt(verseId),
      bookmarkType: bookmarkType,
      surahName: surahName,
      verseText: verseText,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmarkData),
      });

      if (!response.ok) {
        // Fallback to localStorage
        console.log('API failed, using localStorage fallback for adding bookmark');
        const localBookmarks = this.getLocalBookmarks(userId);
        localBookmarks.push(bookmarkData);
        this.saveLocalBookmarks(userId, localBookmarks);
        return bookmarkData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding bookmark, using localStorage fallback:', error);
      // Fallback to localStorage
      const localBookmarks = this.getLocalBookmarks(userId);
      localBookmarks.push(bookmarkData);
      this.saveLocalBookmarks(userId, localBookmarks);
      return bookmarkData;
    }
  }

  // Add an Ayah-wise interpretation bookmark
  static async addAyahInterpretationBookmark(userId, surahId, verseId, surahName = '', meta = {}) {
    const bookmarkData = {
      id: `${userId}_${surahId}_${verseId}_ayahinterp_${Date.now()}`,
      userId,
      surahId: parseInt(surahId),
      verseId: parseInt(verseId),
      bookmarkType: 'ayah-interpretation',
      surahName: surahName && surahName.trim() ? surahName : `Surah ${surahId}`,
      createdAt: new Date().toISOString(),
      ...meta,
    };

    try {
      const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmarkData),
      });
      if (!response.ok) {
        const local = this.getLocalBookmarks(userId);
        local.push(bookmarkData);
        this.saveLocalBookmarks(userId, local);
        return bookmarkData;
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding ayah interpretation bookmark, using local fallback:', error);
      const local = this.getLocalBookmarks(userId);
      local.push(bookmarkData);
      this.saveLocalBookmarks(userId, local);
      return bookmarkData;
    }
  }

  // Add a block bookmark (single record representing a range)
  static async addBlockBookmark(userId, surahId, fromAyah, toAyah, surahName = '') {
    const bookmarkData = {
      id: `${userId}_${surahId}_${fromAyah}_${toAyah}_${Date.now()}`,
      userId: userId,
      surahId: parseInt(surahId),
      verseId: parseInt(fromAyah),
      bookmarkType: 'block',
      surahName: surahName && surahName.trim() ? surahName : `Surah ${surahId}`,
      blockFrom: parseInt(fromAyah),
      blockTo: parseInt(toAyah),
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmarkData),
      });

      if (!response.ok) {
        // Fallback to localStorage
        const localBookmarks = this.getLocalBookmarks(userId);
        localBookmarks.push(bookmarkData);
        this.saveLocalBookmarks(userId, localBookmarks);
        return bookmarkData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding block bookmark, using localStorage fallback:', error);
      const localBookmarks = this.getLocalBookmarks(userId);
      localBookmarks.push(bookmarkData);
      this.saveLocalBookmarks(userId, localBookmarks);
      return bookmarkData;
    }
  }

  // Delete bookmark
  static async deleteBookmark(bookmarkId, userId = null) {
    try {
      const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks/delete/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Fallback to localStorage
        if (userId) {
          console.log('API failed, using localStorage fallback for deleting bookmark');
          const localBookmarks = this.getLocalBookmarks(userId);
          const filteredBookmarks = localBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
          this.saveLocalBookmarks(userId, filteredBookmarks);
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting bookmark, using localStorage fallback:', error);
      // Fallback to localStorage
      if (userId) {
        const localBookmarks = this.getLocalBookmarks(userId);
        const filteredBookmarks = localBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
        this.saveLocalBookmarks(userId, filteredBookmarks);
      }
      return { success: true };
    }
  }

  // Check if verse is bookmarked
  static async isBookmarked(userId, surahId, verseId, bookmarkType = 'translation') {
    try {
      const bookmarks = await this.getBookmarks(userId, bookmarkType);
      return bookmarks.some(bookmark => 
        bookmark.surahId === parseInt(surahId) && bookmark.verseId === parseInt(verseId)
      );
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }
}

export default BookmarkService;