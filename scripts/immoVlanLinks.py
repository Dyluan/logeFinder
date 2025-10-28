from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException, ElementNotInteractableException, ElementClickInterceptedException
from selenium.webdriver.common.action_chains import ActionChains
import time
import json

def decline_cookies(driver):
    popup_container_selector = 'didomi-popup-notice-text-container'
        
    try: 
        cookie_popup = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, popup_container_selector)))
        learn_more_button_selector = 'didomi-notice-learn-more-button'
        learn_more_button = driver.find_element(By.ID, learn_more_button_selector)
        learn_more_button.click()
        
        disagree_button_id = 'btn-toggle-disagree'
        disagree_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, disagree_button_id)))
        
        disagree_button.click()
        
    except TimeoutException:
        print('Impossible to locate cookie popup: ', popup_container_selector)
        time.sleep(1)
        return False
    
    time.sleep(1)
    return True

# in order to prevent the function from running indefinitely::
# returns true if it adds new links to the list
# returns false if the list already contains a link
def add_links_to_list(driver, liste):
    links_container_selector = 'article.list-view-item.mb-3.card.card-border'
    # selecting all items containing our above selector
    links_containers = driver.find_elements(By.CSS_SELECTOR, links_container_selector)
    # appending our selector link to our parameter list
    for link in links_containers:
        href = link.get_attribute('data-url')
        if (not href in liste):
            liste.append(href)
        
        else:
            print('Last page reached.')
            return False
    
    return True

def getListings(nb_pages, raw_url):
    # there are supposedly 50 pages
    for i in range(1, nb_pages+1):
        
        url = raw_url+str(i)+'&noindex=1'
        driver = webdriver.Chrome()
        driver.get(url)
        
        print('page', i)
        
        if decline_cookies(driver):
            print('Cookies declined.')
        
        if not add_links_to_list(driver, linksList):
            break
        
        driver.close()
        time.sleep(0.5)

if __name__ == '__main__':
    
    # our list of links
    linksList = []
    
    # raw URLs look like this. We need to cut the last part and provide it to our function getListings
    realEstateToRent = 'https://immovlan.be/fr/immobilier?transactiontypes=a-louer,en-colocation&propertytypes=maison,appartement&municipals=bruxelles&regions=bruxelles-region&page='
    realEstateForSale = 'https://immovlan.be/fr/immobilier?transactiontypes=a-vendre,en-vente-publique&propertytypes=maison,appartement&municipals=bruxelles&regions=bruxelles-region&page='
    # adding our links to our list
    getListings(50, realEstateToRent)
    getListings(50, realEstateForSale)
    
    print('------------')
    for link in linksList:
        print(link)

    print('-------------')
    print('Found a total of', len(linksList), 'items.')
    
    # adds the new data to the .json file
    with open('immoVlanLinks.json', 'w') as f:
        json.dump(linksList, f)