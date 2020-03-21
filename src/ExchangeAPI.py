import ccxt
import bitmex
from database import Database


# if __name__ == "__main__":
#     bitmex = ccxt.bitmex()
#     print(bitmex.fetch_ohlcv('BTC/USD', '1m', 1514764800000))
if __name__ == "__main__":
    client = bitmex.bitmex()
    response = client.Trade.Trade_get(symbol="XBTUSD").result()
    db = Database('mssql', "UZER\SQLEXPRESS", "BitBot", "user", "password")
    # db.insertTicks()
    # db.insertCandles()
