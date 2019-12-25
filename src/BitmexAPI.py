import bitmex
from dataBase import DataBase

if __name__ == "__main__":
    client = bitmex.bitmex()
    response = client.Trade.Trade_get(symbol="XBTUSD").result()
    db = DataBase("UZER\SQLEXPRESS", "BitBot", "user", "password")
    for i in response[0]:
        tradeDirection = 1
        if i['side'] == "Buy":
            tradeDirection = 2
        db.cursor.execute("INSERT INTO Trade(Pair, Timestamp, TradeDirection, Price, Amount) VALUES (1, ?, ?, ?, ?)",
                          i['timestamp'], tradeDirection, i['price'], i['size'])
    db.connection.commit()
