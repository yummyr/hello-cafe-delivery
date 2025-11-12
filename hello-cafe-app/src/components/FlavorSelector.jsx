import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

function FlavorSelector({
  flavors = [],
  selectedFlavors = {},
  onFlavorChange,
  disabled = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFlavor, setActiveFlavor] = useState(null);

  if (!flavors || flavors.length === 0) {
    return null;
  }

  const handleFlavorSelect = (flavorName, value) => {
    onFlavorChange(flavorName, value);
  };

  const toggleDropdown = (flavorName) => {
    setActiveFlavor(activeFlavor === flavorName ? null : flavorName);
    setIsOpen(activeFlavor !== flavorName);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {flavors.map((flavor) => (
        <div key={flavor.id || flavor.name} className="relative">
          {/* Flavor Label */}
          <button
            type="button"
            onClick={() => toggleDropdown(flavor.name)}
            disabled={disabled}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">
                {flavor.name}
              </span>
              {!selectedFlavors[flavor.name] && (
                <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  Required
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedFlavors[flavor.name] && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedFlavors[flavor.name]}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  activeFlavor === flavor.name ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Flavor Options Dropdown */}
          {activeFlavor === flavor.name && flavor.value && flavor.value.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                {flavor.value.map((option, index) => (
                  <button
                    key={`${flavor.name}-${option}-${index}`}
                    type="button"
                    onClick={() => {
                      handleFlavorSelect(flavor.name, option);
                      toggleDropdown(flavor.name);
                    }}
                    disabled={disabled}
                    className={`w-full text-left px-4 py-3 rounded-md hover:bg-amber-50 focus:outline-none focus:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedFlavors[flavor.name] === option
                        ? 'bg-amber-100 text-amber-700 font-medium border-l-4 border-amber-500'
                        : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {selectedFlavors[flavor.name] === option && (
                        <span className="text-amber-600">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Selected Flavors Summary */}
      {Object.keys(selectedFlavors).length > 0 && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg">
          <div className="text-sm font-medium text-amber-900 mb-2">Selected Flavors:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFlavors).map(([name, value]) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white text-amber-700 text-sm rounded-full border border-amber-200"
              >
                <span>{name}: {value}</span>
                <button
                  type="button"
                  onClick={() => handleFlavorSelect(name, null)}
                  disabled={disabled}
                  className="text-amber-500 hover:text-amber-700 transition-colors disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {flavors.length > 0 && Object.keys(selectedFlavors).length < flavors.length && (
        <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          Please select flavors for all required options
        </div>
      )}
    </div>
  );
}

export default FlavorSelector;