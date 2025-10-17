/**
 * Request deduplication utility to prevent duplicate API calls
 * Tracks in-flight requests by URL and returns existing promise if same request is pending
 */

class RequestDeduplicator {
  constructor() {
    this.pendingRequests = new Map();
    this.requestTimeouts = new Map();
    this.maxRequestAge = 30000; // 30 seconds max request age
  }

  /**
   * Generate a unique key for the request
   * @param {string} url - Request URL
   * @param {object} options - Fetch options (optional)
   * @returns {string} Unique request key
   */
  generateRequestKey(url, options = {}) {
    // Include method and body in the key to handle different request types
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Wrap fetch with deduplication logic
   * @param {string} url - Request URL
   * @param {object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async fetchWithDeduplication(url, options = {}) {
    const key = this.generateRequestKey(url, options);
    
    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      console.log(`🔄 Request DEDUPLICATED: ${url}`);
      return this.pendingRequests.get(key);
    }

    // Create new request promise
    const requestPromise = this.makeRequest(url, options);
    
    // Store the promise
    this.pendingRequests.set(key, requestPromise);
    
    // Set timeout to clean up old requests
    const timeoutId = setTimeout(() => {
      this.cleanupRequest(key);
    }, this.maxRequestAge);
    
    this.requestTimeouts.set(key, timeoutId);

    try {
      const response = await requestPromise;
      return response;
    } finally {
      // Clean up after request completes
      this.cleanupRequest(key);
    }
  }

  /**
   * Make the actual fetch request
   * @param {string} url - Request URL
   * @param {object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async makeRequest(url, options) {
    console.log(`🌐 Making NEW request: ${url}`);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Clean up completed or expired request
   * @param {string} key - Request key
   */
  cleanupRequest(key) {
    this.pendingRequests.delete(key);
    
    const timeoutId = this.requestTimeouts.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.requestTimeouts.delete(key);
    }
  }

  /**
   * Get statistics about pending requests
   * @returns {object} Request statistics
   */
  getStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      requestKeys: Array.from(this.pendingRequests.keys())
    };
  }

  /**
   * Clear all pending requests (useful for cleanup)
   */
  clearAllRequests() {
    // Clear timeouts
    for (const timeoutId of this.requestTimeouts.values()) {
      clearTimeout(timeoutId);
    }
    
    // Clear maps
    this.pendingRequests.clear();
    this.requestTimeouts.clear();
    
    console.log('🧹 All pending requests cleared');
  }

  /**
   * Check if a request is currently pending
   * @param {string} url - Request URL
   * @param {object} options - Fetch options
   * @returns {boolean} Whether request is pending
   */
  isRequestPending(url, options = {}) {
    const key = this.generateRequestKey(url, options);
    return this.pendingRequests.has(key);
  }

  /**
   * Cancel a specific pending request
   * @param {string} url - Request URL
   * @param {object} options - Fetch options
   * @returns {boolean} Whether request was cancelled
   */
  cancelRequest(url, options = {}) {
    const key = this.generateRequestKey(url, options);
    if (this.pendingRequests.has(key)) {
      this.cleanupRequest(key);
      console.log(`❌ Request cancelled: ${url}`);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export default new RequestDeduplicator();

/**
 * Enhanced fetch function with deduplication
 * Drop-in replacement for fetch() that prevents duplicate requests
 * 
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const fetchDeduplicated = (url, options = {}) => {
  return requestDeduplicator.fetchWithDeduplication(url, options);
};

// Also export the instance for direct access
export const requestDeduplicator = new RequestDeduplicator();
