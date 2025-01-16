using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.Business.Concrete;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.DataAccess.Concrete.EFEntityFramework;
using MusicApp.Infrastructure.Entities.Data;
using MusicApp.Infrastructure.Middlewares;
using MusicApp.Music.MusicService.Helpers;
using MusicApp.Music.MusicService.Services.Abstraction;
using MusicApp.Music.MusicService.Services.Concrete;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Allow all origins
              .AllowAnyMethod() // Allow all HTTP methods (GET, POST, etc.)
              .AllowAnyHeader(); // Allow all headers
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<FormOptions>(o =>
{
    o.ValueLengthLimit = int.MaxValue;
    o.MultipartBodyLengthLimit = int.MaxValue;
    o.MemoryBufferThreshold = int.MaxValue;
});

// Assigning the Database

builder.Services.AddDbContext<MusicDataBaseContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("ProductionMusic"));
});


// Add Cloudinary

builder.Services.AddSingleton<CloudinaryService>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    return new CloudinaryService(
        configuration["Cloudinary:CloudName"],
        configuration["Cloudinary:ApiKey"],
        configuration["Cloudinary:ApiSecret"]
    );
});

// Add Data Accesses

builder.Services.AddScoped<ICommentDA, EFCommentDA>();
builder.Services.AddScoped<IFavoriteDA, EFFavoriteDA>();
builder.Services.AddScoped<IPlaylistDA, EFPlaylistDA>();
builder.Services.AddScoped<IPlaylistSongDA, EFPlaylistSongDA>();
builder.Services.AddScoped<ISongDA, EFSongDA>();

// Add Services

builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<IPlaylistService, PlaylistService>();
builder.Services.AddScoped<IPlaylistSongService, PlaylistSongService>();
builder.Services.AddScoped<ISongService, SongService>();

// Add Project-In Services

builder.Services.AddScoped<ISongInService, SongInService>();

// Add AutoMapper

builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// Using Custom Middleware

app.UseMiddleware<GlobalErrorHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
