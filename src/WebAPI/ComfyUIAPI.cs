using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SwarmUI.Accounts;
using SwarmUI.Builtin_ComfyUIBackend;
using SwarmUI.Core;
using SwarmUI.Utils;
using SwarmUI.WebAPI;

namespace SwarmUI.WebAPI;

[ApiController]
[Route("/API/ComfyUI")]
public class ComfyUIAPI : ControllerBase
{
    /// <summary>Save a ComfyUI workflow.</summary>
    [HttpPost("SaveWorkflow")]
    public async Task<IActionResult> SaveWorkflow([FromBody] SaveWorkflowRequest request)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        try
        {
            var session = AuthHelper.GetSession(HttpContext);
            if (session == null)
            {
                return Unauthorized();
            }

            var result = await ComfyUIWebAPI.ComfySaveWorkflow(
                session,
                request.Name,
                request.Workflow,
                request.Prompt,
                request.CustomParams,
                request.ParamValues,
                request.Image,
                request.Description ?? "",
                request.EnableInSimple,
                request.Replace
            );

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>Read a ComfyUI workflow.</summary>
    [HttpGet("ReadWorkflow")]
    public async Task<IActionResult> ReadWorkflow([FromQuery] string name)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        try
        {
            var session = AuthHelper.GetSession(HttpContext);
            if (session == null)
            {
                return Unauthorized();
            }

            var result = await ComfyUIWebAPI.ComfyReadWorkflow(session, name);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>List available ComfyUI workflows.</summary>
    [HttpGet("ListWorkflows")]
    public async Task<IActionResult> ListWorkflows()
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        try
        {
            var session = AuthHelper.GetSession(HttpContext);
            if (session == null)
            {
                return Unauthorized();
            }

            var result = await ComfyUIWebAPI.ComfyListWorkflows(session);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>Delete a ComfyUI workflow.</summary>
    [HttpDelete("DeleteWorkflow")]
    public async Task<IActionResult> DeleteWorkflow([FromQuery] string name)
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        try
        {
            var session = AuthHelper.GetSession(HttpContext);
            if (session == null)
            {
                return Unauthorized();
            }

            var result = await ComfyUIWebAPI.ComfyDeleteWorkflow(session, name);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>Get the generated workflow for current parameters.</summary>
    [HttpGet("GetGeneratedWorkflow")]
    public async Task<IActionResult> GetGeneratedWorkflow()
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        try
        {
            var session = AuthHelper.GetSession(HttpContext);
            if (session == null)
            {
                return Unauthorized();
            }

            var result = await ComfyUIWebAPI.ComfyGetGeneratedWorkflow(session);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>Ensure ComfyUI backend is refreshable.</summary>
    [HttpPost("EnsureRefreshable")]
    public async Task<IActionResult> EnsureRefreshable()
    {
        if (!WebUtil.HasValidLogin(Request.HttpContext))
        {
            return Forbid();
        }

        try
        {
            var session = AuthHelper.GetSession(HttpContext);
            if (session == null)
            {
                return Unauthorized();
            }

            var result = await ComfyUIWebAPI.ComfyEnsureRefreshable(session);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public class SaveWorkflowRequest
{
    public string Name { get; set; } = "";
    public string Workflow { get; set; } = "";
    public string Prompt { get; set; } = "";
    public string CustomParams { get; set; } = "";
    public string ParamValues { get; set; } = "";
    public string Image { get; set; } = "";
    public string? Description { get; set; }
    public bool EnableInSimple { get; set; }
    public string? Replace { get; set; }
}
