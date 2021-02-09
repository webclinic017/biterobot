import base64
import importlib.util
import os
from django.core.files.base import ContentFile

from testManager.services.backtest.tools import checkStrategy


def decodeBase64(data: str) -> str:
    '''
    Decode base64 string from text
    :param data: Text in base64 string (Example: "data:text/plain;base64,fC0tLS0tLS0tLS0t")
    :return: Decoded text
    '''
    format, fileStr = data.split(';base64,')
    ext = format.split('/')[-1]

    data = ContentFile(base64.b64decode(fileStr), name='temp.' + ext)
    base64_message = data.read().decode()

    return base64_message

def saveFile(data: str, filePath: str):
    '''
    Create, write and save file in directory
    :param data: String for writing in file
    :param filePath: String - directory path for saving file
    :return: -
    '''
    file = open(filePath, 'w')
    file.write(data)

def deleteFile(filePath: str):
    '''
    Delete file from directory
    :param filePath: String - file path for deleting
    :return: -
    '''
    path = os.path.join(os.path.abspath(os.path.dirname(__file__)), filePath)
    os.remove(path)

def check(strategyPath: str) -> bool:
    '''
    Get strategy Python class from .py file to check Strategy for Backtrader requirements
    :param strategyPath: String - path to Strategy.py file
    :return: True(if Strategy correct) or raise exception(if Strategy incorrect)
    '''
    spec = importlib.util.spec_from_file_location("Strategy",
                                                  strategyPath)
    foo = importlib.util.module_from_spec(spec)

    spec.loader.exec_module(foo)

    return checkStrategy(foo.Strategy)
