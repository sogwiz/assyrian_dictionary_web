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
//export default AudioHelper;

const AudioHelperString = (originalString, region, searchkeynum) => {
    var audioFile = originalString;
    if(audioFile){
        if(!audioFile.includes('http')){
            audioFile = 'http://assyrianlanguages.org/sureth/' +  originalString;
          }
          return audioFile;
    }else {
        return "https://assyrianaudio.blob.core.windows.net/audioblobs/"+region+"_entry"+searchkeynum+".mp3";
    }
}
export default AudioHelperString;