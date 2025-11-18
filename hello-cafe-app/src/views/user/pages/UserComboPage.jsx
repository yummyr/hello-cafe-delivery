import { useState, useEffect, useRef } from "react";
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
import Pagination from "../../../components/Pagination";

function UserComboPage() {
  const navigate = useNavigate();

  const [combos, setCombos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(1);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [comboMenuItems, setComboMenuItems] = useState([]);
  const [favoriteCombos, setFavoriteCombos] = useState(new Set());

  // cancel request controller
  const abortControllerRef = useRef(null);

  // Get all combos
  const fetchCombos = async (
    currentPage = page,
    currentPageSize = pageSize,
    searchName = null
  ) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        pageSize: currentPageSize,
      };

      // Add search parameter if provided
      if (searchName) {
        params.name = searchName;
      }

      const response = await api.get("/user/combo/page", {
        params: params,
        signal: abortControllerRef.current.signal,
      });
      console.log("combo response:", response);
      if (response.data.code === 1) {
        console.log("combo list:", response.data.data.records);
        setCombos(response.data.data.records || []);
        console.log("combo page total:", response.data.total);

        setTotal(response.data.data.total);
      }
    } catch (error) {
      if (!error.name?.includes("Cancel") && error.code !== "ERR_CANCELED") {
        console.error("Failed to fetch combos:", error);
        setToast({
          message: "Failed to load combo packages",
          isVisible: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Get combo details (included menu items)
  const fetchComboDetails = async (comboId) => {
    try {
      const response = await api.get(`/user/combo/${comboId}`);
      if (response.data.code === 1) {
        // Use the items array from the new ComboVO structure
        const items = response.data.data.items || [];
        console.log("combo details items list: ", items);

        setComboMenuItems(items);
      }
    } catch (error) {
      console.error("Failed to fetch combo details:", error);
      setComboMenuItems([]);
    }
  };

  // Handle search functionality with debouncing
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
    fetchCombos(1, pageSize, query);
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
      const response = await shoppingCartAPI.addItem(null, null, combo.id); 
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

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCombo(null);
    setComboMenuItems([]);
  };

  useEffect(() => {
    fetchCombos(page, pageSize, searchQuery);
  }, [page, pageSize]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (loading && combos.length === 0) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading combo packages...</p>
        </div>
      </UserLayout>
    );
  }

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
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white
               placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2
                focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Search combo packages..."
            />
          </div>
        </div>

        {/* Combo Cards */}
        {combos.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No combo packages found.</p>
            {searchQuery && (
              <p className="text-gray-400 mt-2">
                Try adjusting your search terms
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {combos.map((combo) => (
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
        )}

        {/* pagination */}
        <Pagination
          totalItems={total}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={(p) => {
            setPage(p);
            fetchCombos(p, pageSize, searchQuery);
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1); // reset to first page
            fetchCombos(1, size, searchQuery);
          }}
          showInfo={true}
        />

        {/* Combo Details Modal */}
        {showDetailsModal && selectedCombo && (
          <ComboDetailsModal
            selectedCombo={selectedCombo}
            comboMenuItems={comboMenuItems}
            onClose={() =>handleCloseDetailsModal()}
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
