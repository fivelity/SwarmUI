using Microsoft.AspNetCore.Http;
using SwarmUI.Accounts;
using SwarmUI.Core;
using SwarmUI.Utils;

namespace SwarmUI.WebAPI;

/// <summary>
/// Lightweight auth helper to adapt MVC controllers to the existing session/user system.
/// Returns a usable <see cref="Session"/> for permission checks and parameter serialization.
/// </summary>
public static class AuthHelper
{
    /// <summary>
    /// Get a session for the current HTTP context.
    /// Prefer an existing tracked session if available; otherwise create a temporary in-memory session.
    /// </summary>
    public static Session GetSession(HttpContext context)
    {
        // If a session header is provided, try to use an existing session
        if (context.Request.Headers.TryGetValue("X-SWARM-SESSION_ID", out var sessId)
            && Program.Sessions.TryGetSession(sessId, out Session existing))
        {
            return existing;
        }
        // Otherwise, resolve the user for this request
        User user = WebServer.GetUserFor(context);
        if (user is null)
        {
            // Fallback to a minimal guest user if completely unauthenticated
            user = Program.Sessions.GetUser(SessionHandler.LocalUserID);
        }
        // Build a lightweight temporary session object; do not persist it to DB.
        return new Session
        {
            ID = $"temp_{Utilities.SecureRandomHex(16)}",
            User = user,
            OriginAddress = WebUtil.GetIPString(context)
        };
    }
}
