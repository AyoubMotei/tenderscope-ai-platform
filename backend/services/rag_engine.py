import os
import time
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings # Import local
from langchain_classic.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate
from langchain_chroma import Chroma

load_dotenv()

# Configuration
DOCS_PATH = "documents/"
VECTOR_DB_PATH = "chroma_db"
HF_TOKEN = os.getenv("HF_TOKEN")


class RAGEngine:
    def __init__(self):
        print("⏳ Chargement du modèle d'embedding local (HuggingFace)...")
        # Solution 3 : Embedding local pour éviter les erreurs 504
        # 'intfloat/e5-base-v2' est excellent pour le multilingue (Français/Anglais)
        self.embeddings = HuggingFaceEmbeddings(model_name="intfloat/e5-base-v2")
        
        # 2. Initialiser le LLM (Hugging Face via OpenAI compatible endpoint)
        self.llm = ChatOpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=HF_TOKEN,
            model="Qwen/Qwen3.5-27B:novita",
            temperature=0.3,
            presence_penalty=1.0,  # Sortez-les de model_kwargs
    frequency_penalty=1.0  # Sortez-les de model_kwargs
        )
        
        self.vector_store = None

    def ingest_documents(self):
        """Indexation locale ultra-rapide et stable"""
        all_docs = []
        if not os.path.exists(DOCS_PATH):
            os.makedirs(DOCS_PATH)
            
        for file in os.listdir(DOCS_PATH):
            if file.endswith(".pdf"):
                print(f"📖 Lecture de {file}...")
                loader = PyPDFLoader(os.path.join(DOCS_PATH, file))
                all_docs.extend(loader.load())
        
        if not all_docs:
            print("❌ Aucun document PDF trouvé.")
            return

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_documents(all_docs)
        
        print(f"🧪 Indexation de {len(chunks)} morceaux en local...")

        # Création de la base vectorielle (Tout se passe sur ton PC ici)
        self.vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=VECTOR_DB_PATH
        )

        print(f"✨ Ingestion terminée avec succès en local !")

    def get_response(self, query: str):
        """Répond à une question via Gemini en utilisant le contexte local"""
        if not self.vector_store:
            self.vector_store = Chroma(
                persist_directory=VECTOR_DB_PATH,
                embedding_function=self.embeddings
            )

        template = """Tu es un assistant expert en appels d'offres. 
        Utilise les extraits de documents suivants pour répondre à la question.
        Si la réponse n'est pas dans le texte, dis que tu ne sais pas.
        
        Contexte : {context}
        Question : {question}
        
        Réponse détaillée en français :"""
        
        prompt = PromptTemplate(template=template, input_variables=["context", "question"])
        
        chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
            chain_type_kwargs={"prompt": prompt}
        )
        
        return chain.invoke(query)

# Instance unique
rag_assistant = RAGEngine()