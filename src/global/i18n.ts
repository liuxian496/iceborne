/* eslint-disable import/prefer-default-export */
import enUS from './enUS';
import { Local } from './enum';
import { Lexicon } from './i18n.types';
import zhCN from './zhCN';

export function getLexicon(local: Local): Lexicon {
  const lexicon: Lexicon = local === Local.zhCN ? zhCN : enUS;

  return lexicon;
}
