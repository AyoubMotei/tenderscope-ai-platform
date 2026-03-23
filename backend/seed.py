import json
from database import SessionLocal, engine
import models

# Créer les tables si elles n'existent pas
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    # Vérifier si on a déjà des données pour éviter les doublons
    if db.query(models.Tender).count() == 0:
        with open("fake_data.json", encoding="utf-8") as f:
            tenders = json.load(f)
            for t in tenders:
                new_tender = models.Tender(
                    title=t['title'],
                    organization=t['organization'],
                    city=t['city'],
                    domain=t['domain'],
                    description=t['description']
                )
                db.add(new_tender)
        db.commit()
        print("Base de données initialisée avec les appels d'offres !")
    else:
        print("La base contient déjà des données.")
    db.close()

if __name__ == "__main__":
    seed_data()