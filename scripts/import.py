import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.types import ARRAY, String
import os
from dotenv import load_dotenv
import ast

# lecture du fichier CSV
df = pd.read_csv('properties.csv', sep=';', encoding='utf-8-sig')

load_dotenv()
DATABASE_URL= os.getenv('DATABASE_URL')

engine = create_engine(DATABASE_URL)

# erreur : la liste des images est au format : ['lien1', 'lien2'] et devrait être au format : {'lien1', 'lien2'}


try:
    print(f"Tentative d'import de {len(df)} lignes")
    
    df.to_sql('biens_immobiliers', 
                con=engine, 
                if_exists='append', 
                index=False,
                dtype={'images': ARRAY(String)})
    print('Data imported successfully')
except Exception as e:
    print(f'Error importing data: {e}')
finally:
    engine.dispose()
    print('Database connection closed')