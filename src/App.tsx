import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from './rn-web';
import { SafeAreaProvider, SafeAreaView } from './rn-web';

type ScreenKey =
  | 'home'
  | 'cart'
  | 'order-detail'
  | 'addresses'
  | 'favorites'
  | 'chat'
  | 'notifications'
  | 'edit-profile'
  | 'delete-account';

type ProductItem = {
  id: string;
  name: string;
  category: string;
  store_id: string;
  store_name: string;
  store_type: 'restaurant' | 'kirana';
  price: number;
  mrp?: number;
  is_veg: boolean;
  rating: number;
  tag?: string;
};

type CartEntry = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  store_name: string;
};

type AddressItem = {
  id: string;
  label: string;
  full_address: string;
  landmark: string;
  instructions: string;
  is_default: boolean;
};

type OrderItem = {
  id: string;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: 'online' | 'cod';
  payment_status: 'paid' | 'pending' | 'refund_initiated';
  delivery_address: string;
  kirana_name: string;
  delivery_partner_name: string;
  delivery_partner_phone: string;
  delivery_otp: string;
  tip_amount: number;
  rider_rating?: number;
  progress: { key: string; label: string; done: boolean }[];
};

const DEMO_DISHES: ProductItem[] = [
  // Meals under ₹99 & Popular Restaurant Dishes
  {
    id: 'p1',
    name: 'Paneer Tikka Bowl',
    category: 'Bowls',
    store_id: 's1',
    store_name: 'Spice Route Kitchen',
    store_type: 'restaurant',
    price: 89,
    mrp: 129,
    is_veg: true,
    rating: 4.7,
    tag: 'Popular',
  },
  {
    id: 'p2',
    name: 'Hyderabadi Veg Biryani',
    category: 'Biryani',
    store_id: 's1',
    store_name: 'Spice Route Kitchen',
    store_type: 'restaurant',
    price: 99,
    mrp: 149,
    is_veg: true,
    rating: 4.5,
    tag: 'Bestseller',
  },
  {
    id: 'p3',
    name: 'Masala Dosa & Filter Coffee',
    category: 'South Indian',
    store_id: 's3',
    store_name: 'Madras Tiffin Room',
    store_type: 'restaurant',
    price: 79,
    mrp: 110,
    is_veg: true,
    rating: 4.8,
    tag: 'Under ₹99',
  },
  {
    id: 'p4',
    name: 'Classic Veg Puff & Chai Combo',
    category: 'Snacks',
    store_id: 's3',
    store_name: 'Madras Tiffin Room',
    store_type: 'restaurant',
    price: 49,
    mrp: 75,
    is_veg: true,
    rating: 4.4,
    tag: 'Under ₹49',
  },
  {
    id: 'p5',
    name: 'Chicken Dum Biryani',
    category: 'Biryani',
    store_id: 's1',
    store_name: 'Spice Route Kitchen',
    store_type: 'restaurant',
    price: 179,
    mrp: 229,
    is_veg: false,
    rating: 4.8,
    tag: 'Popular',
  },
  {
    id: 'p6',
    name: 'Butter Chicken & 2 Lachha Paratha',
    category: 'North Indian',
    store_id: 's4',
    store_name: 'Punjab Tandoor House',
    store_type: 'restaurant',
    price: 199,
    mrp: 260,
    is_veg: false,
    rating: 4.6,
  },
  {
    id: 'p7',
    name: 'Dal Makhani & Jeera Rice Bowl',
    category: 'North Indian',
    store_id: 's4',
    store_name: 'Punjab Tandoor House',
    store_type: 'restaurant',
    price: 95,
    mrp: 135,
    is_veg: true,
    rating: 4.5,
    tag: 'Under ₹99',
  },
  {
    id: 'p8',
    name: 'Hakka Veg Noodles',
    category: 'Chinese',
    store_id: 's1',
    store_name: 'Spice Route Kitchen',
    store_type: 'restaurant',
    price: 75,
    mrp: 115,
    is_veg: true,
    rating: 4.3,
  },
  // Kirana Essentials
  {
    id: 'p9',
    name: 'Farm Fresh Milk 1L',
    category: 'Dairy',
    store_id: 's2',
    store_name: 'Daily Fresh Kirana',
    store_type: 'kirana',
    price: 64,
    mrp: 68,
    is_veg: true,
    rating: 4.6,
  },
  {
    id: 'p10',
    name: 'Whole Wheat Atta 5kg',
    category: 'Essentials',
    store_id: 's2',
    store_name: 'Daily Fresh Kirana',
    store_type: 'kirana',
    price: 195,
    mrp: 225,
    is_veg: true,
    rating: 4.7,
  },
  {
    id: 'p11',
    name: 'Farm Brown Eggs (6 pcs)',
    category: 'Dairy',
    store_id: 's2',
    store_name: 'Daily Fresh Kirana',
    store_type: 'kirana',
    price: 48,
    mrp: 54,
    is_veg: false,
    rating: 4.5,
    tag: 'Under ₹49',
  },
];

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'a1',
    label: 'Home',
    full_address: '24 Palm Grove Residency, Indiranagar',
    landmark: 'Metro Pillar 42',
    instructions: 'Leave with security',
    is_default: true,
  },
];

const INITIAL_ORDER: OrderItem = {
  id: 'ORD-DEMO-101',
  status: 'out_for_delivery',
  items: [
    { name: 'Paneer Tikka Bowl', quantity: 1, price: 89 },
    { name: 'Masala Dosa & Filter Coffee', quantity: 1, price: 79 },
  ],
  subtotal: 168,
  delivery_fee: 25,
  total_amount: 201.4,
  payment_method: 'online',
  payment_status: 'paid',
  delivery_address: '24 Palm Grove Residency, Indiranagar',
  kirana_name: 'Spice Route Kitchen',
  delivery_partner_name: 'Vikram Rao',
  delivery_partner_phone: '+919876500001',
  delivery_otp: '4829',
  tip_amount: 0,
  progress: [
    { key: 'placed', label: 'Order Placed', done: true },
    { key: 'accepted', label: 'Accepted', done: true },
    { key: 'preparing', label: 'Preparing', done: true },
    { key: 'delivery_assigned', label: 'Rider Assigned', done: true },
    { key: 'ready_for_pickup', label: 'Ready for Pickup', done: true },
    { key: 'out_for_delivery', label: 'Out for Delivery', done: true },
    { key: 'delivered', label: 'Delivered', done: false },
  ],
};

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('home');

  const [user, setUser] = useState({
    name: 'Aarav Sharma',
    phone: '+919876543210',
    address: '24 Palm Grove Residency, Indiranagar',
    role: 'consumer',
  });
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'review' | 'otp'>('review');
  const [deleteOtp, setDeleteOtp] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  const [section, setSection] = useState<'restaurant' | 'kirana'>('restaurant');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegMode, setVegMode] = useState(false);
  const [search, setSearch] = useState('');
  const [priceMax, setPriceMax] = useState<number | null>(null);

  const [favoriteIds, setFavoriteIds] = useState<string[]>(['p1', 'p3']);

  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrText, setAddrText] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrInstructions, setAddrInstructions] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  const [cart, setCart] = useState<CartEntry[]>([
    {
      product_id: 'p1',
      name: 'Paneer Tikka Bowl',
      price: 89,
      quantity: 1,
      store_name: 'Spice Route Kitchen',
    },
  ]);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [couponApplied, setCouponApplied] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [walletBalance] = useState(50);
  const [scheduledSlot, setScheduledSlot] = useState<string | null>(null);
  const [policyAck, setPolicyAck] = useState(false);

  const [orders, setOrders] = useState<OrderItem[]>([INITIAL_ORDER]);
  const [activeOrderId, setActiveOrderId] = useState<string>(INITIAL_ORDER.id);

  const [messages, setMessages] = useState<{ id: string; sender: 'support' | 'user'; text: string }[]>([
    {
      id: 'm1',
      sender: 'support',
      text: 'Hello! Welcome to the frontend-only demo. Ask anything about your order.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      group: 'order',
      title: 'Order #ORD-DEMO-101 is out for delivery',
      body: 'Vikram Rao is heading to 24 Palm Grove Residency.',
      read: false,
      orderId: INITIAL_ORDER.id,
    },
    {
      id: 'n2',
      group: 'promo',
      title: 'Demo Offer Unlocked',
      body: 'Apply DEMO20 in Cart for ₹20 off.',
      read: false,
    },
  ]);

  const activeAddress =
    addresses.find((a) => a.is_default) || addresses[0] || INITIAL_ADDRESSES[0];

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    for (const d of DEMO_DISHES) {
      if (d.store_type === section) set.add(d.category);
    }
    return Array.from(set);
  }, [section]);

  const visibleProducts = useMemo(() => {
    return DEMO_DISHES.filter((p) => {
      if (p.store_type !== section) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (vegMode && !p.is_veg) return false;
      if (priceMax != null && p.price > priceMax) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.store_name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [section, selectedCategory, vegMode, priceMax, search]);

  const mealsUnder99 = useMemo(() => {
    return DEMO_DISHES.filter(
      (p) =>
        p.store_type === section &&
        p.price <= 99 &&
        (!vegMode || p.is_veg),
    );
  }, [section, vegMode]);

  const addToCart = (p: ProductItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product_id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [
        ...prev,
        {
          product_id: p.id,
          name: p.name,
          price: p.price,
          quantity: 1,
          store_name: p.store_name,
        },
      ];
    });
  };

  const changeQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = cart.length > 0 ? 25 : 0;
  const foodGst = +(subtotal * 0.05).toFixed(2);
  const discount = couponApplied ? 20 : 0;
  const grandTotal = Math.max(0, +(subtotal + deliveryFee + foodGst - discount).toFixed(2));
  const walletApplied = useWallet ? Math.min(walletBalance, grandTotal) : 0;
  const payableTotal = Math.max(0, +(grandTotal - walletApplied).toFixed(2));

  const placeDemoOrder = () => {
    if (!policyAck) {
      Alert.alert('Confirmation required', 'Please acknowledge the cancellation policy first.');
      return;
    }
    const newOrder: OrderItem = {
      id: `ORD-DEMO-${orders.length + 101}`,
      status: 'placed',
      items: cart.map((c) => ({ name: c.name, quantity: c.quantity, price: c.price })),
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: payableTotal,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'online' ? 'paid' : 'pending',
      delivery_address: activeAddress.full_address,
      kirana_name: cart[0]?.store_name || 'Spice Route Kitchen',
      delivery_partner_name: 'Vikram Rao',
      delivery_partner_phone: '+919876500001',
      delivery_otp: '7314',
      tip_amount: 0,
      progress: [
        { key: 'placed', label: 'Order Placed', done: true },
        { key: 'accepted', label: 'Accepted', done: false },
        { key: 'preparing', label: 'Preparing', done: false },
        { key: 'delivery_assigned', label: 'Rider Assigned', done: false },
        { key: 'ready_for_pickup', label: 'Ready for Pickup', done: false },
        { key: 'out_for_delivery', label: 'Out for Delivery', done: false },
        { key: 'delivered', label: 'Delivered', done: false },
      ],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCart([]);
    setPolicyAck(false);
    setScreen('order-detail');
  };

  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topNav}
        >
          {(
            [
              ['home', 'Home'],
              ['cart', `Cart (${cart.reduce((s, i) => s + i.quantity, 0)})`],
              ['order-detail', 'Order Detail'],
              ['addresses', 'Addresses'],
              ['favorites', `Favorites (${favoriteIds.length})`],
              ['chat', 'Chat'],
              ['notifications', `Notifications (${unreadCount})`],
              ['edit-profile', 'Edit Profile'],
              ['delete-account', 'Delete Account'],
            ] as [ScreenKey, string][]
          ).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.navChip, screen === key && styles.navChipActive]}
              onPress={() => setScreen(key)}
            >
              <Text style={[styles.navChipText, screen === key && styles.navChipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.body}>
          {screen === 'home' && (
            <View style={styles.stack}>
              <View style={styles.banner}>
                <Text style={styles.bannerTitle}>{user.name}</Text>
                <Text style={styles.bannerSub}>
                  {activeAddress.label}: {activeAddress.full_address}
                </Text>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.pillBtn, section === 'restaurant' && styles.pillBtnActive]}
                  onPress={() => {
                    setSection('restaurant');
                    setSelectedCategory('All');
                  }}
                >
                  <Text style={[styles.pillText, section === 'restaurant' && styles.pillTextActive]}>
                    Food
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pillBtn, section === 'kirana' && styles.pillBtnActive]}
                  onPress={() => {
                    setSection('kirana');
                    setSelectedCategory('All');
                  }}
                >
                  <Text style={[styles.pillText, section === 'kirana' && styles.pillTextActive]}>
                    Kirana
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pillBtn, vegMode && styles.pillBtnGreen]}
                  onPress={() => setVegMode((v) => !v)}
                >
                  <Text style={[styles.pillText, vegMode && styles.pillTextActive]}>
                    VEG {vegMode ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Search dishes, categories, or stores..."
                value={search}
                onChangeText={setSearch}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.row}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.smallChip,
                      selectedCategory === cat && styles.smallChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={styles.smallChipText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.rowWrap}>
                {[49, 79, 99, 199].map((cap) => (
                  <TouchableOpacity
                    key={cap}
                    style={[styles.smallChip, priceMax === cap && styles.smallChipActive]}
                    onPress={() => setPriceMax((prev) => (prev === cap ? null : cap))}
                  >
                    <Text style={styles.smallChipText}>Under ₹{cap}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {mealsUnder99.length > 0 && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Meals under ₹99</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.row}
                  >
                    {mealsUnder99.map((dish) => (
                      <View key={dish.id} style={styles.miniDish}>
                        <Text style={styles.miniDishName}>{dish.name}</Text>
                        <Text style={styles.muted}>{dish.store_name}</Text>
                        <View style={[styles.rowBetween, { marginTop: 6 }]}>
                          <Text style={styles.priceText}>₹{dish.price}</Text>
                          <TouchableOpacity
                            style={styles.smallPrimaryBtn}
                            onPress={() => addToCart(dish)}
                          >
                            <Text style={styles.primaryBtnText}>+ Add</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {visibleProducts.map((p) => {
                const inCart = cart.find((c) => c.product_id === p.id)?.quantity || 0;
                const isFav = favoriteIds.includes(p.id);
                return (
                  <View key={p.id} style={styles.card}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.cardTitle}>{p.name}</Text>
                      <TouchableOpacity onPress={() => toggleFavorite(p.id)}>
                        <Text style={styles.linkText}>{isFav ? '♥ Saved' : '♡ Save'}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.muted}>
                      {p.store_name} · {p.category} · {p.is_veg ? 'Veg' : 'Non-Veg'} · ★ {p.rating}
                    </Text>
                    <View style={[styles.rowBetween, { marginTop: 8 }]}>
                      <View style={styles.row}>
                        <Text style={styles.priceText}>₹{p.price}</Text>
                        {p.mrp ? <Text style={styles.mrpText}>₹{p.mrp}</Text> : null}
                      </View>
                      {inCart === 0 ? (
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => addToCart(p)}>
                          <Text style={styles.primaryBtnText}>Add</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.row}>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(p.id, -1)}>
                            <Text>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyVal}>{inCart}</Text>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(p.id, 1)}>
                            <Text>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {screen === 'cart' && (
            <View style={styles.stack}>
              <Text style={styles.heading}>Cart</Text>
              {cart.length === 0 ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Your cart is empty</Text>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => setScreen('home')}>
                    <Text style={styles.primaryBtnText}>Browse Products</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {cart.map((item) => (
                    <View key={item.product_id} style={styles.card}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.priceText}>₹{item.price * item.quantity}</Text>
                      </View>
                      <Text style={styles.muted}>{item.store_name}</Text>
                      <View style={[styles.row, { marginTop: 8 }]}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => changeQty(item.product_id, -1)}
                        >
                          <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyVal}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => changeQty(item.product_id, 1)}
                        >
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>Delivery Address</Text>
                    <Text style={styles.muted}>{activeAddress.full_address}</Text>
                    <TouchableOpacity onPress={() => setScreen('addresses')}>
                      <Text style={styles.linkText}>Manage Addresses</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Notes & Schedule</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Add notes (optional)"
                      value={notes}
                      onChangeText={setNotes}
                    />
                    <View style={styles.rowWrap}>
                      <TouchableOpacity
                        style={[styles.smallChip, !scheduledSlot && styles.smallChipActive]}
                        onPress={() => setScheduledSlot(null)}
                      >
                        <Text style={styles.smallChipText}>Deliver Now</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.smallChip,
                          scheduledSlot === 'Today · 7:00 PM' && styles.smallChipActive,
                        ]}
                        onPress={() => setScheduledSlot('Today · 7:00 PM')}
                      >
                        <Text style={styles.smallChipText}>Today · 7:00 PM</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.card}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.cardTitle}>Coupon (DEMO20)</Text>
                      <TouchableOpacity onPress={() => setCouponApplied((c) => !c)}>
                        <Text style={styles.linkText}>
                          {couponApplied ? 'Remove (-₹20)' : 'Apply'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.rowBetween, { marginTop: 8 }]}>
                      <Text style={styles.muted}>Wallet Balance: ₹{walletBalance}</Text>
                      <TouchableOpacity onPress={() => setUseWallet((w) => !w)}>
                        <Text style={styles.linkText}>
                          {useWallet ? 'Wallet On' : 'Use Wallet'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>Bill Details</Text>
                    <Text style={styles.muted}>Item Total: ₹{subtotal}</Text>
                    <Text style={styles.muted}>Delivery Fee: ₹{deliveryFee}</Text>
                    <Text style={styles.muted}>GST (5%): ₹{foodGst}</Text>
                    {discount > 0 && <Text style={styles.muted}>Coupon Discount: -₹{discount}</Text>}
                    {walletApplied > 0 && (
                      <Text style={styles.muted}>Wallet Credits: -₹{walletApplied}</Text>
                    )}
                    <Text style={[styles.priceText, { marginTop: 6 }]}>
                      To Pay: ₹{payableTotal}
                    </Text>

                    <View style={styles.rowWrap}>
                      <TouchableOpacity
                        style={[
                          styles.smallChip,
                          paymentMethod === 'online' && styles.smallChipActive,
                        ]}
                        onPress={() => setPaymentMethod('online')}
                      >
                        <Text style={styles.smallChipText}>Pay Online</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.smallChip,
                          paymentMethod === 'cod' && styles.smallChipActive,
                        ]}
                        onPress={() => setPaymentMethod('cod')}
                      >
                        <Text style={styles.smallChipText}>Cash on Delivery</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.checkRow}
                      onPress={() => setPolicyAck((a) => !a)}
                    >
                      <Text style={styles.muted}>
                        {policyAck ? '☑' : '☐'} Please Double Check your order and address details.
                        Orders are non-refundable once placed.
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryBtn} onPress={placeDemoOrder}>
                      <Text style={styles.primaryBtnText}>
                        {paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}

          {screen === 'order-detail' && activeOrder && (
            <View style={styles.stack}>
              <Text style={styles.heading}>Order #{activeOrder.id}</Text>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  Rider: {activeOrder.delivery_partner_name} ({activeOrder.delivery_partner_phone})
                </Text>
                <Text style={styles.muted}>Delivery OTP: {activeOrder.delivery_otp}</Text>
                <Text style={styles.muted}>Tip: ₹{activeOrder.tip_amount}</Text>
                <View style={styles.rowWrap}>
                  {[20, 30, 50].map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={styles.smallChip}
                      onPress={() =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === activeOrder.id ? { ...o, tip_amount: amt } : o,
                          ),
                        )
                      }
                    >
                      <Text style={styles.smallChipText}>Tip ₹{amt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Order Status</Text>
                {activeOrder.progress.map((step, index) => (
                  <TouchableOpacity
                    key={step.key}
                    onPress={() =>
                      setOrders((prev) =>
                        prev.map((o) => {
                          if (o.id !== activeOrder.id) return o;
                          const nextProgress = o.progress.map((s, i) => ({
                            ...s,
                            done: i <= index,
                          }));
                          return {
                            ...o,
                            status: step.key as OrderItem['status'],
                            progress: nextProgress,
                          };
                        }),
                      )
                    }
                  >
                    <Text style={step.done ? styles.stepDone : styles.muted}>
                      {step.done ? '●' : '○'} {step.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Items & Total</Text>
                {activeOrder.items.map((it, idx) => (
                  <Text key={idx} style={styles.muted}>
                    {it.quantity}x {it.name} — ₹{it.price * it.quantity}
                  </Text>
                ))}
                <Text style={styles.priceText}>Total: ₹{activeOrder.total_amount}</Text>
              </View>
            </View>
          )}

          {screen === 'addresses' && (
            <View style={styles.stack}>
              <Text style={styles.heading}>Saved Addresses</Text>
              {addresses.map((a) => (
                <View key={a.id} style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {a.label} {a.is_default ? '(Default)' : ''}
                  </Text>
                  <Text style={styles.muted}>{a.full_address}</Text>
                  {a.landmark ? <Text style={styles.muted}>Near: {a.landmark}</Text> : null}
                  {a.instructions ? (
                    <Text style={styles.muted}>Instructions: {a.instructions}</Text>
                  ) : null}
                </View>
              ))}

              <View style={styles.card}>
                <Text style={styles.cardTitle}>New Address</Text>
                <View style={styles.rowWrap}>
                  {['Home', 'Work', 'Other'].map((lbl) => (
                    <TouchableOpacity
                      key={lbl}
                      style={[styles.smallChip, addrLabel === lbl && styles.smallChipActive]}
                      onPress={() => setAddrLabel(lbl)}
                    >
                      <Text style={styles.smallChipText}>{lbl}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Full Address"
                  value={addrText}
                  onChangeText={setAddrText}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Landmark"
                  value={addrLandmark}
                  onChangeText={setAddrLandmark}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Delivery Instructions"
                  value={addrInstructions}
                  onChangeText={setAddrInstructions}
                />
                <TouchableOpacity
                  style={styles.checkRow}
                  onPress={() => setAddrDefault((d) => !d)}
                >
                  <Text style={styles.muted}>{addrDefault ? '☑' : '☐'} Set as Default</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => {
                    if (!addrText.trim()) return;
                    const created: AddressItem = {
                      id: `a-${Date.now()}`,
                      label: addrLabel,
                      full_address: addrText.trim(),
                      landmark: addrLandmark.trim(),
                      instructions: addrInstructions.trim(),
                      is_default: addrDefault,
                    };
                    setAddresses((prev) =>
                      addrDefault
                        ? [created, ...prev.map((x) => ({ ...x, is_default: false }))]
                        : [...prev, created],
                    );
                    setAddrText('');
                    setAddrLandmark('');
                    setAddrInstructions('');
                  }}
                >
                  <Text style={styles.primaryBtnText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {screen === 'favorites' && (
            <View style={styles.stack}>
              <Text style={styles.heading}>Wishlist</Text>
              {DEMO_DISHES.filter((p) => favoriteIds.includes(p.id)).map((p) => (
                <View key={p.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{p.name}</Text>
                  <Text style={styles.muted}>
                    {p.store_name} · ₹{p.price}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {screen === 'chat' && (
            <View style={styles.stack}>
              <Text style={styles.heading}>Chat Support</Text>
              {messages.map((m) => (
                <View key={m.id} style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {m.sender === 'user' ? user.name : 'Support'}
                  </Text>
                  <Text style={styles.muted}>{m.text}</Text>
                </View>
              ))}
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  const text = chatInput.trim();
                  if (!text) return;
                  setChatInput('');
                  setMessages((prev) => [
                    ...prev,
                    { id: `u-${Date.now()}`, sender: 'user', text },
                    {
                      id: `s-${Date.now() + 1}`,
                      sender: 'support',
                      text: `Demo support received: "${text}"`,
                    },
                  ]);
                }}
              >
                <Text style={styles.primaryBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          )}

          {screen === 'notifications' && (
            <View style={styles.stack}>
              <View style={styles.rowBetween}>
                <Text style={styles.heading}>Notifications</Text>
                <TouchableOpacity
                  onPress={() =>
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                  }
                >
                  <Text style={styles.linkText}>Mark all read</Text>
                </TouchableOpacity>
              </View>
              {notifications.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={styles.card}
                  onPress={() => {
                    setNotifications((prev) =>
                      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                    );
                    if (n.orderId) {
                      setActiveOrderId(n.orderId);
                      setScreen('order-detail');
                    }
                  }}
                >
                  <Text style={styles.cardTitle}>
                    {n.read ? '' : '• '}
                    {n.title}
                  </Text>
                  <Text style={styles.muted}>{n.body}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {screen === 'edit-profile' && (
            <View style={styles.stack}>
              <Text style={styles.heading}>Edit Profile</Text>
              <TextInput
                style={styles.input}
                value={user.name}
                onChangeText={(name) => setUser((u) => ({ ...u, name }))}
                placeholder="Full Name"
              />
              <TextInput
                style={styles.input}
                value={user.address}
                onChangeText={(address) => setUser((u) => ({ ...u, address }))}
                placeholder="Delivery Address"
              />
              <Text style={styles.muted}>Phone: {user.phone} (Verified)</Text>
              <Text style={styles.muted}>Role: {user.role}</Text>
            </View>
          )}

          {screen === 'delete-account' && (
            <View style={styles.stack}>
              <Text style={styles.heading}>Delete Account</Text>
              {accountDeleted ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Account Demo Reset Complete</Text>
                </View>
              ) : deleteStep === 'review' ? (
                <View style={styles.card}>
                  <Text style={styles.muted}>
                    This action is permanent in production. Demo mode resets local state only.
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Optional reason"
                    value={deleteReason}
                    onChangeText={setDeleteReason}
                  />
                  <TouchableOpacity
                    style={styles.dangerBtn}
                    onPress={() => setDeleteStep('otp')}
                  >
                    <Text style={styles.primaryBtnText}>Send OTP</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.card}>
                  <Text style={styles.muted}>Enter 6-digit demo OTP (any 6 digits)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123456"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={deleteOtp}
                    onChangeText={setDeleteOtp}
                  />
                  <TouchableOpacity
                    style={styles.dangerBtn}
                    onPress={() => {
                      if (deleteOtp.length >= 4) {
                        setAccountDeleted(true);
                        setCart([]);
                      }
                    }}
                  >
                    <Text style={styles.primaryBtnText}>Confirm Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  topNav: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  navChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  navChipActive: { backgroundColor: '#be185d' },
  navChipText: { fontSize: 12, fontWeight: '600', color: '#1e293b' },
  navChipTextActive: { color: '#ffffff' },
  body: { padding: 16, paddingBottom: 48 },
  stack: { gap: 12 },
  heading: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  banner: { backgroundColor: '#be185d', padding: 14, borderRadius: 12 },
  bannerTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  bannerSub: { color: '#fce7f3', fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  muted: { fontSize: 13, color: '#475569' },
  stepDone: { fontSize: 13, fontWeight: '700', color: '#15803d' },
  priceText: { fontSize: 16, fontWeight: '800', color: '#be185d' },
  mrpText: { fontSize: 13, color: '#94a3b8', textDecorationLine: 'line-through' },
  linkText: { fontSize: 13, fontWeight: '700', color: '#be185d' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  pillBtnActive: { backgroundColor: '#be185d', borderColor: '#be185d' },
  pillBtnGreen: { backgroundColor: '#0e8a4f', borderColor: '#0e8a4f' },
  pillText: { fontWeight: '700', color: '#0f172a' },
  pillTextActive: { color: '#ffffff' },
  smallChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  smallChipActive: { backgroundColor: '#fbcfe8' },
  smallChipText: { fontSize: 12, fontWeight: '600', color: '#0f172a' },
  miniDish: {
    width: 170,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  miniDishName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  smallPrimaryBtn: {
    backgroundColor: '#be185d',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#0f172a',
  },
  primaryBtn: {
    marginTop: 6,
    backgroundColor: '#be185d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerBtn: {
    marginTop: 6,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontWeight: '700' },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#be185d',
    borderRadius: 6,
  },
  qtyVal: { fontWeight: '700', minWidth: 20, textAlign: 'center' },
  checkRow: { marginTop: 6 },
});
