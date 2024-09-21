import os
from flask_mail import Mail, Message
from dotenv import load_dotenv  # Importamos python-dotenv para cargar el .env

# Cargar las variables del archivo .env
load_dotenv()

# Configuración del correo en Flask
mail = Mail()

def init_mail(app):
    app.config.update(
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USERNAME='storegeayd@gmail.com',
        MAIL_PASSWORD='crivntwwygipebja',
        MAIL_DEFAULT_SENDER='storegeayd@gmail.com'
    )
    mail.init_app(app)
    """
    

    print(os.getenv('MAIL_USERNAME'))  # Debería mostrar tu correo
    app.config.update(
    MAIL_SERVER=os.getenv('MAIL_SERVER'),
    MAIL_PORT=int(os.getenv('MAIL_PORT')),
    MAIL_USE_TLS=os.getenv('MAIL_USE_TLS') == 'True',
    MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
    MAIL_DEFAULT_SENDER=os.getenv('MAIL_DEFAULT_SENDER')
    )
    mail.init_app(app)

    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxMSwiaWRfcm9sIjoxLCJub21icmVfdXN1YXJpbyI6Im5vb29vbyJ9.0inzZBQLd5dFF41vdZwsituroIBv7ITOR2a_XAJTBe8
    """
def enviar_correo_aviso(email, nombre_usuario):
    msg = Message(
        'Aviso de eliminación de cuenta',
        recipients=[email]
    )
    msg.body = f"""
    Hola {nombre_usuario},

    Hemos notado que no has iniciado sesión recientemente. Si no inicias sesión dentro de 1 mes, procederemos a eliminar toda la información asociada a tu cuenta.
    
    ¡Esperamos verte pronto!

    Saludos,
    El equipo
    """
    mail.send(msg)
