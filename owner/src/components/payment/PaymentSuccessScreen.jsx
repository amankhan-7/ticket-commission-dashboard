import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaDownload, FaTicketAlt, FaSpinner, FaHome } from 'react-icons/fa';
import { generateTicketPDF } from '@/utils/ticketPdfGenerator';
import { toast } from 'sonner';

const PaymentSuccessScreen = ({ 
  booking, 
  onClose, 
  onDownloadTicket,
  onGoHome,
  loadingDuration = 3000 
}) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Show loading for the specified duration
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, loadingDuration);

    return () => clearTimeout(timer);
  }, [loadingDuration]);

  const handleDownloadTicket = async () => {
    if (!booking) {
      toast.error('No booking data available for ticket generation');
      return;
    }

    try {
      setIsDownloading(true);
      await generateTicketPDF(booking);
      toast.success('Ticket downloaded successfully!');
      if (onDownloadTicket) {
        onDownloadTicket(booking);
      }
    } catch (error) {
      console.error('Error generating ticket:', error);
      toast.error('Failed to generate ticket. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-[12px] p-8 max-w-md mx-4 text-center animate-fadeInUp">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FaSpinner className="text-3xl text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment and create your booking...
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: '100%',
                animation: 'pulse 2s infinite'
              }}
            />
          </div>
          
          <p className="text-sm text-gray-500">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-[12px] p-8 max-w-lg mx-4 text-center animate-fadeInUp">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your booking has been confirmed and tickets are ready.
            </p>
          </div>

          {booking && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Booking ID:</span> {booking.bookingReference || 'N/A'}</p>
                <p><span className="font-medium">Passenger:</span> {booking.passengerName || 'N/A'}</p>
                <p><span className="font-medium">Route:</span> {booking.fromCity} → {booking.toCity}</p>
                <p><span className="font-medium">Date:</span> {new Date(booking.journeyDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Seats:</span> {Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : booking.seatNumbers}</p>
                <p><span className="font-medium">Amount:</span> ₹{booking.amount}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownloadTicket}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaDownload />
                  <span>Download Ticket</span>
                </>
              )}
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={onGoHome}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
              >
                <FaHome />
                <span>Go to Home</span>
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                <FaTicketAlt />
                <span>View Bookings</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            You can also download your ticket later from the bookings section.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessScreen;
