import { BestiaryEntity, StoryNode } from '../types/game';

export const ARTWORK_PATHS = {
  heroConservatory: '/src/assets/images/hero_grimoire_altar_1795148415036.jpg',
  tarotZarza: '/src/assets/images/arc_zarza_ninfa_1795148415088.jpg',
  tarotMirror: '/src/assets/images/arc_umbrales_confidente_1795148415483.jpg',
  tarotCrypt: '/src/assets/images/arc_doble_cripta_1795148414445.jpg',
  abyssCove: '/src/assets/images/sea_abyss_sanctuary_1795148414829.jpg',
} as const;

export function getEntityPlateMeta(key: BestiaryEntity['artworkKey']): {
  imageSrc: string;
  roman: string;
  tintOverlay: string;
  accentHex: string;
  fallbackGradient: string;
} {
  switch (key) {
    case 'ninfa':
      return {
        imageSrc: ARTWORK_PATHS.tarotZarza,
        roman: 'I',
        tintOverlay: 'from-[#09080c]/80 via-[#9e1b32]/10 to-transparent',
        accentHex: '#d43750',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #3a101b 0%, #09080c 85%)',
      };
    case 'confidente':
      return {
        imageSrc: ARTWORK_PATHS.tarotMirror,
        roman: 'II',
        tintOverlay: 'from-[#09080c]/85 via-[#c59b4e]/10 to-transparent',
        accentHex: '#e5be6e',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #2a2015 0%, #09080c 85%)',
      };
    case 'vastago':
      return {
        imageSrc: ARTWORK_PATHS.abyssCove,
        roman: 'III',
        tintOverlay: 'from-[#09080c]/85 via-[#2e7d7b]/25 to-transparent',
        accentHex: '#6ad1cc',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #112e30 0%, #09080c 85%)',
      };
    case 'coro':
      return {
        imageSrc: ARTWORK_PATHS.tarotMirror,
        roman: 'IV',
        tintOverlay: 'from-[#09080c]/85 via-[#ece3d5]/10 to-[#14101c]/50',
        accentHex: '#ece3d5',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #25202e 0%, #09080c 85%)',
      };
    case 'senora':
      return {
        imageSrc: ARTWORK_PATHS.abyssCove,
        roman: 'V',
        tintOverlay: 'from-[#09080c]/80 via-[#2e7d7b]/20 to-[#132426]/30',
        accentHex: '#6ad1cc',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #122b2c 0%, #09080c 85%)',
      };
    case 'sacerdote':
      return {
        imageSrc: ARTWORK_PATHS.tarotCrypt,
        roman: 'VI',
        tintOverlay: 'from-[#09080c]/85 via-[#9e1b32]/20 to-transparent',
        accentHex: '#e5be6e',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #2b131b 0%, #09080c 85%)',
      };
    case 'doblada':
      return {
        imageSrc: ARTWORK_PATHS.tarotCrypt,
        roman: 'VII',
        tintOverlay: 'from-[#09080c]/85 via-[#9e1b32]/25 to-transparent',
        accentHex: '#ff8fa0',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #34111c 0%, #09080c 85%)',
      };
    case 'cabra':
      return {
        imageSrc: ARTWORK_PATHS.tarotZarza,
        roman: 'VIII',
        tintOverlay: 'from-[#09080c]/85 via-[#c59b4e]/15 to-[#291016]/40',
        accentHex: '#e5be6e',
        fallbackGradient: 'radial-gradient(circle at 50% 35%, #2c1c12 0%, #09080c 85%)',
      };
  }
}

export function getAmbientBackdrop(
  tag: StoryNode['ambientTag']
): { imageSrc: string; label: string; scrimClass: string } {
  switch (tag) {
    case 'mar':
      return {
        imageSrc: ARTWORK_PATHS.abyssCove,
        label: 'Marea nocturna',
        scrimClass: 'from-[#09080c] via-[#09080c]/65 to-[#102628]/25',
      };
    case 'mascara':
    case 'teatro':
      return {
        imageSrc: ARTWORK_PATHS.tarotMirror,
        label: 'Umbral de espejos',
        scrimClass: 'from-[#09080c] via-[#09080c]/70 to-[#201812]/30',
      };
    case 'cripta':
      return {
        imageSrc: ARTWORK_PATHS.tarotCrypt,
        label: 'Cripta del Círculo',
        scrimClass: 'from-[#09080c] via-[#09080c]/65 to-[#2b1018]/30',
      };
    case 'rebano':
    case 'zarza':
    default:
      return {
        imageSrc: ARTWORK_PATHS.heroConservatory,
        label: 'Invernadero de la Zarza',
        scrimClass: 'from-[#09080c] via-[#09080c]/60 to-[#2a1117]/25',
      };
  }
}
