import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

try:
    from google.cloud import compute_v1
    from google.cloud import storage
    from google.cloud import sql
    from google.oauth2 import service_account
    from google.auth import default
    GCP_AVAILABLE = True
except ImportError:
    GCP_AVAILABLE = False
    logging.warning("Google Cloud libraries not available. GCP scanning will be disabled.")

logger = logging.getLogger(__name__)

class GCPFetcher:
    def __init__(self, credentials: Dict[str, Any], project_id: str):
        self.credentials = credentials
        self.project_id = project_id
        self.credentials_obj = None
        
        if not GCP_AVAILABLE:
            raise ImportError("Google Cloud libraries not available. Install with: pip install google-cloud-compute google-cloud-storage google-cloud-sql")
    
    def _get_credentials(self):
        """Get GCP credentials object"""
        if not self.credentials_obj:
            if 'type' in self.credentials and self.credentials['type'] == 'service_account':
                # Service account key
                self.credentials_obj = service_account.Credentials.from_service_account_info(
                    self.credentials
                )
            else:
                # Try default credentials
                self.credentials_obj, _ = default()
        return self.credentials_obj
    
    def validate_credentials(self) -> bool:
        """Validate GCP credentials"""
        try:
            credentials = self._get_credentials()
            # Test with a simple API call
            client = compute_v1.InstancesClient(credentials=credentials)
            # List instances in the project (this will fail if credentials are invalid)
            request = compute_v1.ListInstancesRequest(
                project=self.project_id,
                zone="us-central1-a",
                max_results=1
            )
            client.list(request)
            return True
        except Exception as e:
            logger.error(f"GCP credential validation failed: {str(e)}")
            return False
    
    def fetch_compute_instances(self) -> List[Dict[str, Any]]:
        """Fetch Compute Engine instances"""
        try:
            credentials = self._get_credentials()
            client = compute_v1.InstancesClient(credentials=credentials)
            
            instances = []
            
            # List all zones
            zones_client = compute_v1.ZonesClient(credentials=credentials)
            zones_request = compute_v1.ListZonesRequest(project=self.project_id)
            zones = zones_client.list(zones_request)
            
            for zone in zones:
                try:
                    request = compute_v1.ListInstancesRequest(
                        project=self.project_id,
                        zone=zone.name
                    )
                    response = client.list(request)
                    
                    for instance in response:
                        instance_data = {
                            'id': instance.id,
                            'name': instance.name,
                            'machine_type': instance.machine_type.split('/')[-1],
                            'status': instance.status,
                            'zone': zone.name,
                            'region': zone.name.rsplit('-', 1)[0],
                            'creation_timestamp': instance.creation_timestamp,
                            'tags': list(instance.tags.items) if instance.tags else [],
                            'network_interfaces': [
                                {
                                    'name': ni.name,
                                    'network': ni.network,
                                    'subnetwork': ni.subnetwork,
                                    'internal_ip': ni.network_ip,
                                    'external_ip': ni.access_configs[0].nat_ip if ni.access_configs else None
                                }
                                for ni in instance.network_interfaces
                            ],
                            'disks': [
                                {
                                    'name': disk.source.split('/')[-1],
                                    'size_gb': disk.disk_size_gb,
                                    'type': disk.type.split('/')[-1]
                                }
                                for disk in instance.disks
                            ]
                        }
                        instances.append(instance_data)
                except Exception as e:
                    logger.error(f"Error fetching instances in zone {zone.name}: {str(e)}")
                    continue
            
            return instances
        except Exception as e:
            logger.error(f"Error fetching Compute Engine instances: {str(e)}")
            return []
    
    def fetch_cloud_sql_instances(self) -> List[Dict[str, Any]]:
        """Fetch Cloud SQL instances"""
        try:
            credentials = self._get_credentials()
            client = sql.InstancesClient(credentials=credentials)
            
            request = sql.ListInstancesRequest(project=self.project_id)
            response = client.list(request)
            
            instances = []
            for instance in response:
                instance_data = {
                    'id': instance.name.split('/')[-1],
                    'name': instance.name,
                    'database_version': instance.database_version,
                    'region': instance.region,
                    'state': instance.state.name,
                    'instance_type': instance.instance_type.name,
                    'tier': instance.settings.tier,
                    'storage_type': instance.settings.data_disk_type.name,
                    'storage_size_gb': instance.settings.data_disk_size_gb,
                    'backup_enabled': instance.settings.backup_configuration.enabled,
                    'ip_addresses': [
                        {
                            'type': ip.type_.name,
                            'ip_address': ip.ip_address
                        }
                        for ip in instance.ip_addresses
                    ],
                    'authorized_networks': [
                        {
                            'name': net.name,
                            'value': net.value
                        }
                        for net in instance.settings.ip_configuration.authorized_networks
                    ] if instance.settings.ip_configuration else []
                }
                instances.append(instance_data)
            
            return instances
        except Exception as e:
            logger.error(f"Error fetching Cloud SQL instances: {str(e)}")
            return []
    
    def fetch_cloud_storage_buckets(self) -> List[Dict[str, Any]]:
        """Fetch Cloud Storage buckets"""
        try:
            credentials = self._get_credentials()
            client = storage.Client(credentials=credentials, project=self.project_id)
            
            buckets = []
            for bucket in client.list_buckets():
                try:
                    # Get bucket IAM policy
                    policy = bucket.get_iam_policy()
                    
                    # Check if bucket is publicly accessible
                    public_access = False
                    for binding in policy.bindings:
                        if 'allUsers' in binding.get('members', []) or 'allAuthenticatedUsers' in binding.get('members', []):
                            public_access = True
                            break
                    
                    bucket_data = {
                        'name': bucket.name,
                        'location': bucket.location,
                        'storage_class': bucket.storage_class,
                        'created': bucket.time_created.isoformat() if bucket.time_created else None,
                        'updated': bucket.updated.isoformat() if bucket.updated else None,
                        'public_access': public_access,
                        'versioning_enabled': bucket.versioning_enabled,
                        'lifecycle_rules': len(bucket.lifecycle_rules) if bucket.lifecycle_rules else 0
                    }
                    buckets.append(bucket_data)
                except Exception as e:
                    logger.error(f"Error fetching details for bucket {bucket.name}: {str(e)}")
                    continue
            
            return buckets
        except Exception as e:
            logger.error(f"Error fetching Cloud Storage buckets: {str(e)}")
            return []
    
    def fetch_iam_policies(self) -> List[Dict[str, Any]]:
        """Fetch IAM policies and service accounts"""
        try:
            # Note: This is a simplified version. Full IAM scanning would require
            # the IAM API client and more complex permission handling
            credentials = self._get_credentials()
            
            # For now, return basic project info
            return [{
                'project_id': self.project_id,
                'note': 'Full IAM scanning requires additional permissions and API setup'
            }]
        except Exception as e:
            logger.error(f"Error fetching IAM policies: {str(e)}")
            return []
    
    def fetch_networking_resources(self) -> Dict[str, Any]:
        """Fetch VPC and networking resources"""
        try:
            credentials = self._get_credentials()
            client = compute_v1.NetworksClient(credentials=credentials)
            
            request = compute_v1.ListNetworksRequest(project=self.project_id)
            response = client.list(request)
            
            networks = []
            for network in response:
                network_data = {
                    'name': network.name,
                    'id': network.id,
                    'description': network.description,
                    'auto_create_subnetworks': network.auto_create_subnetworks,
                    'creation_timestamp': network.creation_timestamp,
                    'subnetworks': list(network.subnetworks) if network.subnetworks else []
                }
                networks.append(network_data)
            
            return {
                'networks': networks,
                'total_networks': len(networks)
            }
        except Exception as e:
            logger.error(f"Error fetching networking resources: {str(e)}")
            return {'networks': [], 'total_networks': 0}
    
    def fetch_all_resources(self) -> Dict[str, Any]:
        """Fetch all GCP resources"""
        logger.info(f"Starting GCP scan for project: {self.project_id}")
        
        all_resources = {
            'provider': 'GCP',
            'scan_timestamp': datetime.utcnow().isoformat(),
            'project_id': self.project_id,
            'resources': {
                'compute_instances': [],
                'cloud_sql_instances': [],
                'storage_buckets': [],
                'iam_policies': [],
                'networking': {}
            }
        }
        
        # Fetch all resource types
        all_resources['resources']['compute_instances'] = self.fetch_compute_instances()
        all_resources['resources']['cloud_sql_instances'] = self.fetch_cloud_sql_instances()
        all_resources['resources']['storage_buckets'] = self.fetch_cloud_storage_buckets()
        all_resources['resources']['iam_policies'] = self.fetch_iam_policies()
        all_resources['resources']['networking'] = self.fetch_networking_resources()
        
        # Calculate summary statistics
        all_resources['summary'] = {
            'total_compute_instances': len(all_resources['resources']['compute_instances']),
            'total_sql_instances': len(all_resources['resources']['cloud_sql_instances']),
            'total_storage_buckets': len(all_resources['resources']['storage_buckets']),
            'total_networks': all_resources['resources']['networking'].get('total_networks', 0)
        }
        
        logger.info(f"GCP scan completed. Found {all_resources['summary']}")
        return all_resources
