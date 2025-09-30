from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import logging

# Import cloud service modules
from services.aws_fetch import AWSFetcher
from services.gcp_fetch import GCPFetcher

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

@app.route('/scan/aws', methods=['POST'])
def scan_aws():
    """Scan AWS infrastructure"""
    try:
        data = request.get_json()
        
        if not data or 'credentials' not in data:
            return jsonify({'error': 'Missing credentials'}), 400
        
        credentials = data['credentials']
        regions = data.get('regions', ['us-east-1', 'us-west-2'])
        
        # Validate required credentials
        required_fields = ['access_key_id', 'secret_access_key']
        for field in required_fields:
            if field not in credentials:
                return jsonify({'error': f'Missing {field}'}), 400
        
        # Initialize AWS fetcher
        aws_fetcher = AWSFetcher(
            access_key=credentials['access_key_id'],
            secret_key=credentials['secret_access_key'],
            session_token=credentials.get('session_token'),
            regions=regions
        )
        
        # Fetch infrastructure data
        infra_data = aws_fetcher.fetch_all_resources()
        
        return jsonify({
            'success': True,
            'provider': 'AWS',
            'data': infra_data,
            'timestamp': datetime.utcnow().isoformat(),
            'regions_scanned': regions
        })
        
    except Exception as e:
        logger.error(f"AWS scan error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'provider': 'AWS'
        }), 500

@app.route('/scan/gcp', methods=['POST'])
def scan_gcp():
    """Scan GCP infrastructure"""
    try:
        data = request.get_json()
        
        if not data or 'credentials' not in data:
            return jsonify({'error': 'Missing credentials'}), 400
        
        credentials = data['credentials']
        project_id = data.get('project_id')
        
        if not project_id:
            return jsonify({'error': 'Missing project_id'}), 400
        
        # Initialize GCP fetcher
        gcp_fetcher = GCPFetcher(
            credentials=credentials,
            project_id=project_id
        )
        
        # Fetch infrastructure data
        infra_data = gcp_fetcher.fetch_all_resources()
        
        return jsonify({
            'success': True,
            'provider': 'GCP',
            'data': infra_data,
            'timestamp': datetime.utcnow().isoformat(),
            'project_id': project_id
        })
        
    except Exception as e:
        logger.error(f"GCP scan error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'provider': 'GCP'
        }), 500

@app.route('/scan/azure', methods=['POST'])
def scan_azure():
    """Scan Azure infrastructure (placeholder)"""
    try:
        data = request.get_json()
        
        if not data or 'credentials' not in data:
            return jsonify({'error': 'Missing credentials'}), 400
        
        # TODO: Implement Azure scanning
        return jsonify({
            'success': False,
            'error': 'Azure scanning not yet implemented',
            'provider': 'Azure'
        }), 501
        
    except Exception as e:
        logger.error(f"Azure scan error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'provider': 'Azure'
        }), 500

@app.route('/validate/aws', methods=['POST'])
def validate_aws_credentials():
    """Validate AWS credentials"""
    try:
        data = request.get_json()
        
        if not data or 'credentials' not in data:
            return jsonify({'error': 'Missing credentials'}), 400
        
        credentials = data['credentials']
        
        # Initialize AWS fetcher with minimal permissions
        aws_fetcher = AWSFetcher(
            access_key=credentials['access_key_id'],
            secret_key=credentials['secret_access_key'],
            session_token=credentials.get('session_token')
        )
        
        # Test credentials by calling a simple API
        is_valid = aws_fetcher.validate_credentials()
        
        return jsonify({
            'valid': is_valid,
            'provider': 'AWS'
        })
        
    except Exception as e:
        logger.error(f"AWS validation error: {str(e)}")
        return jsonify({
            'valid': False,
            'error': str(e),
            'provider': 'AWS'
        }), 500

@app.route('/validate/gcp', methods=['POST'])
def validate_gcp_credentials():
    """Validate GCP credentials"""
    try:
        data = request.get_json()
        
        if not data or 'credentials' not in data:
            return jsonify({'error': 'Missing credentials'}), 400
        
        credentials = data['credentials']
        project_id = data.get('project_id')
        
        if not project_id:
            return jsonify({'error': 'Missing project_id'}), 400
        
        # Initialize GCP fetcher
        gcp_fetcher = GCPFetcher(
            credentials=credentials,
            project_id=project_id
        )
        
        # Test credentials
        is_valid = gcp_fetcher.validate_credentials()
        
        return jsonify({
            'valid': is_valid,
            'provider': 'GCP',
            'project_id': project_id
        })
        
    except Exception as e:
        logger.error(f"GCP validation error: {str(e)}")
        return jsonify({
            'valid': False,
            'error': str(e),
            'provider': 'GCP'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug)
