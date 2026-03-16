from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Modèle performant et gratuit de HuggingFace
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

def compute_score(company_profile, tender_description):
    emb1 = model.encode([company_profile])
    emb2 = model.encode([tender_description])
    score = float(cosine_similarity(emb1, emb2)[0][0])
    score_final = round(score * 100, 2)
    
    # Logique de décision simple
    if score_final >= 70:
        decision = "GO"
    elif score_final >= 40:
        decision = "MAYBE"
    else:
        decision = "NO-GO"
        
    return score_final, decision