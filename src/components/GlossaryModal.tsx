import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, Sparkles, Swords, Heart, Shield } from 'lucide-react';
import { GLOSSARY_CATEGORIES, GLOSSARY_ITEMS, GlossaryItem } from '../data/glossaryData';
import { cn } from '../lib/utils';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = GLOSSARY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: GlossaryItem['category']) => {
    switch (cat) {
      case 'MECHANIC':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'CHARACTER':
        return <Heart className="w-3.5 h-3.5 text-teal-400" />;
      case 'CARD':
        return <Shield className="w-3.5 h-3.5 text-indigo-400" />;
      case 'MONSTER':
        return <Swords className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-3xl max-h-[88vh] bg-[#0c0e14] border border-[#232838] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1c2130] bg-[#10131c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#191e2b] border border-[#2c344a] flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide text-stone-100 font-heading">
                Panduan & Glosarium Labirin
              </h2>
              <p className="text-[11px] text-stone-400 font-mono">Kamus Istilah, Karakter, Kartu & Monster</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#181d2a] hover:bg-[#232a3d] border border-[#2b334a] text-stone-400 hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[#181d2a] bg-[#0a0c12] flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari istilah, kartu, atau nama monster..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#121622] border border-[#242b3d] rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 transition"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {GLOSSARY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition border",
                  selectedCategory === cat.id
                    ? "bg-[#1c2233] border-amber-500/60 text-amber-300 font-semibold"
                    : "bg-[#121520] border-[#1e2334] text-stone-400 hover:text-stone-300"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#0f121a] border border-[#1e2434] hover:border-[#2d364d] transition flex flex-col gap-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(item.category)}
                  <h3 className="text-sm font-semibold text-stone-100 font-heading">
                    {item.term}
                  </h3>
                </div>

                {item.tag && (
                  <span className="text-[10px] font-mono text-stone-400 bg-[#161a26] border border-[#252c40] px-2 py-0.5 rounded shrink-0">
                    {item.tag}
                  </span>
                )}
              </div>

              {item.subtitle && (
                <p className="text-[11px] font-mono text-amber-300/80 -mt-0.5">
                  {item.subtitle}
                </p>
              )}

              <p className="text-xs text-stone-300 leading-relaxed mt-1">
                {item.description}
              </p>

              {item.tacticalTip && (
                <div className="mt-2 pt-2 border-t border-[#181d2a] text-[11px] text-stone-400 bg-[#090b10] p-2 rounded border border-[#161a24] flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold shrink-0">💡 Tips:</span>
                  <span>{item.tacticalTip}</span>
                </div>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-stone-500 text-xs font-mono">
              Tidak ditemukan istilah yang cocok dengan pencarian "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#1a1f2e] bg-[#0c0e14] flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <span>Menampilkan {filteredItems.length} dari {GLOSSARY_ITEMS.length} entri panduan</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#181d2a] hover:bg-[#232a3d] border border-[#293247] text-stone-300 transition"
          >
            Tutup Panduan (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
