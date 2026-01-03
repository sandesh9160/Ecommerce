'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Header from '@/components/Header';
import { Star, Quote, ChevronLeft, ChevronRight, ThumbsUp, MessageCircle } from 'lucide-react';

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

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Jaipur, Rajasthan",
    rating: 5,
    date: "2 weeks ago",
    title: "Excellent service and quality products!",
    content: "I've been shopping with YuvaKart for 6 months now. The product quality is outstanding and delivery is always on time. The customer service team is very helpful and responsive. Highly recommend for anyone looking for reliable eCommerce in rural areas.",
    avatar: "👨‍🌾",
    verified: true,
    helpful: 24
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Lucknow, Uttar Pradesh",
    rating: 5,
    date: "1 month ago",
    title: "Best prices and fast delivery",
    content: "The prices are very competitive compared to local markets. I ordered electronics and household items, everything arrived in perfect condition. The packaging was excellent and the delivery was faster than expected.",
    avatar: "👩‍💼",
    verified: true,
    helpful: 18
  },
  {
    id: 3,
    name: "Amit Singh",
    location: "Patna, Bihar",
    rating: 4,
    date: "3 weeks ago",
    title: "Great platform for rural shopping",
    content: "As someone living in a small town, access to quality products was always a challenge. YuvaKart solved this problem. The UPI payment system is very convenient and the order tracking is excellent. Minor delay in one order but overall satisfied.",
    avatar: "👨‍💻",
    verified: true,
    helpful: 15
  },
  {
    id: 4,
    name: "Sunita Devi",
    location: "Ranchi, Jharkhand",
    rating: 5,
    date: "1 week ago",
    title: "Trustworthy and reliable service",
    content: "I was skeptical about online shopping initially, but YuvaKart changed my mind. They have genuine products at fair prices. The return policy is customer-friendly and their support team helped me with a query very patiently.",
    avatar: "👩‍🏫",
    verified: true,
    helpful: 22
  },
  {
    id: 5,
    name: "Vikram Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    date: "5 days ago",
    title: "Outstanding customer experience",
    content: "From browsing to delivery, the entire experience was smooth. The website is easy to use even for someone not very tech-savvy. Products arrived well-packaged and exactly as described. Will definitely shop again!",
    avatar: "👨‍🔧",
    verified: true,
    helpful: 12
  },
  {
    id: 6,
    name: "Meera Joshi",
    location: "Indore, Madhya Pradesh",
    rating: 4,
    date: "2 weeks ago",
    title: "Good quality, minor delivery issues",
    content: "Products are of good quality and prices are reasonable. Had a small issue with delivery timing but the customer service resolved it quickly. Overall happy with the service and would recommend to others.",
    avatar: "👩‍⚕️",
    verified: true,
    helpful: 9
  }
];

const stats = [
  { label: "Happy Customers", value: "50,000+", icon: "😊" },
  { label: "Products Delivered", value: "2,50,000+", icon: "📦" },
  { label: "Average Rating", value: "4.8/5", icon: "⭐" },
  { label: "Response Time", value: "< 2 hours", icon: "⚡" }
];

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const reviewsPerPage = 3;

  const filteredReviews = selectedRating
    ? testimonials.filter(review => review.rating === selectedRating)
    : testimonials;

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const currentReviews = filteredReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            What Our Customers Say
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-green-100 max-w-2xl mx-auto"
          >
            Real reviews from real customers across rural and semi-urban India
          </motion.p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
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

      {/* Reviews Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Customer Reviews
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our customers from across India have to say about their YuvaKart experience
            </p>
          </motion.div>

          {/* Rating Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            <Button
              variant={selectedRating === null ? "default" : "outline"}
              onClick={() => setSelectedRating(null)}
              size="sm"
            >
              All Reviews
            </Button>
            {[5, 4, 3].map(rating => (
              <Button
                key={rating}
                variant={selectedRating === rating ? "default" : "outline"}
                onClick={() => setSelectedRating(rating)}
                size="sm"
              >
                {rating} Star{rating !== 1 ? 's' : ''}
              </Button>
            ))}
          </motion.div>

          {/* Reviews Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedRating}-${currentPage}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {currentReviews.map((review) => (
                <motion.div key={review.id} variants={itemVariants}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                            {review.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm">{review.name}</h3>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{review.location}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <h4 className="font-medium text-foreground">{review.title}</h4>
                    </CardHeader>
                    <CardContent>
                      <div className="relative mb-4">
                        <Quote className="w-6 h-6 text-primary/30 absolute -top-2 -left-2" />
                        <p className="text-sm text-muted-foreground pl-4 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{review.helpful} found this helpful</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                    className="w-8 h-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join Thousands of Happy Customers</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Experience the YuvaKart difference today. Quality products, reliable delivery, and exceptional service.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a href="/">
                Start Shopping Now
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
