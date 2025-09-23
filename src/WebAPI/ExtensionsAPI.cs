using Microsoft.AspNetCore.Mvc;
using SwarmUI.Accounts;
using SwarmUI.Core;
using SwarmUI.Utils;

namespace SwarmUI.WebAPI;

[ApiController]
[Route("/API/Extensions")]
public class ExtensionsAPI : ControllerBase
{
    [HttpGet("List")]
    public IActionResult ListExtensions()
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ManageExtensions))
        {
            return Forbid();
        }
        return Ok(new
        {
            installed = Program.Extensions.Extensions.Where(e => !e.IsCore).Select(e => new
            {
                name = e.ExtensionName,
                version = e.Version,
                author = e.ExtensionAuthor,
                description = e.Description,
                url = e.ReadmeURL,
                license = e.License,
                canUpdate = e.CanUpdate
            }),
            available = Program.Extensions.KnownExtensions.Where(e => !Program.Extensions.LoadedExtensionFolders.Contains(e.FolderName) && !e.Tags.Contains("hidden")).Select(e => new
            {
                name = e.Name,
                author = e.Author,
                description = e.Description,
                url = e.URL,
                license = e.License
            })
        });
    }

    [HttpPost("Install")]
    public async Task<IActionResult> InstallExtension([FromQuery] string name)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ManageExtensions))
        {
            return Forbid();
        }
        await Program.Extensions.Install(name);
        return Ok(new { result = "success" });
    }

    [HttpPost("Uninstall")]
    public async Task<IActionResult> UninstallExtension([FromQuery] string name)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ManageExtensions))
        {
            return Forbid();
        }
        await Program.Extensions.Uninstall(name);
        return Ok(new { result = "success" });
    }

    [HttpPost("Update")]
    public async Task<IActionResult> UpdateExtension([FromQuery] string name)
    {
        if (!AuthHelper.GetSession(Request.HttpContext).User.HasPermission(Permissions.ManageExtensions))
        {
            return Forbid();
        }
        await Program.Extensions.Update(name);
        return Ok(new { result = "success" });
    }
}
