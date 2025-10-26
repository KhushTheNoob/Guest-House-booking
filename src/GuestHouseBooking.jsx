import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Calendar, Users, Check, Wifi, Car, Coffee, Utensils, Moon, Sun, Shield } from 'lucide-react';

const mockDB = [
  {
    id: 1,
    name: "Deluxe Suite",
    capacity: 2,
    amenities: ["AC", "WiFi", "TV", "Attached Bath"],
    price: 2000,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"
  },
  {
    id: 2,
    name: "Standard Room",
    capacity: 3,
    amenities: ["AC", "WiFi", "Attached Bath"],
    price: 1500,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop"
  }
];

const facilities = [
  { icon: Wifi, text: "High-Speed Internet" },
  { icon: Car, text: "Free Parking" },
  { icon: Coffee, text: "24/7 Support" },
  { icon: Utensils, text: "Dining Nearby" }
];

export default function GuestHouseBooking({ onAdminClick }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomPrice = selectedRoom ? selectedRoom.price : 0;
    const subtotal = nights * roomPrice;
    const tax = subtotal * 0.12;
    return { nights, roomPrice, subtotal, tax, total: subtotal + tax };
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone || !selectedRoom || !formData.checkIn || !formData.checkOut) {
      alert("Please fill in all required fields!");
      return;
    }
    const { total } = calculateTotal();
    if (total <= 0) { 
      alert("Please select valid check-in and check-out dates!"); 
      return; 
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: Math.round(total * 100),
      currency: "INR",
      name: "IIITNR Guest House",
      description: `${selectedRoom.name} Booking`,
      image: "/iiitnrlogo.png",
      handler: async (response) => {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        try {
          await addDoc(collection(db, "bookings"), {
            ...formData,
            roomName: selectedRoom.name,
            roomPrice: selectedRoom.price,
            nights: calculateNights(),
            totalAmount: total,
            paymentId: response.razorpay_payment_id,
            timestamp: new Date()
          });
        } catch(err) { 
          console.error("Firebase error:", err); 
        }
        setFormData({ name: "", email: "", phone: "", roomType: "", checkIn: "", checkOut: "" });
        setSelectedRoom(null);
      },
      prefill: { 
        name: formData.name, 
        email: formData.email, 
        contact: formData.phone 
      },
      theme: { color: "#2563eb" }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (res) => alert(`Payment Failed: ${res.error.description}`));
      rzp.open();
    } catch (error) {
      alert("Payment gateway error. Please check your internet connection.");
      console.error(error);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-900 dark:bg-gray-50 text-white dark:text-gray-900 transition-colors duration-300">
        
        {/* Header */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-900/95 dark:bg-white/95 backdrop-blur shadow-lg' 
            : 'bg-slate-900/80 dark:bg-white/80 backdrop-blur-sm'
        } border-b border-slate-800 dark:border-gray-200`}>
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/iiitnrlogo.png" alt="IIITNR Logo" className="w-14 h-14 object-contain" />
              <div>
                <h1 className="text-xl font-bold">IIITNR Guest House</h1>
                <p className="text-xs text-blue-500 dark:text-blue-600">Campus Accommodation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-800 dark:bg-gray-200 hover:bg-slate-700 dark:hover:bg-gray-300 transition"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={onAdminClick} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition text-sm font-medium"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section 
          className="relative h-screen bg-cover bg-center flex items-center justify-center" 
          style={{
            backgroundImage: "url('https://www.iiitnr.ac.in/sites/default/files/homepage_banner/WhatsApp%20Image%202020-04-29%20at%2012.51.35%20PM.jpeg')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-900/90"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Welcome to IIIT Naya Raipur
            </h1>
            <h2 className="text-3xl md:text-4xl mb-3 text-blue-300">Guest House</h2>
            <p className="text-lg md:text-xl mb-8 text-slate-200 max-w-2xl mx-auto">
              Experience comfortable and modern accommodation in the heart of our campus
            </p>
            <button 
              onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' })} 
              className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-lg transition font-semibold text-lg shadow-lg"
            >
              Book Your Stay
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-6 bg-slate-800 dark:bg-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Our Guest House</h2>
            <p className="text-lg text-slate-300 dark:text-gray-700 leading-relaxed mb-4">
              The Indian Institute of Information Technology, Naya Raipur provides quality accommodation 
              for visiting faculty, researchers, students' families, and official guests. Our guest house 
              is designed to offer a comfortable stay with modern amenities.
            </p>
            <p className="text-slate-400 dark:text-gray-600">
              Located within the serene campus premises, we ensure a peaceful environment with 
              easy access to all campus facilities.
            </p>
          </div>
        </section>

        {/* Facilities */}
        <section className="py-16 px-6 bg-slate-900 dark:bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Facilities & Services</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {facilities.map((facility, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-800 dark:bg-gray-100 p-6 rounded-lg border border-slate-700 dark:border-gray-300 text-center hover:border-blue-500 dark:hover:border-blue-400 transition"
                >
                  <facility.icon className="w-12 h-12 mx-auto mb-3 text-blue-400 dark:text-blue-600" />
                  <p className="font-medium">{facility.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking-section" className="py-16 px-6 bg-slate-800 dark:bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-3">Reserve Your Room</h2>
              <p className="text-lg text-slate-400 dark:text-gray-600">
                Select a room and provide your booking details
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Room Cards */}
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                {mockDB.map(room => (
                  <div 
                    key={room.id} 
                    onClick={() => {
                      setSelectedRoom(room); 
                      setFormData({ ...formData, roomType: room.name });
                    }} 
                    className={`bg-slate-900 dark:bg-white rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedRoom?.id === room.id 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                        : 'border-slate-700 dark:border-gray-300 hover:border-slate-600 dark:hover:border-gray-400'
                    }`}
                  >
                    <div className="relative">
                      <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
                      {selectedRoom?.id === room.id && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-2">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="text-xl font-bold mb-2">{room.name}</h4>
                      <div className="flex items-center text-slate-400 dark:text-gray-600 mb-3">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">Up to {room.capacity} guests</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.amenities.map((amenity, i) => (
                          <span 
                            key={i} 
                            className="bg-slate-800 dark:bg-gray-100 border border-slate-700 dark:border-gray-300 text-slate-300 dark:text-gray-700 px-2 py-1 text-xs rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="text-2xl font-bold text-blue-500 dark:text-blue-600">
                        ₹{room.price}
                        <span className="text-sm text-slate-500 dark:text-gray-500 font-normal">/night</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Booking Form & Summary */}
              <div className="space-y-6">
                
                {/* Guest Information Form */}
                <div className="bg-slate-900 dark:bg-white p-6 rounded-xl border border-slate-700 dark:border-gray-300">
                  <h3 className="text-xl font-bold mb-5">Guest Information</h3>
                  <div className="space-y-4">
                    <input 
                      name="name" 
                      placeholder="Full Name *" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full p-3 rounded-lg border border-slate-700 dark:border-gray-300 bg-slate-800 dark:bg-gray-50 text-white dark:text-gray-900 placeholder-slate-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition"
                    />
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="Email Address *" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full p-3 rounded-lg border border-slate-700 dark:border-gray-300 bg-slate-800 dark:bg-gray-50 text-white dark:text-gray-900 placeholder-slate-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition"
                    />
                    <input 
                      name="phone" 
                      type="tel" 
                      placeholder="Phone Number *" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full p-3 rounded-lg border border-slate-700 dark:border-gray-300 bg-slate-800 dark:bg-gray-50 text-white dark:text-gray-900 placeholder-slate-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none transition"
                    />
                    <div>
                      <label className="block text-sm text-slate-400 dark:text-gray-600 mb-1">Check-In Date *</label>
                      <input 
                        type="date" 
                        name="checkIn" 
                        value={formData.checkIn} 
                        onChange={handleChange} 
                        min={new Date().toISOString().split('T')[0]} 
                        className="w-full p-3 rounded-lg border border-slate-700 dark:border-gray-300 bg-slate-800 dark:bg-gray-50 text-white dark:text-gray-900 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 dark:text-gray-600 mb-1">Check-Out Date *</label>
                      <input 
                        type="date" 
                        name="checkOut" 
                        value={formData.checkOut} 
                        onChange={handleChange} 
                        min={formData.checkIn || new Date().toISOString().split('T')[0]} 
                        className="w-full p-3 rounded-lg border border-slate-700 dark:border-gray-300 bg-slate-800 dark:bg-gray-50 text-white dark:text-gray-900 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-slate-900 dark:bg-white p-6 rounded-xl border border-slate-700 dark:border-gray-300">
                  <h3 className="text-xl font-bold mb-5">Booking Summary</h3>
                  {selectedRoom ? (
                    <div className="space-y-3">
                      <div className="flex justify-between pb-3 border-b border-slate-700 dark:border-gray-300">
                        <span className="text-slate-400 dark:text-gray-600">Selected Room</span>
                        <span className="font-semibold">{selectedRoom.name}</span>
                      </div>
                      {pricing.nights > 0 ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 dark:text-gray-600">
                              ₹{pricing.roomPrice} × {pricing.nights} night{pricing.nights > 1 ? 's' : ''}
                            </span>
                            <span>₹{pricing.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400 dark:text-gray-600">GST (12%)</span>
                            <span>₹{pricing.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-slate-700 dark:border-gray-300">
                            <span className="font-bold text-lg">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-500 dark:text-blue-600">
                              ₹{pricing.total.toFixed(2)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-center text-slate-500 dark:text-gray-500 py-4 text-sm">
                          Please select check-in and check-out dates
                        </p>
                      )}
                      <button 
                        onClick={handlePayment} 
                        disabled={!selectedRoom || pricing.nights <= 0} 
                        className={`mt-4 w-full py-3 rounded-lg font-semibold transition ${
                          !selectedRoom || pricing.nights <= 0
                            ? 'bg-slate-700 dark:bg-gray-300 cursor-not-allowed opacity-50'
                            : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg'
                        }`}
                      >
                        {selectedRoom && pricing.nights > 0 
                          ? `Proceed to Payment - ₹${pricing.total.toFixed(2)}` 
                          : 'Complete All Details First'
                        }
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 dark:text-gray-500 py-8">
                      Please select a room to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 dark:bg-gray-200 py-8 px-6 text-center border-t border-slate-800 dark:border-gray-300">
          <div className="max-w-4xl mx-auto">
            <img src="/iiitnrlogo.png" alt="IIITNR Logo" className="w-12 h-12 mx-auto mb-3 opacity-70" />
            <p className="text-slate-400 dark:text-gray-600 text-sm mb-1">
              © 2025 IIIT Naya Raipur Guest House
            </p>
            <p className="text-xs text-slate-600 dark:text-gray-500">
              Unofficial Booking Portal • For official information, visit IIITNR website
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}