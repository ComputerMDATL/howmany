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
      { before: 'Have you ever asked a question like ', q1: '"How many pizzas could fill a swimming pool?"', mid: ' or ', q2: '"How many steps is it to the moon?"', after: "? That's exactly what ", brand: 'Ask how many', end: ' is here for! Type in any question about numbers, sizes, distances, or amounts — and our ', ai: 'AI brain', fin: ' figures it out instantly, for free!' },
      { before: "You don't just get a number — you get the ", math: 'full math breakdown', mid: ', shown step by step so you can actually see how it works. Plus a ', diagram: 'cool diagram', mid2: ' to help you picture the size, and a ', fact: 'fun fact', end: " that will blow your mind! It's like having a super-smart calculator that also tells stories." },
      { before: 'You can ask about ', conv: 'unit conversions', mid: ' (miles to kilometers, pounds to kilograms — easy!), ', compare: 'real-world comparisons', mid2: ' (how heavy is a blue whale? how tall is the Eiffel Tower in bananas?), or any wild ', qty: 'quantity question', mid3: ' your brain can dream up. Ask how many works in ', en: 'English', mid4: ' and ', es: 'Spanish', end: ' — just tap the flag at the top to switch!' },
      { before: 'Not sure where to start? ', cta: 'Tap one of the example questions', mid: ' below and see the magic happen. No sign-up, no accounts, ', free: 'totally free', end: " — just big questions and even bigger answers. Let's go! 🚀" },
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
      { before: '¿Alguna vez hiciste una pregunta como ', q1: '"¿Cuántas pizzas cabrían en una piscina?"', mid: ' o ', q2: '"¿Cuántos pasos hay hasta la luna?"', after: '? ¡Para eso exactamente está ', brand: 'Ask how many', end: '! Escribe cualquier pregunta sobre números, tamaños, distancias o cantidades — ¡y nuestro ', ai: 'cerebro de IA', fin: ' lo descubre al instante, gratis!' },
      { before: 'No solo obtienes un número — obtienes el ', math: 'desglose matemático completo', mid: ', paso a paso para que puedas ver cómo funciona. Más un ', diagram: 'diagrama genial', mid2: ' para ayudarte a visualizar el tamaño, y un ', fact: 'dato curioso', end: ' que te dejará boquiabierto. ¡Es como tener una calculadora superinteligente que también cuenta historias!' },
      { before: 'Puedes preguntar sobre ', conv: 'conversiones de unidades', mid: ' (millas a kilómetros, libras a kilogramos — ¡fácil!), ', compare: 'comparaciones del mundo real', mid2: ' (¿cuánto pesa una ballena azul? ¿qué tan alta es la Torre Eiffel en plátanos?), o cualquier ', qty: 'pregunta de cantidades', mid3: ' que se te ocurra. Ask how many funciona en ', en: 'inglés', mid4: ' y ', es: 'español', end: ' — ¡solo toca la bandera arriba para cambiar!' },
      { before: '¿No sabes por dónde empezar? ', cta: 'Toca una de las preguntas de ejemplo', mid: ' y mira cómo ocurre la magia. Sin registros, sin cuentas, ', free: 'totalmente gratis', end: ' — solo grandes preguntas y respuestas aún más grandes. ¡Vamos! 🚀' },
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
