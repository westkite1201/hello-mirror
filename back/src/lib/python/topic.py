import requests
import json

from bs4 import BeautifulSoup
from datetime import datetime
def getTopic():
    params = {
        'where': 'nexearch',
        'sm': 'tab_htk.nws',
        'ie': 'utf8',
        'query': 'today'
    }

    url = 'https://search.naver.com/search.naver?'
    headers = {
        'host': 'www.naver.com:443',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'sec-fetch-mode': 'nested-navigate',
        'sec-fetch-site': 'same-origin',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
        'referer': 'https://m.datalab.naver.com/realtimeList.naver?where=main'
    }
    try:
        r = requests.get(url, params=params, headers=headers)
        html = r.text
        #print(html)
        # 뷰티풀소프의 인자값 지정
        soup = BeautifulSoup(html, 'html.parser')
        time = soup.select('.time > time')[0].text
        hotKeyword= soup.select('.list_wrap')
        newsTopic = []
        enterTopic = []
        for tagIndex,tag in enumerate(hotKeyword):
            for index, liTag in enumerate(tag.select('li > a')):
                if tagIndex == 0:
                    #link_text = liTag['href']
                    newsTopic.append({'rank': index + 1, 'keyword': liTag.text,  'keywordSynonyms': []})
                if tagIndex == 1:
                    enterTopic.append({'rank': index + 1, 'keyword': liTag.text, 'keywordSynonyms': []})

        topic = {
            'newTopic': newsTopic,
            'enterTopic': enterTopic,
            'sm': time,
            'ts': '',
            'message' : 'none'
        }

        resData = {
            'message' : 'success',
            'statusCode' : '200',
            'ranks' : topic
        }
        jsonString = json.dumps(resData)
        return jsonString

    except:
        resData = {
            'message': 'error',
            'statusCode': '400',
            'ranks': []
        }
        jsonString = json.dumps(resData)
        return jsonString

if __name__ == "__main__":
    response = getTopic()
    print(response)