import React from 'react';

// Production Discord Markdown & Mention Parser
function renderDiscordMarkdown(text) {
  if (!text || typeof text !== 'string') return null;

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    let isBlockquote = false;
    let processedLine = line;

    if (processedLine.startsWith('> ')) {
      isBlockquote = true;
      processedLine = processedLine.substring(2);
    }

    const parseInline = (str) => {
      const parts = [];
      let remaining = str;
      let key = 0;

      while (remaining && remaining.length > 0) {
        // Tag @everyone / @here
        let match = remaining.match(/^@(everyone|here)/);
        if (match) {
          parts.push(
            <span key={key++} className="bg-[#3c4270]/60 text-[#c9cdfb] px-1 py-0.5 rounded font-medium text-xs border border-[#5865f2]/30 hover:bg-[#5865f2]/40 transition">
              @{match[1]}
            </span>
          );
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Tag User <@123456789>
        match = remaining.match(/^<@!?(\d+)>/);
        if (match) {
          parts.push(
            <span key={key++} className="bg-[#3c4270]/60 text-[#c9cdfb] px-1 py-0.5 rounded font-medium text-xs border border-[#5865f2]/30">
              @{match[1]}
            </span>
          );
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Tag Role <@&123456789>
        match = remaining.match(/^<@&(\d+)>/);
        if (match) {
          parts.push(
            <span key={key++} className="bg-[#3c4270]/60 text-[#c9cdfb] px-1 py-0.5 rounded font-medium text-xs border border-[#5865f2]/30">
              @Role({match[1]})
            </span>
          );
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Tag Channel <#123456789>
        match = remaining.match(/^<#(\d+)>/);
        if (match) {
          parts.push(
            <span key={key++} className="bg-[#3c4270]/60 text-[#c9cdfb] px-1 py-0.5 rounded font-medium text-xs border border-[#5865f2]/30">
              #{match[1]}
            </span>
          );
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Code inline `code`
        match = remaining.match(/^`([^`]+)`/);
        if (match) {
          parts.push(
            <code key={key++} className="bg-[#1e1f22] text-[#e0e1e5] px-1.5 py-0.5 rounded font-mono text-xs border border-[#383a40]">
              {match[1]}
            </code>
          );
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Bold **text**
        match = remaining.match(/^\*\*([^*]+)\*\*/);
        if (match) {
          parts.push(<strong key={key++} className="font-bold text-white">{match[1]}</strong>);
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Italic *text*
        match = remaining.match(/^\*([^*]+)\*/);
        if (match) {
          parts.push(<em key={key++} className="italic text-zinc-300">{match[1]}</em>);
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Strikethrough ~~text~~
        match = remaining.match(/^~~([^~]+)~~/);
        if (match) {
          parts.push(<del key={key++} className="line-through text-zinc-400">{match[1]}</del>);
          remaining = remaining.substring(match[0].length);
          continue;
        }

        // Link [title](url)
        match = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          parts.push(
            <a key={key++} href={match[2]} target="_blank" rel="noreferrer" className="text-[#00a8fc] hover:underline font-medium">
              {match[1]}
            </a>
          );
          remaining = remaining.substring(match[0].length);
          continue;
        }

        const nextSpecial = remaining.search(/[`*~[@<]/);
        if (nextSpecial === -1) {
          parts.push(remaining);
          break;
        } else if (nextSpecial === 0) {
          parts.push(remaining[0]);
          remaining = remaining.substring(1);
        } else {
          parts.push(remaining.substring(0, nextSpecial));
          remaining = remaining.substring(nextSpecial);
        }
      }

      return parts;
    };

    const content = parseInline(processedLine);

    if (isBlockquote) {
      return (
        <blockquote key={lineIdx} className="border-l-[3px] border-[#4e5058] pl-2.5 my-1 text-[#dbdee1]">
          {content}
        </blockquote>
      );
    }

    return (
      <React.Fragment key={lineIdx}>
        {content}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function DiscordEmbedPreview({ embedData }) {
  if (!embedData) return null;

  const {
    content,
    title,
    description,
    url,
    color = '#5865f2',
    imageUrl,
    thumbnailUrl,
    authorName,
    authorIcon,
    footerText,
    footerIcon,
    fields = []
  } = embedData;

  const validFields = Array.isArray(fields) ? fields.filter((f) => f && (f.name || f.value)) : [];
  const showAuthorHeader = !!(authorName && typeof authorName === 'string' && authorName.trim().length > 0);
  const hasEmbedData = !!(title || description || url || imageUrl || thumbnailUrl || showAuthorHeader || footerText || validFields.length > 0);

  return (
    <div className="bg-[#313338] p-4 rounded-md text-[#dbdee1] font-['gg_sans','Noto_Sans',sans-serif] text-sm select-none border border-[#2b2d31] max-w-lg">
      {/* Bot Message Header */}
      <div className="flex items-start space-x-3">
        <img
          src="/logo.jpg"
          alt="Anna Bot Avatar"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 leading-tight mb-1">
            <span className="font-medium text-white text-base hover:underline cursor-pointer">
              Anna Bot
            </span>
            <span className="bg-[#5865f2] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center h-4 uppercase tracking-wider">
              BOT
            </span>
            <span className="text-xs text-[#949ba4] ml-1">
              Hôm nay lúc {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Plain Text Message Content */}
          {content && (
            <div className="text-[#dbdee1] text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
              {renderDiscordMarkdown(content)}
            </div>
          )}

          {/* Embed Card Container */}
          {hasEmbedData && (
            <div className="mt-2 flex max-w-md">
              {/* Color Pill */}
              <div
                className="w-1 rounded-l flex-shrink-0"
                style={{ backgroundColor: color || '#5865f2' }}
              ></div>

              {/* Embed Body */}
              <div className="bg-[#2b2d31] p-3.5 rounded-r flex-1 text-sm space-y-2.5 min-w-0 overflow-hidden border-y border-r border-[#383a40]">
                {/* Author Header */}
                {showAuthorHeader && (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                    {authorIcon && (
                      <img src={authorIcon} alt="" className="w-5 h-5 rounded-full object-cover" />
                    )}
                    <span>{authorName}</span>
                  </div>
                )}

                {/* Title & Thumbnail */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {title && (
                      <div className="font-semibold text-white text-base leading-snug break-words">
                        {url ? (
                          <a href={url} target="_blank" rel="noreferrer" className="text-[#00a8fc] hover:underline">
                            {title}
                          </a>
                        ) : (
                          title
                        )}
                      </div>
                    )}
                    {description && (
                      <div className="text-[#dbdee1] text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {renderDiscordMarkdown(description)}
                      </div>
                    )}
                  </div>

                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail"
                      className="w-16 h-16 rounded object-cover flex-shrink-0 border border-[#383a40]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>

                {/* Fields */}
                {validFields.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-[#383a40]/60">
                    {validFields.map((field, idx) => (
                      <div key={idx} className={field.inline ? "col-span-1" : "col-span-full"}>
                        <div className="text-xs font-semibold text-[#949ba4] mb-0.5">{field.name || "Tên ô"}</div>
                        <div className="text-sm text-[#dbdee1] whitespace-pre-wrap">{renderDiscordMarkdown(field.value || "Nội dung ô")}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Image Banner */}
                {imageUrl && (
                  <div className="mt-2 rounded overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Embed Banner"
                      className="w-full h-auto max-h-72 object-cover rounded border border-[#383a40]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                {/* Footer */}
                {(footerText || footerIcon) && (
                  <div className="flex items-center space-x-2 text-xs text-[#949ba4] pt-1.5 border-t border-[#383a40]/50">
                    {footerIcon && (
                      <img src={footerIcon} alt="" className="w-4 h-4 rounded-full object-cover" />
                    )}
                    <span>{footerText}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
