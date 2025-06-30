from app import create_app
from models import db, User, Chore
from datetime import datetime, timedelta

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create test users
        user1 = User(username='sarah_j', email='sarah@example.com')
        user1.set_password('password123')
        
        user2 = User(username='mike_c', email='mike@example.com')
        user2.set_password('password123')
        
        db.session.add_all([user1, user2])
        db.session.commit()
        
        # Create sample chores
        chores = [
            Chore(
                title="Pick up dry cleaning",
                description="Need someone to pick up my suit from Crystal Clean Dry Cleaners.",
                price=15.00,
                location="Downtown",
                time_estimate="30 mins",
                priority="medium",
                category="Personal",
                posted_by=user1.id,
                posted_at=datetime.utcnow() - timedelta(hours=2)
            ),
            # Add more sample chores...
        ]
        
        db.session.add_all(chores)
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()