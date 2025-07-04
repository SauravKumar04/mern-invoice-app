import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Bitcoin,
  DollarSign,
  Mail,
  ExternalLink,
  Sparkles,
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const PaymentHub = () => {
  const { invoiceId } = useParams();
  const [searchParams] = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  const amount = searchParams.get('amount');
  const invoiceNumber = searchParams.get('invoice');
  const clientName = searchParams.get('client');

  useEffect(() => {
    setMounted(true);
  }, []);

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Secure card payments with Stripe',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      url: `/pay/${invoiceId}`,
      recommended: true,
      features: ['Instant', 'Secure', 'Worldwide']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: <Wallet className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      gradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      url: `https://paypal.me/yourcompany/${amount}`,
      features: ['Trusted', 'Fast', 'Buyer Protection']
    },
    {
      id: 'venmo',
      name: 'Venmo',
      description: 'Quick mobile payments',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-cyan-500 to-cyan-600',
      gradient: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      url: `https://venmo.com/yourcompany?txn=pay&amount=${amount}&note=Invoice%20${invoiceNumber}`,
      features: ['Mobile-First', 'Social', 'US Only']
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      description: 'Send money with Cash App',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      gradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      url: `https://cash.app/$yourcompany/${amount}`,
      features: ['Instant', 'Mobile', 'Popular']
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      description: 'Cryptocurrency payment',
      icon: <Bitcoin className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      gradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      url: `bitcoin:?amount=${(amount * 0.000025).toFixed(8)}&label=Invoice%20${invoiceNumber}`,
      features: ['Decentralized', 'Low Fees', 'Global']
    },
    {
      id: 'zelle',
      name: 'Zelle',
      description: 'Bank-to-bank transfer',
      icon: <Mail className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      gradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      url: `mailto:payment@yourcompany.com?subject=Payment%20for%20Invoice%20${invoiceNumber}&body=Amount:%20$${amount}`,
      features: ['Bank Transfer', 'No Fees', 'Secure']
    }
  ];

  const handlePaymentClick = (method) => {
    if (method.id === 'stripe') {
      // Internal navigation for Stripe
      window.location.href = method.url;
    } else {
      // External links for other methods
      window.open(method.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 opacity-20 pointer-events-none">
        <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
      <div className="absolute top-40 left-10 opacity-15 pointer-events-none">
        <Star className="w-6 h-6 text-purple-500 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10 pointer-events-none">
        <DollarSign className="w-7 h-7 text-green-500 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`container mx-auto px-4 py-8 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Payment Options</h1>
              <p className="text-gray-600 text-lg mt-1">Choose your preferred payment method</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Secure Payment</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">${amount}</div>
                <div className="text-gray-600">Invoice #{invoiceNumber}</div>
                {clientName && (
                  <div className="text-sm text-gray-500">for {decodeURIComponent(clientName)}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div
                key={method.id}
                className={`relative transition-all duration-500 delay-${index * 100} ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <button
                  onClick={() => handlePaymentClick(method)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-xl transform hover:scale-105 relative overflow-hidden group ${
                    method.recommended 
                      ? `bg-gradient-to-r ${method.gradient} ${method.borderColor} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  {method.recommended && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Recommended
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${method.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {method.features.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full text-xs font-medium text-gray-700"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className={`mt-12 max-w-2xl mx-auto transition-all duration-1000 delay-600 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-100/30 to-transparent rounded-full blur-xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Secure & Trusted</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                All payment methods are secure and encrypted. Your financial information is protected 
                with industry-standard security measures.
              </p>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Instant Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Worldwide Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-800 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-gray-500">
            Powered by <strong className="text-purple-600">InvoX</strong> • Modern Invoice Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentHub;