from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
import time
from fake_useragent import UserAgent
from utils.free_proxies import FreeProxy
import random
import os
import json

# this var is a list of all links available for the current search
# this will be output in some file later on
linksList = []

# generates a random user agent
ua = UserAgent()
user_agent = ua.random

# gets a free proxy to use
free_proxy = FreeProxy() 
proxy_list = free_proxy.get_proxy_list()
random_choice = random.choice(proxy_list)
random_proxy = random_choice.split(':')[0]
random_port = random_choice.split(':')[1]
print('using : ', random_choice)

# changing the default user agent of firefox webdriver
options = Options()
options.set_preference("media.peerconnection.enabled", False)
options.set_preference("general.useragent.override", user_agent)
options.set_preference("network.proxy.http", random_proxy)
options.set_preference("network.proxy.http_port", random_port)

# this link is relative to real estate goods for sale only
realEstateForSale = 'https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIiwiVEFLRV9PVkVSIl19LCJwbGFjZUlkIjp7ImluIjpbNzJdfSwiY2F0ZWdvcnkiOnsiaW4iOlsiSE9VU0UiLCJBUEFSVE1FTlQiXX19LCJzb3J0aW5nIjpbeyJ0eXBlIjoiUkFOS0lOR19TQ09SRSIsIm9yZGVyIjoiREVTQyJ9XSwicGFnaW5nIjp7ImZyb20iOjIyNywic2l6ZSI6MjF9fQ%3D%3D&p=1#gallery'


driver = webdriver.Firefox(options=options)
driver.set_window_size(1366, 768)

driver.get(realEstateForSale)

# allows the browser to wait until cookies page pops up. There should be a better solution than this
time.sleep(5)

# accept the cookies if there are any
if (driver.find_element(By.ID, 'didomi-popup')):
    accept_cookies_button = 'didomi-notice-agree-button'
    driver.find_element(By.ID, accept_cookies_button).click()
    print('cookies accepted like a boss')
    
time.sleep(5)

nbOfPagesContainer = driver.find_element(By.CSS_SELECTOR, 'ul.pagination')
# list of all the li elems on the bottom of the page
lis = nbOfPagesContainer.find_elements(By.TAG_NAME, 'li')
# text element containing the number of pages available for that search
nbOfPages = lis[-2].text

# doesnt work, got stopped after 2 pages browsed by a captcha requiring me to prove im not a robot.
# need to find a workaround
for i in range (1, int(nbOfPages)+1):
    #creating the url of the pages to visit
    urlToVisit = 'https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIiwiVEFLRV9PVkVSIl19LCJwbGFjZUlkIjp7ImluIjpbNzJdfSwiY2F0ZWdvcnkiOnsiaW4iOlsiSE9VU0UiLCJBUEFSVE1FTlQiXX19LCJzb3J0aW5nIjpbeyJ0eXBlIjoiUkFOS0lOR19TQ09SRSIsIm9yZGVyIjoiREVTQyJ9XSwicGFnaW5nIjp7ImZyb20iOjIyNywic2l6ZSI6MjF9fQ%3D%3D&p=' + str(i) + '#gallery'
    
    time.sleep(1)
    
    driver.get(urlToVisit)
    print('Currently browsing page ', i)
    
    time.sleep(5)

    try:
        
        big_container = driver.find_element(By.CLASS_NAME, 'property-results_container')
        individualItems = big_container.find_elements(By.CSS_SELECTOR, 'div.property-item')

        for item in individualItems:
            container = item.find_element(By.CSS_SELECTOR, 'div.property-item_photo-container')
            linkContainer = container.find_element(By.CSS_SELECTOR, 'a.property-item_link')
            link = linkContainer.get_attribute('href')
            print(link)
            linksList.append(link)
    except:
        print('-----------------')
        print('Script detected. Closing and opening again on same link')
        print('-----------------')
        
        # closing the webdriver and opening it again using a different agent and proxy
        driver.close()
        
        random_choice = random.choice(proxy_list)
        random_proxy = random_choice.split(':')[0]
        random_port = random_choice.split(':')[1]
        print('using new proxy : ', random_choice)
        user_agent = ua.random
        
        options.set_preference("media.peerconnection.enabled", False)
        options.set_preference("general.useragent.override", user_agent)
        options.set_preference("network.proxy.http", random_proxy)
        options.set_preference("network.proxy.http_port", random_port)

        driver = webdriver.Firefox(options=options)
        driver.set_window_size(1366, 768)

        driver.get(urlToVisit)
        print('OH shit, here we go again')
        time.sleep(5)
        
        if (driver.find_element(By.ID, 'didomi-popup')):
            accept_cookies_button = 'didomi-notice-agree-button'
            driver.find_element(By.ID, accept_cookies_button).click()
            print('cookies accepted like a boss')
            
        time.sleep(4)
        
        # très mauvaise idée mais on essaie quand même
        big_container = driver.find_element(By.CLASS_NAME, 'property-results_container')
        individualItems = big_container.find_elements(By.CSS_SELECTOR, 'div.property-item')

        for item in individualItems:
            container = item.find_element(By.CSS_SELECTOR, 'div.property-item_photo-container')
            linkContainer = container.find_element(By.CSS_SELECTOR, 'a.property-item_link')
            link = linkContainer.get_attribute('href')
            print(link)
            linksList.append(link)


driver.close()

print('------------------------------------')
print('        --------------')
print('--------------------------')
print('Scraping done. There are ' , len(linksList), ' links for that search')

#########################################################################################
# this part of the program is reponsible for writing the scraped links into a json file #
#########################################################################################
print('--------------------------')
print('Opening output file')
print('--------------------------')
# reads the data located in links.json and outputs it in liste_de_liens
if os.path.getsize('links.json') > 0:
    with open('links.json', 'r') as f:
        liste_de_liens = json.load(f)
else :
    liste_de_liens = []

print('Adding scraped results to local array')
print('--------------------------')
for link in linksList:
    liste_de_liens.append(link)

print('adding local array to json file')
print('--------------------------')
# adds the new data to the .json file
with open('links.json', 'w') as f:
    json.dump(liste_de_liens, f)

print('done')