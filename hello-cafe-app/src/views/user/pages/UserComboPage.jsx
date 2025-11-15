import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../components/ToastNotification";
import ComboCard from "../components/ComboCard";
import ComboDetailsModal from "../components/ComboDetailsModal";
import shoppingCartAPI from "../../../api/shoppingCart";
import favoritesAPI from "../../../api/favorites";

// Combos API functions
const combosAPI = {
  // Get all active combos
  getAllCombos: () => {
    return api.get("/user/combo/all");
  },

  // Get combos by category ID
  getCombosByCategory: (categoryId) => {
    return api.get(`/user/combo/list?categoryId=${categoryId}`);
  },

  // Get combo menu items
  getComboMenuItems: (comboId) => {
    return api.get(`/user/combo/menu_item/${comboId}`);
  },
};

function UserComboPage() {
  const navigate = useNavigate();

  const [combos, setCombos] = useState([]);
  const [filteredCombos, setFilteredCombos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [comboMenuItems, setComboMenuItems] = useState([]);
  const [favoriteCombos, setFavoriteCombos] = useState(new Set());

  // Pagination: 3 columns x 4 rows = 12 items per page
  const ITEMS_PER_PAGE = 12;

  // Get all combos
  const fetchCombos = async () => {
    try {
      setLoading(true);
      const response = await combosAPI.getAllCombos();

      if (response.data.code === 1) {
        // Transform API data to match frontend format
        const transformedCombos = response.data.data.map((combo, index) => ({
          id: combo.id,
          name: combo.name,
          price: combo.price,
          image: combo.image,
          description: combo.description,
          categoryId: combo.categoryId,
          status: combo.status,
          rating: 4.9 - index * 0.03, // Simulated ratings
        }));
        setCombos(transformedCombos);
        setFilteredCombos(transformedCombos);

        // Calculate total pages
        const total = transformedCombos.length;
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Failed to fetch combos:", error);
      setToast({
        message: "Failed to load combo packages",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get combo details (included menu items)
  const fetchComboDetails = async (comboId) => {
    try {
      const response = await api.get(`/admin/combo/${comboId}`);
      if (response.data.code === 1) {
        // Use the items array from the new ComboVO structure
        const items = response.data.data.items || [];
        setComboMenuItems(items);
      }
    } catch (error) {
      console.error("Failed to fetch combo details:", error);
      setComboMenuItems([]);
    }
  };

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    let newFilteredCombos;
    if (query.trim() === "") {
      newFilteredCombos = combos;
    } else {
      newFilteredCombos = combos.filter(
        (combo) =>
          combo.name.toLowerCase().includes(query.toLowerCase()) ||
          combo.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredCombos(newFilteredCombos);
    setCurrentPage(1); // Reset to first page when searching

    // Recalculate total pages
    const total = newFilteredCombos.length;
    setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
  };

  // Get current page combos
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCombos.slice(startIndex, endIndex);
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // View combo details
  const handleViewDetails = async (combo) => {
    setSelectedCombo(combo);
    setShowDetailsModal(true);
    await fetchComboDetails(combo.id);
  };

  // Add combo to shopping cart
  const handleAddToCart = async (e, combo) => {
    e.stopPropagation();

    try {
      const response = await shoppingCartAPI.addItem(null, null, combo.id); // setmealId for combo
      if (response.data.code === 1) {
        setToast({
          message: `${combo.name} added to cart!`,
          isVisible: true,
        });
        await refreshCartCount();
      } else {
        setToast({
          message: "Failed to add combo to cart",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error adding combo to cart:", error);
      setToast({
        message: "Error adding combo to cart",
        isVisible: true,
      });
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (e, combo) => {
    e.stopPropagation();

    try {
      const favoriteData = {
        itemType: "combo",
        itemId: combo.id,
        itemName: combo.name,
        itemImage: combo.image,
        itemPrice: combo.price,
      };

      const response = await favoritesAPI.toggleFavorite(favoriteData);
      if (response.data.code === 1) {
        const isFavorite = response.data.data.isFavorite;
        setFavoriteCombos((prev) => {
          const newSet = new Set(prev);
          if (isFavorite) {
            newSet.add(combo.id);
          } else {
            newSet.delete(combo.id);
          }
          return newSet;
        });
        setToast({
          message: isFavorite
            ? `${combo.name} added to favorites!`
            : `${combo.name} removed from favorites`,
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setToast({
        message: "Failed to update favorites",
        isVisible: true,
      });
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  useEffect(() => {
    // Recalculate total pages when filtered items change
    const total = filteredCombos.length;
    setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredCombos, currentPage, totalPages]);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading combo packages...</p>
        </div>
      </UserLayout>
    );
  }

  const currentPageItems = getCurrentPageItems();

  return (
    <UserLayout>
      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Combo Packages
              </h1>
              <p className="text-gray-600">
                {filteredCombos.length} combo
                {filteredCombos.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Search combo packages..."
            />
          </div>
        </div>

        {/* Combos Grid */}
        {currentPageItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentPageItems.map((combo) => (
                <ComboCard
                  key={combo.id}
                  combo={combo}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                  isFavorite={favoriteCombos.has(combo.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-amber-600 text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "No combo packages found matching your search."
                : "No combo packages available."}
            </p>
          </div>
        )}

        {/* Combo Details Modal */}
        {showDetailsModal && selectedCombo && (
          <ComboDetailsModal
            selectedCombo={selectedCombo}
            comboMenuItems={comboMenuItems}
            onClose={() => setShowDetailsModal(false)}
            onAddToCart={(combo) => {
              // Create a synthetic event to match the existing handler signature
              const syntheticEvent = { stopPropagation: () => {} };
              handleAddToCart(syntheticEvent, combo);
            }}
          />
        )}
      </div>
    </UserLayout>
  );
}

export default UserComboPage;
