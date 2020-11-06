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
            let elements = generateCmdxComponentArray(data);

            //Teraz przechodzimy się po wszystkich elementech i patrzymy czy nie ma elementów które należy opatrzeć
            //Pozostałe elementy renderujemy
            let rendered = new Array<string>();
            let i = 0;
            while (i < elements.length) {
                if (elements[i].definition.patternType == CmdxPatternType.overflowed) {
                    //Opakowujemy dopóki ostatni nie jest ov
                    let toOverflow = new Array<CmdxObject>();
                    let def = elements[i].definition;
                    toOverflow.push(elements[i]);
                    i++;

                    while (i < elements.length && elements[i].definition.id == toOverflow[toOverflow.length - 1].definition.id) {
                        toOverflow.push(elements[i]);
                        i++;
                    }

                    //Jeżeli tutaj doszliśmy, zgrupowaliśmy już wszystkie elementy do opakowania
                    rendered.push(def.overflowWithMarkup(toOverflow));
                    continue;
                }

                rendered.push(elements[i].render());
                i++;
            }

            //Dodajemy wygenerowane elementy do displaya
            elem.innerHTML = rendered.join("");
        });
}

const generateCmdxComponent = (line : string) : CmdxObject => {
    if (line) {
        let arr = line.split(' ');
        let cmdxDef = definitions.filter(e => e.match == arr[0] && e.type == CmdxType.preline)[0];
        if (cmdxDef != null && cmdxDef != undefined) {
            return new CmdxObject(cmdxDef, arrNoSelectorString(arr));
        }

        //Jeżeli nie znaleźliśmy patternu, to dajemy do uniwersalnego
        else {
            //Sprawdzamy czy nie jest to pusta linia
            if (!isStringEmpty(line)) {
                cmdxDef = definitions.filter(e => e.match == "all" && e.type == CmdxType.preline)[0];
                return new CmdxObject(cmdxDef, line);
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
                arr[i].getAttribute("css"),
                i //ID definicji
            ));
        }
    })
}

const generateCmdxComponentArray = (cmdxText : string) : Array<CmdxObject> => {
    let arr = cmdxText.split('\n');
    let arrComponents = new Array<CmdxObject>();
    for (let i = 0; i < arr.length; i++) {
        let component = generateCmdxComponent(arr[i]);
        if (component != null)
            arrComponents.push(component);
    }

    return arrComponents;
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