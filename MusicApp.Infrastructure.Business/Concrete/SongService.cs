﻿using MusicApp.Infrastructure.Business.Abstraction;
using MusicApp.Infrastructure.DataAccess.Abstraction;
using MusicApp.Infrastructure.Entities.Entities;
using System.Linq.Expressions;

namespace MusicApp.Infrastructure.Business.Concrete;

public class SongService : ISongService
{
    private readonly ISongDA _songDA;

    public SongService(ISongDA songDA)
    {
        _songDA = songDA;
    }

    public async Task AddAsync(Song song)
    {
        await _songDA.Add(song);
    }

    public async Task DeleteAsync(Song song)
    {
        await _songDA.Delete(song);
    }

    public async Task<List<Song>> GetAllAsync(Expression<Func<Song, bool>> filter = null)
    {
        return await _songDA.GetList(filter);
    }

    public async Task<Song> GetByIdAsync(int id)
    {
        return await _songDA.Get(s => s.Id == id); 
    }

    public async Task UpdateAsync(Song song)
    {
        await _songDA.Update(song);
    }
}
