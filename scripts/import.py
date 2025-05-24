import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
import ast

# lecture du fichier CSV
df = pd.read_csv('properties.csv', sep=';', encoding='utf-8-sig')

load_dotenv()
DATABASE_URL= os.getenv('DATABASE_URL')

engine = create_engine(DATABASE_URL)

# erreur : la liste des images est au format : ['lien1', 'lien2'] et devrait être au format : {'lien1', 'lien2'}

# remplacement des valeurs non conformes à la base de données pour type_bien.
# valeurs acceptées : appartement, maison, villa
for elem in df['type_bien']:
    if ('Appartement' in elem):
        df['type_bien'] = df['type_bien'].replace(elem, 'appartement')
    elif ('Maison' in elem):
        df['type_bien'] = df['type_bien'].replace(elem, 'maison')

# conversion de la colonne images au format accepté par la base de données
df['images'] = df['images'].apply(ast.literal_eval)

try:
    print(f"Tentative d'import de {len(df)} lignes")
    
    df.to_sql('biens_immobiliers', 
                con=engine, 
                if_exists='append', 
                index=False,
    )
    print('Data imported successfully')
except Exception as e:
    print(f'Error importing data: {e}')
finally:
    engine.dispose()
    print('Database connection closed')