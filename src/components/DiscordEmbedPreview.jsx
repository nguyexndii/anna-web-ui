import React from 'react';

export default function DiscordEmbedPreview({ embedData }) {
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

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-[#313338] p-4 rounded-lg text-[#dbdee1] font-['gg_sans','Noto_Sans',sans-serif] text-sm select-none border border-[#2b2d31]">
      {/* Bot Message Header */}
      <div className="flex items-start space-x-4 mb-1">
        <img
          src={authorIcon || "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"}
          alt="Bot Avatar"
          className="w-10 h-10 rounded-full flex-shrink-0 cursor-pointer hover:opacity-90 transition"
          onError={(e) => {
            e.target.src = "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 leading-tight mb-1">
            <span className="font-semibold text-white text-base hover:underline cursor-pointer">
              {authorName || "Anna Bot"}
            </span>
            <span className="bg-[#5865f2] text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center h-4 uppercase tracking-wider">
              BOT
            </span>
            <span className="text-xs text-[#949ba4] ml-1">
              Hôm nay lúc {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Regular Message Content Outside Embed */}
          {content && (
            <div className="text-[#dbdee1] text-sm leading-relaxed whitespace-pre-wrap break-words mb-2 font-sans">
              {renderMarkdown(content)}
            </div>
          )}

          {/* Embed Container */}
          <div className="mt-1 flex max-w-lg">
            {/* Color Pill / Border */}
            <div
              className="w-1 rounded-l flex-shrink-0"
              style={{ backgroundColor: color || '#5865f2' }}
            ></div>

            {/* Embed Body */}
            <div className="bg-[#2b2d31] p-3.5 rounded-r flex-1 text-sm space-y-2.5 min-w-0 overflow-hidden">
              {/* Author Header */}
              {authorName && (
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
                      {renderMarkdown(description)}
                    </div>
                  )}
                </div>

                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="w-20 h-20 rounded object-cover flex-shrink-0 border border-[#383a40]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              {/* Fields */}
              {fields && fields.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {fields.map((field, idx) => (
                    <div key={idx} className={field.inline ? "col-span-1" : "col-span-full"}>
                      <div className="text-xs font-semibold text-[#949ba4] mb-0.5">{field.name || "Tên ô"}</div>
                      <div className="text-sm text-[#dbdee1] whitespace-pre-wrap">{field.value || "Nội dung ô"}</div>
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
                <div className="flex items-center space-x-2 text-xs text-[#949ba4] pt-1">
                  {footerIcon && (
                    <img src={footerIcon} alt="" className="w-4 h-4 rounded-full object-cover" />
                  )}
                  <span>{footerText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
