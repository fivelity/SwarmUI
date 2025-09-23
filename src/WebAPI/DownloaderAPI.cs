using FreneticUtilities.FreneticToolkit;
using Microsoft.AspNetCore.Mvc;
using SwarmUI.Accounts;
using SwarmUI.Core;
using SwarmUI.Utils;
using System.Net.Http;

namespace SwarmUI.WebAPI;

[ApiController]
[Route("/API/Downloader")]
public class DownloaderAPI : ControllerBase
{
    private static readonly HttpClient CivitaiProxyClient = new();

    [HttpGet("ProxyCivitai/{*path}")]
    public async Task<IActionResult> ProxyCivitai(string path)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.DownloadModels))
        {
            return Forbid();
        }
        HttpResponseMessage response = await CivitaiProxyClient.GetAsync($"https://civitai.com/api/{path}");
        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode);
        }
        return Content(await response.Content.ReadAsStringAsync(), "application/json");
    }

    // TODO: This is a simplified placeholder for the complex logic in the original project.
    // A full implementation would require parsing Civitai/HuggingFace pages.
    public static async Task<JObject> GetURLMetadata(string url)
    {
        if (url.Contains("civitai.com"))
        {
            return new JObject()
            {
                ["name"] = "Example Civitai Model",
                ["type"] = "LoRA",
                ["description"] = "An example description from Civitai.",
                ["images"] = new JArray()
            };
        }
        return null;
    }

    [HttpGet("GetURLMetadata")]
    public async Task<IActionResult> WebGetURLMetadata([FromQuery] string url)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.DownloadModels))
        {
            return Forbid();
        }
        JObject result = await GetURLMetadata(url);
        if (result is null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [HttpPost("StartDownload")]
    public async Task<IActionResult> StartDownload([FromQuery] string url, [FromQuery] string model_type, [FromQuery] string save_as)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.DownloadModels))
        {
            return Forbid();
        }
        // In a real implementation, this would trigger the actual download process
        // and return a download ID or similar.
        Logs.Info($"Starting download: URL={url}, Type={model_type}, SaveAs={save_as}");
        // Simulate a download ID
        string downloadId = Guid.NewGuid().ToString();
        // Store download status in a static dictionary for polling (simplified)
        DownloadStatusTracker.Statuses[downloadId] = new DownloadStatus { Id = downloadId, Progress = 0, Status = "Pending" };
        _ = Task.Run(async () => {
            // Simulate download progress
            for (int i = 0; i <= 100; i += 10)
            {
                await Task.Delay(500);
                DownloadStatusTracker.Statuses[downloadId].Progress = i;
                DownloadStatusTracker.Statuses[downloadId].Status = i == 100 ? "Completed" : "Downloading";
            }
        });
        return Ok(new { download_id = downloadId });
    }

    [HttpGet("GetDownloadStatus")]
    public IActionResult GetDownloadStatus([FromQuery] string download_id)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.DownloadModels))
        {
            return Forbid();
        }
        if (DownloadStatusTracker.Statuses.TryGetValue(download_id, out DownloadStatus status))
        {
            return Ok(status);
        }
        return NotFound();
    }
}

public static class DownloadStatusTracker
{
    public static ConcurrentDictionary<string, DownloadStatus> Statuses = new ConcurrentDictionary<string, DownloadStatus>();
}

public class DownloadStatus
{
    public string Id { get; set; }
    public int Progress { get; set; }
    public string Status { get; set; }
}
