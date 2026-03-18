import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from unittest.mock import patch

@pytest.mark.asyncio
async def test_auth_flow(override_get_db):
    """
    Test du flux d'authentification spécifique à TenderScope :
    L'inscription renvoie directement un token.
    """
    transport = ASGITransport(app=app)
    
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # --- 1. TEST DE L'INSCRIPTION ---
        user_data = {
            "email": "tester_final@tenderscope.ma",
            "password": "password123",
            "company_name": "Test Lab",
            "sector": "Audit",
            "city": "Casablanca",
            "description": "Validation"
        }
        
        reg_resp = await ac.post("/register", json=user_data)
        
        assert reg_resp.status_code == 200
        response_json = reg_resp.json()
        
        # D'après tes logs, ton /register renvoie directement le token
        assert "access_token" in response_json
        print("\n[SUCCESS] L'inscription a réussi et a généré un token immédiat.")

        # --- 2. TEST DE LA CONNEXION (LOGIN CLASSIQUE) ---
        login_data = {
            "username": user_data["email"],
            "password": user_data["password"]
        }
        
        token_resp = await ac.post("/token", data=login_data)
        
        assert token_resp.status_code == 200
        assert "access_token" in token_resp.json()
        print(f"[SUCCESS] Le login classique fonctionne également pour {user_data['email']}")

@pytest.mark.asyncio
async def test_security_access(override_get_db):
    """
    Vérifie que les accès non autorisés sont bloqués (Erreur 401).
    """
    transport = ASGITransport(app=app)
    
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Accès refusé sans token
        hist_resp = await ac.get("/chat-history")
        assert hist_resp.status_code == 401
        print("\n[SUCCESS] Sécurité confirmée : accès refusé sans token.")

@pytest.mark.asyncio
async def test_get_chat_history_authorized(override_get_db):
    """
    Vérifie qu'un utilisateur connecté peut récupérer son historique.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. On s'inscrit pour avoir un token
        user_data = {"email": "history@test.com", "password": "password123", "company_name": "H", "sector": "S", "city": "C", "description": "D"}
        reg_resp = await ac.post("/register", json=user_data)
        token = reg_resp.json()["access_token"]
        
        # 2. On appelle l'historique avec le token
        headers = {"Authorization": f"Bearer {token}"}
        response = await ac.get("/chat-history", headers=headers)
        
        assert response.status_code == 200
        assert isinstance(response.json(), list) # Doit renvoyer une liste (même vide)
        print("\n[SUCCESS] L'accès à l'historique avec token fonctionne.")


@pytest.mark.asyncio
async def test_match_tender_mocked(override_get_db):
    """
    Teste l'algorithme de matching global.
    Correction : L'URL est /match et non /match/1.
    """
    transport = ASGITransport(app=app)

    # 1. On patche compute_score (importé dans main)
    # 2. On patche aussi la requête Tender pour simuler un appel d'offre en DB
    with patch("main.compute_score") as mocked_calc:
        # compute_score renvoie (score, decision)
        mocked_calc.return_value = (85.5, "GO")

        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            # --- Préparation : Inscription ---
            user_data = {
                "email": "matcher@test.com", 
                "password": "password123", 
                "company_name": "M", 
                "sector": "S", 
                "city": "C", 
                "description": "D"
            }
            reg_resp = await ac.post("/register", json=user_data)
            token = reg_resp.json()["access_token"]

            # --- Action : Appel du matching global ---
            headers = {"Authorization": f"Bearer {token}"}
            # CORRECTION : L'URL est /match d'après ton main.py
            response = await ac.post("/match", headers=headers)

            # --- Vérification ---
            assert response.status_code == 200
            results = response.json()
            assert isinstance(results, list)
            
            # Si ta DB de test a des tenders, on vérifie le contenu
            if len(results) > 0:
                assert "score" in results[0]
                assert results[0]["decision"] == "GO"
            
            print(f"\n[SUCCESS] Matching global testé sur {len(results)} appels d'offres.")



@pytest.mark.asyncio
async def test_ask_tender_mocked(override_get_db):
    """
    Teste l'endpoint /ask-tender en simulant la réponse de l'assistant.
    Correction : On injecte la clé 'result' que main.py attend explicitement.
    """
    transport = ASGITransport(app=app)

    # On simule le retour de l'assistant
    with patch("main.rag_assistant.get_response") as mocked_rag:
        # On renvoie un dictionnaire contenant 'result' pour éviter la KeyError
        mocked_rag.return_value = {"result": "Ceci est une réponse simulée pour le test."}

        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            # 1. Inscription pour obtenir un token frais
            user_data = {
                "email": "tester_rag@tenderscope.ma", 
                "password": "password123", 
                "company_name": "Mock Corp", 
                "sector": "Tech", 
                "city": "Rabat", 
                "description": "Test"
            }
            reg_resp = await ac.post("/register", json=user_data)
            token = reg_resp.json()["access_token"]

            # 2. Appel de l'endpoint protégé avec le Token
            headers = {"Authorization": f"Bearer {token}"}
            payload = {"question": "Quelle est la date limite de cet appel d'offres ?"}
            
            response = await ac.post("/ask-tender", json=payload, headers=headers)

            # Vérifications
            assert response.status_code == 200, f"Erreur API: {response.text}"
            
            # Ici on vérifie 'answer' car ton API transforme probablement 'result' en 'answer' pour le client
            response_data = response.json()
            assert "answer" in response_data or "result" in response_data
            
            print(f"\n[SUCCESS] /ask-tender a répondu : {response_data}")

