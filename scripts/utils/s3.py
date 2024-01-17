from dotenv import find_dotenv, load_dotenv
import os
import boto3

def create_wasabi_s3_client():
    # read AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT AND AWS_REGION from .env file
    load_dotenv(find_dotenv())
    key_id = os.getenv("AWS_ACCESS_KEY_ID")
    secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    endpoint = os.getenv("AWS_ENDPOINT")
    region = os.getenv("AWS_REGION")

    if not key_id or not secret_key:
        raise Exception("Missing required environment variable(s)")
    
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=key_id,
        aws_secret_access_key=secret_key,
        region_name=region,
    )