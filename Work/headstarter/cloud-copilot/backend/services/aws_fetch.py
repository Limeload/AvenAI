import boto3
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class AWSFetcher:
    def __init__(self, access_key: str, secret_key: str, session_token: Optional[str] = None, regions: List[str] = None):
        self.access_key = access_key
        self.secret_key = secret_key
        self.session_token = session_token
        self.regions = regions or ['us-east-1', 'us-west-2']
        self.session = None
        
    def _get_session(self, region: str = 'us-east-1'):
        """Get boto3 session for a specific region"""
        if not self.session:
            self.session = boto3.Session(
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                aws_session_token=self.session_token,
                region_name=region
            )
        return self.session
    
    def validate_credentials(self) -> bool:
        """Validate AWS credentials by calling STS GetCallerIdentity"""
        try:
            session = self._get_session()
            sts = session.client('sts')
            sts.get_caller_identity()
            return True
        except Exception as e:
            logger.error(f"Credential validation failed: {str(e)}")
            return False
    
    def fetch_ec2_instances(self, region: str) -> List[Dict[str, Any]]:
        """Fetch EC2 instances for a region"""
        try:
            session = self._get_session(region)
            ec2 = session.client('ec2')
            
            response = ec2.describe_instances()
            instances = []
            
            for reservation in response['Reservations']:
                for instance in reservation['Instances']:
                    instance_data = {
                        'id': instance['InstanceId'],
                        'type': instance['InstanceType'],
                        'state': instance['State']['Name'],
                        'launch_time': instance['LaunchTime'].isoformat(),
                        'tags': {tag['Key']: tag['Value'] for tag in instance.get('Tags', [])},
                        'region': region,
                        'vpc_id': instance.get('VpcId'),
                        'subnet_id': instance.get('SubnetId'),
                        'security_groups': [sg['GroupId'] for sg in instance.get('SecurityGroups', [])],
                        'public_ip': instance.get('PublicIpAddress'),
                        'private_ip': instance.get('PrivateIpAddress')
                    }
                    instances.append(instance_data)
            
            return instances
        except Exception as e:
            logger.error(f"Error fetching EC2 instances in {region}: {str(e)}")
            return []
    
    def fetch_rds_instances(self, region: str) -> List[Dict[str, Any]]:
        """Fetch RDS instances for a region"""
        try:
            session = self._get_session(region)
            rds = session.client('rds')
            
            response = rds.describe_db_instances()
            instances = []
            
            for db_instance in response['DBInstances']:
                instance_data = {
                    'id': db_instance['DBInstanceIdentifier'],
                    'engine': db_instance['Engine'],
                    'engine_version': db_instance['EngineVersion'],
                    'instance_class': db_instance['DBInstanceClass'],
                    'status': db_instance['DBInstanceStatus'],
                    'allocated_storage': db_instance['AllocatedStorage'],
                    'storage_type': db_instance['StorageType'],
                    'multi_az': db_instance['MultiAZ'],
                    'publicly_accessible': db_instance['PubliclyAccessible'],
                    'region': region,
                    'vpc_id': db_instance.get('DBSubnetGroup', {}).get('VpcId'),
                    'tags': {}  # RDS tags require separate API call
                }
                instances.append(instance_data)
            
            return instances
        except Exception as e:
            logger.error(f"Error fetching RDS instances in {region}: {str(e)}")
            return []
    
    def fetch_s3_buckets(self) -> List[Dict[str, Any]]:
        """Fetch S3 buckets (global service)"""
        try:
            session = self._get_session()
            s3 = session.client('s3')
            
            response = s3.list_buckets()
            buckets = []
            
            for bucket in response['Buckets']:
                try:
                    # Get bucket location
                    location_response = s3.get_bucket_location(Bucket=bucket['Name'])
                    region = location_response.get('LocationConstraint', 'us-east-1')
                    
                    # Get bucket policy
                    try:
                        policy_response = s3.get_bucket_policy(Bucket=bucket['Name'])
                        policy = json.loads(policy_response['Policy'])
                    except:
                        policy = None
                    
                    # Get bucket ACL
                    try:
                        acl_response = s3.get_bucket_acl(Bucket=bucket['Name'])
                        public_read = any(
                            grant.get('Grantee', {}).get('URI') == 'http://acs.amazonaws.com/groups/global/AllUsers'
                            for grant in acl_response['Grants']
                        )
                    except:
                        public_read = False
                    
                    bucket_data = {
                        'name': bucket['Name'],
                        'creation_date': bucket['CreationDate'].isoformat(),
                        'region': region,
                        'policy': policy,
                        'public_read': public_read
                    }
                    buckets.append(bucket_data)
                except Exception as e:
                    logger.error(f"Error fetching details for bucket {bucket['Name']}: {str(e)}")
                    continue
            
            return buckets
        except Exception as e:
            logger.error(f"Error fetching S3 buckets: {str(e)}")
            return []
    
    def fetch_iam_users(self) -> List[Dict[str, Any]]:
        """Fetch IAM users"""
        try:
            session = self._get_session()
            iam = session.client('iam')
            
            response = iam.list_users()
            users = []
            
            for user in response['Users']:
                user_data = {
                    'username': user['UserName'],
                    'user_id': user['UserId'],
                    'arn': user['Arn'],
                    'create_date': user['CreateDate'].isoformat(),
                    'path': user['Path'],
                    'has_login_profile': False,
                    'has_access_keys': False,
                    'attached_policies': [],
                    'inline_policies': []
                }
                
                # Check for login profile
                try:
                    iam.get_login_profile(UserName=user['UserName'])
                    user_data['has_login_profile'] = True
                except:
                    pass
                
                # Check for access keys
                try:
                    keys_response = iam.list_access_keys(UserName=user['UserName'])
                    user_data['has_access_keys'] = len(keys_response['AccessKeyMetadata']) > 0
                except:
                    pass
                
                # Get attached policies
                try:
                    policies_response = iam.list_attached_user_policies(UserName=user['UserName'])
                    user_data['attached_policies'] = [p['PolicyName'] for p in policies_response['AttachedPolicies']]
                except:
                    pass
                
                # Get inline policies
                try:
                    inline_response = iam.list_user_policies(UserName=user['UserName'])
                    user_data['inline_policies'] = inline_response['PolicyNames']
                except:
                    pass
                
                users.append(user_data)
            
            return users
        except Exception as e:
            logger.error(f"Error fetching IAM users: {str(e)}")
            return []
    
    def fetch_cloudwatch_metrics(self, region: str) -> Dict[str, Any]:
        """Fetch CloudWatch metrics for cost and performance insights"""
        try:
            session = self._get_session(region)
            cloudwatch = session.client('cloudwatch')
            
            # Get EC2 CPU utilization metrics
            ec2_metrics = []
            try:
                response = cloudwatch.list_metrics(
                    Namespace='AWS/EC2',
                    MetricName='CPUUtilization'
                )
                ec2_metrics = [metric['MetricName'] for metric in response['Metrics']]
            except:
                pass
            
            # Get RDS metrics
            rds_metrics = []
            try:
                response = cloudwatch.list_metrics(
                    Namespace='AWS/RDS',
                    MetricName='CPUUtilization'
                )
                rds_metrics = [metric['MetricName'] for metric in response['Metrics']]
            except:
                pass
            
            return {
                'ec2_metrics': ec2_metrics,
                'rds_metrics': rds_metrics,
                'region': region
            }
        except Exception as e:
            logger.error(f"Error fetching CloudWatch metrics in {region}: {str(e)}")
            return {}
    
    def fetch_all_resources(self) -> Dict[str, Any]:
        """Fetch all AWS resources across specified regions"""
        logger.info(f"Starting AWS scan for regions: {self.regions}")
        
        all_resources = {
            'provider': 'AWS',
            'scan_timestamp': datetime.utcnow().isoformat(),
            'regions': self.regions,
            'resources': {
                'ec2_instances': [],
                'rds_instances': [],
                's3_buckets': [],
                'iam_users': [],
                'cloudwatch_metrics': {}
            }
        }
        
        # Fetch global resources
        all_resources['resources']['s3_buckets'] = self.fetch_s3_buckets()
        all_resources['resources']['iam_users'] = self.fetch_iam_users()
        
        # Fetch regional resources
        for region in self.regions:
            logger.info(f"Scanning region: {region}")
            
            # EC2 instances
            ec2_instances = self.fetch_ec2_instances(region)
            all_resources['resources']['ec2_instances'].extend(ec2_instances)
            
            # RDS instances
            rds_instances = self.fetch_rds_instances(region)
            all_resources['resources']['rds_instances'].extend(rds_instances)
            
            # CloudWatch metrics
            metrics = self.fetch_cloudwatch_metrics(region)
            all_resources['resources']['cloudwatch_metrics'][region] = metrics
        
        # Calculate summary statistics
        all_resources['summary'] = {
            'total_ec2_instances': len(all_resources['resources']['ec2_instances']),
            'total_rds_instances': len(all_resources['resources']['rds_instances']),
            'total_s3_buckets': len(all_resources['resources']['s3_buckets']),
            'total_iam_users': len(all_resources['resources']['iam_users']),
            'regions_scanned': len(self.regions)
        }
        
        logger.info(f"AWS scan completed. Found {all_resources['summary']}")
        return all_resources
