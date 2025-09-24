using FreneticUtilities.FreneticToolkit; 
using Microsoft.AspNetCore.Mvc; 
using Newtonsoft.Json.Linq;
using SwarmUI.Accounts; 
using SwarmUI.Core; 
using SwarmUI.Text2Image; 
using SwarmUI.Utils; 
using System.IO; 
using System.Net.Http; 
using System.Text; 

namespace SwarmUI.WebAPI;

[ApiController]
[Route("/API/Util")]
public class UtilAPI : ControllerBase
{
    public static JObject GetAboutUs()
    {
        return new JObject()
        {
            ["version"] = Utilities.Version,
            ["version_id"] = Utilities.VaryID,
            ["version_date"] = Program.CurrentGitDate,
            ["total_backends"] = Program.Backends.T2IBackends.Count
        };
    }
 
    [HttpGet("ListAllT2IParams")] 
    public IActionResult ListAllT2IParams() 
    { 
        return Ok(T2IParamTypes.Types.Values.Select(p => p.ToNet(AuthHelper.GetSession(Request.HttpContext))).ToList()); 
    } 

    [HttpGet("ListThemes")] 
    public IActionResult ListThemes()
    {
        var themes = Program.Web.RegisteredThemes.Values.Select(t => new JObject
        {
            ["id"] = t.ID,
            ["name"] = t.Name,
            ["is_dark"] = t.IsDark,
            ["css_paths"] = JArray.FromObject(t.CSSPaths)
        }).ToList();
        return Ok(JArray.FromObject(themes));
    }

    [HttpGet("Tokenize")]
    public IActionResult Tokenize([FromQuery] string text)
    {
        // Tokenizer not available in this build context. Return empty list for compatibility.
        return Ok(new JArray());
    }

    [HttpPost("CountTokens")]
    public IActionResult CountTokens([FromBody] JObject request)
    {
        // Extract text from request body
        string text = request["text"]?.ToString() ?? "";
        
        // Simple token counting - split by whitespace and common punctuation
        // This is a placeholder implementation since the full tokenizer isn't available
        if (string.IsNullOrEmpty(text))
        {
            return Ok(new { count = 0 });
        }
        
        // Basic token estimation: split by spaces and count
        string[] words = text.Split(new char[] { ' ', '\t', '\n', '\r', ',', '.', '!', '?', ';', ':' }, 
            StringSplitOptions.RemoveEmptyEntries);
        
        // Rough estimation: average 1.3 tokens per word for English text
        int estimatedTokens = (int)(words.Length * 1.3);
        
        return Ok(new { count = estimatedTokens });
    }

    [HttpGet("GetLogs")]
    public IActionResult GetLogs([FromQuery] string level = "Info", [FromQuery] string filter = "", [FromQuery] int limit = 1000)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ViewLogs))
        {
            return Forbid();
        }
        Logs.LogLevel minLevel = Enum.Parse<Logs.LogLevel>(level, true);
        List<string> logLines = Logs.GetRecentLogs(minLevel, filter, limit);
        return Ok(logLines);
    }

    [HttpGet("GetInstallStatus")]
    public IActionResult GetInstallStatus()
    {
        // This endpoint should work without authentication during installation
        return Ok(new { is_installed = Program.ServerSettings.IsInstalled });
    }

    [HttpPost("SubmitLogsToPastebin")]
    public async Task<IActionResult> SubmitLogsToPastebin([FromBody] JObject payload)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ViewLogs))
        {
            return Forbid();
        }
        string logs = payload["logs"].ToString();
        string pastebinUrl = "https://paste.denizenscript.com/New/Swarm";
        using (HttpClient client = new HttpClient())
        {
            var content = new StringContent(logs, Encoding.UTF8, "text/plain");
            var response = await client.PostAsync(pastebinUrl, content);
            response.EnsureSuccessStatusCode();
            string result = await response.Content.ReadAsStringAsync();
            return Ok(new { url = result });
        }
    }

    [HttpGet("GetServerInfo")]
    public IActionResult GetServerInfo()
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ReadServerInfoPanels))
        {
            return Forbid();
        }
        return Ok(new JObject()
        {
            ["local_ip"] = Utilities.GetLocalIPAddress(),
            ["public_url"] = Program.ProxyHandler?.PublicURL,
            ["host"] = Program.ServerSettings.Network.Host
        });
    }
    [HttpGet("About")] 
    public IActionResult About() 
    { 
        return Ok(GetAboutUs()); 
    }

    [HttpGet("ListWildcards")]
    public IActionResult ListWildcards()
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ReadServerInfoPanels))
        {
            return Forbid();
        }
        
        // Return empty wildcard list for now - this would normally scan wildcard files
        return Ok(new JArray());
    }

    [HttpGet("ListPresets")]
    public IActionResult ListPresets()
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }
        
        // Return empty presets list for now - this would normally load user presets
        return Ok(new JArray());
    }
}