using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SwarmUI.Accounts;
using SwarmUI.Core;
using SwarmUI.Utils;

namespace SwarmUI.WebAPI;

[ApiController]
[Route("/API/Backend")]
public class BackendControllerAPI : ControllerBase
{
    [HttpGet("ListBackends")]
    public async Task<IActionResult> ListBackends([FromQuery] bool nonreal = false, [FromQuery] bool full_data = false)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        var session = WebServer.GetUserFor(Request.HttpContext);
        if (!session.HasPermission(Permissions.ViewBackendsList))
        {
            return Forbid();
        }

        // Call the existing BackendAPI method
        var result = await BackendAPI.ListBackends(new Session() { User = session }, nonreal, full_data);
        return Ok(result);
    }

    [HttpGet("ListBackendTypes")]
    public async Task<IActionResult> ListBackendTypes()
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        var session = WebServer.GetUserFor(Request.HttpContext);
        if (!session.HasPermission(Permissions.ViewBackendsList))
        {
            return Forbid();
        }

        // Call the existing BackendAPI method
        var result = await BackendAPI.ListBackendTypes(new Session() { User = session });
        return Ok(result);
    }

    [HttpPost("AddNewBackend")]
    public async Task<IActionResult> AddNewBackend([FromBody] JObject request)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        var session = WebServer.GetUserFor(Request.HttpContext);
        if (!session.HasPermission(Permissions.AddRemoveBackends))
        {
            return Forbid();
        }

        string typeId = request["type_id"]?.ToString();
        if (string.IsNullOrEmpty(typeId))
        {
            return BadRequest(new { error = "Missing type_id" });
        }

        // Call the existing BackendAPI method
        var result = await BackendAPI.AddNewBackend(new Session() { User = session }, typeId);
        return Ok(result);
    }

    [HttpPost("DeleteBackend")]
    public async Task<IActionResult> DeleteBackend([FromBody] JObject request)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        var session = WebServer.GetUserFor(Request.HttpContext);
        if (!session.HasPermission(Permissions.AddRemoveBackends))
        {
            return Forbid();
        }

        if (!request.TryGetValue("backend_id", out var backendIdToken) || !int.TryParse(backendIdToken.ToString(), out int backendId))
        {
            return BadRequest(new { error = "Missing or invalid backend_id" });
        }

        // Call the existing BackendAPI method
        var result = await BackendAPI.DeleteBackend(new Session() { User = session }, backendId);
        return Ok(result);
    }

    [HttpPost("ToggleBackend")]
    public async Task<IActionResult> ToggleBackend([FromBody] JObject request)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        var session = WebServer.GetUserFor(Request.HttpContext);
        if (!session.HasPermission(Permissions.ToggleBackends))
        {
            return Forbid();
        }

        if (!request.TryGetValue("backend_id", out var backendIdToken) || !int.TryParse(backendIdToken.ToString(), out int backendId))
        {
            return BadRequest(new { error = "Missing or invalid backend_id" });
        }

        if (!request.TryGetValue("enabled", out var enabledToken) || !bool.TryParse(enabledToken.ToString(), out bool enabled))
        {
            return BadRequest(new { error = "Missing or invalid enabled" });
        }

        // Call the existing BackendAPI method
        var result = await BackendAPI.ToggleBackend(new Session() { User = session }, backendId, enabled);
        return Ok(result);
    }

    [HttpPost("RestartBackends")]
    public async Task<IActionResult> RestartBackends([FromBody] JObject request)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        var session = WebServer.GetUserFor(Request.HttpContext);
        if (!session.HasPermission(Permissions.RestartBackends))
        {
            return Forbid();
        }

        string backend = request["backend"]?.ToString() ?? "all";

        // Call the existing BackendAPI method
        var result = await BackendAPI.RestartBackends(new Session() { User = session }, backend);
        return Ok(result);
    }
}
