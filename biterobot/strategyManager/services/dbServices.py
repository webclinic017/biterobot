from rest_framework.generics import get_object_or_404

from strategyManager.models import StrategyModel
from strategyManager.services import services


def deleteStrategyInfo(id: int) -> StrategyModel:
    '''
    Delete Strategy info from db
    :param id: Strategy id in db
    :return: Strategy instance
    '''
    strategy = get_object_or_404(StrategyModel.objects.all(), id=id)
    strategy.delete()

    return strategy

def saveStrategyInfo(strategyData: dict, strategyDataNew: dict = None) -> (None, StrategyModel):
    '''
    Save or update Strategy info in db
    :param strategyData: Strategy data (dict) for save or saved strategy info in db (for update case)
    :param strategyDataNew: Only for update case - new strategy Info
    :return: - or Strategy instance
    '''
    # Update case
    if strategyDataNew != None:
        strategyData.description = strategyDataNew.get('description', strategyData.description)
        strategyData.filePath = strategyDataNew.get('filePath', strategyData.filePath)

        # Strategy version increment
        strategyData.version = strategyData.version + 1

        strategyData.save()

        return strategyData
    # Save case
    else:
        try:
            return StrategyModel.objects.create(**strategyData)
        except:
            services.deleteStrategyFile(fileName=strategyData["name"])
            raise
