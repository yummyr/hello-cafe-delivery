import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, ChevronLeft, ChevronRight, Plus, Info, Heart } from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import { combosAPI } from "../../../api/combos";
import { shoppingCartAPI } from "../../../api/shoppingCart";
import { favoritesAPI } from "../../../api/favorites";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../../../components/ToastNotification";

function CombosPage() {
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

  // 获取所有套餐
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
          image: combo.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
          description: combo.description,
          categoryId: combo.categoryId,
          status: combo.status,
          rating: 4.9 - (index * 0.03), // Simulated ratings
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

  // 获取套餐详情（包含的菜品）
  const fetchComboDetails = async (comboId) => {
    try {
      const response = await combosAPI.getComboMenuItems(comboId);
      if (response.data.code === 1) {
        setComboMenuItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch combo details:", error);
      setComboMenuItems([]);
    }
  };

  // 处理搜索功能
  const handleSearch = (query) => {
    setSearchQuery(query);
    let newFilteredCombos;
    if (query.trim() === "") {
      newFilteredCombos = combos;
    } else {
      newFilteredCombos = combos.filter(combo =>
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

  // 获取当前页的套餐
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCombos.slice(startIndex, endIndex);
  };

  // 处理分页
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 查看套餐详情
  const handleViewDetails = async (combo) => {
    setSelectedCombo(combo);
    setShowDetailsModal(true);
    await fetchComboDetails(combo.id);
  };

  // 添加套餐到购物车
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

  // 切换收藏状态
  const handleToggleFavorite = async (e, combo) => {
    e.stopPropagation();

    try {
      const favoriteData = {
        itemType: 'combo',
        itemId: combo.id,
        itemName: combo.name,
        itemImage: combo.image,
        itemPrice: combo.price
      };

      const response = await favoritesAPI.toggleFavorite(favoriteData);
      if (response.data.code === 1) {
        const isFavorite = response.data.data.isFavorite;
        setFavoriteCombos(prev => {
          const newSet = new Set(prev);
          if (isFavorite) {
            newSet.add(combo.id);
          } else {
            newSet.delete(combo.id);
          }
          return newSet;
        });
        setToast({
          message: isFavorite ? `${combo.name} added to favorites!` : `${combo.name} removed from favorites`,
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
                {filteredCombos.length} combo{filteredCombos.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
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
                <div
                  key={combo.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Combo Deal
                    </div>
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, combo)}
                      className="absolute top-3 right-12 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition hover:scale-110"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          favoriteCombos.has(combo.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, combo)}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition hover:scale-110"
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {combo.name}
                    </h3>
                    {combo.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {combo.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-amber-600">
                        ${combo.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {combo.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(combo)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                    >
                      <Info className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
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
                            ? 'bg-amber-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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
              {searchQuery ? 'No combo packages found matching your search.' : 'No combo packages available.'}
            </p>
          </div>
        )}

        {/* Combo Details Modal */}
        {showDetailsModal && selectedCombo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="relative">
                <img
                  src={selectedCombo.image}
                  alt={selectedCombo.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedCombo.name}
                </h2>

                {selectedCombo.description && (
                  <p className="text-gray-600 mb-6">
                    {selectedCombo.description}
                  </p>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Included Items:
                  </h3>
                  {comboMenuItems.length > 0 ? (
                    <div className="space-y-2">
                      {comboMenuItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=100&q=80"}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                          <div className="text-sm font-medium text-amber-600">
                            ×{item.copies}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items information available</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-amber-600">
                      ${selectedCombo.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      handleAddToCart(e, selectedCombo);
                      setShowDetailsModal(false);
                    }}
                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default CombosPage;