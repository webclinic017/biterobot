import base64
from django.core.files.base import ContentFile

def blobToFile(data: str):
    format, fileStr = data.split(';base64,')
    ext = format.split('/')[-1]

    data = ContentFile(base64.b64decode(fileStr), name='temp.' + ext)
    base64_message = data.read().decode()

    return base64_message

def saveFile(data: str, filePath: str = 'strategyManager/strategies/text.txt'):
    file = open(filePath, 'w')
    file.write(data)
