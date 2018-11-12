const PhoneticEastHelper = (originalString) => {
    var phonetic = originalString;
    if(phonetic){
        phonetic = phonetic.replace("š", "sh");
        phonetic = phonetic.replace("ḥ", "kh");
    }
    return (
        phonetic    
    );
}
export default PhoneticEastHelper;