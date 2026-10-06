import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TableZone, Reservation } from '../../types';
import {
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  QrCode,
  Utensils,
  X
} from 'lucide-react';

const ZONES: TableZone[] = ['Main Dining', 'Patio Terrace', 'VIP Booth', 'Bar Lounge'];

export const ReservationView: React.FC = () => {
  const { tables, createReservation, setSelectedTableId } = useApp();

  const [selectedZone, setSelectedZone] = useState<TableZone>('Main Dining');
  const [partySize, setPartySize] = useState<number>(2);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('19:00');
  const [selectedTableIdState, setSelectedTableIdState] = useState<string | null>(null);

  // Form details
  const [customerName, setCustomerName] = useState('Sophia Martinez');
  const [customerEmail, setCustomerEmail] = useState('sophia@example.com');
  const [customerPhone, setCustomerPhone] = useState('+1 555-0144');
  const [occasion, setOccasion] = useState('Dinner Date');
  const [specialNotes, setSpecialNotes] = useState('Quiet table requested.');

  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const filteredTables = tables.filter(t => t.zone === selectedZone);
  const selectedTable = tables.find(t => t.id === selectedTableIdState);

  const handleBookTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableIdState) {
      alert('Please click on a table in the floor map to select your preferred table.');
      return;
    }

    const targetTable = tables.find(t => t.id === selectedTableIdState);
    if (!targetTable) return;

    const res = await createReservation({
      customerName,
      customerEmail,
      customerPhone,
      partySize,
      date,
      timeSlot,
      tableId: targetTable.id,
      tableName: targetTable.label,
      zone: targetTable.zone,
      occasion,
      specialNotes
    });

    setSelectedTableId(targetTable.id);
    setConfirmedReservation(res);
  };


  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      
      {/* Title Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/20 p-8 shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Floor Plan Booking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
            Reserve Your Gourmet Table
          </h2>
          <p className="text-sm text-slate-300">
            Select your party size, date, and preferred seating zone. Tap on available tables directly on our interactive 2D floor layout.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 2D Interactive Floor Layout (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold font-serif text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>Restaurant Floor Map</span>
            </h3>

            {/* Zone Selector */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
              {ZONES.map(z => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${
                    selectedZone === z
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Cleaning</span>
            </div>
          </div>

          {/* 2D Floor Plan Table Canvas */}
          <div className="relative min-h-[340px] bg-slate-950/80 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center border-b border-slate-800/60 pb-2">
              Kitchen & Bar Pass Section ({selectedZone})
            </div>

            {/* Interactive Tables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
              {filteredTables.map(t => {
                const isSelected = selectedTableIdState === t.id;
                const isAvail = t.status === 'available';

                let statusBadgeColor = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
                if (t.status === 'reserved') statusBadgeColor = 'border-amber-500/50 bg-amber-500/10 text-amber-400';
                if (t.status === 'occupied') statusBadgeColor = 'border-red-500/50 bg-red-500/10 text-red-400';
                if (t.status === 'cleaning') statusBadgeColor = 'border-blue-500/50 bg-blue-500/10 text-blue-400';

                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!isAvail}
                    onClick={() => setSelectedTableIdState(t.id)}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 text-center ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-xl shadow-amber-500/20 scale-105'
                        : isAvail
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:scale-102 cursor-pointer'
                        : 'bg-slate-950/50 border-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Utensils className="w-4 h-4 text-amber-400" />
                      <span className="font-serif font-bold text-sm text-white">{t.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>{t.capacity} Seats</span>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${statusBadgeColor}`}>
                      {t.status}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[10px] text-slate-500 text-center uppercase tracking-widest pt-2 border-t border-slate-800/60">
              Main Entrance & Hostess Stand
            </div>
          </div>

        </div>

        {/* Right Column: Booking Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-base font-bold font-serif text-white border-b border-slate-800 pb-3">
            Reservation Details
          </h3>

          <form onSubmit={handleBookTable} className="space-y-4">
            
            {/* Selected Table Indicator */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Selected Table:</span>
              <span className="font-bold text-amber-400">
                {selectedTable ? `${selectedTable.label} (${selectedTable.zone} • ${selectedTable.capacity} Seats)` : 'Click a table on floor plan'}
              </span>
            </div>

            {/* Party Size & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Party Size</label>
                <select
                  value={partySize}
                  onChange={e => setPartySize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
                >
                  {[2, 3, 4, 5, 6, 8, 10].map(size => (
                    <option key={size} value={size}>{size} Guests</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
                >
                  {['17:00', '18:00', '19:00', '19:30', '20:00', '21:00'].map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Reservation Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Guest Name & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Guest Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Email Confirmation</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {/* Occasion & Notes */}
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Special Occasion</label>
              <select
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition"
              >
                {['Casual Dining', 'Birthday Celebration', 'Anniversary', 'Business Dinner', 'Date Night'].map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Special Requests</label>
              <textarea
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                rows={2}
                placeholder="High chair needed, quiet booth, allergies..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-500 to-yellow-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
            >
              Confirm Table Reservation
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Pass Modal */}
      {confirmedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
            <button
              onClick={() => setConfirmedReservation(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Digital Booking Pass</span>
              <h3 className="text-2xl font-bold font-serif text-white mt-1">
                {confirmedReservation.reservationCode}
              </h3>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Guest Name</span>
                <span className="font-bold text-white">{confirmedReservation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Table & Zone</span>
                <span className="font-bold text-amber-400">{confirmedReservation.tableName} ({confirmedReservation.zone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Party Size</span>
                <span className="font-bold text-white">{confirmedReservation.partySize} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-bold text-white">{confirmedReservation.date} @ {confirmedReservation.timeSlot}</span>
              </div>
            </div>

            {/* QR Code Graphic */}
            <div className="p-4 bg-white rounded-2xl w-40 h-40 mx-auto flex items-center justify-center shadow-md">
              <QrCode className="w-32 h-32 text-slate-950" />
            </div>
            <p className="text-[11px] text-slate-400">Present this QR pass to hostess upon arrival.</p>

            <button
              onClick={() => setConfirmedReservation(null)}
              className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-2xl hover:brightness-110 transition"
            >
              Done & Return to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
