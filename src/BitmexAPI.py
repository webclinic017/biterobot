import bitmex

client = bitmex.bitmex()
response = client.Trade.Trade_get(symbol="XBTUSD").result()
timestamp = response[0][0]['timestamp']
print(type(timestamp))