import { Plus } from "lucide-react";
import useImageFallback from "../../../hooks/useImageFallback";

function ComboDetailsModal({
  selectedCombo,
  comboMenuItems,
  onClose,
  onAddToCart
}) {
  const { src: modalImageSrc, handleError: handleModalImageError } = useImageFallback(selectedCombo.image);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="relative flex-shrink-0">
          <img
            src={modalImageSrc}
            alt={selectedCombo.name}
            onError={handleModalImageError}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
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
                  <ComboMenuItem key={index} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No items information available</p>
            )}
          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex-shrink-0 p-6 pt-0 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Price</p>
              <p className="text-2xl font-bold text-amber-600">
                ${selectedCombo.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => {
                onAddToCart(selectedCombo);
                onClose();
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
  );
}

// Separate component for combo menu items to handle hooks properly
function ComboMenuItem({ item }) {
  const { src: itemImageSrc, handleError: handleItemImageError } = useImageFallback(
    item.image 
  );

  return (
    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
      <img
        src={itemImageSrc}
        alt={item.name}
        onError={handleItemImageError}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1">
        <p className="font-medium text-gray-900">{item.name}</p>
        {item.description && (
          <p className="text-sm text-gray-600">{item.description}</p>
        )}
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-amber-600">
          ×{item.quantity || 1}
        </div>
        <div className="text-xs text-gray-500">
          ${(item.price * (item.quantity || 1)).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default ComboDetailsModal;