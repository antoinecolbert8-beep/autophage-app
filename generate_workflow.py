import json
import uuid

# Helper to create a node structure
def create_node(id_num, name, type_name, position, parameters=None):
    if parameters is None:
        parameters = {}
    
    # Map simplistic descriptions to actual n8n node types
    n8n_type = "n8n-nodes-base.noOp" # Default/Placeholder
    
    if "Webhook" in type_name or "Déclencheur" in name or "Gateway" in name:
        n8n_type = "n8n-nodes-base.webhook"
    elif "HTTP" in type_name or "API" in name or "Request" in type_name or "Uploader" in name or "Livreur" in name or "Moniteur" in name:
        n8n_type = "n8n-nodes-base.httpRequest"
    elif "Code" in type_name or "Javascript" in type_name or "Calcul" in name or "Script" in type_name or "Scénariste" in name or "Assembleur" in name:
        n8n_type = "n8n-nodes-base.code"
    elif "Switch" in type_name or "Routeur" in name or "Aiguillage" in name or "Filtre" in name or "Sélecteur" in name:
        n8n_type = "n8n-nodes-base.switch"
    elif "Set" in type_name or "Variable" in name or "Contexte" in name or "Injecteur" in name:
        n8n_type = "n8n-nodes-base.set"
    elif "OpenAI" in type_name or "LLM" in name or "Générateur" in name or "Analyste" in name or "Rédacteur" in name or "Critique" in name or "Classificateur" in name:
        n8n_type = "n8n-nodes-base.openAi"
    elif "Postgres" in type_name or "Database" in name or "Base" in name or "Historien" in name:
        n8n_type = "n8n-nodes-base.postgres"
    elif "Pinecone" in type_name or "Vectorielle" in name or "Indexeur" in name:
        n8n_type = "n8n-nodes-base.pinecone"
    elif "Google Sheets" in type_name:
        n8n_type = "n8n-nodes-base.googleSheets"
    elif "S3" in type_name or "Stockage" in name:
        n8n_type = "n8n-nodes-base.awsS3"
    elif "Merge" in type_name or "Agrégateur" in name:
        n8n_type = "n8n-nodes-base.merge"
    elif "Schedule" in type_name or "Veilleur" in name or "Cron" in type_name or "Planificateur" in name:
         n8n_type = "n8n-nodes-base.scheduleTrigger"
    elif "Wait" in type_name or "Interface" in name:
        n8n_type = "n8n-nodes-base.wait"
    elif "Error" in type_name or "Crash" in name:
        n8n_type = "n8n-nodes-base.errorTrigger"

    
    return {
        "parameters": parameters,
        "id": str(uuid.uuid4()),
        "name": f"Node {id_num}: {name}",
        "type": n8n_type,
        "typeVersion": 1,
        "position": position
    }

nodes = []
connections = {}

# --- CLUSTER A: INGESTION & ANALYSE (Nodes 1-25) ---
x = 0
y = 0
nodes.append(create_node(1, "Le Veilleur Temporel", "Schedule Trigger", [x, y]))
x += 250
nodes.append(create_node(2, "L'Injecteur de Contexte", "Set", [x, y]))
x += 250
nodes.append(create_node(3, "Le Radar de Tendances", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(4, "Le Filtre de Pertinence", "Switch", [x, y]))
x += 250
nodes.append(create_node(5, "Le Déclencheur d'Erreur", "Error Trigger", [x, y+300])) 
nodes.append(create_node(6, "Le Planificateur de Tâches", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(7, "L'Analyste de Mots-Clés", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(8, "Le Scraper de Contenu", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(9, "Le Nettoyeur de Texte", "Code", [x, y]))
x += 250
nodes.append(create_node(10, "Le Détecteur de Langue", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(11, "Le Traducteur Automatique", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(12, "Le Classificateur de Sentiment", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(13, "L'Extracteur d'Entités", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(14, "Le Vérificateur de Fake News", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(15, "Le Scoreur de Viralité", "Code", [x, y]))
x += 250
nodes.append(create_node(16, "Le Filtre de Doublons", "Code", [x, y]))
x += 250
nodes.append(create_node(17, "Le Résumeur de Contenu", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(18, "L'Agrégateur de Sources", "Merge", [x, y]))
x += 250
nodes.append(create_node(19, "Le Monitor Twitter", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(20, "Le Monitor Reddit", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(21, "Le Monitor YouTube", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(22, "Le Monitor News", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(23, "La Passerelle de Stockage", "S3", [x, y]))
x += 250
nodes.append(create_node(24, "L'Indexeur de Recherche", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(25, "Le Dispatcheur de Cluster", "Switch", [x, y]))
x += 300 

# --- CLUSTER B: MEMORY & LEARNING (Nodes 26-50) ---
y += 300
x = 0
nodes.append(create_node(26, "La Base Vectorielle", "Pinecone", [x, y]))
x += 250
nodes.append(create_node(27, "L'Embedder Sémantique", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(28, "Le Calculateur de Similarité", "Code", [x, y]))
x += 250
nodes.append(create_node(29, "Le Récupérateur de Contexte", "Pinecone", [x, y]))
x += 250
nodes.append(create_node(30, "L'Historien des Faits", "Postgres", [x, y]))
x += 250
nodes.append(create_node(31, "Le Profiler d'Audience", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(32, "Le Générateur de Persona", "Set", [x, y]))
x += 250
nodes.append(create_node(33, "Le Détecteur de Tendance Longue", "Code", [x, y]))
x += 250
nodes.append(create_node(34, "Le Gestionnaire de 'Few-Shot'", "Code", [x, y]))
x += 250
nodes.append(create_node(35, "L'Injecteur de Style", "Set", [x, y]))
x += 250
nodes.append(create_node(36, "Le Garde-Fou Éthique (Mémoire)", "Code", [x, y]))
x += 250
nodes.append(create_node(37, "L'Optimiseur de Prompt (Mémoire)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(38, "Le Nettoyeur de Vecteurs", "Pinecone", [x, y]))
x += 250
nodes.append(create_node(39, "Le Compresseur d'Information", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(40, "Le Système de Rétention", "Cron", [x, y]))
x += 250
nodes.append(create_node(41, "L'Analyste de Feedback", "Code", [x, y]))
x += 250
nodes.append(create_node(42, "Le Calculateur de Score de Qualité", "Code", [x, y]))
x += 250
nodes.append(create_node(43, "Le Détecteur d'Hallucination", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(44, "Le Synchronisateur de Base de Données", "Postgres", [x, y]))
x += 250
nodes.append(create_node(45, "L'Exportateur de Dataset", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(46, "L'Entraîneur de Modèle (Fine-Tuner)", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(47, "Le Comparateur A/B", "Code", [x, y]))
x += 250
nodes.append(create_node(48, "Le Versionneur de Mémoire", "Code", [x, y]))
x += 250
nodes.append(create_node(49, "La Sauvegarde Froide (Cold Storage)", "S3", [x, y]))
x += 250
nodes.append(create_node(50, "Le Pont vers la Création", "Switch", [x, y]))
x += 300

# --- CLUSTER C: CREATIVE FORGE (Nodes 51-75) ---
y += 300
x = 0
nodes.append(create_node(51, "Le Générateur de Concepts", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(52, "Le Critique d'Idées (Interne)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(53, "Le Sélecteur de Sujet", "Switch", [x, y]))
x += 250
nodes.append(create_node(54, "Le Définisseur d'Angle", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(55, "Le Chercheur de Références", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(56, "Le Structurateur de Plan", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(57, "Le Rédacteur de Titres (Clickbait)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(58, "Le Rédacteur d'Intro (Hook)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(59, "Le Rédacteur de Corps (Main Content)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(60, "Le Rédacteur de Conclusion (CTA)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(61, "L'Assembleur de Script V1", "Code", [x, y]))
x += 250
nodes.append(create_node(62, "Le Polisseur de Style", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(63, "Le Simplificateur (ELI5)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(64, "Le Vérificateur de Faits (Script)", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(65, "L'Injecteur d'Humour", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(66, "Le Générateur de Manifeste Visuel", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(67, "Le Découpeur de Scènes", "Code", [x, y]))
x += 250
nodes.append(create_node(68, "Le Calculateur de Timing", "Code", [x, y]))
x += 250
nodes.append(create_node(69, "Le Générateur de Prompts Image", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(70, "Le Générateur de Prompts Vidéo", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(71, "Le Générateur de Prompts Audio", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(72, "Le Validateur de Cohérence", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(73, "Le Traducteur de Script", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(74, "Le Formatteur JSON Final", "Code", [x, y]))
x += 250
nodes.append(create_node(75, "Le Lanceur de Production", "HTTP Request", [x, y]))
x += 300

# --- CLUSTER D: PRODUCTION STUDIO (Nodes 76-115) ---
y += 300
x = 0
nodes.append(create_node(76, "Le Scénariste Technique", "Code", [x, y]))
x += 250
nodes.append(create_node(77, "Le Calculateur de Durée", "Code", [x, y]))
x += 250
nodes.append(create_node(78, "L'Optimiseur de Prompt Visuel", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(79, "Le Sélecteur de Voix", "Code", [x, y]))
x += 250
nodes.append(create_node(80, "Le Routeur de Médias", "Switch", [x, y]))
x += 250
nodes.append(create_node(81, "Le Générateur Audio", "HTTP Request", [x, y-100]))
nodes.append(create_node(82, "Le Générateur Image", "HTTP Request", [x, y+100]))
x += 250
nodes.append(create_node(83, "L'Animateur Vidéo", "HTTP Request", [x, y+100]))
x += 250
nodes.append(create_node(84, "Le Synchronisateur Labial", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(85, "Le Timestamper", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(86, "L'Assembleur de Timeline", "Code", [x, y]))
x += 250
nodes.append(create_node(87, "Le Moteur de Rendu", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(88, "Le Récupérateur de Rendu", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(89, "L'Optimiseur de Méta-Données", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(90, "Le Calculateur de Coût Unitaire", "Code", [x, y]))
x += 250
nodes.append(create_node(91, "Le Gestionnaire de Crash", "Error Trigger", [x, y]))
x += 250
nodes.append(create_node(92, "L'Interface Humaine", "Wait", [x, y])) 
x += 250
nodes.append(create_node(93, "Le Repurposeur de Contenu", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(94, "L'Indexeur de Production", "Pinecone", [x, y]))
x += 250
nodes.append(create_node(95, "Le Vérificateur de Solde API", "Code", [x, y]))
x += 250
nodes.append(create_node(96, "Le Planificateur de Publication", "Schedule Trigger", [x, y]))
x += 250
nodes.append(create_node(97, "Le Dashboard Push", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(98, "Le Versionneur de Configuration", "Code", [x, y]))
x += 250
nodes.append(create_node(99, "L'Optimiseur Auto-Évolutif", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(100, "Le Master Controller", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(101, "Gateway Client", "Webhook", [x, y]))
x += 250
nodes.append(create_node(102, "Auto-Scaler Infrastructure", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(103, "Filtre Anti-Prompt-Injection", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(104, "Queue Manager", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(105, "Moteur de Doublage IA", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(106, "Synchronisateur Temporel", "Code", [x, y]))
x += 250
nodes.append(create_node(107, "Color Grade & Upscale", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(108, "Générateur Audio Foley", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(109, "Générateur Thumbnail", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(110, "Livreur Last-Mile", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(111, "Gestionnaire Cycle de Vie", "Cron", [x, y]))
x += 250
nodes.append(create_node(112, "Moniteur LTV", "Code", [x, y]))
x += 250
nodes.append(create_node(113, "Déployeur GitOps", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(114, "Moteur Rendu Atomique", "Code", [x, y]))
x += 250
nodes.append(create_node(115, "Synchronisateur Sortie Linéaire", "Code", [x, y]))
x += 300

# --- CLUSTER E: THE ORACLE (Nodes 116-145) ---
y += 300
x = 0
nodes.append(create_node(116, "Le Premier Juré (Scrolleur)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(117, "Le Contre-Poids Cognitif", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(118, "Le Résonateur Émotionnel", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(119, "Le Provocateur (Hater)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(120, "Le Juge Final (Masse)", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(121, "Le Juge Suprême (Logic)", "Switch", [x, y]))
x += 250
nodes.append(create_node(122, "Le Routeur de Succès", "Switch", [x, y]))
x += 250
nodes.append(create_node(123, "L'Initiateur de la Boucle Corrective", "Code", [x, y]))
x += 250
nodes.append(create_node(124, "Le Gardien de la Sécurité Anti-Boucle", "Switch", [x, y]))
x += 250
nodes.append(create_node(125, "Le Préparateur d'Instructions", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(126, "Le Premier Alchimiste", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(127, "Le Spécialiste du Hook", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(128, "Le Spécialiste du Rythme", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(129, "Le Simplificateur Lexical", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(130, "Le Convertisseur CTA", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(131, "Le Censeur de Sûreté", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(132, "Le Stratège SEO", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(133, "Le Façonneur d'Identité", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(134, "Le Directeur Artistique Textuel", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(135, "Le Finaliseur de Mutation", "Code", [x, y]))
x += 250
nodes.append(create_node(136, "L'Entrée du Nexus de Réinjection", "Switch", [x, y]))
x += 250
nodes.append(create_node(137, "Le Valideur de Payload", "Code", [x, y]))
x += 250
nodes.append(create_node(138, "Le Connecteur de Webhook", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(139, "L'Auditeur de Transition", "Postgres", [x, y]))
x += 250
nodes.append(create_node(140, "Le Libérateur de Ressources", "Code", [x, y]))
x += 250
nodes.append(create_node(141, "L'Archiviste de l'Échec", "S3", [x, y]))
x += 250
nodes.append(create_node(142, "La Sentinelle de Dérive", "Code", [x, y]))
x += 250
nodes.append(create_node(143, "L'Estimateur de Coût Prédictif", "Code", [x, y]))
x += 250
nodes.append(create_node(144, "Le Gestionnaire de Priorité", "Code", [x, y]))
x += 250
nodes.append(create_node(145, "Le Déclencheur de Synchronisation", "Code", [x, y]))
x += 300

# --- CLUSTER F: DISTRIBUTION & ANALYTICS (Nodes 146-170) ---
y += 300
x = 0
nodes.append(create_node(146, "Le Chef de Gare de la Distribution", "Switch", [x, y]))
x += 250
nodes.append(create_node(147, "L'Émissaire TikTok", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(148, "L'Émissaire YouTube", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(149, "L'Émissaire Instagram", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(150, "L'Émissaire Twitter", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(151, "L'Émissaire LinkedIn", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(152, "L'Émissaire Discord/Slack", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(153, "L'Émissaire Web/Blog", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(154, "L'Émissaire Newsletter", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(155, "L'Émissaire Podcast", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(156, "L'Initiateur de la Moisson", "Cron", [x, y]))
x += 250
nodes.append(create_node(157, "Le Collecteur TikTok", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(158, "Le Collecteur YouTube", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(159, "Le Collecteur Instagram", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(160, "Le Moissonneur Final (Lake)", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(161, "Le Comparateur de Réalité", "Code", [x, y]))
x += 250
nodes.append(create_node(162, "Le Décomposeur Vectoriel", "Pinecone", [x, y]))
x += 250
nodes.append(create_node(163, "Le Classificateur de Tendances", "Code", [x, y]))
x += 250
nodes.append(create_node(164, "Le Générateur d'Hypothèses", "OpenAI", [x, y]))
x += 250
nodes.append(create_node(165, "Le Superviseur de Mutation", "Code", [x, y]))
x += 250
nodes.append(create_node(166, "Le Modulateur de Poids", "Code", [x, y]))
x += 250
nodes.append(create_node(167, "Le Simulateur de Sécurité", "Code", [x, y]))
x += 250
nodes.append(create_node(168, "Le Greffier Historique", "Postgres", [x, y]))
x += 250
nodes.append(create_node(169, "Le Héraut de l'Évolution", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(170, "Le Chirurgien Stratégique", "Pinecone", [x, y]))
x += 300

# --- CLUSTER G: MAINTENANCE (Nodes 171-185) ---
y += 300
x = 0
nodes.append(create_node(171, "Le Système Immunitaire", "Code", [x, y]))
x += 250
nodes.append(create_node(172, "Le Diagnostiqueur de Crise", "Code", [x, y]))
x += 250
nodes.append(create_node(173, "Le Réparateur Ciblé", "Switch", [x, y]))
x += 250
nodes.append(create_node(174, "Le Vérificateur de Cohérence", "Code", [x, y]))
x += 250
nodes.append(create_node(175, "La Valve de Réinjection", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(176, "L'Hygiéniste Numérique", "Cron", [x, y]))
x += 250
nodes.append(create_node(177, "L'Exécuteur de Suppression", "S3", [x, y]))
x += 250
nodes.append(create_node(178, "L'Archiviste Intelligent", "Postgres", [x, y]))
x += 250
nodes.append(create_node(179, "L'Auditeur de Conformité", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(180, "Le Signal de Fin de Cycle", "Code", [x, y]))
x += 250
nodes.append(create_node(181, "L'Œil du Maître (Logger)", "Google Sheets", [x, y]))
x += 250
nodes.append(create_node(182, "Le Dessinateur de Tendances", "Code", [x, y]))
x += 250
nodes.append(create_node(183, "L'Officier de Communication", "HTTP Request", [x, y]))
x += 250
nodes.append(create_node(184, "Le Contrôleur de Gestion", "Code", [x, y]))
x += 250
nodes.append(create_node(185, "La Salle des Machines", "HTTP Request", [x, y]))


# Generate Linear Connections (Node i -> Node i+1)
# This is a simplification. Real workflow has branches.
for i in range(len(nodes) - 1):
    source_node = nodes[i]
    target_node = nodes[i+1]
    
    source_name = source_node["name"]
    target_name = target_node["name"]
    
    connections[source_name] = {
        "main": [
            [
                {
                    "node": target_name,
                    "type": "main",
                    "index": 0
                }
            ]
        ]
    }

workflow = {
    "nodes": nodes,
    "connections": connections
}

print(json.dumps(workflow, indent=2))
