import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign, Users, Star, Shield, Zap, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Clock size={32} />,
      title: "Save Time",
      description: "Get your errands done while you focus on what matters most to you."
    },
    {
      icon: <MapPin size={32} />,
      title: "Local Runners",
      description: "Connect with trusted runners in your neighborhood for quick service."
    },
    {
      icon: <DollarSign size={32} />,
      title: "Fair Pricing",
      description: "Set your own price or accept competitive rates for every chore."
    },
    {
      icon: <Shield size={32} />,
      title: "Secure & Safe",
      description: "All runners are verified with background checks and insurance coverage."
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Matching",
      description: "Get matched with available runners in minutes, not hours."
    },
    {
      icon: <Star size={32} />,
      title: "Rated Service",
      description: "Rate and review every experience to maintain quality standards."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Post Your Chore",
      description: "Describe what you need done, set your price, and specify the location."
    },
    {
      step: "2",
      title: "Get Matched",
      description: "Local ChoreRunners near you will see your request and accept the task."
    },
    {
      step: "3",
      title: "Track Progress",
      description: "Follow your runner's progress in real-time with live updates."
    },
    {
      step: "4",
      title: "Pay & Rate",
      description: "Secure payment processing and rate your experience."
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Outsource Your Errands. Instantly.</h1>
          <p>
            ChoreRun connects you with local runners who can handle your daily tasks - 
            from grocery shopping to package returns, we've got you covered.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link to="/register" className="btn btn-accent btn-lg">
              Get Started Today
            </Link>
            <Link to="/browse-chores" className="btn btn-outline btn-lg">
              Browse Chores
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose ChoreRun?</h2>
            <p className="text-large text-gray-600 max-width-2xl">
              We make it easy to get things done with a network of trusted local runners 
              ready to tackle your to-do list.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-large text-gray-600">
              Getting your errands done is as easy as 1-2-3-4
            </p>
          </div>
          
          <div className="features-grid">
            {howItWorks.map((step, index) => (
              <div key={index} className="card text-center">
                <div className="card-body">
                  <div 
                    className="feature-icon mb-4"
                    style={{
                      background: `linear-gradient(135deg, var(--accent), var(--accent-dark))`,
                      fontSize: '1.5rem',
                      fontWeight: '700'
                    }}
                  >
                    {step.step}
                  </div>
                  <h3 className="mb-2">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="dashboard-grid">
            <div className="stats-card">
              <div className="stats-number">10,000+</div>
              <div className="stats-label">Chores Completed</div>
            </div>
            <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))'}}>
              <div className="stats-number">5,000+</div>
              <div className="stats-label">Active Runners</div>
            </div>
            <div className="stats-card" style={{background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))'}}>
              <div className="stats-number">4.9★</div>
              <div className="stats-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Chores Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="mb-4">Popular Chore Categories</h2>
            <p className="text-large text-gray-600">
              See what kinds of tasks our runners help with every day
            </p>
          </div>
          
          <div className="features-grid">
            {[
              { name: "Shopping & Groceries", count: "2,500+ completed", icon: "🛒" },
              { name: "Package & Mail", count: "1,800+ completed", icon: "📦" },
              { name: "Food Delivery", count: "3,200+ completed", icon: "🍕" },
              { name: "Errands & Tasks", count: "1,600+ completed", icon: "✅" },
              { name: "Pet Services", count: "900+ completed", icon: "🐕" },
              { name: "Home Services", count: "1,200+ completed", icon: "🏠" }
            ].map((category, index) => (
              <div key={index} className="card">
                <div className="card-body text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {category.icon}
                  </div>
                  <h4 className="mb-2">{category.name}</h4>
                  <p className="text-gray-500">{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Get Your Errands Done?</h2>
          <p className="text-large text-gray-600 mb-8">
            Join thousands of users who save time with ChoreRun every day
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              <Users size={20} />
              Join as a User
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              <CheckCircle size={20} />
              Become a Runner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;