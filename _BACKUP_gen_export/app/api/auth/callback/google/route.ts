import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/google`;

/**
 * GET /api/auth/callback/google
 * Callback après autorisation Google OAuth
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Erreur d'authentification</title>
          <style>
            body { font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto; }
            .error { background: #fee; border: 2px solid #c00; padding: 20px; border-radius: 8px; }
            h1 { color: #c00; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>❌ Erreur d'authentification</h1>
            <p><strong>Erreur:</strong> ${error}</p>
            <p>L'utilisateur a refusé l'accès ou une erreur s'est produite.</p>
            <a href="/">← Retour à l'accueil</a>
          </div>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Code d'autorisation manquant" },
      { status: 400 }
    );
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Credentials YouTube manquants dans .env" },
      { status: 500 }
    );
  }

  try {
    // Échanger le code contre un access token et refresh token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(JSON.stringify(errorData));
    }

    const tokens = await tokenResponse.json();

    if (!tokens.refresh_token) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Avertissement</title>
            <style>
              body { font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto; }
              .warning { background: #ffc; border: 2px solid #f90; padding: 20px; border-radius: 8px; }
              h1 { color: #f90; }
              code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <div class="warning">
              <h1>⚠️ Refresh Token manquant</h1>
              <p>Le refresh token n'a pas été fourni par Google.</p>
              <p><strong>Solution:</strong></p>
              <ol>
                <li>Allez sur <a href="https://myaccount.google.com/permissions" target="_blank">Google Permissions</a></li>
                <li>Révoquez l'accès à votre application</li>
                <li>Réessayez l'autorisation</li>
              </ol>
              <a href="/api/auth/youtube">🔄 Réessayer</a>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Succès ! Afficher le refresh token
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>✅ Authentification réussie</title>
          <style>
            body { 
              font-family: system-ui; 
              padding: 40px; 
              max-width: 800px; 
              margin: 0 auto;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .success { 
              background: #d4edda; 
              border: 2px solid #28a745; 
              padding: 20px; 
              border-radius: 8px; 
              margin-bottom: 30px;
            }
            h1 { color: #28a745; margin-top: 0; }
            h2 { color: #333; margin-top: 30px; }
            .token-box {
              background: #f8f9fa;
              border: 2px solid #dee2e6;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              word-break: break-all;
              font-family: monospace;
              font-size: 14px;
            }
            .copy-btn {
              background: #667eea;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 10px;
            }
            .copy-btn:hover { background: #5568d3; }
            .instructions {
              background: #e7f3ff;
              border-left: 4px solid #2196F3;
              padding: 15px;
              margin-top: 20px;
            }
            code { 
              background: #f5f5f5; 
              padding: 2px 6px; 
              border-radius: 3px;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">
              <h1>🎉 Authentification YouTube réussie !</h1>
              <p>Votre application peut maintenant uploader des vidéos sur YouTube.</p>
            </div>

            <h2>🔑 Votre Refresh Token</h2>
            <p>Copiez ce token et ajoutez-le dans votre fichier <code>.env</code> :</p>
            
            <div class="token-box" id="refreshToken">
YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}
            </div>
            
            <button class="copy-btn" onclick="copyToken()">
              📋 Copier le token
            </button>

            <div class="instructions">
              <h3>📝 Prochaines étapes :</h3>
              <ol>
                <li>Ajoutez le token ci-dessus dans votre fichier <code>.env</code> ou <code>.env.local</code></li>
                <li>Redémarrez votre serveur Next.js</li>
                <li>Testez l'upload avec : <code>npx tsx scripts/generate-youtube-short.ts</code></li>
              </ol>
            </div>

            <h3>📊 Informations complémentaires :</h3>
            <ul>
              <li><strong>Access Token :</strong> ${tokens.access_token.substring(0, 30)}...</li>
              <li><strong>Expire dans :</strong> ${tokens.expires_in} secondes</li>
              <li><strong>Scopes :</strong> ${tokens.scope || 'N/A'}</li>
            </ul>

            <p style="margin-top: 40px; text-align: center;">
              <a href="/" style="color: #667eea; text-decoration: none; font-weight: bold;">
                ← Retour au dashboard
              </a>
            </p>
          </div>

          <script>
            function copyToken() {
              const tokenText = document.getElementById('refreshToken').textContent.trim();
              navigator.clipboard.writeText(tokenText).then(() => {
                const btn = document.querySelector('.copy-btn');
                btn.textContent = '✅ Copié !';
                setTimeout(() => {
                  btn.textContent = '📋 Copier le token';
                }, 2000);
              });
            }
          </script>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Erreur lors de l'échange du code:", error);
    
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Erreur</title>
          <style>
            body { font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto; }
            .error { background: #fee; border: 2px solid #c00; padding: 20px; border-radius: 8px; }
            h1 { color: #c00; }
            pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>❌ Erreur lors de l'authentification</h1>
            <p><strong>Message:</strong> ${error.message}</p>
            <pre>${JSON.stringify(error, null, 2)}</pre>
            <a href="/api/auth/youtube">🔄 Réessayer</a>
          </div>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}


