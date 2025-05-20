from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
import time
from fake_useragent import UserAgent
import pandas as pd
import os
import json
import re

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

# reads the data located in links.json and outputs it in liste_de_liens

with open('links.json', 'r') as f:
    liste_de_liens = json.load(f)

# testLink = 'https://www.zimmo.be/fr/bruxelles-1000/a-vendre/appartement/L6U2F/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIiwiVEFLRV9PVkVSIl19LCJwbGFjZUlkIjp7ImluIjpbNzJdfSwiY2F0ZWdvcnkiOnsiaW4iOlsiSE9VU0UiLCJBUEFSVE1FTlQiXX19LCJzb3J0aW5nIjpbeyJ0eXBlIjoiUkFOS0lOR19TQ09SRSIsIm9yZGVyIjoiREVTQyJ9XSwicGFnaW5nIjp7ImZyb20iOjIyNywic2l6ZSI6MjF9fQ%3D%3D&p=1&boosted=1'
# driver = webdriver.Firefox()

# driver.get(testLink)

# for i in range (len(liste_de_liens)):
for i in range(10):
    driver = webdriver.Firefox()
    driver.get(liste_de_liens[i])
    print('browsing ' + liste_de_liens[i])
    
    time.sleep(4)
    # accept the cookies if there are any
    if (driver.find_element(By.ID, 'didomi-popup')):
        accept_cookies_button = 'didomi-notice-agree-button'
        driver.find_element(By.ID, accept_cookies_button).click()
        print('cookies accepted like a boss')
        
    time.sleep(3)
    
    # vérification de la présence des containers dans la page web
    try:
        page_container = driver.find_element(By.CSS_SELECTOR, 'div.content')
        title_container = page_container.find_element(By.CSS_SELECTOR, 'h1.pand-title')
        
        main_container = page_container.find_element(By.CSS_SELECTOR, 'section#tab-detail').find_element(By.CSS_SELECTOR, 'div.main-container')
        sub_container = main_container.find_element(By.CSS_SELECTOR, 'div.pand-detail')
        data_container = sub_container.find_element(By.CSS_SELECTOR, 'section#main-features')
        
        # adresse_full looks like : Rue non communiquée, 1000 Bruxelles
        adresse_full = data_container.find_element(By.CSS_SELECTOR, 'h2.section-title').find_element(By.TAG_NAME, 'span').text
        
        prix_container = data_container.find_element(By.CSS_SELECTOR, 'span.feature-value')
        
        features_container = data_container.find_element(By.CSS_SELECTOR, 'ul.main-features')
        features_list = features_container.find_elements(By.TAG_NAME, 'li')
        
        desc_container = sub_container.find_element(By.CSS_SELECTOR, 'section#description')
        full_desc = desc_container.find_element(By.CSS_SELECTOR, 'p.description-block')
        
        images_slider_container = sub_container.find_element(By.CSS_SELECTOR, 'div#property-detail-slider')
        images_full = images_slider_container.find_elements(By.TAG_NAME, 'img')
    
    # si un des containers n'est pas présent, alors on saute le lien posant problème
    except:
        print('Erreur lors de la récupération des données. Container(s) non présent(s)')
        driver.close()
        continue
    
    # vérification des données avant de les rajouter dans la dataFrame
    try:
        title_full = title_container.text
        code_postal_et_ville= adresse_full.split(',')[1]
        prix_full = prix_container.text.split('€')[1]
        prix_temp = prix_full.strip()
        
        ####################################################################
        # impératif de changer ces filtres, ils sont bien trop restrictifs #
        ####################################################################
        
        if (not 'Type' in features_container.text):
            print('Type de location non spécifié')
            raise TypeError
        elif (not 'Surf. habitable' in features_container.text):
            print('Superficie non spécifée')
            raise TypeError
        elif (not 'Chambres' in features_container.text):
            print('Nombre de chambres non spécifié')
            raise TypeError
        elif (not 'Garages' in features_container.text):
            print('Nombre de garages non spécifié')
            raise TypeError
        # cette condition est sûrement trop restrictive. A modifier
        elif('demande' in features_container.text):
            raise TypeError
        
    except:
        print('Erreur, tous les champs concernés ne sont pas remplis.')
        driver.close()
        continue
    
    
    title.append(title_full.split('(')[0])

    if ('à vendre' in title_full):
        type_annonce.append('vente')
    else:
        type_annonce.append('location')

    adresse.append(adresse_full.split(',')[0])
    
    # using re to extract the numbers from str as : 1000 Bruxelles
    code_postal.append(re.search(r'\d+', code_postal_et_ville).group())

    ville.append(code_postal_et_ville.strip().split(' ')[1])

    # i should probably change the type of prix from str to int before inserting into db
    prix.append(prix_temp.replace('.', ''))

    for i in range(len(features_list)):
        if ('Type' in features_list[i].text):
            type_bien.append(features_list[i].find_element(By.CSS_SELECTOR, 'span.feature-value').text.strip())

        if ('Surf. habitable' in features_list[i].text):
            surface_full = features_list[i].find_element(By.CSS_SELECTOR, 'span.feature-value').text.strip()

            # si le format du prix est comme : 'à partir de 125 m² '
            if ('à partir' in surface_full):
                surface.append(surface_full.split(' ')[3])
            else:
                surface.append(surface_full.split(' ')[0])
            
        if ('Chambres' in features_list[i].text):
            nombre_chambres_temp = features_list[i].find_element(By.CSS_SELECTOR, 'span.feature-value').text.strip()
            nombre_chambres.append(nombre_chambres_temp)
    
        if ('Garages' in features_list[i].text):
            garage.append(True)
        else:
            garage.append(False)

    parking.append(False)
    
    description.append(full_desc.text)

    images_list_temp = []
    
    for image_src in images_full:
        image_test = image_src.get_attribute('src')
        images_list_temp.append(image_test)
    
    images.append(images_list_temp)
    
    lien_annonce.append(liste_de_liens[i])

    driver.close()

print('--------------------------')
print('        ---------         ')
print('scraping over. Writing data to output file')

print('titles:', len(title))
print('description:', len(description))
print('adresse:', len(adresse))
print('ville:', len(ville))
print('code_postal:', len(code_postal))
print('surface:', len(surface))
print('prix:', len(prix))
print('nombre_chambres:', len(nombre_chambres))
print('type_bien:', len(type_bien))
print('parking:', len(parking))
print('garage:', len(garage))
print('images:', len(images))
print('lien_annonce:', len(lien_annonce))

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
df = pd.DataFrame(data_dict)

# Vérifier si le fichier existe
file_exists = os.path.isfile('properties.csv')

# Sauvegarder en CSV
#########################################################################
# attention, tous les headers ne s'écrivent que dans une seule colonne! #
#########################################################################
df.to_csv('properties.csv', mode='a', header=not file_exists, index=False, encoding='utf-8')

print("Données sauvegardées dans properties.csv")