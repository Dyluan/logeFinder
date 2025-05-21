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

# lis les liens présents dans links.json et les enregistre dans liste_de_liens
with open('links.json', 'r') as f:
    liste_de_liens = json.load(f)

# looping tous les liens présents dans liste_de_liens
for i in range (len(liste_de_liens)):
    
    driver = webdriver.Firefox()
    driver.get(liste_de_liens[i])
    print('browsing ' + liste_de_liens[i])
    
    time.sleep(4)
    # accepte les cookies
    if (driver.find_element(By.ID, 'didomi-popup')):
        accept_cookies_button = 'didomi-notice-agree-button'
        driver.find_element(By.ID, accept_cookies_button).click()
        
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
        
        type_flag = True
        surface_flag = True
        chambres_flag = True
        
        # je check si la page comprend bien les mots Type, Surf. habitable et Chambres. Sinon, je passe le flag correspondant à False
        if (not 'Type' in features_container.text):
            print('Type de location non spécifié')
            type_flag = False
        elif (not 'Surf. habitable' in features_container.text):
            print('Superficie non spécifée')
            surface_flag = False
        elif (not 'Chambres' in features_container.text):
            print('Nombre de chambres non spécifié')
            chambres_flag = False
        
        # si l'un de mes flag est False, alors je lance une erreur et on passe au lien suivant sans ajouter de valeurs aux variables
        if (not type_flag or not surface_flag or not chambres_flag):
            raise TypeError
        
        # si la valeur de Type, Surf. habitable ou Chambres est égal à : sur demande, alors le flag correspondant passe à False
        for i in range(len(features_list)):
            if ('Type' in features_list[i].text and 'demande' in features_list[i].find_element(By.CSS_SELECTOR, 'span.feature-value').text.strip()):
                type_flag = False
            if ('Surf. habitable' in features_list[i].text and 'demande' in features_list[i].find_element(By.CSS_SELECTOR, 'span.feature-value').text.strip()):
                surface_flag = False
            if ('Chambres' in features_list[i].text and 'demande' in features_list[i].find_element(By.CSS_SELECTOR, 'span.feature-value').text.strip()):
                chambres_flag = False
        
        # si l'un de mes flag est False, alors je lance une erreur et on passe au lien suivant sans ajouter de valeurs aux variables
        if (not type_flag or not surface_flag or not chambres_flag):
            raise TypeError
        
    except:
        print('Erreur, tous les champs concernés ne sont pas remplis.')
        driver.close()
        continue
    
    # si tous les tests sont positifs, alors on peut commencer à rajouter les données dans les listes adéquates
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
    
    # si le mot Garages est présent sur la page, c'est qu'il y en a 1 (pas besoin de parcourir la liste pour avoir une valeur binaire)
    if ('Garages' in features_container.text):
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
print('type_annonce:', len(type_annonce))

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
df.to_csv('properties.csv', mode='a', sep=';', header=not file_exists, index=False, encoding='utf-8-sig')

print("Données sauvegardées dans properties.csv")