'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { ShoppingBag, Users, Truck, Heart, Target, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
                >
                    <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-blue-500/10 text-blue-200 border-blue-500/20 backdrop-blur-sm">
                        Empowering Rural India
                    </Badge>
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-300">
                        About YuvaKart
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Bridging the gap between quality products and rural availability. We are building the future of eCommerce for Bharat.
                    </p>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50" />
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                        <Target className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4 text-slate-800">Our Mission</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                        To democratize access to high-quality products for every village and town in India. We strive to create an inclusive digital marketplace that serves the unique needs of rural and semi-urban communities with reliability and trust.
                                    </p>
                                    <ul className="space-y-3">
                                        {['Access to quality goods', 'Fair pricing', 'Reliable delivery network'].map((item, i) => (
                                            <li key={i} className="flex items-center text-slate-700">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card className="h-full border-0 shadow-xl bg-slate-900 text-white">
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                                        <Lightbulb className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                                    <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                        To be the most trusted and preferred shopping destination for a billion Indians, fostering digital inclusion and economic growth across the nation.
                                    </p>
                                    <ul className="space-y-3">
                                        {['Digital inclusion', 'Economic empowerment', 'Sustainable growth'].map((item, i) => (
                                            <li key={i} className="flex items-center text-slate-300">
                                                <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { icon: ShoppingBag, label: "Products", value: "10,000+" },
                            { icon: Users, label: "Happy Customers", value: "50k+" },
                            { icon: Truck, label: "Pincodes Served", value: "2,500+" },
                            { icon: Heart, label: "Community", value: "Growing" }
                        ].map((stat, index) => (
                            <motion.div key={index} variants={itemVariants} className="text-center">
                                <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <stat.icon className="w-6 h-6 text-slate-700" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-slate-900">Why Choose YuvaKart?</h2>
                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed text-left">
                            <p>
                                Founded with a simple yet powerful idea: <strong>Why should geography dictate quality?</strong> YuvaKart was born out of the need to provide authentic, high-quality products to customers in rural and semi-urban areas where access to major e-commerce players is often limited or unreliable.
                            </p>
                            <p>
                                We understand the unique challenges of rural logistics. That's why we've built a robust delivery network designed specifically for villages and towns, ensuring your orders reach you safely and on time. From groceries to gadgets, we bring the market to your doorstep.
                            </p>
                            <p>
                                At YuvaKart, we believe in trust. We offer transparent pricing, easy returns, and dedicated customer support to ensure your shopping experience is nothing short of excellent.
                            </p>
                        </div>
                        <div className="mt-12">
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                                <Link href="/contact">
                                    Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Experience Better Shopping?</h2>
                        <p className="text-xl text-slate-300 mb-10">Join thousands of satisfied customers who trust YuvaKart for their daily needs.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" variant="secondary" className="text-slate-900 font-bold text-lg h-14 px-8">
                                <Link href="/">Start Shopping</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-lg h-14 px-8">
                                <Link href="/register">Create Account</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
