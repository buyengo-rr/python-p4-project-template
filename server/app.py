from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os

from config import config
from models import db, User, Chore, ChoreApplication, Review

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'default')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Routes
    @app.route('/api/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'email', 'password']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'message': f'{field} is required'}), 400
            
            # Check if user already exists
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'message': 'User with this email already exists'}), 400
            
            # Create new user
            user = User(
                name=data['name'],
                email=data['email'],
                phone=data.get('phone'),
                location=data.get('location'),
                bio=data.get('bio')
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            # Create token
            token = create_access_token(identity=user.id)
            
            response_data = user.to_dict()
            response_data['token'] = token
            
            return jsonify(response_data), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Registration failed: {str(e)}'}), 500
    
    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            if not data.get('email') or not data.get('password'):
                return jsonify({'message': 'Email and password are required'}), 400
            
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not user.check_password(data['password']):
                return jsonify({'message': 'Invalid email or password'}), 401
            
            token = create_access_token(identity=user.id)
            
            response_data = user.to_dict()
            response_data['token'] = token
            
            return jsonify(response_data), 200
            
        except Exception as e:
            return jsonify({'message': f'Login failed: {str(e)}'}), 500
    
    @app.route('/api/chores', methods=['GET'])
    def get_chores():
        try:
            # Get query parameters
            status = request.args.get('status', 'active')
            category = request.args.get('category')
            location = request.args.get('location')
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 20))
            
            # Build query
            query = Chore.query
            
            if status:
                query = query.filter(Chore.status == status)
            if category:
                query = query.filter(Chore.category == category)
            if location:
                query = query.filter(Chore.location.ilike(f'%{location}%'))
            
            # Order by posted_at descending
            query = query.order_by(Chore.posted_at.desc())
            
            # Paginate
            chores = query.paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return jsonify([chore.to_dict() for chore in chores.items]), 200
            
        except Exception as e:
            return jsonify({'message': f'Failed to fetch chores: {str(e)}'}), 500
    
    @app.route('/api/chores', methods=['POST'])
    @jwt_required()
    def create_chore():
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'description', 'location', 'payment', 'category', 'urgency']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'message': f'{field} is required'}), 400
            
            # Parse due date if provided
            due_date = None
            if data.get('dueDate'):
                try:
                    due_date = datetime.fromisoformat(data['dueDate'].replace('Z', '+00:00'))
                except ValueError:
                    return jsonify({'message': 'Invalid due date format'}), 400
            
            chore = Chore(
                title=data['title'],
                description=data['description'],
                location=data['location'],
                payment=float(data['payment']),
                category=data['category'],
                urgency=data['urgency'],
                estimated_time=data.get('estimatedTime'),
                due_date=due_date,
                posted_by_id=user_id
            )
            
            db.session.add(chore)
            db.session.commit()
            
            return jsonify(chore.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Failed to create chore: {str(e)}'}), 500
    
    @app.route('/api/chores/<int:chore_id>/accept', methods=['PATCH'])
    @jwt_required()
    def accept_chore(chore_id):
        try:
            user_id = get_jwt_identity()
            chore = Chore.query.get_or_404(chore_id)
            
            if chore.status != 'active':
                return jsonify({'message': 'Chore is not available for acceptance'}), 400
            
            if chore.posted_by_id == user_id:
                return jsonify({'message': 'Cannot accept your own chore'}), 400
            
            chore.accepted_by_id = user_id
            chore.accepted_at = datetime.utcnow()
            chore.status = 'accepted'
            
            db.session.commit()
            
            return jsonify(chore.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Failed to accept chore: {str(e)}'}), 500
    
    @app.route('/api/chores/<int:chore_id>/complete', methods=['PATCH'])
    @jwt_required()
    def complete_chore(chore_id):
        try:
            user_id = get_jwt_identity()
            chore = Chore.query.get_or_404(chore_id)
            
            if chore.status != 'accepted':
                return jsonify({'message': 'Chore is not in accepted status'}), 400
            
            if chore.accepted_by_id != user_id:
                return jsonify({'message': 'Only the accepter can complete this chore'}), 403
            
            chore.completed_by_id = user_id
            chore.completed_at = datetime.utcnow()
            chore.status = 'completed'
            
            db.session.commit()
            
            return jsonify(chore.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Failed to complete chore: {str(e)}'}), 500
    
    @app.route('/api/user/profile', methods=['GET'])
    @jwt_required()
    def get_profile():
        try:
            user_id = get_jwt_identity()
            user = User.query.get_or_404(user_id)
            return jsonify(user.to_dict()), 200
        except Exception as e:
            return jsonify({'message': f'Failed to get profile: {str(e)}'}), 500
    
    @app.route('/api/user/profile', methods=['PUT'])
    @jwt_required()
    def update_profile():
        try:
            user_id = get_jwt_identity()
            user = User.query.get_or_404(user_id)
            data = request.get_json()
            
            # Update allowed fields
            updatable_fields = ['name', 'phone', 'location', 'bio']
            for field in updatable_fields:
                if field in data:
                    setattr(user, field, data[field])
            
            # Handle password update separately
            if 'password' in data and data['password']:
                user.set_password(data['password'])
            
            db.session.commit()
            
            return jsonify(user.to_dict()), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Failed to update profile: {str(e)}'}), 500
    
    @app.route('/api/user/chores', methods=['GET'])
    @jwt_required()
    def get_user_chores():
        try:
            user_id = get_jwt_identity()
            chore_type = request.args.get('type', 'all')  # posted, accepted, completed, all
            
            if chore_type == 'posted':
                chores = Chore.query.filter_by(posted_by_id=user_id).order_by(Chore.posted_at.desc()).all()
            elif chore_type == 'accepted':
                chores = Chore.query.filter_by(accepted_by_id=user_id, status='accepted').order_by(Chore.accepted_at.desc()).all()
            elif chore_type == 'completed':
                chores = Chore.query.filter_by(completed_by_id=user_id, status='completed').order_by(Chore.completed_at.desc()).all()
            else:
                # All chores related to user
                posted = Chore.query.filter_by(posted_by_id=user_id).all()
                accepted = Chore.query.filter_by(accepted_by_id=user_id).all()
                completed = Chore.query.filter_by(completed_by_id=user_id).all()
                
                # Combine and remove duplicates
                chore_ids = set()
                chores = []
                for chore_list in [posted, accepted, completed]:
                    for chore in chore_list:
                        if chore.id not in chore_ids:
                            chores.append(chore)
                            chore_ids.add(chore.id)
                
                # Sort by most recent activity
                chores.sort(key=lambda x: x.posted_at, reverse=True)
            
            return jsonify([chore.to_dict() for chore in chores]), 200
            
        except Exception as e:
            return jsonify({'message': f'Failed to get user chores: {str(e)}'}), 500
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)