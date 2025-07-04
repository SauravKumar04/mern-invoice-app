import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  X, 
  QrCode, 
  Mail, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Bitcoin,
  DollarSign,
  Sparkles,
  Star,
  CheckCircle,
  Send,
  Download,
  MessageSquare
} from 'lucide-react';

const PaymentQRModal = ({ invoice, isOpen, onClose, onSendQR }) => {
  const [sending, setSending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('multiple');
  const [customMessage, setCustomMessage] = useState('');
  const [downloadingQR, setDownloadingQR] = useState(false);

  const paymentMethods = [
    {
      id: 'multiple',
      name: 'All Payment Options',
      description: 'Show all available payment methods in one place',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      gradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Cards',
      description: 'Secure card payments via Stripe',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with PayPal account',
      icon: <Wallet className="w-5 h-5" />,
      color: 'from-yellow-500 to-yellow-600',
      gradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'venmo',
      name: 'Venmo',
      description: 'Quick payments with Venmo',
      icon: <Smartphone className="w-5 h-5" />,
      color: 'from-cyan-500 to-cyan-600',
      gradient: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200'
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      description: 'Send payment via Cash App',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      gradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      description: 'Cryptocurrency payment',
      icon: <Bitcoin className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      gradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200'
    }
  ];

  const calculateTotal = () => {
    if (!invoice) return 0;
    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxAmount = subtotal * (invoice.tax / 100);
    const discountAmount = subtotal * (invoice.discount / 100);
    return subtotal + taxAmount - discountAmount;
  };

  const handleSendQR = async () => {
    setSending(true);
    try {
      await onSendQR({
        paymentMethod,
        customMessage
      });
      toast.success("🎉 Payment QR code sent successfully! Check your client's email.");
      onClose();
    } catch (error) {
      toast.error("Failed to send payment QR code. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDownloadQR = async () => {
    setDownloadingQR(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API || 'http://localhost:4000'}/api/payments/${invoice._id}/qr-code?paymentMethod=${paymentMethod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `payment-qr-${invoice.invoiceNumber}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("QR code downloaded successfully!");
      } else {
        throw new Error('Failed to download QR code');
      }
    } catch (error) {
      toast.error("Failed to download QR code. Please try again.");
    } finally {
      setDownloadingQR(false);
    }
  };

  if (!isOpen) return null;

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-blue-100/20 rounded-full blur-2xl" />
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Send Payment QR Code</h2>
                <p className="text-gray-600">Generate and email a QR code for easy payments</p>
              </div>
            </div>
            
            {/* Invoice info */}
            <div className="flex items-center gap-4 mt-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600">Invoice</div>
                <div className="font-semibold text-gray-900">#{invoice.invoiceNumber}</div>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="text-sm text-gray-600">Amount</div>
                <div className="font-bold text-green-600 text-lg">${calculateTotal().toFixed(2)}</div>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="text-sm text-gray-600">Client</div>
                <div className="font-semibold text-gray-900">{invoice.clientName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Payment Method Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg transform hover:scale-105 ${
                    paymentMethod === method.id
                      ? `bg-gradient-to-r ${method.gradient} ${method.borderColor} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color} text-white shadow-md`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <label className="text-lg font-semibold text-gray-900" htmlFor="customMessage">
                Custom Message (Optional)
              </label>
            </div>
            <textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message to include with the payment QR code..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {customMessage.length}/500 characters
            </div>
          </div>

          {/* Selected Method Preview */}
          {selectedMethod && (
            <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedMethod.gradient} border ${selectedMethod.borderColor}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedMethod.color} text-white`}>
                  {selectedMethod.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Selected: {selectedMethod.name}</div>
                  <div className="text-sm text-gray-600">{selectedMethod.description}</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 bg-white/60 rounded-lg p-3 mt-3">
                📱 <strong>QR Code will contain:</strong> {
                  selectedMethod.id === 'multiple' 
                    ? 'A link to a payment hub with all available payment options'
                    : `Direct link to ${selectedMethod.name} payment`
                }
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleDownloadQR}
            disabled={downloadingQR}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
          >
            {downloadingQR ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download QR
              </>
            )}
          </button>
          
          <button
            onClick={handleSendQR}
            disabled={sending}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending QR Code...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send via Email
                  <Sparkles className="w-4 h-4 opacity-75" />
                </>
              )}
            </span>
            {!sending && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRModal;