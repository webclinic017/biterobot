import ccxt

if __name__ == "__main__":
    bitmex = ccxt.bitmex()
    print(bitmex.fetch_ohlcv('BTC/USD', '1m', 1514764800000))
