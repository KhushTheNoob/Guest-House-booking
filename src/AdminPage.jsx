import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ArrowLeft, Calendar, Users, DollarSign, Clock, Mail, Phone, Home, Download, RefreshCw } from "lucide-react";

export default function AdminPage({ onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalRevenue: 0, thisMonth: 0 });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "bookings"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);

      const total = data.length;
      const totalRevenue = data.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const now = new Date();
      const thisMonth = data.filter(b => {
        const bookingDate = new Date(b.timestamp?.seconds * 1000);
        return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
      }).length;

      setStats({ total, totalRevenue, thisMonth });
    } catch (e) {
      console.error("Fetch error:", e);
      alert("Error loading bookings. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const exportToCSV = () => {
    if (!bookings.length) { alert("No bookings to export!"); return; }

    const headers = ["Name", "Email", "Phone", "Room", "Check-In", "Check-Out", "Amount", "Payment ID", "Booked At"];
    const rows = bookings.map(b => [
      b.name, b.email, b.phone, b.roomName, b.checkIn, b.checkOut, b.totalAmount?.toFixed(2),
      b.paymentId, new Date(b.timestamp?.seconds * 1000).toLocaleString()
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookings_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/iiitnrlogo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">IIITNR Guest House Bookings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.open("https://www.iiitnr.ac.in", "_blank")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-medium text-sm"
            >
              <Home className="w-4 h-4" /> Main Website
            </button>
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Booking
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg"><Calendar className="w-8 h-8" /></div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg"><DollarSign className="w-8 h-8" /></div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400 mb-1">This Month</p>
              <p className="text-3xl font-bold">{stats.thisMonth}</p>
            </div>
            <div className="p-3 bg-purple-600 rounded-lg"><Users className="w-8 h-8" /></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={fetchBookings} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            onClick={exportToCSV} disabled={!bookings.length}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-medium disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Bookings Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-lg text-slate-400">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Calendar className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-lg text-slate-400">No bookings found</p>
              <p className="text-sm text-slate-500 mt-2">Bookings will appear here once guests make reservations</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold">Guest</th>
                    <th className="p-4 text-left text-sm font-semibold">Contact</th>
                    <th className="p-4 text-left text-sm font-semibold">Room</th>
                    <th className="p-4 text-left text-sm font-semibold">Dates</th>
                    <th className="p-4 text-left text-sm font-semibold">Payment</th>
                    <th className="p-4 text-left text-sm font-semibold">Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => (
                    <tr key={b.id} className={`border-b border-slate-700 ${idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-850'} hover:bg-slate-700 transition`}>
                      <td className="p-4">
                        <p className="font-medium">{b.name}</p>
                        <p className="text-sm text-slate-400 mt-1 flex items-center gap-1"><Mail className="w-3 h-3" /> {b.email}</p>
                      </td>
                      <td className="p-4"><p className="text-sm flex items-center gap-1"><Phone className="w-3 h-3" /> {b.phone}</p></td>
                      <td className="p-4"><p className="font-medium">{b.roomName}</p>{b.nights && <p className="text-xs text-slate-400 mt-1">{b.nights} night{b.nights > 1 ? 's' : ''}</p>}</td>
                      <td className="p-4"><p className="text-sm">In: {b.checkIn}</p><p className="text-sm mt-1">Out: {b.checkOut}</p></td>
                      <td className="p-4"><p className="font-bold text-green-500">₹{b.totalAmount?.toFixed(2) || '0.00'}</p><p className="text-xs text-slate-500 mt-1 font-mono">{b.paymentId?.substring(0,15)}...</p></td>
                      <td className="p-4"><div className="flex items-center gap-1 text-sm"><Clock className="w-3 h-3 text-slate-400" /> {b.timestamp?.seconds ? new Date(b.timestamp.seconds *1000).toLocaleDateString() : 'N/A'}</div><p className="text-xs text-slate-500 mt-1">{b.timestamp?.seconds ? new Date(b.timestamp.seconds*1000).toLocaleTimeString() : ''}</p></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {bookings.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-400">
            Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''} • Last updated: {new Date().toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
