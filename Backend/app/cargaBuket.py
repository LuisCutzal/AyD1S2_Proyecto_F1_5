from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv
import os
import boto3


load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION_NAME= os.getenv('AWS_REGION_NAME')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')

def uploadFileBucket(file, s3fileName):
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name = AWS_REGION_NAME
        )

        s3.upload_fileobj(file,AWS_BUCKET_NAME,s3fileName)
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': AWS_BUCKET_NAME, 'Key': s3fileName}
        )
        return url
    
    except NoCredentialsError as e:
        print(e)

    except ClientError as e:

        print(e)
        
    except Exception as e:
        print(e)