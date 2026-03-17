from services.rag_engine import rag_assistant
import os

# Vérification que le dossier documents existe et n'est pas vide
if not os.path.exists("documents") or not os.listdir("documents"):
    print("❌ Erreur : Le dossier 'documents' est vide ou inexistant. Place tes PDF dedans !")
else:
    print("🚀 Début de l'ingestion des documents...")
    try:
        # rag_assistant.ingest_documents()

        question = "Quelles sont les certifications requises pour l'appel d'offre de construction de terminaux gaziers ou pétroliers à Agadir ?"
        print(f"\n🔍 Question posée : {question}")

        response = rag_assistant.get_response(question)
        print("\n🤖 Réponse du modèle Hugging Face :")
        print("-" * 30)
        print(response['result'])
        print("-" * 30)
    except Exception as e:
        print(f"❌ Une erreur est survenue : {e}")