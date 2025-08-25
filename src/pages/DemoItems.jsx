import React, { useState } from "react";

const DemoItems = () => {
  const [pageSearch, setPageSearch] = useState("");

  // Generate all 604 pages of the Quran
  const pageList = Array.from({ length: 604 }, (_, index) => ({
    id: index + 1,
    number: index + 1,
    name: `Page ${index + 1}`,
    // You can add additional data like starting surah, verse, etc.
    startSurah: index < 10 ? "Al-Fatihah" : index < 50 ? "Al-Baqarah" : "Various",
  }));

  // filter by page number or name
  const filteredPages = pageList.filter(
    (page) =>
      page.name.toLowerCase().includes(pageSearch.toLowerCase()) ||
      page.number.toString().includes(pageSearch) ||
      page.startSurah.toLowerCase().includes(pageSearch.toLowerCase())
  );

  return (
    <>
      <div className="bg-white w-90 max-h-96 flex flex-col shadow rounded-lg">
        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search Page"
            value={pageSearch}
            onChange={(e) => setPageSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Page List */}
        <div className="flex-1 overflow-y-auto px-4 pb-3">
          {filteredPages.length > 0 ? (
            <div className="space-y-2">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="cursor-pointer text-gray-800 hover:text-blue-600 transition-colors py-1"
                >
                  {page.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No page found
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100 bg-gray-50">
          {filteredPages.length} of {pageList.length} pages
        </div>
      </div>
    </>
  );
};

export default DemoItems;
