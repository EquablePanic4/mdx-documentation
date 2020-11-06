var definitions : Array<CmdxDefinition>;

window.addEventListener('load', async function() {
    //Inicjalizacja definicji XML
    definitions = new Array<CmdxDefinition>();
    await loadXmlDefinitions("cmdx-interop-translations.xml");
    await cmdxInitializer();
})

const cmdxInitializer = () : void => {
    //Operujemy na wszystkich wyświetlaczach cmdx
    let arr = document.getElementsByClassName('cmdx-display');
    for (let i = 0; i < arr.length; i++) {
        loadCmdx(arr[i]);
    }
}

const loadCmdx = (elem : Element) : void => {
    fetch(elem.getAttribute('cmdx-source'))
        .then(response => response.text()).then(data => {
            let elements = generateCmdxStringComponentArray(data);

            //Dodajemy wygenerowane elementy do displaya
            elem.innerHTML = elements.join("");
        });
}

const generateCmdxStringComponent = (line : string) : string => {
    if (line) {
        let arr = line.split(' ');
        let cmdxDef = definitions.filter(e => e.match == arr[0])[0];
        if (cmdxDef != null && cmdxDef != undefined) {
            return cmdxDef.parseUsingDefinition(arrNoSelectorString(arr));
        }

        //Jeżeli nie znaleźliśmy patterny, to dajemy do uniwersalnego
        else {
            //Sprawdzamy czy nie jest to pusta linia
            if (!isStringEmpty(line)) {
                cmdxDef = definitions.filter(e => e.match == "all")[0];
                return cmdxDef.parseUsingDefinition(line);
            }
        }
    }
}

const loadXmlDefinitions = async (location : string) => {
    let parser = new DOMParser();
    await fetch(location).then(response => response.text()).then(e => {
        let xml = parser.parseFromString(e, "text/xml");
        let arr = xml.getElementsByTagName("cmdx");
        for (let i = 0; i < arr.length; i++) {
            definitions.push(new CmdxDefinition(
                arr[i].getAttribute("type"),
                arr[i].getAttribute("pattern"),
                arr[i].getAttribute("match"),
                arr[i].getAttribute("css")
            ));
        }
    })
}

const generateCmdxStringComponentArray = (cmdxText : string) : Array<string> => {
    let arr = cmdxText.split('\n');
    let arrStrComponents = new Array<string>();
    for (let i = 0; i < arr.length; i++)
        arrStrComponents.push(generateCmdxStringComponent(arr[i]));

    return arrStrComponents;
}

const arrNoSelectorString = (arr : Array<string>) : string => {
    let str = "";
    for (let i = 1; i < arr.length; i++) {
        str += arr[i];
        if (i < (arr.length - 1))
            str += " ";
    }
    
    return str;
}

const isStringEmpty = (str : string) : boolean => {
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 32)
            return false;
    }

    return true;
}