from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

driver = webdriver.Firefox()
driver.get("https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIiwiVEFLRV9PVkVSIl19LCJwbGFjZUlkIjp7ImluIjpbNzJdfSwiY2F0ZWdvcnkiOnsiaW4iOlsiSE9VU0UiLCJBUEFSVE1FTlQiXX19fQ%3D%3D#gallery")

isThereACookiePopUp = True

time.sleep(5)

if (driver.find_element(By.ID, 'didomi-popup')):
    print('there is a popup page that wants us to accept the cookies')
    accept_cookies_button = 'didomi-notice-agree-button'
    driver.find_element(By.ID, accept_cookies_button).click()
    print('cookies accepted like a boss')

# allows browser to wait until js elements are loaded
time.sleep(5)

big_container = driver.find_element(By.CLASS_NAME, 'property-results_container')
print('big container found. Type of that container: ', type(big_container))
print(big_container)
nb_of_containers = big_container.find_elements(By.CLASS_NAME, 'property_item')
print(len(nb_of_containers), ' appartments/houses on the front page')

driver.close()