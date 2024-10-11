from botocore.exceptions import NoCredentialsError, ClientError
from dotenv import load_dotenv
import os
import boto3
from io import BytesIO

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
        url = f"https://{AWS_BUCKET_NAME}.s3.amazonaws.com/{s3fileName}"
        return url
    
    except NoCredentialsError as e:
        print(e)

    except ClientError as e:

        print(e)
        
    except Exception as e:
        print(e)



def download_file_from_s3(s3file_name):
    try:
        file_obj = BytesIO()
        s3 = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name = AWS_REGION_NAME
        )
        s3.download_fileobj(AWS_BUCKET_NAME, s3file_name, file_obj)
        file_obj.seek(0)  # Volver al inicio del objeto BytesIO
        return file_obj
    except NoCredentialsError:
        print("Error: No se encontraron las credenciales de AWS.")
        raise
    except ClientError as e:
        print(f"Error al descargar el archivo: {e.response['Error']['Message']}")
        raise
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        raise


def list_files_in_bucket():
    s3 = boto3.client('s3')
    try:
        response = s3.list_objects_v2(Bucket=AWS_BUCKET_NAME)
        if 'Contents' in response:
            print("Archivos en el bucket:")
            for obj in response['Contents']:
                print(obj['Key'])  # Imprime el nombre completo del archivo
        else:
            print("No hay archivos en el bucket.")
    except ClientError as e:
        print("Error al listar los archivos:")
        print(e)

# Llama a la función para listar archivos
list_files_in_bucket()