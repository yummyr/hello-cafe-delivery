import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search,ChevronLeft } from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../components/ToastNotification";
import MenuItemModal from "../components/MenuItemModal";
import MenuItemCard from "../components/MenuItemCard";
import shoppingCartAPI from "../../../api/shoppingCart";
import favoritesAPI from "../../../api/favorites";
import Pagination from "../../admin/components/Pagination";

function UserMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // 3 columns x 4 rows = 12 items per page
  const [total, setTotal] = useState(1);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState(new Set());

  // Debouncing for search
  const debounceTimeoutRef = useRef(null);

  // Fetch menu items based on category with pagination
  const fetchMenuItems = async (
    currentPage = page,
    currentPageSize = pageSize,
    searchName = null
  ) => {
    try {
      setLoading(true);

      // Fetch all menu items with pagination
      const params = {
        page: currentPage,
        pageSize: currentPageSize,
      };
      if (searchName) {
        params.name = searchName;
      }
      if (categoryId) {
        params.categoryId = categoryId;
      }

      const response = await api.get("/user/menu/page", { params });

      console.log("menu response:", response);

      if (response.data.code === 1) {
        // Transform API data to match frontend format
        const transformedItems = response.data.data.records.map(
          (item, index) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            categoryName: item.categoryName,
            description: item.description,
            rating: 4.8 - index * 0.05, // Simulated ratings
          })
        );
        setMenuItems(transformedItems);
        console.log("menu items: ",menuItems);
        
        setTotal(response.data.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      setToast({
        message: "Failed to load menu items",
        isVisible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality with debouncing
  const handleSearch = (query) => {
    setSearchQuery(query);

    // Clear the previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout to fetch data after 500ms of no typing
    debounceTimeoutRef.current = setTimeout(() => {
      setPage(1); // Reset to first page when searching
      fetchMenuItems(1, pageSize, query);
    }, 500);
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
    setPage(1); // Reset to first page when category changes
    fetchMenuItems(1, pageSize, searchQuery);
  }, [categoryId]);

  useEffect(() => {
    fetchMenuItems(page, pageSize, searchQuery);
  }, [page, pageSize]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading menu items...</p>
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
                {categoryId === "null" || categoryId === null
                  ? "All Menu Items"
                  : "Menu Items"}
              </h1>
              <p className="text-gray-600">
                {total} item
                {total !== 1 ? "s" : ""} found
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
        {menuItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {menuItems.map((item) => (
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
            <Pagination
              totalItems={total}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={(p) => {
                setPage(p);
                fetchMenuItems(p, pageSize, searchQuery);
              }}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1); // reset to first page
                fetchMenuItems(1, size, searchQuery);
              }}
              showInfo={true}
            />
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
