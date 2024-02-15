import { ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

export const texte_recherche = ref("")
export const chansons = ref([])
export const chanson_active = ref("")
export const params = ref({})
export const source_audio = ref("")
export const balise_audio = ref(null)
export const progression = ref(0)
export const chanson_en_cours = ref(null)
export const isPlaying = ref(false)
export const volume = ref(1)

fetch("chansons/chansons.json").then(resp => resp.json()).then(fichier => {
  chansons.value = fichier
})

// Lancer la chanson lorsqu'on clique dessu
export function lancerAudio(nom_chanson) {
  if (nom_chanson && nom_chanson.audio) {
    const source_url = "chansons/" + nom_chanson.audio
    const audio_element = balise_audio.value
    if (audio_element) {
      audio_element.src = source_url
      audio_element.load()
      audio_element.play()
      audio_element.volume = 1
      chanson_en_cours.value = nom_chanson
      isPlaying.value = true
    }
  }
}

// Jouer une chanson ou la mettre sur pause à partir du bouton play/pause
export function toggleJouer() {
  const audio_element = balise_audio.value
  if (audio_element) {
    if (audio_element.paused) {
      isPlaying.value = true
      audio_element.play()
    } else {
      isPlaying.value = false
      audio_element.pause()
    }
  }
}

// Afficher la progression du temps de la chanson en %
export function timeUpdate() {
  if (balise_audio.value) {
    progression.value = Math.floor((balise_audio.value.currentTime / balise_audio.value.duration) * 100).toFixed()
  }
}

// Changer la chanson lorsqu'on clique sur un autre titre
export function changerChanson(nom_chanson, params_chanson = null) {
  chanson_active.value = nom_chanson
  params.value = params_chanson
}

// Filtrer les chansons dans la barre de recherche
export function filtrer(chansons) {
  const chansons_filtres = chansons.filter(chanson => {
    const titre = chanson.titre.toLowerCase()
    const recherche = texte_recherche.value.toLowerCase()
    return titre.includes(recherche)
  })
  return chansons_filtres
}

// Afficher le temps par chanson en minutes:secondes
export function formatTime(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60)
  let seconds = Math.floor(timeInSeconds % 60)
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

// Afficher le temps restant à la chanson
export function updateTempsChanson() {
  const audio_element = balise_audio.value
  if (audio_element) {
    chanson_en_cours.value.currentTime = audio_element.currentTime
    const temps_restant = formatTime(audio_element.duration - audio_element.currentTime)
    return temps_restant
  }
}

// Changer le volume
export function setVolume() {
  const audio_element = balise_audio.value
  if (audio_element) {
      audio_element.volume = volume.value
  }
}
