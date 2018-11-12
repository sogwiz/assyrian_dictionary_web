const PhoneticWestHelper = (originalString) => {
    var phonetic = originalString;
    if(phonetic){
        phonetic = phonetic.replace("š", "sh");
    }
    return (
        phonetic    
    );
}
export default PhoneticWestHelper;