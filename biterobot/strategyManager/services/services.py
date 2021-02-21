import base64
import importlib.util
import os
from django.conf import settings
from django.core.files.base import ContentFile

from testManager.services.backtest.tools import checkStrategy
from strategyManager.services import dbServices


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

def saveStrategyFile(data: str, fileName: str):
    '''
    Create, write and save file in directory
    :param data: String for writing in file
    :param fileName: String - name of file
    :return: -
    '''
    filePath = f'strategyManager/strategies/{fileName}.py'

    file = open(filePath, 'w')
    file.write(data)

def saveStrategy(strategyData: dict, strategyDataNew: dict = None):
    '''
    Save Strategy info in db and strategy file in directory
    :param strategyData: Strategy data (dict) for save or saved strategy info in db (for update case)
    :param strategyDataNew: Only for update case - new strategy Info
    :return: -
    '''
    # Update case
    if strategyDataNew != None:
        fileInfo = strategyDataNew.pop('file')  # Get file info block (inner dict)

        # Save Strategy file.py in strategies directory
        saveStrategyFile(data=decodeBase64(fileInfo['body']), fileName=strategyData.__str__())
        strategyDataNew.update({'filePath': f'../strategies/{strategyData.__str__()}.py'})  # Generate strategy file path and add in dict

        # Update strategy info in db
        return dbServices.saveStrategyInfo(strategyData=strategyData, strategyDataNew=strategyDataNew)
    # Save case
    else:
        fileInfo = strategyData.pop('file')  # Get file info block (inner dict)

        # Save Strategy file.py in strategies directory
        saveStrategyFile(data=decodeBase64(fileInfo['body']), fileName=strategyData["name"])
        # Check Strategy file.py for Backtrader requirements.
        # If it not correct - raise exception, delete Strategy file from directory and break (don't save in database)
        try:
            checkStrategyFile(strategyPath=f'strategyManager/strategies/{strategyData["name"]}.py')
        except:
            deleteStrategyFile(fileName=strategyData["name"])
            raise

        strategyData.update({'filePath': f'../strategies/{strategyData["name"]}.py'})  # Generate strategy file path and add in dict

        # Save strategy info in db
        return dbServices.saveStrategyInfo(strategyData=strategyData)

def deleteStrategyFile(fileName: str):
    '''
    Delete strategy file from directory
    :param fileName: File path (directory + file name)
    :return: -
    '''
    filePath = f'{settings.BASE_DIR}/strategyManager/strategies/{fileName}.py'  # Generate file path

    try:
        path = os.path.join(os.path.abspath(os.path.dirname(__file__)), filePath)
        os.remove(path)
    except:
        raise

def deleteStrategy(id: int):
    '''
    Delete strategy file from directory
    :param id: Strategy id in db
    :return: -
    '''
    try:
        strategyName = dbServices.deleteStrategyInfo(id=id)  # Delete Strategy from db and get strategy name
    except:
        raise

    deleteStrategyFile(fileName=strategyName)

def checkStrategyFile(strategyPath: str) -> bool:
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
