from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

driver = webdriver.Firefox()
driver.get("https://www.zimmo.be/fr/rechercher/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIiwiVEFLRV9PVkVSIl19LCJwbGFjZUlkIjp7ImluIjpbNzJdfSwiY2F0ZWdvcnkiOnsiaW4iOlsiSE9VU0UiLCJBUEFSVE1FTlQiXX19fQ%3D%3D#gallery")

# must accept cookies first
areThereCookies = False
accept_cookies_button = 'didomi-notice-agree-button'

# needs to scroll down to access the accept all cookies button

if (driver.find_element(By.ID, accept_cookies_button)):
    areThereCookies = True
    print('There are cookies to be accepted')
    driver.find_element(By.ID, accept_cookies_button).click()
print('no cookies to be accepted')

time.sleep(2)

# allows browser to wait until js elements are loaded
time.sleep(3)
big_container = driver.find_element(By.CLASS_NAME, 'property-results_container')
print('big container found')
nb_of_containers = driver.find_elements(By.CLASS_NAME, 'property_item')
print(nb_of_containers)

driver.close()