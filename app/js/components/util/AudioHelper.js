import ReactAudioPlayer from 'react-audio-player'

const AudioHelper = (originalString) => {
    var audioFile = originalString;
    if(audioFile){
        if(!audioFile.includes('http')){
            audioFile = 'http://assyrianlanguages.org/sureth/' +  todo.dictionary_definition_obj.audio;
          }
          return (
              <span><ReactAudioPlayer src={audioFile}/></span>
          );
    }else {
        return audioFile;
    }
}
export default AudioHelper;