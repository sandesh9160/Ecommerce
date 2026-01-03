'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Header from '@/components/Header';
import { ChevronDown, ChevronUp, Search, HelpCircle, Truck, CreditCard, RefreshCw, Shield, Phone, MessageCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const faqCategories = [
  {
    id: 'general',
    name: 'General Questions',
    icon: HelpCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'orders',
    name: 'Orders & Shipping',
    icon: Truck,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'returns',
    name: 'Returns & Refunds',
    icon: RefreshCw,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'account',
    name: 'Account & Support',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
];

const faqData = {
  general: [
    {
      id: 1,
      question: "What is YuvaKart?",
      answer: "YuvaKart is a modern eCommerce platform designed specifically for rural and semi-urban customers in India. We offer quality products at competitive prices with reliable delivery and easy payment options."
    },
    {
      id: 2,
      question: "Is YuvaKart available in my area?",
      answer: "YuvaKart serves customers across rural and semi-urban areas throughout India. We partner with reliable courier services to ensure timely delivery to even remote locations."
    },
    {
      id: 3,
      question: "Are your products genuine?",
      answer: "Yes, all products on YuvaKart are 100% genuine. We source directly from authorized manufacturers and distributors to ensure quality and authenticity."
    },
    {
      id: 4,
      question: "Do you offer warranty on products?",
      answer: "Most electronic products come with manufacturer warranty. The warranty terms vary by product and brand. Please check the product description for specific warranty information."
    }
  ],
  orders: [
    {
      id: 5,
      question: "How long does delivery take?",
      answer: "Delivery typically takes 3-7 business days depending on your location. Rural areas may take 5-10 days. You'll receive tracking updates once your order ships."
    },
    {
      id: 6,
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive tracking information via WhatsApp and email. You can also check your order status on our website."
    },
    {
      id: 7,
      question: "What if my order is delayed?",
      answer: "If your order is delayed beyond the estimated delivery time, please contact our customer support. We'll investigate and provide updates or arrange alternatives."
    },
    {
      id: 8,
      question: "Can I change my delivery address after placing an order?",
      answer: "Address changes are possible only before the order ships. Please contact us immediately if you need to change the delivery address."
    }
  ],
  payment: [
    {
      id: 9,
      question: "What payment methods do you accept?",
      answer: "We accept UPI payments only. This includes Google Pay, PhonePe, Paytm, and other UPI apps. No credit/debit cards or net banking required."
    },
    {
      id: 10,
      question: "Is UPI payment safe?",
      answer: "Yes, UPI is a secure payment method regulated by RBI. All transactions are protected by bank-level security. We never store your payment information."
    },
    {
      id: 11,
      question: "How do I make payment?",
      answer: "After placing your order, you'll receive a payment QR code and exact amount details. Open any UPI app, scan the QR code, and complete the payment."
    },
    {
      id: 12,
      question: "What if I pay the wrong amount?",
      answer: "If you pay more than the order amount, we'll refund the excess within 3-5 business days. If you pay less, we'll contact you to complete the payment."
    }
  ],
  returns: [
    {
      id: 13,
      question: "What is your return policy?",
      answer: "We offer returns within 7 days of delivery for damaged or defective products. The product must be unused and in original packaging. Return shipping is free for valid claims."
    },
    {
      id: 14,
      question: "How do I initiate a return?",
      answer: "Contact our customer support with your order number and reason for return. We'll provide a return authorization and pickup arrangements."
    },
    {
      id: 15,
      question: "When will I get my refund?",
      answer: "Refunds are processed within 3-5 business days after we receive and inspect the returned product. Amount will be credited to your original payment method."
    },
    {
      id: 16,
      question: "Can I exchange a product?",
      answer: "Yes, you can exchange for a different size/color of the same product or get a different product of equal or lesser value. Exchanges are subject to product availability."
    }
  ],
  account: [
    {
      id: 17,
      question: "Do I need to create an account?",
      answer: "No account creation is required. You can place orders as a guest. However, creating an account helps track your orders and get personalized recommendations."
    },
    {
      id: 18,
      question: "How do I contact customer support?",
      answer: "You can reach us via WhatsApp, phone, or email. Our support team responds within 2 hours during business hours. Check our contact page for details."
    },
    {
      id: 19,
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled before they ship. Contact us immediately if you need to cancel. Once shipped, you'll need to follow our return policy."
    },
    {
      id: 20,
      question: "How do I report a problem with my order?",
      answer: "Please contact our support team with your order number, photos of the issue, and description. We'll resolve the matter quickly and fairly."
    }
  ]
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleQuestion = (questionId: number) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const filteredFAQs = faqData[activeCategory as keyof typeof faqData].filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-indigo-100 max-w-2xl mx-auto"
          >
            Find quick answers to common questions about YuvaKart
          </motion.p>
        </div>
      </motion.section>

      {/* Search and Categories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  variants={itemVariants}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card text-card-foreground border-border hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {faqData[category.id as keyof typeof faqData].length}
                  </Badge>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matching questions found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or browse other categories.</p>
              </motion.div>
            ) : (
              filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader
                      className="cursor-pointer"
                      onClick={() => toggleQuestion(faq.id)}
                    >
                      <CardTitle className="flex items-center justify-between text-left pr-8">
                        <span className="text-lg">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: openQuestions.has(faq.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </CardTitle>
                    </CardHeader>
                    <AnimatePresence>
                      {openQuestions.has(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="/contact" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Support
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Questions Answered", value: "500+", icon: "❓" },
              { label: "Avg Response Time", value: "< 2 hrs", icon: "⚡" },
              { label: "Customer Satisfaction", value: "98%", icon: "😊" },
              { label: "Support Channels", value: "4", icon: "📞" }
            ].map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
