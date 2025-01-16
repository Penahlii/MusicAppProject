using AutoMapper;
using MusicApp.Infrastructure.Entities.Entities;
using MusicApp.Music.MusicService.DTOs;

namespace MusicApp.Music.MusicService.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Map Song to SongDTO
        CreateMap<Song, SongDTO>().ReverseMap();
    }
}
