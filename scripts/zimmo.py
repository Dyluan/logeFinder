from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

driver = webdriver.Firefox()
driver.get("https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIiwiVEFLRV9PVkVSIl19LCJwbGFjZUlkIjp7ImluIjpbNzJdfSwiY2F0ZWdvcnkiOnsiaW4iOlsiSE9VU0UiLCJBUEFSVE1FTlQiXX19fQ%3D%3D#gallery")

isThereACookiePopUp = True

priceList = []
titleList = []
adressList = []
cityList = []
postal_codeList = []

time.sleep(5)

if (driver.find_element(By.ID, 'didomi-popup')):
    print('there is a popup page that wants us to accept the cookies')
    accept_cookies_button = 'didomi-notice-agree-button'
    driver.find_element(By.ID, accept_cookies_button).click()
    print('cookies accepted like a boss')

# allows browser to wait until js elements are loaded
time.sleep(5)

big_container = driver.find_element(By.CLASS_NAME, 'property-results_container')
print('big container found. ')

nb_containers = big_container.find_elements(By.CSS_SELECTOR, 'div.property-item')

for item in nb_containers:
    #tempPrice works but some prices are 'on demand' or 'àpd', which needs to be trimmed
    tempPrice = item.find_element(By.CSS_SELECTOR, 'div.property-item_price').text
    priceList.append(tempPrice)

    infoContainer = item.find_element(By.CSS_SELECTOR, 'div.property-item_info-container')
    
    #works as intended. Output is either : 'Appartement à vendre' or 'Maison à vendre' or 'Projet'
    #might need to do something about Project    
    tempTitle = infoContainer.find_element(By.CSS_SELECTOR, 'div.property-item_title').text
    titleList.append(tempTitle)
    
    #adress contains the postal code as well. Need to separate boths.
    adressFull = infoContainer.find_element(By.CSS_SELECTOR, 'div.property-item_address').text
    adress_parts = adressFull.split('\n')
    
    adressList.append(adress_parts[0])
    
    #splitting the postalCode and the city as they are both in adress_parts[1]
    tempCP = adress_parts[1].split(' ')
    
    postal_codeList.append(tempCP[0])
    cityList.append(tempCP[1])
    
    dataContainer = infoContainer.find_element(By.CSS_SELECTOR, 'div.property-item_meta-info')
    
    #need to separate the data : 78m2 => 78
    #not done yet
    surface = dataContainer.find_element(By.CSS_SELECTOR, 'span.opp-icon').text
    print('Appartement de ', surface)


driver.close()

# for i in range(0, len(priceList)):
#     print(titleList[i] + ' pour seulement ' + priceList[i] + '. Situé ' + adressList[i] + ' dans la ville de ' + cityList[i])