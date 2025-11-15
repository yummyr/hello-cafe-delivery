import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../components/ToastNotification";
import MenuItemModal from "../components/MenuItemModal";
import MenuItemCard from "../components/MenuItemCard";
import shoppingCartAPI from "../../../api/shoppingCart";
import favoritesAPI from "../../../api/favorites";

function UserMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState(new Set());

  // Pagination: 3 columns x 4 rows = 12 items per page
  const ITEMS_PER_PAGE = 12;

  // Fetch menu items based on category
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      let response;

      if (categoryId === "null" || categoryId === null) {
        // Fetch all menu items
        response = await api.get("/user/menu/all");
      } else {
        // Fetch items by category
        response = await api.get(`/user/menu/category/${categoryId}`);
      }

      if (response.data.code === 1) {
        // Transform API data to match frontend format
        const transformedItems = response.data.data.map((item, index) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          categoryName: item.categoryName,
          description: item.description,
          rating: 4.8 - index * 0.05, // Simulated ratings
        }));
        setMenuItems(transformedItems);
        setFilteredItems(transformedItems);

        // Calculate total pages
        const total = transformedItems.length;
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    let newFilteredItems;
    if (query.trim() === "") {
      newFilteredItems = menuItems;
    } else {
      newFilteredItems = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredItems(newFilteredItems);
    setCurrentPage(1); // Reset to first page when searching

    // Recalculate total pages
    const total = newFilteredItems.length;
    setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
  };

  // Get items for current page
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, endIndex);
  };

  // Handle pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleAddToCart = async (e, item) => {
    e.stopPropagation(); // Stop event propagation to avoid triggering card click event

    try {
      const response = await shoppingCartAPI.addItem(item.id);
      if (response.data.code === 1) {
        setToast({
          message: `${item.name} added to cart!`,
          isVisible: true,
        });
        // Update cart count
        await refreshCartCount();
      } else {
        setToast({
          message: "Failed to add item to cart",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setToast({
        message: "Error adding item to cart",
        isVisible: true,
      });
    }
  };

  const handleToggleFavorite = async (e, item) => {
    e.stopPropagation();

    try {
      const favoriteData = {
        itemType: "menu_item",
        itemId: item.id,
        itemName: item.name,
        itemImage: item.image,
        itemPrice: item.price,
      };

      const response = await favoritesAPI.toggleFavorite(favoriteData);
      if (response.data.code === 1) {
        const isFavorite = response.data.data.isFavorite;
        setFavoriteItems((prev) => {
          const newSet = new Set(prev);
          if (isFavorite) {
            newSet.add(item.id);
          } else {
            newSet.delete(item.id);
          }
          return newSet;
        });
        setToast({
          message: isFavorite
            ? `${item.name} added to favorites!`
            : `${item.name} removed from favorites`,
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
    fetchMenuItems();
  }, [categoryId]);

  useEffect(() => {
    // Recalculate total pages when filtered items change
    const total = filteredItems.length;
    setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredItems, currentPage, totalPages]);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading menu items...</p>
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
                {categoryId === "null" || categoryId === null
                  ? "All Menu Items"
                  : "Menu Items"}
              </h1>
              <p className="text-gray-600">
                {filteredItems.length} item
                {filteredItems.length !== 1 ? "s" : ""} found
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
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search menu items..."
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        {currentPageItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentPageItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favoriteItems.has(item.id)}
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
                            ? "bg-blue-600 text-white"
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
                ? "No menu items found matching your search."
                : "No menu items available in this category."}
            </p>
          </div>
        )}
      </div>

      {/* MenuItem Modal */}
      {showItemModal && selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => {
            setShowItemModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </UserLayout>
  );
}

export default UserMenuPage;
