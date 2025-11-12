import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Info,
  NotebookText,
} from "lucide-react";
import UserLayout from "../layouts/UserLayout";
import api from "../../../api";
import { shoppingCartAPI } from "../../../api/shoppingCart";
import { refreshCartCount } from "../../../hooks/useShoppingCart";
import ToastNotification from "../../../components/ToastNotification";


function UserDashboard() {
  const navigate = useNavigate();
  const storeInfo = {
    name: "Hello Cafe",
    address: "5173 Localhost Rd, Happywood, CA 92618, USA",
    phone: "(949) 555-8080",
    hours: "6:00 AM - 10:00 PM",
    description:
      "Your friendly neighborhood cafe serving premium coffee and delicious treats",
    image: "/assets/user_dashboard_bg.png",
  };
  const [featuredItems, setFeaturedItems] = useState([]);
  const [toast, setToast] = useState({ message: "", isVisible: false });

  const categories = [
    {
      id: 1,
      name: "Coffees",
      description: "Freshly brewed coffee",
      image:
        "/assets/house_coffee.jpeg",
    },
    {
      id: 2,
      name: "Burgers",
      description: "Juicy, flame-grilled burgers with premium ingredients and bold flavors",
      image:
        "/assets/burgers.jpeg",
    },
    {
      id: 3,
      name: "Sandwiches",
      description: "Freshly made sandwiches",
      image:
        "/assets/sandwiches.jpeg",
    },
    {
      id: 4,
      name: "Bakery",
      description: "Artisanal breads, pastries, and sweet treats baked fresh daily",
      image:
        "/assets/bakery.jpeg",
    },
    {
      id: 8,
      name: "Salads",
      description: "Vibrant, nutrient-packed salads with crisp greens and flavorful dressings",
      image:
        "/assets/salads.jpeg",
    },

    {
      id: null,
      name: "All other categories",
      description: "Explore our full menu with diverse and delicious offerings for every taste",
      image:
        "/assets/meal.jpeg",
    }
  ];
  const [loading, setLoading] = useState(true);
  const handleFindNew = () => {
    // navigate("/user/find-new");
  };

  const handleMustHave = () => {
    navigate("/user/combos");
  };

  // Fetch featured items
  const fetchFeaturedItems = async () => {
    try {
      const response = await api.get("/user/menu/featured");
      if (response.data.code === 1) {
        // Transform API data to match frontend format
        const transformedItems = response.data.data.map((item, index) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image:
            item.image ||
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
          categoryName: item.categoryName,
          description: item.description,
          badge: index < 3 ? `#${index + 1} Most liked` : null,
          rating: 4.8 - index * 0.1, // Simulated ratings
        }));
        setFeaturedItems(transformedItems);
      }
    } catch (error) {
      console.error("Failed to fetch featured items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchFeaturedItems()]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchFeaturedItems();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/user/menu?category=${categoryId}`);
  };

  const handleItemClick = (itemId) => {
    navigate(`/user/menu/item/${itemId}`);
  };

  const handleAddToCart = async (e, item) => {
    e.stopPropagation(); 

    try {
      const response = await shoppingCartAPI.addItem(item.id);
      if (response.data.code === 1) {
        setToast({
          message: `${item.name} added to cart!`,
          isVisible: true,
        });
        // update cart count
        refreshCartCount();
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

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard data...</p>
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

      {/* Store Info */}
      <div className="relative h-96 bg-gradient-to-b from-[#4b3b2b] to-[#2e2e2e] rounded-xl overflow-hidden mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${storeInfo?.image})` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">{storeInfo?.name}</h1>
          <div className="flex items-center gap-6 text-lg mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{storeInfo?.hours}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg">{storeInfo?.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 mb-4">
            <NotebookText className="w-5 h-5 mt-1 flex-shrink-0 " />
            <p className="text-lg">{storeInfo?.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Items Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Featured Items</h2>
            <button
              onClick={() => navigate("/user/menu")}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  {item.badge && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {item.badge}
                    </div>
                  )}
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition hover:scale-110"
                  >
                    <span className="text-2xl">+</span>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Categories Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Menu</h2>
            <p className="text-gray-600">
              Browse our delicious menu categories
            </p>
          </div>

          {/* Special Categories (Featured Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              onClick={() => handleFindNew()}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img
                src="/assets/whats_new.jpeg"
                alt="whats_new"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">What's New</h3>
                <p className="text-gray-200">Check out our latest creations</p>
              </div>
            </div>
            <div
              onClick={() => handleMustHave()}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img
                src="/assets/must_have_combos.jpeg"
                alt="must_have_combos"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">Must-Have Combos</h3>
                <p className="text-gray-200">Our signature combinations</p>
              </div>
            </div>
          </div>

          {/* Regular Categories (List) */}
          <div className="space-y-4">
            {categories
              .filter((cat) => !cat.special)
              .map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                  <div className="flex items-center p-4 gap-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-24 h-24 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">{category.description}</p>
                      {category.timeRestricted && (
                        <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {category.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </UserLayout>
  );
}

export default UserDashboard;
