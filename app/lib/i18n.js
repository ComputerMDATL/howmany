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
    // Intro paragraph
    intro: [
      { before: 'Ever wondered ', q1: '"How many pizzas could fill a swimming pool?"', mid: ' or ', q2: '"How many steps is it to the moon?"', after: '? ', brand: 'Ask how many', end: ' answers instantly — powered by our ', ai: 'AI brain', fin: ', for free!' },
      { before: 'You get the ', math: 'full math breakdown', mid: ', a ', diagram: 'cool diagram', mid2: ', and a ', fact: 'fun fact', end: ' — not just a number.' },
      { before: 'Ask anything: ', conv: 'unit conversions', mid: ', ', compare: 'real-world comparisons', mid2: ', wild ', qty: 'quantity questions', mid3: '. Works in ', en: 'English', mid4: ' and ', es: 'Spanish', end: ' — tap the flag to switch!' },
      { before: 'Not sure where to start? ', cta: 'Tap an example question', mid: ' below. No sign-up, no accounts, ', free: 'totally free', end: " — let's go! 🚀" },
    ],
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
    // Intro paragraph
    intro: [
      { before: '¿Alguna vez te preguntaste ', q1: '"¿Cuántas pizzas cabrían en una piscina?"', mid: ' o ', q2: '"¿Cuántos pasos hay hasta la luna?"', after: '? ', brand: 'Ask how many', end: ' responde al instante — con nuestro ', ai: 'cerebro de IA', fin: ', ¡gratis!' },
      { before: 'Obtienes el ', math: 'desglose matemático completo', mid: ', un ', diagram: 'diagrama genial', mid2: ' y un ', fact: 'dato curioso', end: ' — no solo un número.' },
      { before: 'Pregunta lo que quieras: ', conv: 'conversiones de unidades', mid: ', ', compare: 'comparaciones del mundo real', mid2: ', cualquier ', qty: 'pregunta de cantidades', mid3: '. Funciona en ', en: 'inglés', mid4: ' y ', es: 'español', end: ' — ¡toca la bandera para cambiar!' },
      { before: '¿No sabes por dónde empezar? ', cta: 'Toca una pregunta de ejemplo', mid: ' abajo. Sin registros, sin cuentas, ', free: 'totalmente gratis', end: ' — ¡vamos! 🚀' },
    ],
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
