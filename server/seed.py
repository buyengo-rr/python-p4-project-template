from app import create_app
from models import db, User, Chore, ChoreApplication, Review
from datetime import datetime, timedelta
import random

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        # Create sample users
        print("Creating sample users...")
        users_data = [
            {
                'name': 'Alice Johnson',
                'email': 'alice@example.com',
                'password': 'password123',
                'phone': '+1-555-0101',
                'location': 'Downtown, City Center',
                'bio': 'Reliable and experienced in home maintenance tasks. Available weekends and evenings.'
            },
            {
                'name': 'Bob Smith',
                'email': 'bob@example.com',
                'password': 'password123',
                'phone': '+1-555-0102',
                'location': 'Suburbs, North District',
                'bio': 'Handy with tools and great at organizing. Love helping neighbors with their projects.'
            },
            {
                'name': 'Carol Davis',
                'email': 'carol@example.com',
                'password': 'password123',
                'phone': '+1-555-0103',
                'location': 'West Side, Near Park',
                'bio': 'Professional cleaner with 5 years experience. Detailed and thorough work guaranteed.'
            },
            {
                'name': 'David Wilson',
                'email': 'david@example.com',
                'password': 'password123',
                'phone': '+1-555-0104',
                'location': 'East District, Shopping Area',
                'bio': 'College student looking for part-time work. Good with technology and delivery tasks.'
            },
            {
                'name': 'Emma Brown',
                'email': 'emma@example.com',
                'password': 'password123',
                'phone': '+1-555-0105',
                'location': 'South End, Residential',
                'bio': 'Stay-at-home mom with flexible schedule. Great with kids and pet care.'
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                name=user_data['name'],
                email=user_data['email'],
                phone=user_data['phone'],
                location=user_data['location'],
                bio=user_data['bio'],
                rating=round(random.uniform(4.0, 5.0), 1)
            )
            user.set_password(user_data['password'])
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        print(f"Created {len(users)} users")
        
        # Create sample chores
        print("Creating sample chores...")
        chores_data = [
            {
                'title': 'House Cleaning Service',
                'description': 'Need a thorough cleaning of my 3-bedroom house. Includes kitchen, bathrooms, living areas, and bedrooms. Vacuum, mop, dust, and organize.',
                'location': 'Downtown, City Center',
                'payment': 120.0,
                'category': 'Cleaning',
                'urgency': 'medium',
                'estimated_time': '3-4 hours'
            },
            {
                'title': 'Grocery Shopping and Delivery',
                'description': 'Weekly grocery shopping for elderly resident. List will be provided. Need someone reliable who can shop carefully and deliver to apartment.',
                'location': 'Suburbs, North District',
                'payment': 45.0,
                'category': 'Shopping',
                'urgency': 'low',
                'estimated_time': '2 hours'
            },
            {
                'title': 'Furniture Assembly - IKEA Desk',
                'description': 'Recently bought a desk from IKEA and need help assembling it. All tools and instructions provided. Should be straightforward for someone handy.',
                'location': 'West Side, Near Park',
                'payment': 60.0,
                'category': 'Assembly',
                'urgency': 'medium',
                'estimated_time': '1-2 hours'
            },
            {
                'title': 'Dog Walking - Urgent',
                'description': 'My regular dog walker is sick and I need someone to walk my Golden Retriever today. Very friendly dog, just needs 45 minutes of exercise.',
                'location': 'East District, Shopping Area',
                'payment': 25.0,
                'category': 'Pet Care',
                'urgency': 'high',
                'estimated_time': '1 hour'
            },
            {
                'title': 'Garden Weeding and Maintenance',
                'description': 'Spring cleaning for my backyard garden. Need someone to remove weeds, trim bushes, and general maintenance. Some gardening experience preferred.',
                'location': 'South End, Residential',
                'payment': 80.0,
                'category': 'Gardening',
                'urgency': 'low',
                'estimated_time': '2-3 hours'
            },
            {
                'title': 'Move Heavy Furniture',
                'description': 'Moving a couch and dining table to second floor. Need 2 strong people to help safely move furniture up stairs. Will provide moving straps.',
                'location': 'Downtown, City Center',
                'payment': 100.0,
                'category': 'Moving',
                'urgency': 'high',
                'estimated_time': '2 hours'
            },
            {
                'title': 'Computer Setup and Tech Support',
                'description': 'Just got a new computer and need help setting it up, installing software, and transferring files from old computer. Tech-savvy person needed.',
                'location': 'Suburbs, North District',
                'payment': 75.0,
                'category': 'Technology',
                'urgency': 'medium',
                'estimated_time': '2-3 hours'
            },
            {
                'title': 'Event Setup - Birthday Party',
                'description': 'Need help setting up decorations and organizing for my daughter\'s 8th birthday party. Includes balloon setup, table arrangement, and cleanup.',
                'location': 'West Side, Near Park',
                'payment': 90.0,
                'category': 'Events',
                'urgency': 'medium',
                'estimated_time': '3 hours'
            }
        ]
        
        chores = []
        for i, chore_data in enumerate(chores_data):
            # Assign chores to different users
            poster = users[i % len(users)]
            
            # Create due date (1-14 days from now)
            due_date = datetime.utcnow() + timedelta(days=random.randint(1, 14))