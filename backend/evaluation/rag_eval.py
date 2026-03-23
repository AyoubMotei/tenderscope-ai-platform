import os
import pandas as pd
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    Faithfulness,
    AnswerRelevancy,
    ContextPrecision
)
from dotenv import load_dotenv

# Charger les variables d'environnement 
load_dotenv()

def main():
    print("Initialisation du Gold Dataset (sans appel API Tenderscope)...")
    
    # Définition du dictionnaire de données de test en dur (Gold Dataset)
    # Permet une isolation totale et préserve les quotas HuggingFace
    data = {
        "question": [
            "Quelles sont les certifications requises pour l'appel d'offre de construction de terminaux gaziers à Agadir ?",
            "Quel est le montant du budget annuel estimé pour ce marché ?"
        ],
        "answer": [
            "Les certifications requises sont ISO 9001, ISO 14001 et ISO 45001.",
            "Montant : 3 200 000,00 MAD (Trois millions deux cent mille dirhams)."
        ],
        "contexts": [
            ["Le candidat doit justifier des certifications ISO 9001, 14001 et 45001 pour les projets gaziers à Agadir."],
            ["Le budget global annuel pour ce marché de maintenance est fixé à 3,2 MDH."]
        ],
        # context_precision a besoin d'une ground_truth de référence
        "ground_truth": [
            "Le candidat doit avoir les certifications ISO 9001, 14001 et 45001.",
            "Le budget annuel est de 3,2 millions de dirhams."
        ]
    }

    # Création du Dataset compatible système RAGAS
    dataset = Dataset.from_dict(data)

    print("Lancement de l'évaluation des métriques RAGAS : Faithfulness, Answer Relevancy, Context Precision...")
    
    # Exécution de la suite d'évaluation MLOps de RAGAS
    results = evaluate(
        dataset=dataset,
        metrics=[
            Faithfulness(),
            AnswerRelevancy(),
            ContextPrecision()
        ]
    )

    # Conversion des résultats globaux et ligne-par-ligne en DataFrame Pandas pour l'export MLOps
    df_results = results.to_pandas()
    
    # Configuration du chemin d'exportation strict local au script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_csv = os.path.join(current_dir, "rag_metrics_results.csv")
    
    # Export des données d'évaluation 
    df_results.to_csv(output_csv, index=False, encoding="utf-8")
    
    print("\n[SUCCÈS] Évaluation MLOps du RAG terminée avec succès.")
    print(f"Les métriques clés ont été exportées dans le fichier de tracking :\n-> {output_csv}")

if __name__ == "__main__":
    main()
