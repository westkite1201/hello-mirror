# -*- coding: utf-8 -*- 
import requests
import time
from bs4 import BeautifulSoup



class Weather_NAVER:

    def __init__(self, query):
        self.url = 'https://search.naver.com/search.naver'
        self.params = {
            'query': query,
            'where': 'nexearch',
        }
        self.headers = {'User-Agent' :'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'}

        self.response = ''

        self.html = ''

        self.soup = ''

        

        self.timeList = []

        self.temperature_List = []

        self.weather_List = []

        

        self.wind_Direction_List = []

        self.wind_Speed_List = []

        

        self.precipitation_List = [] # 강수량 

        self.Pro_Precipitation_List = [] #강수확률 

        

        self.humidity_List = [] # 강수리스트 

        

        self.location =''

        self.littleInfo = ''

        self.temperture_Min = ''

        self.temperture_Max = ''

        self.sensible_Temperature= ''

        self.UV = ''

        self.fine_Dust = ''

        self.Ultrafine_Dust = ''

        self.ozone =''

        self.SS_SR_str = '#_sunriseSunsetRoot > div.contents03_sub > div > div.sun_detail > div.sun_list._representativeAreaList > ul > '

        self.dayInfo_Str = 'div.weather_box > div.weather_area._mainArea > div.today_area._mainTabContent > div.main_info > div > ul > '

        self.dust_Str = 'div.weather_box > div.weather_area._mainArea > div.today_area._mainTabContent > div.sub_info > div > dl > '

      

        

        

    def resquest_To_(self):
        while self.response == '':
            try:
                self.response = requests.get(self.url, headers = self.headers, params = self.params)
                print('response')
                break
            except requests.exceptions.ConnectionError:
                print ( "Connection refused" )
                print ( "reloading..." )
                time.sleep(5)

            
        html = self.response.text

        #뷰티풀소프의 인자값 지정

        self.soup = BeautifulSoup(html, 'html.parser')

        

    def get_Temperture(self):

        liList = self.soup.select('div.info_list.weather_condition._tabContent > ul > li ')

        cnt = 0 

        # 날씨  

        for tag in liList:

            temperature = (tag.select('.weather_item._dotWrapper > span')[0].text.strip())

            time = tag.select('.item_time')[0].text.strip()

            weather  = tag.select('.item_condition')[0].text.strip()

            self.timeList.append(time)

            self.weather_List.append(weather)

            self.temperature_List.append(temperature)

            

            if cnt == 10 :

                break

            cnt += 1

            
 
        #print("시간",self.timeList)  

#        print("현재 날씨 " , self.weather_List)  

 #       print("온도",self.temperature_List)

        

        return self.timeList,self.weather_List,self.temperature_List

    def get_Wind(self):

        cnt = 0

        wind = self.soup.select('.info_list.wind._tabContent > ul > li')

        for tag in wind:

            windSpeed = (tag.select('.weather_item._dotWrapper > span')[0].text.strip())

            windDirec = (tag.select('.item_condition > span')[0].text.strip())

            self.wind_Speed_List.append(windSpeed)

            self.wind_Direction_List.append(windDirec)

            

            if cnt == 10 :

                break

            cnt += 1

        

        print("풍속 ",self.wind_Speed_List)

        print("풍향 ",self.wind_Direction_List)

 

    def get_Humidity(self):

        humidity = self.soup.select('.info_list.humidity._tabContent > ul > li')

        cnt = 0

        for tag in humidity:
            humidity_Percent = (tag.select('.weather_item._dotWrapper > span')[0].text.strip())
            self.humidity_List.append(humidity_Percent)

            if cnt == 10 :
                break
            cnt += 1

        #print("습도 ",self.humidity_List)
        return self.humidity_List

    def get_Rain(self):

        cnt = 0

        rainfall = self.soup.select('.info_list.rainfall._tabContent > ul > li ')

        for tag in rainfall:

            Probability_precipitation= tag.select('.weather_item._dotWrapper > span')[0].text.strip()

            Precipitation= tag.select('.item_condition > span')[0].text.strip()

            time = tag.select('.item_time')[0].text.strip()

        

            self.Pro_Precipitation_List.append(Probability_precipitation)

            self.precipitation_List.append(Precipitation)

            if cnt == 10 :

                break

            cnt += 1

        #print("강수 확률",self.Pro_Precipitation_List)

        #print("예상 강수량",self.precipitation_List)

        return self.Pro_Precipitation_List, self.precipitation_List
 

    

    def get_Location(self):

        location = self.soup.select('div.weather_area._mainArea > div.sort_box._areaSelectLayer > div > div > span > em')

        self.location = location[0].text

        

    def TodayInfo(self):

      

        littleInfo = self.soup.select(self.dayInfo_Str + 'li:nth-of-type(1) > p')

        temperture_Min = self.soup.select(self.dayInfo_Str + 'li:nth-of-type(2) > span.merge > span.min')

        temperture_Max = self.soup.select(self.dayInfo_Str + 'li:nth-of-type(2) > span.merge > span.max')

        sensible_Temperature = self.soup.select(self.dayInfo_Str + 'li:nth-of-type(2) > span.sensible')

        UV = self.soup.select(self.dayInfo_Str + 'li:nth-of-type(3) > span')

        

       

        fine_Dust = self.soup.select(self.dust_Str+ 'dd:nth-of-type(2) > span.num')

        Ultrafine_Dust = self.soup.select(self.dust_Str + 'dd:nth-of-type(2) > span.num')

        ozone = self.soup.select(self.dust_Str + 'dd:nth-of-type(3) > span.num')


        

        self.littleInfo = littleInfo[0].text

        self.temperture_Min = temperture_Min[0].text

        self.temperture_Max = temperture_Max[0].text

        self.sensible_Temperature = sensible_Temperature[0].text

        self.UV = UV[0].text

        self.fine_Dust = fine_Dust[0].text

        self.Ultrafine_Dust =Ultrafine_Dust[0].text

        self.ozone = ozone[0].text


        print(self.littleInfo)
        print(self.temperture_Min)
        print(self.temperture_Max)
        print(self.sensible_Temperature)
        print(self.UV)
        print(self.fine_Dust)
        print(self.Ultrafine_Dust)
        print(self.ozone)


    def return_Weather_Info(self):

        pass

    

    def sunrise_Sunset_Time(self):
        seoul_SR = self.soup.select(self.SS_SR_str + 'li:nth-of-type(2) > a > dl > dd:nth-of-type(1) > span.time')
        seoul_SS = self.soup.select(self.SS_SR_str + 'li:nth-of-type(2) > a > dl > dd:nth-of-type(2) > span.time')

        print(seoul_SR[0].text)

        print(seoul_SS[0].text)
        pass