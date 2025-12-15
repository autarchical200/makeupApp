import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { Booking, BookingStatus } from '../types';

// =========================================================================
// HƯỚNG DẪN CẤU HÌNH (CONFIGURATION GUIDE)
// 1. Truy cập https://console.firebase.google.com/
// 2. Tạo project mới.
// 3. Vào Project Settings > General > Your apps > Chọn Web (</>)
// 4. Copy nội dung 'firebaseConfig' và dán đè vào object bên dưới.
// 5. Vào Build > Firestore Database > Create Database > Start in Test Mode.
// =========================================================================

const firebaseConfig = {
  // Thay thế toàn bộ đoạn này bằng config thật của bạn
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

// Check if config is placeholder
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

let db: any;
if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase connected successfully");
  } catch (error) {
    console.error("Firebase init error:", error);
  }
}

// === API SERVICE ===

// 1. Subscribe to Bookings (Real-time)
export const subscribeToBookings = (onData: (bookings: Booking[]) => void) => {
  if (isConfigured && db) {
    // Real Firestore mode
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      onData(bookings);
    });
    return unsubscribe;
  } else {
    // Fallback: LocalStorage mode (Polling to simulate updates)
    const loadLocal = () => {
      const saved = localStorage.getItem('glowup_bookings');
      onData(saved ? JSON.parse(saved) : []);
    };
    loadLocal();
    // Poll every 2 seconds to check for changes in other tabs
    const interval = setInterval(loadLocal, 2000);
    return () => clearInterval(interval);
  }
};

// 2. Create Booking
export const createBooking = async (booking: Booking): Promise<boolean> => {
  if (isConfigured && db) {
    try {
      // Remove ID as Firestore generates it, but we can keep other fields
      const { id, ...bookingData } = booking; 
      await addDoc(collection(db, 'bookings'), bookingData);
      return true;
    } catch (error) {
      console.error("Error adding document: ", error);
      return false;
    }
  } else {
    // LocalStorage Fallback
    const saved = localStorage.getItem('glowup_bookings');
    const bookings = saved ? JSON.parse(saved) : [];
    const newBookings = [booking, ...bookings];
    localStorage.setItem('glowup_bookings', JSON.stringify(newBookings));
    return true;
  }
};

// 3. Update Status
export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<boolean> => {
  if (isConfigured && db) {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status });
      return true;
    } catch (error) {
      console.error("Error updating document: ", error);
      return false;
    }
  } else {
    // LocalStorage Fallback
    const saved = localStorage.getItem('glowup_bookings');
    if (saved) {
      const bookings = JSON.parse(saved) as Booking[];
      const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
      localStorage.setItem('glowup_bookings', JSON.stringify(updated));
      return true;
    }
    return false;
  }
};

export const isFirebaseEnabled = () => isConfigured;