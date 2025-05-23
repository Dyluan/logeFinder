from bs4 import BeautifulSoup
import requests
import re
import json

url = "https://www.zimmo.be/fr/bruxelles-1000/a-louer/appartement/L3FW2/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIlRPX1JFTlQiXX0sInBsYWNlSWQiOnsiaW4iOls3Ml19LCJjYXRlZ29yeSI6eyJpbiI6WyJIT1VTRSIsIkFQQVJUTUVOVCJdfSwiemltbW9Db2RlIjp7Im5vdEluIjpbIkw3REJLIiwiTDVXSUciLCJMN0YwVyIsIkw1T0pWIl19fSwicGFnaW5nIjp7ImZyb20iOjAsInNpemUiOjE3fSwic29ydGluZyI6W3sidHlwZSI6IlJBTktJTkdfU0NPUkUiLCJvcmRlciI6IkRFU0MifV19&p=12"

response = requests.get(url)

soup = BeautifulSoup(response.content, 'html.parser')

try:
    cookies = soup.find('div', class_='didomi-notice')
    
    if cookies:
        print('Cookies popup detected.')
except Exception as e:
    print('No cookies popup detected.')

page_container = soup.find('div', class_='content')
print(page_container)