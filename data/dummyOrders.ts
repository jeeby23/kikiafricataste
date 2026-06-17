// kikiafricataste/data/dummyOrders.ts
// Orders Data
export const dummyOrders = [
  {
    id: "ORD-1001",
    name: "Mujeeb Abdulrahman",
    email: "mujeeb@gmail.com",
    phone: "08012345678",
    address: "12 Allen Avenue, Ikeja",
    postcode: "100001",
    items: [
      { name: "Goat Meat", qty: 2, price: 8000 },
      { name: "Ponmo", qty: 1, price: 5000 },
    ],
    total: 21000,
    status: "pending", // pending | paid | cancelled
    createdAt: "2026-06-16T10:00:00",
  },
  {
    id: "ORD-1002",
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    address: "Lekki Phase 1",
    postcode: "101245",
    items: [{ name: "Smoked Catfish", qty: 1, price: 6000 }],
    total: 6000,
    status: "paid",
    createdAt: "2026-06-16T09:30:00",
  },
];

// Products Data (using dummyOrders name for products too)
export const dummyProducts = [
  {
    id: "PROD-001",
    name: "Catfish Pack (6 pieces)",
    category: "Catfish",
    price: 18000,
    stock: 50,
    description: "Fresh farm-raised catfish, 6 pieces per pack. Each piece weighs approximately 500g.",
    mainImage: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=400",
    secondaryImages: [
      "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=400",
      "https://images.unsplash.com/photo-1574786213297-91e2be94742a?w=400"
    ],
    packSize: 6,
    pricePerPiece: 3, // in dollars
    createdAt: "2026-06-16T10:00:00",
  },
  {
    id: "PROD-002",
    name: "Ponmo Pack (6 pieces)",
    category: "Ponmo",
    price: 15000,
    stock: 40,
    description: "Premium cow skin (ponmo), 6 pieces per pack. Cleaned and ready to cook.",
    mainImage: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    secondaryImages: [
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=400"
    ],
    packSize: 6,
    pricePerPiece: 2.5,
    createdAt: "2026-06-16T09:30:00",
  },
  {
    id: "PROD-003",
    name: "Goat Meat (1kg)",
    category: "Goat Meat",
    price: 15000,
    stock: 30,
    description: "Fresh goat meat, 1kg pack. Cut into bite-sized pieces.",
    mainImage: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400",
    secondaryImages: [
      "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400",
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400"
    ],
    packSize: 1,
    pricePerPiece: 15,
    createdAt: "2026-06-16T08:45:00",
  },
  {
    id: "PROD-004",
    name: "Smoked Catfish (500g)",
    category: "Catfish",
    price: 8000,
    stock: 25,
    description: "Hot-smoked catfish, 500g pack. Ready to eat or use in soups.",
    mainImage: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=400",
    secondaryImages: [],
    packSize: 1,
    pricePerPiece: 8,
    createdAt: "2026-06-15T14:20:00",
  },
  {
    id: "PROD-005",
    name: "Ponmo (Single piece)",
    category: "Ponmo",
    price: 3000,
    stock: 100,
    description: "Single piece of premium cow skin (ponmo).",
    mainImage: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    secondaryImages: [],
    packSize: 1,
    pricePerPiece: 3,
    createdAt: "2026-06-15T12:00:00",
  },
];