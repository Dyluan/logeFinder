from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import os
import json

# this var is a list of all links available for the current search
# this will be output in some file later on
linksList = []

# this link is relative to real estate goods for sale only
realEstateForSale = 'https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIiwiVEFLRV9PVkVSIl19LCJwbGFjZUlkIjp7ImluIjpbNzJdfSwiY2F0ZWdvcnkiOnsiaW4iOlsiSE9VU0UiLCJBUEFSVE1FTlQiXX19LCJzb3J0aW5nIjpbeyJ0eXBlIjoiUkFOS0lOR19TQ09SRSIsIm9yZGVyIjoiREVTQyJ9XSwicGFnaW5nIjp7ImZyb20iOjIyNywic2l6ZSI6MjF9fQ%3D%3D&p='
realEstateToRent = 'https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIlRPX1JFTlQiXX0sInBsYWNlSWQiOnsiaW4iOls3Ml19LCJjYXRlZ29yeSI6eyJpbiI6WyJIT1VTRSIsIkFQQVJUTUVOVCJdfSwiemltbW9Db2RlIjp7Im5vdEluIjpbIkw3REJLIiwiTDVXSUciLCJMN0YwVyIsIkw1T0pWIl19fSwicGFnaW5nIjp7ImZyb20iOjAsInNpemUiOjE3fSwic29ydGluZyI6W3sidHlwZSI6IlJBTktJTkdfU0NPUkUiLCJvcmRlciI6IkRFU0MifV19&p='

urls = [
    realEstateForSale,
    realEstateToRent
]

for url in urls:
    
    driver = webdriver.Firefox()
    driver.set_window_size(1366, 768)

    # driver.get(realEstateForSale)
    driver.get(url)

    # allows the browser to wait until cookies page pops up. There should be a better solution than this
    time.sleep(3)

    # accept the cookies if there are any
    if (driver.find_element(By.ID, 'didomi-popup')):
        accept_cookies_button = 'didomi-notice-agree-button'
        driver.find_element(By.ID, accept_cookies_button).click()
        
    time.sleep(3)

    nbOfPagesContainer = driver.find_element(By.CSS_SELECTOR, 'ul.pagination')
    # list of all the li elems on the bottom of the page
    lis = nbOfPagesContainer.find_elements(By.TAG_NAME, 'li')
    # text element containing the number of pages available for that search
    nbOfPages = lis[-2].text

    driver.close()

    for i in range (1, int(nbOfPages)+1):
        #creating the url of the pages to visit
        # urlToVisit = 'https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIlRPX1JFTlQiXX0sInBsYWNlSWQiOnsiaW4iOls3Ml19LCJjYXRlZ29yeSI6eyJpbiI6WyJIT1VTRSIsIkFQQVJUTUVOVCJdfSwiemltbW9Db2RlIjp7Im5vdEluIjpbIkw3REJLIiwiTDVXSUciLCJMN0YwVyIsIkw1T0pWIl19fSwicGFnaW5nIjp7ImZyb20iOjAsInNpemUiOjE3fSwic29ydGluZyI6W3sidHlwZSI6IlJBTktJTkdfU0NPUkUiLCJvcmRlciI6IkRFU0MifV19&p=' +str(i) + '#gallery'
        urlToVisit = url + str(i) + '#gallery'
        
        driver = webdriver.Firefox()
        driver.set_window_size(1366, 768)
        
        driver.get(urlToVisit)
        print('Currently browsing page ', i)
        
        time.sleep(3)
        # accept the cookies if there are any
        if (driver.find_element(By.ID, 'didomi-popup')):
            accept_cookies_button = 'didomi-notice-agree-button'
            driver.find_element(By.ID, accept_cookies_button).click()
            
        time.sleep(3)

        try:
            
            big_container = driver.find_element(By.CLASS_NAME, 'property-results_container')
            individualItems = big_container.find_elements(By.CSS_SELECTOR, 'div.property-item')

            for item in individualItems:
                container = item.find_element(By.CSS_SELECTOR, 'div.property-item_photo-container')
                linkContainer = container.find_element(By.CSS_SELECTOR, 'a.property-item_link')
                link = linkContainer.get_attribute('href')
                linksList.append(link)
                
            driver.close()
        except:
            print('-----------------')
            print('Something went wrong during scraping.')
            print('-----------------')

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
# Why? Just to not erase the previous links contained in the original file. We're appending new links to previous ones.
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