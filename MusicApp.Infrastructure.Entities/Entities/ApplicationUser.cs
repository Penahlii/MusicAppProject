﻿using Microsoft.AspNetCore.Identity;
using MusicApp.Infrastructure.Core.Repository.Abstraction;

namespace MusicApp.Infrastructure.Entities.Entities;

public class ApplicationUser : IdentityUser, IEntity
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfilePhotoPath { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
