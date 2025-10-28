from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException, ElementNotInteractableException, ElementClickInterceptedException, WebDriverException
from selenium.webdriver.common.action_chains import ActionChains
import time
import json
import pandas as pd
import os
import traceback

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

def split_address(address):
    # Séparer l'adresse par les espaces
    parts = address.split()
    
    # Identifier le code postal (qui est généralement le deuxième à partir de la fin)
    postal_code = parts[-2]
    
    # La ville est le dernier élément
    city = parts[-1]
    
    # La rue est tout ce qui reste
    street = ' '.join(parts[:-2])
    
    return street, postal_code, city

def strip_price(price_raw):
    parts = price_raw.split()
    
    price = ''.join(parts[:-1])
    
    return price

def garageLogic(data_rows):
    for data in data_rows:
        if 'Aménagement intérieur' in data.text:
                if 'Garage' in data.text:
                    return True
    
    return False

def imageLogic(selector):
    
    try:
        list_of_images_links = []
        
        first_image = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
        ActionChains(driver).move_to_element(first_image).click(first_image).perform()
        
        images_container_selector = 'div.lg-thumb.lg-group'
        images_container = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, images_container_selector)))
        
        images_raw = images_container.find_elements(By.TAG_NAME, 'div')
        for image_raw in images_raw:
            img = image_raw.find_element(By.TAG_NAME, 'img')
            link = img.get_attribute('src')
            list_of_images_links.append(link)
            
        # close_button_selector = 'button.lg-close.lg-icon'
        # close_button_selector.click()
        
        return list_of_images_links
    except (TimeoutException, NoSuchElementException, ElementNotInteractableException, ElementClickInterceptedException) as e:
        print(f"Error retrieving images for selector '{selector}': {e}")
        print(traceback.format_exc())
        return []
    except Exception as e:
        print(f"Unexpected error in imageLogic for selector '{selector}': {e}")
        print(traceback.format_exc())
        return []

def _not_empty(v):
    if v is None:
        return False
    if isinstance(v, str):
        return v.strip() != ''
    if isinstance(v, (list, tuple, set, dict)):
        return len(v) > 0
    return True

def get_details(driver, lien):
    
    # --- initialisation des variables par défaut pour éviter UnboundLocalError ---
    title = ''
    desc = ''
    address = ''
    postal_code = ''
    city = ''
    surface = ''
    price = ''
    nb_chambres = ''
    type_bien = ''
    images_for_said_appartment = []
    lien_annonce = ''
    type_annonce = ''
    parking = False
    garage = False
    
    print(lien)
    
    # first, we need to open the link and decline the cookies
    try:
        driver.get(lien)
    except WebDriverException:
        print('An unkown error occured trying to open the link.')
        return
    
    decline_cookies(driver)
    
    # waiting until the main container is present on the page
    # if it's not present after 10seconds, do nothing and return
    try:
        main_content_selector = 'main_content'
        presence_of_main_content = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, main_content_selector)))
    except TimeoutException:
        print(lien, ' - unreachable')
        # not sure it belongs here
        driver.quit()
        return
    
    try:
        title_selector = 'span.detail__header_title_main'
        title_raw = driver.find_element(By.CSS_SELECTOR, title_selector)
        title = title_raw.text
        if ('en vente publique' in title):
            title = title.split(' ')[0]
        type_bien = title_raw.text.split(' ')[0]
    except NoSuchElementException as e:
        print(f"{lien} - title not found: {e}")
        print(traceback.format_exc())
        return
    except Exception as e:
        print(f"{lien} - unexpected error while reading title: {e}")
        print(traceback.format_exc())
        return
    
    try:
        address_selector = 'div.detail__header_address'
        address_raw = driver.find_element(By.CSS_SELECTOR, address_selector)
        address, postal_code, city = split_address(address_raw.text)
    except NoSuchElementException as e:
        print(f"{lien} - address not found: {e}")
        print(traceback.format_exc())
        return
    except Exception as e:
        print(f"{lien} - unexpected error while reading address: {e}")
        print(traceback.format_exc())
        return
    
    try:
        price_selector = 'span.detail__header_price_data'
        price_raw = driver.find_element(By.CSS_SELECTOR, price_selector)
        price = strip_price(price_raw.text)
    except NoSuchElementException as e:
        print(f"{lien} - price not found: {e}")
        print(traceback.format_exc())
        return
    except Exception as e:
        print(f"{lien} - unexpected error while reading price: {e}")
        print(traceback.format_exc())
        return
    
    
    try:
        rooms_surface_and_other_selector = 'li.property-highlight.margin-bottom-05.margin-right-05'
        rooms_surface_and_other = driver.find_elements(By.CSS_SELECTOR, rooms_surface_and_other_selector)
        
        for elem in rooms_surface_and_other:
            temp = elem.text
            
            if 'chamb' in temp:
                nb_chambres = elem.find_element(By.TAG_NAME, 'strong').text
            else:
                nb_chambres = '1'
            # break is important here because there is a terrasse component that overrides our surface value
            if 'm²' in temp:
                surface = elem.find_element(By.TAG_NAME, 'strong').text
                break
            else:
                surface = '0'
    except Exception as e:
        print(f"{lien} - error while parsing rooms/surface: {e}")
        print(traceback.format_exc())
        return
    
    try:
        description_selector = 'div.dynamic-description'
        desc = driver.find_element(By.CSS_SELECTOR, description_selector).text
        # print(f"Description: {desc}")
    except NoSuchElementException as e:
        print(f"{lien} - description not found: {e}")
        print(traceback.format_exc())
        return
    except Exception as e:
        print(f"{lien} - unexpected error while reading description: {e}")
        print(traceback.format_exc())
        return
    
    try:
        general_info_selector = 'div.general-info-wrapper'
        general_info_container = driver.find_element(By.CSS_SELECTOR, general_info_selector)
        
        data_rows = general_info_container.find_elements(By.CLASS_NAME, 'data-row-wrapper')
        
        garage = garageLogic(data_rows)
    except NoSuchElementException as e:
        print(f"{lien} - general info not found: {e}")
        print(traceback.format_exc())
        return
    except Exception as e:
        print(f"{lien} - unexpected error while reading general info: {e}")
        print(traceback.format_exc())
        return
    
    try:
        lien_annonce = driver.current_url
        parking = False
        if 'a-louer' in lien_annonce:
            type_annonce = 'location'
        else:
            type_annonce = 'vente'
    except Exception as e:
        print(f"{lien} - error while determining lien/type_annonce: {e}")
        print(traceback.format_exc())
        return
    
    try:
        # we need to click on the first image in order to be able to select all the other images
        first_image_selector = 'a.img-thumb.first'
        images_for_said_appartment = imageLogic(first_image_selector)
        
    except Exception as e:
        print(f"{lien} - error while retrieving images: {e}")
        print(traceback.format_exc())
        return
    
    required = [
        title, desc, address, postal_code, city, surface,
        price, nb_chambres, type_bien, images_for_said_appartment,
        lien_annonce, type_annonce
    ]
    if all(_not_empty(x) for x in required):
        return title, desc, address, city, postal_code, surface, price, nb_chambres, type_bien, parking, garage, images_for_said_appartment, lien_annonce, type_annonce
    
    # return


if __name__ == '__main__':
    
    title = []
    description = []
    adresse = []
    ville = []
    code_postal = []
    surface = []
    prix = []
    nombre_chambres = []
    type_bien = []
    parking = []
    garage = []
    images = []
    lien_annonce = []
    type_annonce = []

    # lis les liens présents dans immoVlanLinks.json et les enregistre dans liste_de_liens
    # with open('immoVlanLinks.json', 'r') as f:
    with open('testLinks.json', 'r') as f:
        liste_de_liens = json.load(f)

    start_time = time.time()
    
    for lien in liste_de_liens:
        driver = webdriver.Chrome()
        driver.set_window_size(1040, 900)
        
        result = get_details(driver, lien)
        if result is None:
            print(f'No data for {lien} — skipping')
            continue
        
        (temp_title, temp_desc, temp_address, temp_city, temp_pc, temp_surface, temp_price, temp_nb_ch, 
        temp_type, temp_parking, temp_garage, temp_images, temp_lien, temp_annonce) = result
        
        title.append(temp_type)
        description.append(temp_desc)
        adresse.append(temp_address)
        ville.append(temp_city)
        code_postal.append(temp_pc)
        surface.append(temp_surface)
        prix.append(temp_price)
        nombre_chambres.append(temp_nb_ch)
        type_bien.append(temp_type)
        parking.append(temp_parking)
        garage.append(temp_garage)
        images.append(temp_images)
        lien_annonce.append(temp_lien)
        type_annonce.append(temp_annonce)
        
        driver.quit()
    
    end_time = time.time()
    elapsed_time = end_time - start_time
    minutes = elapsed_time // 60

    print(f'Il s est écoulé {minutes} minutes depuis le début du scraping')
    
    
    data_dict = {
        'title': title if isinstance(title, list) else [title],
        'description': description if isinstance(description, list) else [description],
        'adresse': adresse if isinstance(adresse, list) else [adresse],
        'ville': ville if isinstance(ville, list) else [ville],
        'code_postal': code_postal if isinstance(code_postal, list) else [code_postal],
        'surface': surface if isinstance(surface, list) else [surface],
        'prix': prix if isinstance(prix, list) else [prix],
        'nombre_chambres': nombre_chambres if isinstance(nombre_chambres, list) else [nombre_chambres],
        'type_bien': type_bien if isinstance(type_bien, list) else [type_bien],
        'parking': parking if isinstance(parking, list) else [parking],
        'garage': garage if isinstance(garage, list) else [garage],
        'images': images if isinstance(images, list) else [images],
        'lien_annonce': lien_annonce if isinstance(lien_annonce, list) else [lien_annonce],
        'type_annonce': type_annonce if isinstance(type_annonce, list) else [type_annonce]
    }
    
    # Créer un DataFrame pandas
    # df = pd.DataFrame(data_dict)

    # # Vérifier si le fichier existe
    # file_exists = os.path.isfile('immoVlan.csv')

    # # Sauvegarder en CSV
    # df.to_csv('immoVlan.csv', mode='a', sep=';', header=not file_exists, index=False, encoding='utf-8-sig')

    print("Données sauvegardées dans immoVlan.csv")