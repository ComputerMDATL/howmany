/**
 * app/lib/i18n.js
 *
 * All UI strings for EN and ES.
 * Usage: import { useLang } from '../context/LanguageContext'
 *        const { t } = useLang()
 *        t('placeholder')
 */

export const translations = {
  en: {
    // Header
    subtitle:        'Ask anything. Get a real answer with the math shown.',
    // QuestionInput
    placeholder:     'How many sheets of paper are in a tree?',
    voiceTitle:      'Tap to speak',
    voiceUnsupported:'Voice requires Chrome or Edge',
    // ExampleChips
    tryAsking:       'Try asking:',
    reshuffle:       '↺ Re-shuffle',
    // LoadingState
    lookingUp:       'Looking that up...',
    tryingAgain:     'Trying again…',
    writingAnswer:   'Writing the answer…',
    cancel:          'Cancel',
    thoughts: [
      'Crunching the numbers…',
      'Consulting the universe…',
      'Doing the math…',
      'Researching real-world data…',
      'Checking sources…',
      'Calculating with care…',
    ],
    // FallbackCard
    fb_off_topic:    "That's not a 'how many' question!",
    fb_unanswerable: 'That one stumped me...',
    fb_too_vague:    'Can you be more specific?',
    fb_default:      "Hmm, couldn't answer that",
    fb_icon_off_topic:    '🧭',
    fb_icon_unanswerable: '🤔',
    fb_icon_too_vague:    '🔍',
    fb_icon_default:      '😅',
    things_i_can_answer: 'Things I can answer:',
    try_one_of_these:    'Try one of these:',
    ask_another:         'Ask another',
    // AnswerCard
    est_range:    '~ Est. range:',
    tab_math:     '🔢 The math',
    tab_visual:   '📊 Picture it',
    tab_fact:     '💡 Fun fact',
    did_you_know: 'Did you know?',
    sources:      'Sources',
    share_answer: '🎴 Share this answer',
    ad_in:        'ad in',
    // useAsk client-side error messages
    err_too_many:   'Too many questions right now — try again in a moment!',
    err_too_specific: 'Try a more specific question!',
    err_went_wrong: 'Something went wrong. Try rephrasing.',
    err_suggestions: [
      'How many feet in a mile?',
      'How many gallons in a bathtub?',
      'How many bones in the human body?',
    ],
  },

  es: {
    // Header
    subtitle:        'Pregunta lo que quieras. Obtén una respuesta real con los cálculos.',
    // QuestionInput
    placeholder:     '¿Cuántas hojas de papel hay en un árbol?',
    voiceTitle:      'Toca para hablar',
    voiceUnsupported:'La voz requiere Chrome o Edge',
    // ExampleChips
    tryAsking:       'Prueba preguntando:',
    reshuffle:       '↺ Mezclar',
    // LoadingState
    lookingUp:       'Buscando la respuesta...',
    tryingAgain:     'Intentando de nuevo…',
    writingAnswer:   'Escribiendo la respuesta…',
    cancel:          'Cancelar',
    thoughts: [
      'Haciendo los cálculos…',
      'Consultando el universo…',
      'Haciendo las matemáticas…',
      'Investigando datos del mundo real…',
      'Verificando fuentes…',
      'Calculando con cuidado…',
    ],
    // FallbackCard
    fb_off_topic:    "¡Esa no es una pregunta de '¿cuántos?'!",
    fb_unanswerable: 'Esa pregunta me dejó pensando...',
    fb_too_vague:    '¿Puedes ser más específico?',
    fb_default:      "Hmm, no pude responder eso",
    fb_icon_off_topic:    '🧭',
    fb_icon_unanswerable: '🤔',
    fb_icon_too_vague:    '🔍',
    fb_icon_default:      '😅',
    things_i_can_answer: 'Cosas que puedo responder:',
    try_one_of_these:    'Prueba con uno de estos:',
    ask_another:         'Preguntar otra vez',
    // AnswerCard
    est_range:    '~ Rango est.:',
    tab_math:     '🔢 Las matemáticas',
    tab_visual:   '📊 Visualízalo',
    tab_fact:     '💡 Dato curioso',
    did_you_know: '¿Sabías que?',
    sources:      'Fuentes',
    share_answer: '🎴 Compartir respuesta',
    ad_in:        'anuncio en',
    // useAsk client-side error messages
    err_too_many:    '¡Demasiadas preguntas ahora mismo — inténtalo de nuevo en un momento!',
    err_too_specific:'¡Intenta una pregunta más específica!',
    err_went_wrong:  'Algo salió mal. Intenta reformular.',
    err_suggestions: [
      '¿Cuántos pies hay en una milla?',
      '¿Cuántos galones caben en una bañera?',
      '¿Cuántos huesos hay en el cuerpo humano?',
    ],
  },
}
