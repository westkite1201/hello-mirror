# -*- coding: utf-8 -*- 
import requests
import time
from bs4 import BeautifulSoup
import json
import weather_naver as WN
import sys

if __name__ =="__main__":
    loc = sys.argv[1] # args 넘겨준것 
    w = WN.Weather_NAVER(loc)
    w.resquest_To_()
    print(json.dumps(loc))
    timeList , weatherList, temperatureList = w.get_Temperture()
    
    print('TIME')
    for time in timeList:
        print( json.dumps(time))
    #print(json.dumps(timeList))
    print('WEATHER')
    for weather in weatherList:
        print( json.dumps(weather))

    print('TEMPERATURE')
    for temperature in temperatureList:
        print( json.dumps(temperature))


    #습도구하기 
    humidityList = w.get_Humidity()

    print('HUMIDITY')
    for humidity in humidityList:
        print( json.dumps(humidity))



     #print("강수 확률",self.Pro_Precipitation_List)

    #print("예상 강수량",self.precipitation_List)

    proPrecipitationList, precipitationList = w.get_Rain()

    #강수확률
    print('proPrecipitation')
    for proPrecipitation in proPrecipitationList:
        print(json.dumps(proPrecipitation))

    #강수량 
    print('precipitation')
    for precipitation in precipitationList:
        print(json.dumps(precipitation))




    w = WN.Weather_NAVER('일출일몰시간')
    w.resquest_To_()
    w.sunrise_Sunset_Time();


    



# #미세미세 수치 알려줌 ㅁ
# littleDustInfo = soup.select('.sub_info > .detai_box > .indicator')
# for tag in littleDustInfo:
#     print(tag.text)

