# -*- coding: utf-8 -*- 
import requests
import sys
import json
from datetime import datetime
from pytz import timezone, utc
def getNaverRealtimeSearchWord(urlParam):
    
    now_utc = datetime.now(timezone('UTC'))
    now_kst = now_utc.astimezone(timezone('Asia/Seoul'))
    urlParam = {
        'age': 'all',
        'datetime': now_kst.strftime('%Y-%m-%dT%H:%M:00'),
        'entertainment':4,
        'groupingLevel': 4,
        'marketing': 0,
        'news': 4,
        'sports': 0,
    }
    url = 'https://m.datalab.naver.com/rankSnapshotV3/data.naver?'
    for key in urlParam.keys():
        url += key + '=' + str(urlParam[key]).replace(" ","")
        url += '&'

    headers = {
        'host': 'm.datalab.naver.com:443',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'accept-encoding': 'gzip, deflate, br, charset=UTF-8',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-fetch-mode': 'nested-navigate',
        'sec-fetch-site': 'same-origin',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
        'referer': 'https: // m.datalab.naver.com / realtimeList.naver?where = main'
    }
    r = requests.post(url, data=param, headers=headers)
    return r.json()


if __name__ == "__main__":
    param = {
        # 'age': all,
        # 'datetime': '2020 - 11 - 05T15 % 3A13 % 3A00',
        # 'entertainment':2,
        # 'groupingLevel': 4,
        # 'marketing': 2,
        # 'news': 2,
        # 'sports': 2,
    }
    response = getNaverRealtimeSearchWord(param)
    jsonString = json.dumps(response)
    print(jsonString)
    sys.stdout.flush()
