export function tts(messageToSend){
  var msg = new SpeechSynthesisUtterance(String(messageToSend));
  msg.lang = 'en-US';
  window.speechSynthesis.speak(msg);
}
