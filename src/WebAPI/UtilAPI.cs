using FreneticUtilities.FreneticToolkit; 
using Microsoft.AspNetCore.Mvc; 
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
            ["version_id"] = Utilities.VersionID, 
            ["version_date"] = Program.CurrentGitDate, 
            ["total_sessions"] = Stats.TotalSessions, 
            ["total_gens"] = Stats.TotalGens, 
            ["total_errors"] = Stats.TotalErrors, 
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
        return Ok(Program.Web.RegisteredThemes.Values.Select(t => t.ToNet()).ToList()); 
    } 

    [HttpGet("Tokenize")]
    public IActionResult Tokenize([FromQuery] string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return Ok(new JObject());
        }
        CliplikeTokenizer.Token[] tokens = Program.Tokenizer.Encode(text);
        JArray result = new();
        foreach (CliplikeTokenizer.Token token in tokens)
        {
            result.Add(new JObject()
            {
                ["id"] = token.ID,
                ["text"] = Program.Tokenizer.Tokens[token.ID]
            });
        }
        return Ok(result);
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
            ["host"] = Program.ServerSettings.Network.Host,
            ["resource_usage"] = new JObject()
            {
                ["cpu"] = SystemStatusMonitor.CurrentCPUUsage,
                ["ram_total"] = SystemStatusMonitor.TotalRAM,
                ["ram_used"] = SystemStatusMonitor.UsedRAM,
                ["vram_total"] = SystemStatusMonitor.TotalVRAM,
                ["vram_used"] = SystemStatusMonitor.UsedVRAM
            },
            ["connected_users"] = new JArray(Program.Sessions.Sessions.Values.Select(s => s.User.UserID).Distinct().ToList())
        });
    }

    [HttpGet("About")] 
    public IActionResult About() 
    { 
        return Ok(GetAboutUs()); 
    } 
 
    [HttpGet("GetMySessions")]