import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Star, ChevronRight } from "lucide-react";

function UserDashboard() {
  const navigate = useNavigate();
  const [storeInfo, setStoreInfo] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch store information
  const fetchStoreInfo = async () => {
    try {
      // Replace with actual API endpoint
      // const response = await api.get("/user/store/info");
      // setStoreInfo(response.data.data);
      
      // Mock data
      setStoreInfo({
        name: "7 Leaves Cafe",
        address: "14845 Jeffrey Rd, Irvine, CA 92618, USA",
        phone: "(949) 555-0123",
        hours: "6:00 AM - 10:50 PM",
        description: "Premium bubble tea and Vietnamese coffee cafe serving fresh, handcrafted beverages and light bites.",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
        rating: 4.7,
        totalReviews: 2847
      });
    } catch (error) {
      console.error("Failed to fetch store info:", error);
    }
  };

  // Fetch featured items
  const fetchFeaturedItems = async () => {
    try {
      // Replace with actual API endpoint
      // const response = await api.get("/user/menu/featured");
      // setFeaturedItems(response.data.data);
      
      // Mock data based on the image
      setFeaturedItems([
        {
          id: 1,
          name: "House Coffee",
          price: 6.60,
          image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
          badge: "#1 Most liked",
          rating: 4.8
        },
        {
          id: 2,
          name: "Vietnamese Coffee",
          price: 6.60,
          image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&q=80",
          badge: "#2 Most liked",
          rating: 4.7
        },
        {
          id: 3,
          name: "Thai Tea",
          price: 6.60,
          image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80",
          badge: "#3 Most liked",
          rating: 4.6
        },
        {
          id: 4,
          name: "Japanese Soy Tea",
          price: 7.14,
          image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
          rating: 4.5
        },
        {
          id: 5,
          name: "Jasmine Milk Tea",
          price: 6.60,
          image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&q=80",
          rating: 4.6
        },
        {
          id: 6,
          name: "Sunset Passion (Juice)",
          price: 6.90,
          image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80",
          rating: 4.4
        }
      ]);
    } catch (error) {
      console.error("Failed to fetch featured items:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      // Replace with actual API endpoint
      // const response = await api.get("/user/categories");
      // setCategories(response.data.data);
      
      // Mock data based on the images
      setCategories([
        {
          id: 1,
          name: "What's New",
          description: "Check out our latest creations",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
          special: true
        },
        {
          id: 2,
          name: "You Pick Two®",
          description: "Choose any two entrees",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
          special: true
        },
        {
          id: 3,
          name: "Must-Have Meals",
          description: "Our signature combinations",
          image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
          special: true
        },
        {
          id: 4,
          name: "Sandwiches",
          description: "Freshly made sandwiches",
          image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80"
        },
        {
          id: 5,
          name: "Salads",
          description: "Fresh and healthy options",
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
        },
        {
          id: 6,
          name: "Bakery",
          description: "Freshly baked goods",
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"
        },
        {
          id: 7,
          name: "Beverages",
          description: "Hot and cold drinks",
          image: "https://images.unsplash.com/photo-1544145945-35c346c8df46?w=400&q=80"
        },
        {
          id: 8,
          name: "Breakfast",
          description: "Available before 10:30 am",
          image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
          timeRestricted: true
        },
        {
          id: 9,
          name: "Family Feast Value Meals",
          description: "Perfect for sharing",
          image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80"
        },
        {
          id: 10,
          name: "Value Duets",
          description: "Great value combos",
          image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80"
        }
      ]);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStoreInfo(),
          fetchFeaturedItems(),
          fetchCategories()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/user/menu?category=${categoryId}`);
  };

  const handleItemClick = (itemId) => {
    navigate(`/user/menu/item/${itemId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Store Info */}
      <div className="relative h-96 bg-gradient-to-b from-gray-900 to-gray-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${storeInfo?.image})` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">{storeInfo?.name}</h1>
          <div className="flex items-center gap-6 text-lg mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{storeInfo?.rating}</span>
              <span className="text-gray-300">({storeInfo?.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{storeInfo?.hours}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg">{storeInfo?.address}</p>
              <button className="text-yellow-400 hover:text-yellow-300 underline mt-1">
                Change Location
              </button>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl">{storeInfo?.description}</p>
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
                  <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition">
                    <span className="text-2xl">+</span>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{item.rating}</span>
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
            <p className="text-gray-600">Browse our delicious menu categories</p>
          </div>

          {/* Special Categories (Featured Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {categories.filter(cat => cat.special).map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                  <p className="text-gray-200">{category.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Regular Categories (List) */}
          <div className="space-y-4">
            {categories.filter(cat => !cat.special).map((category) => (
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
    </div>
  );
}

export default UserDashboard;