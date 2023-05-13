const alpabeth = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const number = "0123456789";

//EVENT LISTENER ON KEY UP PLAINTEXT AND CIPHERTEXT
document.querySelector("#plaintext").addEventListener("keyup", event => process("encrypt", event.target.value));
document.querySelector("#ciphertext").addEventListener("keyup", event => process("decrypt", event.target.value));


//PROCESS
function process(type, text){
    let plaintext = "", ciphertext = "";

    const algoritm = document.querySelector("#algorithm").value;
    const key = document.querySelector("#key").value;

    switch(algoritm){
        case "caesar_cipher":
            plaintext = caesar_cipher(type, text, parseInt(key)).plaintext;
            ciphertext = caesar_cipher(type, text, parseInt(key)).ciphertext;
            break;
        case "vigenere_cipher":
            plaintext = vigenere_cipher(type, text, key).plaintext;
            ciphertext = vigenere_cipher(type, text, key).ciphertext;
            break;
        case "scytale":
            plaintext = scytale(type, text, parseInt(key)).plaintext;
            ciphertext = scytale(type, text, parseInt(key)).ciphertext;
            break;
        case "super":
            plaintext = super_e(type, text, key).plaintext;
            ciphertext = super_e(type, text, key).ciphertext;
            break;
    }

    document.querySelector("#plaintext").value = plaintext;
    document.querySelector("#ciphertext").value = ciphertext;
}


//SUPER
function super_e(type, text, key){
    let plaintext = "", ciphertext = "";
    const key_num = key.length;

    switch(type){
        case "encrypt":
            plaintext = text;
            ciphertext = caesar_cipher(type, text, key_num).ciphertext;
            ciphertext = vigenere_cipher(type, ciphertext, key).ciphertext;
            ciphertext = scytale(type, ciphertext, key_num).ciphertext;
            break;
        case "decrypt":
            ciphertext = text;
            plaintext = scytale(type, text, key_num).plaintext;
            plaintext = vigenere_cipher(type, plaintext, key).plaintext;
            plaintext = caesar_cipher(type, plaintext, key_num).plaintext;
            
            break;
    }

    return {plaintext, ciphertext};
}


//CAESAR CHIPER
function caesar_cipher(type, text, key){
    let plaintext = "", ciphertext = "";
    
    switch(type){
        case "encrypt":
            for(let i = 0; i < text.length; i++){
                plaintext += text[i];
                
                if(text[i] == " "){
                    ciphertext += " ";
                    continue;
                }
                pi = getCharacter().indexOf(text[i]);
                ci = (pi + key) % (getCharacter().length);

                ciphertext += getCharacter()[ci];
            }
            break;
        case "decrypt":
            for(let i = 0; i < text.length; i++){
                ciphertext += text[i];
                
                if(text[i] == " "){
                    plaintext += " ";
                    continue;
                }
                ci = getCharacter().indexOf(text[i]);
                pi = (ci - key) % getCharacter().length;
                if(pi < 0) pi += getCharacter().length;

                plaintext += getCharacter()[pi];
            }
            break;
    }

    return {plaintext, ciphertext};
}


//VIGENERW CIPHER
function vigenere_cipher(type, text, key){
    let plaintext = "", ciphertext = "";

    switch(type){
        case "encrypt":
            for(let i = 0; i < text.length; i++){
                plaintext += text[i];
                
                if(text[i] == " "){
                    ciphertext += " ";
                    continue;
                }

                pi = getCharacter().indexOf(text[i]);
                ki = getCharacter().indexOf(getKeyVigenere(key, text)[i]);

                ci = (pi + ki) % (getCharacter().length);

                ciphertext += getCharacter()[ci];
            }
            break;
        case "decrypt":
            for(let i = 0; i < text.length; i++){
                ciphertext += text[i];
                
                if(text[i] == " "){
                    plaintext += " ";
                    continue;
                }

                ci = getCharacter().indexOf(text[i]);
                ki = getCharacter().indexOf(getKeyVigenere(key, text)[i]);

                pi = (ci - ki + getCharacter().length) % (getCharacter().length);

                plaintext += getCharacter()[pi];
            }
            break;
    }

    return {plaintext, ciphertext};
}
function getKeyVigenere(key, text){
    let temp = "";

    let j = 0;
    for(let i = 0; i < text.length; i++){
        if(text[i] == " "){
            temp += " ";
            continue;
        }

        temp += key[j];
        
        if(j == key.length - 1) j = 0;
        else j++;
    }

    return temp;
}


//SCYTALE
function scytale(type, text, key){
    let plaintext = "", ciphertext = "";

    switch(type){
        case "encrypt":
            plaintext = text;

            temp = ""; c = [];
            text = text.replace(/\s+/g, '');

            for(let i = 0; i < Math.ceil(text.length / key); i++){
                for(let j = i * key; j < (i+1) * key; j++){
                    if(text[j]) temp += text[j];
                    else temp+= "Z";
                }
                c[i] = temp;
                temp = "";
            }

            for(let i = 0; i < key; i++){
                for(let j = 0; j < Math.ceil(text.length / key); j++){
                    ciphertext += c[j][i];
                }
            }
            break;
        case "decrypt":
            ciphertext = text;

            temp = ""; c = [];
            text = text.replace(/\s+/g, '');

            for(let j = 0; j < key; j++){
                for(let i = j * Math.ceil(text.length / key); i < (j+1) * Math.ceil(text.length / key); i++){
                    temp += text[i];
                }
                c[j] = temp;
                temp = "";
            }

            for(let j = 0; j < Math.ceil(text.length / key); j++){
                for(let i = 0; i < key; i++){
                    plaintext += c[i][j];
                }
            }
            break;
    }

    return {plaintext, ciphertext};
}



function getCharacter(){
    let temp = parseInt(document.querySelector("#characters").value);
    let character = "";
    switch(temp){
        case 0:
            character = alpabeth;
            break;
        case 1:
            character = alpabeth + alpabeth.toLowerCase();
            break;
        case 2:
            character = alpabeth + number;
            break;
        case 3:
            character = alpabeth + alpabeth.toLowerCase() + number;
            break;
    }

    return character;
}



//EVENT LISTENER ON ALGORITHM CHANGE
document.querySelector("#algorithm").addEventListener("change", (event) => {
    let input_key = document.querySelector("#key");

    switch(event.target.value){
        case "caesar_cipher": case "scytale":
            input_key.setAttribute("type", "number");
            input_key.value = 0;
            break;
        case "vigenere_cipher": case "super":
            input_key.setAttribute("type", "text");
            input_key.value = "";
            break;
    }
})


document.querySelector("#reset").addEventListener("click", () => {
    document.querySelector("#algorithm").value = "caesar_cipher";
    document.querySelector("#key").setAttribute("type", "number");
    document.querySelector("#key").value = 0;
    document.querySelector("#characters").value = "0";
    document.querySelector("#plaintext").value = "";
    document.querySelector("#ciphertext").value = "";
})