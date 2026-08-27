import React from 'react';
import { Server } from 'lucide-react';

export default function ServerRail({ guildList = [], selectedGuildId, onSelectGuild, onHomeClick }) {
  return (
    <aside className="w-18 bg-discord-serverRail flex-shrink-0 flex flex-col items-center py-3 space-y-2 select-none border-r border-[#232428]">
      
      {/* Home / Anna Manager Brand Icon */}
      <div className="relative group flex items-center justify-center w-full">
        {!selectedGuildId && (
          <div className="absolute left-0 w-1 h-10 bg-white rounded-r transition-all duration-200"></div>
        )}
        <button
          onClick={onHomeClick}
          className="w-12 h-12 rounded-3xl group-hover:rounded-2xl bg-discord-accent hover:bg-discord-hover text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer"
          title="Anna Manager Home"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </button>
      </div>

      <div className="w-8 h-[2px] bg-[#35363c] rounded my-1"></div>

      {/* Guild Server List */}
      <div className="flex-1 w-full space-y-2 overflow-y-auto overflow-x-hidden flex flex-col items-center scrollbar-none">
        {guildList.map((guild) => {
          const isSelected = selectedGuildId === guild.id;
          const guildInitial = guild.name ? guild.name.substring(0, 2).toUpperCase() : 'DS';

          return (
            <div key={guild.id} className="relative group flex items-center justify-center w-full">
              {isSelected && (
                <div className="absolute left-0 w-1 h-10 bg-white rounded-r transition-all duration-200"></div>
              )}
              <button
                onClick={() => onSelectGuild(guild.id)}
                className={`w-12 h-12 rounded-3xl group-hover:rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-200 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'rounded-2xl bg-discord-accent text-white shadow-lg'
                    : 'bg-discord-card text-discord-text hover:bg-discord-accent hover:text-white'
                }`}
                title={guild.name}
              >
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt={guild.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span>{guildInitial}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

    </aside>
  );
}
