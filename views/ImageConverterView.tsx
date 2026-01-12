
import React, { useState } from 'react';

export const ImageConverterView: React.FC = () => {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [copyStatus, setCopyStatus] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          const key = file.name.split('.')[0].toLowerCase();
          setAssets(prev => ({ ...prev, [key]: base64 }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const generateCode = () => {
    const json = JSON.stringify(assets, null, 2);
    return `// 이 파일은 ImageConverter 도구에 의해 생성되었습니다.
export const IMAGE_ASSETS: Record<string, string> = ${json};`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-2">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white italic">IMAGE CONVERTER</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Generate imageAssets.ts without Terminal</p>
      </div>

      <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center mb-6 hover:border-indigo-500/50 transition-colors relative">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <div className="text-slate-300 font-bold">클릭하거나 이미지 파일을 드래그하세요</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-tighter">warrior.png, wizard.png 등을 선택하세요</div>
        </div>
      </div>

      {Object.keys(assets).length > 0 && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{Object.keys(assets).length} Images Processed</span>
            <button 
              onClick={copyToClipboard}
              className={`text-[10px] font-black uppercase px-3 py-1 rounded-full transition-all ${copyStatus ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {copyStatus ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <div className="flex-1 bg-black/50 rounded-xl p-4 overflow-y-auto font-mono text-[10px] text-slate-400 border border-slate-800">
            <pre>{generateCode()}</pre>
          </div>
          <p className="text-[10px] text-amber-500/70 mt-3 italic leading-relaxed">
            * 위 코드를 전체 복사하여 <b>imageAssets.ts</b> 파일에 덮어씌우면 이미지가 즉시 적용됩니다.
          </p>
        </div>
      )}
    </div>
  );
};
