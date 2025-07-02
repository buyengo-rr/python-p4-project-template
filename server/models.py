from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    posted_chores = db.relationship('Chore', foreign_keys='Chore.posted_by_id', backref='poster', lazy='dynamic')
    accepted_chores = db.relationship('Chore', foreign_keys='Chore.accepted_by_id', backref='accepter', lazy='dynamic')
    completed_chores = db.relationship('Chore', foreign_keys='Chore.completed_by_id', backref='completer', lazy='dynamic')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'bio': self.bio,
            'rating': self.rating,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Chore(db.Model):
    __tablename__ = 'chores'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    payment = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    urgency = db.Column(db.String(50), nullable=False)  # low, medium, high
    estimated_time = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(50), default='active')  # active, accepted, completed, cancelled
    
    # User relationships
    posted_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    accepted_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    completed_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Timestamps
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    due_date = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self, include_user_details=True):
        result = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'payment': self.payment,
            'category': self.category,
            'urgency': self.urgency,
            'estimatedTime': self.estimated_time,
            'status': self.status,
            'postedAt': self.posted_at.isoformat() if self.posted_at else None,
            'acceptedAt': self.accepted_at.isoformat() if self.accepted_at else None,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None,
            'dueDate': self.due_date.isoformat() if self.due_date else None
        }
        
        if include_user_details:
            result.update({
                'postedBy': self.poster.name if self.poster else None,
                'acceptedBy': self.accepter.name if self.accepter else None,
                'completedBy': self.completer.name if self.completer else None,
                'posterDetails': self.poster.to_dict() if self.poster else None
            })
        
        return result

class ChoreApplication(db.Model):
    __tablename__ = 'chore_applications'
    
    id = db.Column(db.Integer, primary_key=True)
    chore_id = db.Column(db.Integer, db.ForeignKey('chores.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='pending')  # pending, accepted, rejected
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    chore = db.relationship('Chore', backref='applications')
    user = db.relationship('User', backref='applications')
    
    def to_dict(self):
        return {
            'id': self.id,
            'chore_id': self.chore_id,
            'user_id': self.user_id,
            'message': self.message,
            'status': self.status,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'user_name': self.user.name if self.user else None,
            'chore_title': self.chore.title if self.chore else None
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    chore_id = db.Column(db.Integer, db.ForeignKey('chores.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    chore = db.relationship('Chore', backref='reviews')
    reviewer = db.relationship('User', foreign_keys=[reviewer_id], backref='reviews_given')
    reviewee = db.relationship('User', foreign_keys=[reviewee_id], backref='reviews_received')
    
    def to_dict(self):
        return {
            'id': self.id,
            'chore_id': self.chore_id,
            'reviewer_id': self.reviewer_id,
            'reviewee_id': self.reviewee_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewer_name': self.reviewer.name if self.reviewer else None,
            'reviewee_name': self.reviewee.name if self.reviewee else None,
            'chore_title': self.chore.title if self.chore else None
        }