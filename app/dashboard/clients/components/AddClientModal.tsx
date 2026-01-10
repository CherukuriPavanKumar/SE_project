import { useState, useMemo } from "react";
import { X, Plus, Building2, DollarSign } from "lucide-react";
import type { Client, Property } from "@/lib/types";
import { clientStatuses, propertyTypes } from "@/lib/constants";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { addClient as addClientAction } from "@/lib/redux/slices/clientSlice";
import { addProperty as addPropertyAction } from "@/lib/redux/slices/propertySlice";

import toast from "react-hot-toast";

interface AddClientModalProps {
  onClose: () => void;
}

export default function AddClientModal({ onClose }: AddClientModalProps) {
  const dispatch = useAppDispatch();
  // const clients = useAppSelector((state) => state.clients.items);
  const agents = useAppSelector((state) => state.agents.items);
  const properties = useAppSelector((state) => state.properties.items);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    preferredAgent: agents.find((a) => a.status === "Active")?.name || "",
    tags: "",
    notes: "",
    status: "Active" as "Active" | "VIP" | "Inactive",
  });

  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newPropertyData, setNewPropertyData] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    status: "Available",
    bedrooms: "2",
    bathrooms: "2",
    area: "",
    description: "",
    listedBy: agents.find((a) => a.status === "Active")?.name || "",
  });

  const activeAgents = useMemo(() => {
    return agents.filter((agent) => agent.status === "Active");
  }, [agents]);

  const availableProperties = useMemo(() => {
    return properties.filter((p) => p.status === "Available" || p.status === "Sold");
  }, [properties]);

  const handlePropertyToggle = (propertyId: string) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const calculateTotalValue = () => {
    const selectedProps = properties.filter((p) => selectedPropertyIds.includes(p.id));
    const total = selectedProps.reduce((sum, prop) => {
      const priceStr = prop.price.replace(/[₹,\s]/g, "");
      const lakhs = priceStr.match(/(\d+\.?\d*)\s*L/i);
      const crores = priceStr.match(/(\d+\.?\d*)\s*Cr/i);

      if (lakhs) {
        return sum + parseFloat(lakhs[1]) * 100000;
      } else if (crores) {
        return sum + parseFloat(crores[1]) * 10000000;
      }
      return sum;
    }, 0);

    if (total >= 10000000) {
      return `₹${(total / 10000000).toFixed(2)} Cr`;
    } else if (total >= 100000) {
      return `₹${(total / 100000).toFixed(2)} L`;
    }
    return `₹${total}`;
  };

  const handleAddNewProperty = () => {
    if (!newPropertyData.title || !newPropertyData.location || !newPropertyData.price) {
      toast.error("Please fill all required property fields");
      return;
    }

    const newProperty: Property = {
      id: `P${String(properties.length + 1).padStart(3, "0")}`,
      title: newPropertyData.title,
      location: newPropertyData.location,
      price: newPropertyData.price,
      type: newPropertyData.type,
      status: newPropertyData.status as "Available" | "Sold" | "Under Negotiation",
      bedrooms: parseInt(newPropertyData.bedrooms),
      bathrooms: parseInt(newPropertyData.bathrooms),
      area: newPropertyData.area,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      description: newPropertyData.description,
      listedBy: newPropertyData.listedBy,
      listedDate: new Date().toISOString().split("T")[0],
    };

    dispatch(addPropertyAction(newProperty));

    setSelectedPropertyIds([...selectedPropertyIds, newProperty.id]);

    setNewPropertyData({
      title: "",
      location: "",
      price: "",
      type: "Apartment",
      status: "Available",
      bedrooms: "2",
      bathrooms: "2",
      area: "",
      description: "",
      listedBy: agents.find((a) => a.status === "Active")?.name || "",
    });

    setShowAddProperty(false);
    toast.success("Property added and selected!");
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedProps = properties.filter((p) => selectedPropertyIds.includes(p.id));
    const propertiesOwned = selectedProps.map((p) => p.title);

    const newClient: Client = {
      id: `C${String(Date.now()).slice(-3)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || "",
      totalPurchases: selectedPropertyIds.length,
      totalValue: calculateTotalValue(),
      propertiesOwned: propertiesOwned,
      status: formData.status,
      joinedDate: new Date().toISOString().split("T")[0],
      lastInteraction: new Date().toISOString().split("T")[0],
      preferredAgent: formData.preferredAgent,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      notes: formData.notes,
    };

    dispatch(addClientAction(newClient));

    onClose();
    toast.success("Client added successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New Client</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleAddClient} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Active" | "VIP" | "Inactive",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    {clientStatuses
                      .filter((s) => s !== "All Status")
                      .map((status) => (
                        <option key={status} value={status} className="text-gray-900">
                          {status}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Agent *
                  </label>
                  <select
                    value={formData.preferredAgent}
                    onChange={(e) => setFormData({ ...formData, preferredAgent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  >
                    <option value="">-- Select Agent --</option>
                    {activeAgents.map((agent) => (
                      <option key={agent.id} value={agent.name} className="text-gray-900">
                        {agent.name} ({agent.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="VIP, Investor"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                    placeholder="Additional notes about the client..."
                  ></textarea>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    Select Properties
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddProperty(!showAddProperty)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    {showAddProperty ? "Cancel" : "Add New Property"}
                  </button>
                </div>

                {showAddProperty && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-semibold text-blue-900 mb-3">
                      New Property Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Property Title *
                        </label>
                        <input
                          type="text"
                          value={newPropertyData.title}
                          onChange={(e) =>
                            setNewPropertyData({ ...newPropertyData, title: e.target.value })
                          }
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="Luxury 3BHK Apartment"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Location *
                        </label>
                        <input
                          type="text"
                          value={newPropertyData.location}
                          onChange={(e) =>
                            setNewPropertyData({ ...newPropertyData, location: e.target.value })
                          }
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="Whitefield, Bangalore"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Price *
                        </label>
                        <input
                          type="text"
                          value={newPropertyData.price}
                          onChange={(e) =>
                            setNewPropertyData({ ...newPropertyData, price: e.target.value })
                          }
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="₹50 Lakhs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Type *
                        </label>
                        <select
                          value={newPropertyData.type}
                          onChange={(e) =>
                            setNewPropertyData({ ...newPropertyData, type: e.target.value })
                          }
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        >
                          {propertyTypes
                            .filter((t) => t !== "All Types")
                            .map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Area *
                        </label>
                        <input
                          type="text"
                          value={newPropertyData.area}
                          onChange={(e) =>
                            setNewPropertyData({ ...newPropertyData, area: e.target.value })
                          }
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
                          placeholder="1500 sqft"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Listed By *
                        </label>
                        <select
                          value={newPropertyData.listedBy}
                          onChange={(e) =>
                            setNewPropertyData({ ...newPropertyData, listedBy: e.target.value })
                          }
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                        >
                          {activeAgents.map((agent) => (
                            <option key={agent.id} value={agent.name}>
                              {agent.name} ({agent.role})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewProperty}
                      className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Add Property
                    </button>
                  </div>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableProperties.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No properties available. Add a new property above.
                    </p>
                  ) : (
                    availableProperties.map((property) => (
                      <label
                        key={property.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPropertyIds.includes(property.id)}
                          onChange={() => handlePropertyToggle(property.id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{property.title}</p>
                          <p className="text-xs text-gray-500">{property.location}</p>
                        </div>
                        <span className="text-sm font-bold text-blue-600">{property.price}</span>
                      </label>
                    ))
                  )}
                </div>

                {selectedPropertyIds.length > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Selected Properties: {selectedPropertyIds.length}
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          Total Value: {calculateTotalValue()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Add Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
