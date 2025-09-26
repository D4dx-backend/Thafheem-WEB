// const THAFHEEM_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://thafheem.net/thafheem-api';

// class BookmarkService {
//   // Provide a persistent guest id for unauthenticated users
//   static getGuestUserId() {
//     try {
//       const key = 'thafheem_guest_user_id';
//       let guestId = localStorage.getItem(key);
//       if (!guestId) {
//         guestId = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`;
//         localStorage.setItem(key, guestId);
//       }
//       return guestId;
//     } catch (_) {
//       // In environments without localStorage, fallback to a constant id
//       return 'guest_user';
//     }
//   }

//   static getEffectiveUserId(user) {
//     return user?.uid || this.getGuestUserId();
//   }
//   // Fallback to localStorage if API is not available
//   static getLocalStorageKey(userId) {
//     return `bookmarks_${userId}`;
//   }

//   static getLocalBookmarks(userId) {
//     try {
//       const stored = localStorage.getItem(this.getLocalStorageKey(userId));
//       return stored ? JSON.parse(stored) : [];
//     } catch (error) {
//       console.error('Error reading local bookmarks:', error);
//       return [];
//     }
//   }

//   static saveLocalBookmarks(userId, bookmarks) {
//     try {
//       localStorage.setItem(this.getLocalStorageKey(userId), JSON.stringify(bookmarks));
//     } catch (error) {
//       console.error('Error saving local bookmarks:', error);
//     }
//   }

//   // Get user bookmarks
//   static async getBookmarks(userId, bookmarkType = 'translation') {
//     try {
//       const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks?userId=${userId}&bkType=${bookmarkType}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         // Fallback to localStorage if API fails
//         console.log('API failed, using localStorage fallback');
//         // Filter local bookmarks by type when using fallback
//         const all = this.getLocalBookmarks(userId);
//         return Array.isArray(all)
//           ? all.filter(b => (bookmarkType ? b.bookmarkType === bookmarkType : true))
//           : [];
//       }

//       const data = await response.json();
      
//       // Handle different response formats
//       if (Array.isArray(data)) {
//         return data;
//       } else if (data.bookmarks && Array.isArray(data.bookmarks)) {
//         return data.bookmarks;
//       } else if (data.data && Array.isArray(data.data)) {
//         return data.data;
//       }
      
//       return [];
//     } catch (error) {
//       console.error('Error fetching bookmarks, using localStorage fallback:', error);
//       // Fallback to localStorage (filtered by type)
//       const all = this.getLocalBookmarks(userId);
//       return Array.isArray(all)
//         ? all.filter(b => (bookmarkType ? b.bookmarkType === bookmarkType : true))
//         : [];
//     }
//   }

//   // Add bookmark
//   static async addBookmark(userId, surahId, verseId, bookmarkType = 'translation', surahName = '', verseText = '') {
//     const bookmarkData = {
//       id: `${userId}_${surahId}_${verseId}_${Date.now()}`,
//       userId: userId,
//       surahId: parseInt(surahId),
//       verseId: parseInt(verseId),
//       bookmarkType: bookmarkType,
//       surahName: surahName,
//       verseText: verseText,
//       createdAt: new Date().toISOString()
//     };

//     try {
//       const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookmarkData),
//       });

//       if (!response.ok) {
//         // Fallback to localStorage
//         console.log('API failed, using localStorage fallback for adding bookmark');
//         const localBookmarks = this.getLocalBookmarks(userId);
//         localBookmarks.push(bookmarkData);
//         this.saveLocalBookmarks(userId, localBookmarks);
//         return bookmarkData;
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error adding bookmark, using localStorage fallback:', error);
//       // Fallback to localStorage
//       const localBookmarks = this.getLocalBookmarks(userId);
//       localBookmarks.push(bookmarkData);
//       this.saveLocalBookmarks(userId, localBookmarks);
//       return bookmarkData;
//     }
//   }

//   // Add an Ayah-wise interpretation bookmark
//   static async addAyahInterpretationBookmark(userId, surahId, verseId, surahName, verseText = '') {
//     try {
//       const bookmarkData = {
//         userId,
//         surahId,
//         verseId,
//         surahName,
//         verseText,
//         type: 'interpretation',
//         timestamp: new Date().toISOString()
//       };
  
//       // Try API first (without Content-Type header to avoid CORS issue)
//       const response = await fetch(`${API_BASE_URL}/bookmarks`, {
//         method: 'POST',
//         body: JSON.stringify(bookmarkData)
//       });
  
//       if (!response.ok) {
//         throw new Error('API bookmark failed');
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.warn('API bookmark failed, using local storage:', error);
//       // Fallback to local storage
//       return this.addLocalBookmark(userId, {
//         ...bookmarkData,
//         id: `local-${Date.now()}`
//       });
//     }
//   }

//   // Add a block bookmark (single record representing a range)
//   static async addBlockBookmark(userId, surahId, fromAyah, toAyah, surahName = '') {
//     const bookmarkData = {
//       id: `${userId}_${surahId}_${fromAyah}_${toAyah}_${Date.now()}`,
//       userId: userId,
//       surahId: parseInt(surahId),
//       verseId: parseInt(fromAyah),
//       bookmarkType: 'block',
//       surahName: surahName && surahName.trim() ? surahName : `Surah ${surahId}`,
//       blockFrom: parseInt(fromAyah),
//       blockTo: parseInt(toAyah),
//       createdAt: new Date().toISOString()
//     };

//     try {
//       const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookmarkData),
//       });

//       if (!response.ok) {
//         // Fallback to localStorage
//         const localBookmarks = this.getLocalBookmarks(userId);
//         localBookmarks.push(bookmarkData);
//         this.saveLocalBookmarks(userId, localBookmarks);
//         return bookmarkData;
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error adding block bookmark, using localStorage fallback:', error);
//       const localBookmarks = this.getLocalBookmarks(userId);
//       localBookmarks.push(bookmarkData);
//       this.saveLocalBookmarks(userId, localBookmarks);
//       return bookmarkData;
//     }
//   }

//   // Delete bookmark
//   static async deleteBookmark(bookmarkId, userId = null) {
//     try {
//       const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks/delete/${bookmarkId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         // Fallback to localStorage
//         if (userId) {
//           console.log('API failed, using localStorage fallback for deleting bookmark');
//           const localBookmarks = this.getLocalBookmarks(userId);
//           const filteredBookmarks = localBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
//           this.saveLocalBookmarks(userId, filteredBookmarks);
//         }
//         return { success: true };
//       }

//       return { success: true };
//     } catch (error) {
//       console.error('Error deleting bookmark, using localStorage fallback:', error);
//       // Fallback to localStorage
//       if (userId) {
//         const localBookmarks = this.getLocalBookmarks(userId);
//         const filteredBookmarks = localBookmarks.filter(bookmark => bookmark.id !== bookmarkId);
//         this.saveLocalBookmarks(userId, filteredBookmarks);
//       }
//       return { success: true };
//     }
//   }

//   // Check if verse is bookmarked
//   static async isBookmarked(userId, surahId, verseId, bookmarkType = 'translation') {
//     try {
//       const bookmarks = await this.getBookmarks(userId, bookmarkType);
//       return bookmarks.some(bookmark => 
//         bookmark.surahId === parseInt(surahId) && bookmark.verseId === parseInt(verseId)
//       );
//     } catch (error) {
//       console.error('Error checking bookmark status:', error);
//       return false;
//     }
//   }
// }

// export default BookmarkService;

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
      return 'guest_user';
    }
  }

  static getEffectiveUserId(user) {
    return user?.uid || this.getGuestUserId();
  }

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
        console.log('API failed, using localStorage fallback');
        const all = this.getLocalBookmarks(userId);
        return Array.isArray(all)
          ? all.filter(b => (bookmarkType ? b.bookmarkType === bookmarkType : true))
          : [];
      }

      const data = await response.json();
      
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
      const localBookmarks = this.getLocalBookmarks(userId);
      localBookmarks.push(bookmarkData);
      this.saveLocalBookmarks(userId, localBookmarks);
      return bookmarkData;
    }
  }

  // Add an Ayah-wise interpretation bookmark
  static async addAyahInterpretationBookmark(userId, surahId, verseId, surahName, verseText = '') {
    // Define bookmarkData OUTSIDE the try block so it's accessible in catch
    const bookmarkData = {
      id: `${userId}_${surahId}_${verseId}_interpretation_${Date.now()}`,
      userId,
      surahId: parseInt(surahId),
      verseId: parseInt(verseId),
      surahName,
      verseText,
      bookmarkType: 'interpretation',
      createdAt: new Date().toISOString()
    };

    try {
      // Try API first (without Content-Type header to avoid CORS issue)
      const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks`, {
        method: 'POST',
        body: JSON.stringify(bookmarkData)
      });

      if (!response.ok) {
        throw new Error('API bookmark failed');
      }

      return await response.json();
    } catch (error) {
      console.warn('API bookmark failed, using local storage:', error);
      // Fallback to local storage
      const localBookmarks = this.getLocalBookmarks(userId);
      localBookmarks.push(bookmarkData);
      this.saveLocalBookmarks(userId, localBookmarks);
      return bookmarkData;
    }
  }

  // Add a block-wise interpretation bookmark
  static async addBlockInterpretationBookmark(userId, surahId, range, surahName, interpretationNo = 1, language = 'en') {
    const bookmarkData = {
      id: `${userId}_${surahId}_${range}_block_${Date.now()}`,
      userId,
      surahId: parseInt(surahId),
      range,
      surahName,
      bookmarkType: 'block-interpretation',
      interpretationNo,
      language,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${THAFHEEM_API_BASE}/bookmarks`, {
        method: 'POST',
        body: JSON.stringify(bookmarkData)
      });

      if (!response.ok) {
        throw new Error('API bookmark failed');
      }

      return await response.json();
    } catch (error) {
      console.warn('API bookmark failed, using local storage:', error);
      const localBookmarks = this.getLocalBookmarks(userId);
      localBookmarks.push(bookmarkData);
      this.saveLocalBookmarks(userId, localBookmarks);
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