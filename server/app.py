from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Chore
from config import Config
from datetime import datetime

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Add this method to your Chore model in models.py
    def chore_to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'location': self.location,
            'time_estimate': self.time_estimate,
            'priority': self.priority,
            'category': self.category,
            'status': self.status,
            'posted_by': self.posted_by,
            'accepted_by': self.accepted_by,
            'posted_at': self.posted_at.isoformat() if self.posted_at else None
        }
    
    Chore.to_dict = chore_to_dict

    @app.route('/')
    def home():
        return "ChoreRun Server is running!"

    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'Username already exists'}), 400
            
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'}), 201
    
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
            
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'rating': user.rating
            }
        })
    
    @app.route('/api/chores', methods=['GET'])
    @jwt_required()
    def get_chores():
        chores = Chore.query.all()
        return jsonify([chore.to_dict() for chore in chores])
    
    @app.route('/api/chores', methods=['POST'])
    @jwt_required()
    def create_chore():
        data = request.get_json()
        current_user = get_jwt_identity()
        
        chore = Chore(
            title=data['title'],
            description=data['description'],
            price=data['price'],
            location=data['location'],
            time_estimate=data['time_estimate'],
            priority=data.get('priority', 'medium'),
            category=data['category'],
            posted_by=current_user
        )
        
        db.session.add(chore)
        db.session.commit()
        return jsonify(chore.to_dict()), 201
    
    @app.route('/api/chores/<int:chore_id>/accept', methods=['POST'])
    @jwt_required()
    def accept_chore(chore_id):
        current_user = get_jwt_identity()
        chore = Chore.query.get_or_404(chore_id)
        
        if chore.status != 'active':
            return jsonify({'message': 'Chore not available'}), 400
            
        chore.status = 'accepted'
        chore.accepted_by = current_user
        db.session.commit()
        
        return jsonify(chore.to_dict())
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)  # Explicitly set port